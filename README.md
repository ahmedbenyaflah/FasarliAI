# PDF ChatBot - AI-Powered Learning Platform

A full-stack application that allows users to upload PDF documents and interact with them through AI-powered chat, quiz generation, and flashcard creation.

## Features

- 📄 **PDF Upload & Processing**: Upload PDF documents and extract text for AI processing
- 💬 **AI Chat**: Ask questions about your PDF documents using RAG (Retrieval Augmented Generation)
- 📝 **Quiz Generation**: Automatically generate multiple-choice quizzes from PDF content
- ⚡ **Flashcards**: Create study flashcards from your documents
- 🎨 **Modern UI**: Beautiful React/Next.js interface with dark mode support

## Tech Stack

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library

### Backend
- **FastAPI** - Python web framework
- **LangChain** - LLM orchestration
- **Groq** - Fast LLM inference
- **FAISS** - Vector database for embeddings
- **HuggingFace** - Sentence transformers for embeddings

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- Groq API key ([Get one here](https://console.groq.com/))

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "GROQ_API_KEY=your_key_here" > .env

# Start server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Access the Application

- Frontend: http://localhost:3000
- Backend API Docs: http://localhost:8000/docs

## Usage

1. **Upload a PDF**: Click the upload button and select a PDF file
2. **Ask Questions**: Type questions about the document in the chat
3. **Generate Quiz**: Switch to Quiz mode to create and take quizzes
4. **Study with Flashcards**: Switch to Flashcards mode to generate study cards

## Project Structure

```
.
├── backend/              # FastAPI backend
│   ├── main.py          # Main API server
│   ├── requirements.txt  # Python dependencies
│   └── start.bat/sh     # Startup scripts
├── app/                 # Next.js app directory
│   ├── api/            # API routes (proxies to FastAPI)
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page
├── components/          # React components
│   ├── chat-area.tsx   # Chat interface
│   ├── quiz-panel.tsx  # Quiz interface
│   └── flashcard-panel.tsx # Flashcard interface
└── contexts/           # React contexts
    └── session-context.tsx # Session management
```

## API Endpoints

### Backend (FastAPI)

- `POST /api/upload` - Upload and process PDF
- `POST /api/chat` - Send chat message
- `POST /api/quiz` - Generate quiz questions
- `POST /api/flashcards` - Generate flashcards
- `GET /api/health` - Health check

### Frontend (Next.js)

All frontend routes proxy to the FastAPI backend:
- `/api/upload` → `http://localhost:8000/api/upload`
- `/api/chat` → `http://localhost:8000/api/chat`
- `/api/quiz` → `http://localhost:8000/api/quiz`
- `/api/flashcards` → `http://localhost:8000/api/flashcards`

## Environment Variables

### Backend (.env)
```
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend (.env.local) - Optional
```
BACKEND_URL=http://localhost:8000
```

## Troubleshooting

### Backend Issues

- **Module not found**: Activate virtual environment and reinstall dependencies
- **GROQ_API_KEY error**: Check `.env` file exists in `backend/` directory
- **Port 8000 in use**: Change port in startup command or stop conflicting service

### Frontend Issues

- **Cannot connect to backend**: Ensure backend is running on port 8000
- **CORS errors**: Check CORS settings in `backend/main.py`

### PDF Upload Issues

- **File too large**: Maximum size is 50MB
- **No text extracted**: PDF might be image-based (scanned), try a text-based PDF

## Development

### Backend Development

```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload
```

### Frontend Development

```bash
npm run dev
```

## Production Considerations

- Use a database for session/vector store persistence
- Implement proper authentication
- Add rate limiting
- Use environment-specific CORS settings
- Consider using Redis for session storage
- Add logging and monitoring
- Implement proper error handling and retries

## License

MIT

