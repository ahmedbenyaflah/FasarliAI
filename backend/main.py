from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
import tempfile
from pathlib import Path
from datetime import datetime
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_classic.chains.retrieval_qa.base import RetrievalQA
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import uuid
import shutil
import re   

# Load environment variables from backend directory
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)

app = FastAPI(title="PDF ChatBot API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for vector stores (in production, use a database)
vector_stores: Dict[str, FAISS] = {}
chat_histories: Dict[str, List[tuple]] = {}

# Request/Response models
class ChatRequest(BaseModel):
    question: str
    session_id: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    id: str
    author: str
    content: str
    sources: Optional[List[Dict[str, str]]] = None
    timestamp: str

class QuizRequest(BaseModel):
    session_id: str

class QuizQuestion(BaseModel):
    question: str
    a: str
    b: str
    c: str
    d: str
    correct: str

class QuizResponse(BaseModel):
    questions: List[QuizQuestion]

class FlashcardRequest(BaseModel):
    session_id: str

class Flashcard(BaseModel):
    front: str
    back: str

class FlashcardResponse(BaseModel):
    flashcards: List[Flashcard]

class UploadResponse(BaseModel):
    session_id: str
    message: str
    chunks_count: int

def parse_quiz(quiz_text: str) -> List[Dict]:
    """Parse quiz questions from LLM response."""
    questions = []
    current_q = {}
    lines = quiz_text.split('\n')
    
    for line in lines:
        line = line.strip()
        if not line:
            if current_q and 'question' in current_q and 'correct' in current_q:
                questions.append(current_q)
                current_q = {}
            continue
            
        if line.upper().startswith('Q') and (':' in line or (len(line) > 1 and line[1:2].isdigit())):
            if current_q and 'question' in current_q and 'correct' in current_q:
                questions.append(current_q)
            if ':' in line:
                current_q = {'question': line}
            else:
                current_q = {'question': line}
        elif line.upper().startswith('A)') or (line.startswith('A.') and len(line) > 2):
            current_q['a'] = line[2:].strip() if line[1] == ')' else line[2:].strip()
        elif line.upper().startswith('B)') or (line.startswith('B.') and len(line) > 2):
            current_q['b'] = line[2:].strip() if line[1] == ')' else line[2:].strip()
        elif line.upper().startswith('C)') or (line.startswith('C.') and len(line) > 2):
            current_q['c'] = line[2:].strip() if line[1] == ')' else line[2:].strip()
        elif line.upper().startswith('D)') or (line.startswith('D.') and len(line) > 2):
            current_q['d'] = line[2:].strip() if line[1] == ')' else line[2:].strip()
        elif 'correct' in line.lower() and ':' in line:
            parts = line.split(':', 1)
            if len(parts) > 1:
                correct_ans = parts[1].strip().upper()
                if correct_ans:
                    current_q['correct'] = correct_ans[0] if len(correct_ans) > 0 else correct_ans
    
    if current_q and 'question' in current_q and 'correct' in current_q:
        questions.append(current_q)
    
    valid_questions = []
    for q in questions:
        if all(key in q for key in ['question', 'a', 'b', 'c', 'd', 'correct']):
            # Clean question text
            question_text = q['question'].strip()
            if question_text.startswith('Q') and ':' in question_text:
                question_text = question_text.split(':', 1)[1].strip()
            q['question'] = question_text
            valid_questions.append(q)
    
    return valid_questions[:5]

def parse_flashcards(flashcard_text: str) -> List[Dict]:
    """Parse flashcards from LLM response - improved with better error handling."""
    flashcards = []
    current_card = {}
    lines = flashcard_text.split('\n')
    
    for line in lines:
        line = line.strip()
        if not line:
            if current_card and 'front' in current_card and 'back' in current_card:
                flashcards.append(current_card)
                current_card = {}
            continue
        
        # More flexible parsing - handle variations
        line_lower = line.lower()
        if line_lower.startswith('front:'):
            if current_card and 'front' in current_card and 'back' in current_card:
                flashcards.append(current_card)
                current_card = {}
            current_card['front'] = line[6:].strip()
        elif line_lower.startswith('back:'):
            current_card['back'] = line[5:].strip()
        # Handle cases where front/back might be on separate lines
        elif 'front' in line_lower and ':' in line:
            parts = line.split(':', 1)
            if len(parts) > 1:
                current_card['front'] = parts[1].strip()
        elif 'back' in line_lower and ':' in line and 'front' not in line_lower:
            parts = line.split(':', 1)
            if len(parts) > 1:
                current_card['back'] = parts[1].strip()
    
    if current_card and 'front' in current_card and 'back' in current_card:
        flashcards.append(current_card)
    
    # If we have incomplete cards, try to pair them up
    if len(flashcards) < 5 and current_card:
        # Try to extract any remaining pairs
        pass
    
    return flashcards[:10]

@app.post("/api/upload", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    """Upload and process a PDF file."""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    # Generate session ID
    session_id = str(uuid.uuid4())
    
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            shutil.copyfileobj(file.file, tmp_file)
            tmp_path = tmp_file.name
        
        # Extract text from PDF
        reader = PdfReader(tmp_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        
        # Clean up temp file
        os.unlink(tmp_path)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the PDF")
        
        # Split text into chunks
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        chunks = splitter.split_text(text)
        
        # Create embeddings
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        
        # Create FAISS vector store
        vector_store = FAISS.from_texts(chunks, embedding=embeddings)
        
        # Store vector store and initialize chat history
        vector_stores[session_id] = vector_store
        chat_histories[session_id] = []
        
        return UploadResponse(
            session_id=session_id,
            message="PDF processed successfully",
            chunks_count=len(chunks)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Handle chat questions."""
    if request.session_id not in vector_stores:
        raise HTTPException(status_code=400, detail="No PDF uploaded for this session. Please upload a PDF first.")
    
    try:
        vector_store = vector_stores[request.session_id]
        chat_history = chat_histories.get(request.session_id, [])
        
        # Initialize LLM with Groq
        groq_api_key = os.getenv("GROQ_API_KEY")
        print(f"Using GROQ_API_KEY: {groq_api_key is not None}")
        if not groq_api_key:
            raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")
        
        llm = ChatGroq(
            api_key=groq_api_key,
            model_name="llama-3.1-8b-instant"
        )
        
        # Build RetrievalQA chain with better retrieval settings
        retriever = vector_store.as_retriever(
            search_kwargs={"k": 4}  # Retrieve top 4 most relevant chunks
        )
        
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=retriever,
            chain_type="stuff",
            return_source_documents=False
        )
        
        # Combine history into prompt
        history_text = "\n".join([f"Q: {q}\nA: {a}" for q, a in chat_history[-3:]])  # Last 3 exchanges
        instruction = (
    "You are a helpful chatbot. If the user asks something related to the PDF, "
    "answer using the information found in the PDF. Otherwise, just answer normally. "
    "Be clear, friendly, and helpful."
)


        
        if history_text:
            final_question = f"{instruction}\n\nPrevious conversation:\n{history_text}\n\nCurrent question: {request.question}"
        else:
            final_question = f"{instruction}\n\nQuestion: {request.question}"
        
        # Run QA
        answer = qa_chain.run(final_question)
        
        # Save to history
        chat_history.append((request.question, answer))
        chat_histories[request.session_id] = chat_history
        
        return ChatResponse(
            id=str(uuid.uuid4()),
            author="FasarliAI",
            content=answer,
            sources=[],
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get answer: {str(e)}")

@app.post("/api/quiz", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    """Generate quiz questions from the PDF."""
    if request.session_id not in vector_stores:
        raise HTTPException(status_code=400, detail="No PDF uploaded for this session. Please upload a PDF first.")
    
    try:
        vector_store = vector_stores[request.session_id]
        
        groq_api_key = os.getenv("GROQ_API_KEY")
        if not groq_api_key:
            raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")
        
        llm = ChatGroq(
            api_key=groq_api_key,
            model_name="llama-3.1-8b-instant",
            temperature=0.5,  # Lower temperature for faster, more deterministic responses
            max_tokens=1000  # Limit response length for faster generation
        )
        
        # Optimize: Get fewer, more focused documents for faster processing
        relevant_docs = vector_store.similarity_search("key concepts main ideas important information", k=2)
        
        # Aggressively limit context size for faster LLM processing
        context_parts = []
        total_length = 0
        max_length = 1200  # Reduced to 1200 chars for much faster processing
        
        for doc in relevant_docs:
            content = doc.page_content if hasattr(doc, 'page_content') else str(doc)
            # Truncate each document to max 600 chars
            truncated_content = content[:600] if len(content) > 600 else content
            if total_length + len(truncated_content) > max_length:
                remaining = max_length - total_length
                if remaining > 50:
                    context_parts.append(truncated_content[:remaining])
                break
            context_parts.append(truncated_content)
            total_length += len(truncated_content)
        
        context = "\n\n".join(context_parts)
        
        # Optimize: Ultra-concise prompt for fastest generation
        from langchain_core.messages import HumanMessage
        
        quiz_prompt = (
            f"Create 5 multiple-choice questions. Format:\n"
            f"Q1: [question]\n"
            f"A) [option]\n"
            f"B) [option]\n"
            f"C) [option]\n"
            f"D) [option]\n"
            f"Correct: [A/B/C/D]\n\n"
            f"{context}\n\n"
            f"Output 5 questions in the format above."
        )
        
        # Direct LLM call (faster than chain)
        try:
            messages = [HumanMessage(content=quiz_prompt)]
            quiz_response_obj = llm.invoke(messages)
            
            # Extract content from response
            if hasattr(quiz_response_obj, 'content'):
                quiz_response = quiz_response_obj.content
            else:
                quiz_response = str(quiz_response_obj)
            
            questions = parse_quiz(quiz_response)
            
            # If parsing failed or got too few questions, try a simpler approach
            if len(questions) < 3:
                # Fallback: Try to extract questions using regex
                pattern = r'Q\d+:\s*(.+?)\nA\)\s*(.+?)\nB\)\s*(.+?)\nC\)\s*(.+?)\nD\)\s*(.+?)\nCorrect:\s*([A-D])'
                matches = re.findall(pattern, quiz_response, re.DOTALL | re.IGNORECASE)
                if matches:
                    questions = []
                    for i, match in enumerate(matches[:5], 1):
                        questions.append({
                            'question': match[0].strip(),
                            'a': match[1].strip(),
                            'b': match[2].strip(),
                            'c': match[3].strip(),
                            'd': match[4].strip(),
                            'correct': match[5].strip().upper()
                        })
            
            if not questions or len(questions) < 3:
                raise ValueError(f"Failed to parse quiz. Got {len(questions) if questions else 0} questions. Response: {quiz_response[:200]}")
                
        except Exception as parse_error:
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to generate or parse quiz: {str(parse_error)}"
            )
        
        return QuizResponse(questions=[QuizQuestion(**q) for q in questions])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")

class ConversationNameRequest(BaseModel):
    session_id: str

class ConversationNameResponse(BaseModel):
    name: str

@app.post("/api/generate-conversation-name", response_model=ConversationNameResponse)
async def generate_conversation_name(request: ConversationNameRequest):
    """Generate a short, clear conversation name based on PDF content."""
    if request.session_id not in vector_stores:
        raise HTTPException(status_code=400, detail="No PDF uploaded for this session.")
    
    try:
        vector_store = vector_stores[request.session_id]
        
        groq_api_key = os.getenv("GROQ_API_KEY")
        if not groq_api_key:
            raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")
        
        llm = ChatGroq(
            api_key=groq_api_key,
            model_name="llama-3.1-8b-instant"
        )
        
        # Get relevant content from PDF to understand what it's about
        relevant_docs = vector_store.similarity_search("main topic subject title summary overview", k=3)
        context = "\n\n".join([doc.page_content if hasattr(doc, 'page_content') else str(doc) for doc in relevant_docs])
        
        # Limit context size for faster processing
        if len(context) > 1000:
            context = context[:1000]
        
        prompt = f"""Based on the following PDF content, generate a short and clear conversation title (maximum 5-6 words). 
The title should summarize what the PDF is about.

PDF Content:
{context}

Generate only the title, nothing else. Make it concise and descriptive."""
        
        from langchain_core.messages import HumanMessage
        messages = [HumanMessage(content=prompt)]
        response_obj = llm.invoke(messages)
        
        name = response_obj.content.strip() if hasattr(response_obj, 'content') else str(response_obj).strip()
        
        # Clean up the name (remove quotes, extra spaces, etc.)
        name = name.strip('"').strip("'").strip()
        if len(name) > 60:
            name = name[:57] + "..."
        
        return ConversationNameResponse(name=name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate conversation name: {str(e)}")

@app.post("/api/flashcards", response_model=FlashcardResponse)
async def generate_flashcards(request: FlashcardRequest):
    """Generate flashcards from the PDF."""
    if request.session_id not in vector_stores:
        raise HTTPException(status_code=400, detail="No PDF uploaded for this session. Please upload a PDF first.")
    
    try:
        vector_store = vector_stores[request.session_id]
        
        groq_api_key = os.getenv("GROQ_API_KEY")
        if not groq_api_key:
            raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")
        
        llm = ChatGroq(
            api_key=groq_api_key,
            model_name="llama-3.1-8b-instant",
            temperature=0.5,  # Lower temperature for faster, more deterministic responses
            max_tokens=800  # Limit response length for faster generation
        )
        
        # Optimize: Get fewer, more focused documents for faster processing
        relevant_docs = vector_store.similarity_search("key concepts definitions main ideas", k=2)
        
        # Aggressively limit context size for faster LLM processing
        context_parts = []
        total_length = 0
        max_length = 1200  # Reduced to 1200 chars for much faster processing
        
        for doc in relevant_docs:
            content = doc.page_content if hasattr(doc, 'page_content') else str(doc)
            # Truncate each document to max 600 chars
            truncated_content = content[:600] if len(content) > 600 else content
            if total_length + len(truncated_content) > max_length:
                remaining = max_length - total_length
                if remaining > 50:
                    context_parts.append(truncated_content[:remaining])
                break
            context_parts.append(truncated_content)
            total_length += len(truncated_content)
        
        context = "\n\n".join(context_parts)
        
        # Optimize: Ultra-concise prompt for fastest generation
        from langchain_core.messages import HumanMessage
        
        flashcard_prompt = (
            f"Create 10 flashcards. Format:\n"
            f"Front: [concept]\n"
            f"Back: [definition]\n\n"
            f"{context}\n\n"
            f"Output 10 flashcards in the format above."
        )
        
        # Direct LLM call (faster than chain) with timeout handling
        try:
            messages = [HumanMessage(content=flashcard_prompt)]
            flashcard_response = llm.invoke(messages)
            
            # Extract content from response
            if hasattr(flashcard_response, 'content'):
                response_text = flashcard_response.content
            else:
                response_text = str(flashcard_response)
            
            flashcards = parse_flashcards(response_text)
            
            # If parsing failed or got too few cards, try a simpler approach
            if len(flashcards) < 5:
                # Fallback: Try to extract pairs from the response
                # Look for Front: ... Back: ... patterns
                pattern = r'Front:\s*(.+?)\s*Back:\s*(.+?)(?=Front:|$)'
                matches = re.findall(pattern, response_text, re.DOTALL | re.IGNORECASE)
                if matches:
                    flashcards = [{'front': f.strip(), 'back': b.strip()} for f, b in matches[:10]]
            
            if not flashcards or len(flashcards) < 3:
                raise ValueError(f"Failed to parse flashcards. Got {len(flashcards) if flashcards else 0} cards. Response: {response_text[:200]}")
                
        except Exception as parse_error:
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to generate or parse flashcards: {str(parse_error)}"
            )
        
        return FlashcardResponse(flashcards=[Flashcard(**fc) for fc in flashcards])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate flashcards: {str(e)}")

@app.get("/api/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

