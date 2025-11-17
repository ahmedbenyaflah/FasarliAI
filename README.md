# FasarliAI - AI-Powered PDF Learning Platform

## Project Title & Description

**FasarliAI** is a full-stack, AI-powered learning platform that enables users to upload PDF documents and interact with them through intelligent chat, automated quiz generation, and flashcard creation. Built with modern web technologies and leveraging Large Language Models (LLMs) for natural language understanding, the platform transforms static PDF documents into interactive learning experiences.

The application uses Retrieval Augmented Generation (RAG) to provide contextually accurate responses based on PDF content, making it ideal for students, researchers, and professionals who need to quickly understand and study complex documents.

---

## Full Features List

### 🔐 Authentication & User Management
- **User Registration**: Sign up with email, password, and username
- **User Login**: Secure authentication via Supabase Auth
- **User Profiles**: View and manage user information
- **Session Management**: Persistent sessions with automatic refresh
- **Sign Out**: Secure logout functionality

### 📄 PDF Management
- **PDF Upload**: Upload PDF files up to 50MB
- **PDF Storage**: Secure storage in Supabase Storage buckets
- **PDF Processing**: Automatic text extraction and chunking
- **Vector Embeddings**: Convert PDF content into searchable vector embeddings
- **PDF Reloading**: Reload PDFs from storage when opening conversations

### 💬 AI Chat System
- **RAG-Powered Chat**: Ask questions about PDF content using Retrieval Augmented Generation
- **Context-Aware Responses**: AI responses based on actual PDF content
- **Chat History**: Persistent conversation history saved to database
- **Source Citations**: View sources for AI responses
- **Typing Animation**: Smooth typing effect for AI responses

### 📝 Quiz Generation
- **Automatic Quiz Creation**: Generate multiple-choice questions from PDF content
- **Interactive Quiz Interface**: Answer questions and see immediate feedback
- **Score Tracking**: Track your quiz performance
- **Question Navigation**: Navigate through quiz questions

### ⚡ Flashcard Generation
- **Automatic Flashcard Creation**: Generate study flashcards from PDF content
- **Flip Animation**: Interactive card flipping interface
- **Color-Coded Cards**: Visual organization with gradient colors
- **Navigation Controls**: Easy navigation between flashcards

### 📚 Conversation Management
- **Multiple Conversations**: Create and manage multiple PDF conversations
- **Conversation List**: View all conversations in sidebar
- **Auto-Naming**: Intelligent conversation naming based on PDF content or chat history
- **Conversation Deletion**: Delete conversations and associated PDFs from storage
- **New Conversation Button**: Quick creation of new conversations

### 🎨 User Interface
- **Modern Design**: Beautiful, responsive UI built with Radix UI and Tailwind CSS
- **Dark Mode Support**: Theme provider for dark/light mode
- **Sidebar Navigation**: Easy access to different views (Chat, Quiz, Flashcards)
- **Settings Menu**: Access user profile and settings
- **Toast Notifications**: User-friendly notifications for actions

---

## High-level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Next.js Frontend (React/TypeScript)          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │   Sign In/Up │  │  Chat Area    │  │  Quiz Panel   │ │  │
│  │  │   Pages      │  │  Component    │  │  Component    │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │ Conversations│  │ Flashcard    │  │  Sidebar      │ │  │
│  │  │ List         │  │ Panel        │  │  Component    │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        │ HTTP/HTTPS
                        │
        ┌───────────────┴───────────────┐
        │                               │
┌───────▼────────┐            ┌─────────▼──────────┐
│  Next.js API   │            │   Supabase         │
│  Routes        │            │   (PostgreSQL +    │
│  (Proxy Layer) │            │    Storage + Auth) │
└───────┬────────┘            └───────────────────┘
        │                               │
        │                               │
        │  Forward Requests             │  Store Data
        │                               │
┌───────▼───────────────────────────────▼──────────┐
│         FastAPI Backend (Python)                 │
│  ┌────────────────────────────────────────────┐  │
│  │  PDF Processing                           │  │
│  │  - Text Extraction (PyPDF)                │  │
│  │  - Text Chunking                          │  │
│  │  - Embeddings (HuggingFace)               │  │
│  │  - Vector Store (FAISS)                   │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │  AI Services                               │  │
│  │  - Chat (RAG with Groq LLM)               │  │
│  │  - Quiz Generation (Groq LLM)             │  │
│  │  - Flashcard Generation (Groq LLM)         │  │
│  │  - Conversation Naming (Groq LLM)          │  │
│  └────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────┘
```

---

## Tech Stack Explanation

### Frontend
- **Next.js 16**: React framework with App Router, Server Components, and API Routes
- **TypeScript**: Type-safe JavaScript for better developer experience
- **React 19**: Modern React with hooks and context API
- **Tailwind CSS 4**: Utility-first CSS framework for rapid UI development
- **Radix UI**: Accessible, unstyled component primitives
- **React Hook Form**: Performant form library with validation
- **Zod**: TypeScript-first schema validation
- **Sonner**: Toast notification library
- **Lucide React**: Beautiful icon library

### Backend (FastAPI)
- **FastAPI**: Modern, fast Python web framework
- **Uvicorn**: ASGI server for FastAPI
- **LangChain**: Framework for building LLM applications
- **LangChain Groq**: Integration for Groq LLM
- **HuggingFace Sentence Transformers**: Pre-trained embedding models
- **FAISS**: Facebook AI Similarity Search for vector storage
- **PyPDF**: PDF text extraction library

### Database & Storage
- **Supabase**: Backend-as-a-Service platform
  - **PostgreSQL**: Relational database for structured data
  - **Supabase Storage**: Object storage for PDF files
  - **Supabase Auth**: Authentication service
  - **Row Level Security (RLS)**: Database-level security policies

### AI/ML
- **Groq API**: Fast LLM inference for chat, quiz, and flashcard generation
- **Model**: `llama-3.1-8b-instant` - Fast, efficient language model
- **Embedding Model**: `sentence-transformers/all-MiniLM-L6-v2` - Lightweight embeddings

### Development Tools
- **Node.js 18+**: JavaScript runtime
- **Python 3.8+**: Python runtime
- **npm/yarn**: Package managers
- **ESLint**: Code linting
- **TypeScript Compiler**: Type checking

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
1. **Node.js** (v18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **Python** (v3.8 or higher)
   - Download from [python.org](https://www.python.org/downloads/)
   - Verify installation: `python --version`

3. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

4. **pip** (Python package manager)
   - Usually comes with Python
   - Verify installation: `pip --version`

### Required Accounts & API Keys
1. **Supabase Account**
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Groq API Key**
   - Sign up at [console.groq.com](https://console.groq.com/)
   - Create an API key
   - Note your API key

### Optional but Recommended
- **Git**: Version control system
- **VS Code**: Code editor with TypeScript support
- **Postman/Insomnia**: API testing tools

---

## Installation Guide

### Step 1: Clone the Repository

```bash
# If using Git
git clone <repository-url>
cd FasarliAI

# Or download and extract the ZIP file
```

### Step 2: Install Frontend Dependencies

```bash
# Navigate to project root (if not already there)
cd FasarliAI

# Install all npm packages
npm install

# This will install all dependencies listed in package.json
# Wait for installation to complete (may take 2-5 minutes)
```

### Step 3: Install Backend Dependencies

```bash
# Navigate to backend directory
cd backend

# Create a Python virtual environment
# On Windows:
python -m venv venv

# On macOS/Linux:
python3 -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# Install Python packages
pip install -r requirements.txt

# Verify installation
pip list
```

### Step 4: Set Up Environment Variables

#### Frontend Environment Variables

Create a `.env.local` file in the project root:

```bash
# In project root directory
touch .env.local  # On macOS/Linux
# Or create .env.local manually on Windows
```

Add the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
BACKEND_URL=http://localhost:8000
```

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# In backend directory
cd backend
touch .env  # On macOS/Linux
# Or create .env manually on Windows
```

Add the following content:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### Step 5: Set Up Supabase Database

See the [Supabase Setup Guide](#supabase-setup-guide) section below for detailed instructions.

### Step 6: Verify Installation

```bash
# Check frontend dependencies
npm list --depth=0

# Check backend dependencies (with venv activated)
pip list
```

---

## Environment Variables (.env.example)

### Frontend (.env.local)

```env
# Supabase Configuration
# Get these from your Supabase project settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# Explanation: Your Supabase project URL. Found in Project Settings > API > Project URL

NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
# Explanation: Your Supabase anonymous/public key. Found in Project Settings > API > anon/public key
# This key is safe to expose in client-side code as it's protected by RLS policies

# Backend API URL
BACKEND_URL=http://localhost:8000
# Explanation: URL of the FastAPI backend server. Use http://localhost:8000 for local development
# For production, replace with your production backend URL
```

### Backend (.env)

```env
# Groq API Key
GROQ_API_KEY=your-groq-api-key-here
# Explanation: Your Groq API key for LLM inference. Get it from https://console.groq.com/
# This key is used to generate chat responses, quizzes, flashcards, and conversation names
# Keep this secret and never commit it to version control
```

---

## Supabase Setup Guide

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project Name**: e.g., "FasarliAI"
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project to be created (2-3 minutes)

### Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL Editor
5. Click "Run" (or press Ctrl+Enter)
6. Verify success: You should see "Success. No rows returned"

7. Run the second migration:
   - Copy contents of `supabase/migrations/002_add_storage_path.sql`
   - Paste and run in SQL Editor

### Step 4: Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Configure:
   - **Name**: `pdfs`
   - **Public bucket**: Unchecked (private)
   - **File size limit**: 52428800 (50MB)
   - **Allowed MIME types**: `application/pdf`
4. Click "Create bucket"

### Step 5: Set Up Storage Policies

1. In Storage, click on the `pdfs` bucket
2. Go to **Policies** tab
3. Click "New Policy"
4. Create the following policies (or run the SQL from migration file):

**Policy 1: Allow users to upload their own PDFs**
```sql
CREATE POLICY "Users can upload their own PDFs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pdfs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 2: Allow users to read their own PDFs**
```sql
CREATE POLICY "Users can read their own PDFs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'pdfs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 3: Allow users to delete their own PDFs**
```sql
CREATE POLICY "Users can delete their own PDFs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pdfs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Step 6: Verify Setup

1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - `users`
   - `conversations`
   - `pdfs`
   - `chat_messages`
3. Go to **Storage** and verify `pdfs` bucket exists

---

## Database Tables

### 1. `users` Table

Extends Supabase `auth.users` with additional profile information.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | References `auth.users(id)`, cascades on delete |
| `email` | TEXT | User's email address |
| `username` | TEXT | Optional username |
| `created_at` | TIMESTAMP | Account creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

**Relationships:**
- One-to-many with `conversations`
- One-to-many with `pdfs`
- One-to-many with `chat_messages`

### 2. `conversations` Table

Stores conversation metadata. One conversation per PDF upload.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Unique conversation identifier |
| `user_id` | UUID (FK) | References `auth.users(id)`, cascades on delete |
| `title` | TEXT | Conversation title (auto-generated or user-set) |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp (auto-updated) |

**Relationships:**
- Many-to-one with `users`
- One-to-one with `pdfs`
- One-to-many with `chat_messages`

**Indexes:**
- `idx_conversations_user_id` on `user_id`
- `idx_conversations_created_at` on `created_at DESC`

### 3. `pdfs` Table

Stores PDF metadata and references to storage.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Unique PDF identifier |
| `conversation_id` | UUID (FK) | References `conversations(id)`, cascades on delete |
| `user_id` | UUID (FK) | References `auth.users(id)`, cascades on delete |
| `filename` | TEXT | Original PDF filename |
| `file_size` | BIGINT | File size in bytes |
| `chunks_count` | INTEGER | Number of text chunks created |
| `vector_store_session_id` | TEXT | Session ID for vector store (temporary) |
| `storage_path` | TEXT | Path in Supabase Storage bucket |
| `created_at` | TIMESTAMP | Upload timestamp |

**Relationships:**
- Many-to-one with `conversations`
- Many-to-one with `users`

**Indexes:**
- `idx_pdfs_conversation_id` on `conversation_id`
- `idx_pdfs_user_id` on `user_id`

### 4. `chat_messages` Table

Stores all chat messages in conversations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Unique message identifier |
| `conversation_id` | UUID (FK) | References `conversations(id)`, cascades on delete |
| `user_id` | UUID (FK) | References `auth.users(id)`, cascades on delete |
| `author` | TEXT | Message author: 'user', 'assistant', or 'system' |
| `content` | TEXT | Message content |
| `sources` | JSONB | Array of source objects (for assistant messages) |
| `created_at` | TIMESTAMP | Message timestamp |

**Relationships:**
- Many-to-one with `conversations`
- Many-to-one with `users`

**Indexes:**
- `idx_chat_messages_conversation_id` on `conversation_id`
- `idx_chat_messages_created_at` on `created_at ASC`
- `idx_chat_messages_user_id` on `user_id`

---

## SQL Migrations

### Migration 001: Initial Schema (`001_initial_schema.sql`)

Creates all database tables, indexes, RLS policies, and triggers.

**Key Features:**
- Creates `users`, `conversations`, `pdfs`, and `chat_messages` tables
- Sets up foreign key relationships with CASCADE deletes
- Creates indexes for performance
- Enables Row Level Security (RLS) on all tables
- Creates RLS policies for user data isolation
- Creates trigger to auto-create user profile on signup
- Creates trigger to auto-update `updated_at` timestamps

### Migration 002: Storage Path (`002_add_storage_path.sql`)

Adds storage path column and storage bucket policies.

**Key Features:**
- Adds `storage_path` column to `pdfs` table
- Creates storage bucket policies (commented out - run manually in Storage UI)

---

## Policies (RLS, Storage, Auth)

### Row Level Security (RLS) Policies

RLS ensures users can only access their own data.

#### Users Table Policies
- **SELECT**: Users can view their own profile
- **UPDATE**: Users can update their own profile

#### Conversations Table Policies
- **SELECT**: Users can view their own conversations
- **INSERT**: Users can create conversations (must be their own)
- **UPDATE**: Users can update their own conversations
- **DELETE**: Users can delete their own conversations

#### PDFs Table Policies
- **SELECT**: Users can view their own PDFs
- **INSERT**: Users can create PDFs (must be their own)
- **DELETE**: Users can delete their own PDFs

#### Chat Messages Table Policies
- **SELECT**: Users can view messages from their conversations
- **INSERT**: Users can create messages in their conversations
- **DELETE**: Users can delete their own messages

### Storage Policies

Storage policies control access to PDF files in Supabase Storage.

**Bucket**: `pdfs` (private bucket)

**Policies:**
1. **INSERT**: Users can upload PDFs to their own folder (`userId/filename`)
2. **SELECT**: Users can read PDFs from their own folder
3. **DELETE**: Users can delete PDFs from their own folder

**Path Structure**: `{userId}/{conversationId}.pdf`

### Auth Policies

Supabase Auth handles authentication:
- Email/password authentication
- Session management
- JWT token generation
- Automatic user creation in `auth.users` table

---

## Storage Buckets

### `pdfs` Bucket

**Configuration:**
- **Name**: `pdfs`
- **Public**: `false` (private)
- **File Size Limit**: 50MB (52,428,800 bytes)
- **Allowed MIME Types**: `application/pdf`

**Path Structure:**
```
pdfs/
  └── {userId}/
      └── {conversationId}.pdf
```

**Example:**
```
pdfs/
  └── 123e4567-e89b-12d3-a456-426614174000/
      └── 987fcdeb-51a2-43d7-8f9e-123456789abc.pdf
```

---

## Edge Functions

Currently, the project does not use Supabase Edge Functions. All server-side logic is handled by:
- Next.js API Routes (for database operations and proxying)
- FastAPI Backend (for AI/ML processing)

If you need to add Edge Functions in the future, they would be placed in `supabase/functions/`.

---

## How to Run the Project Locally

### Step 1: Start the Backend Server

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# Start FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# You should see:
# INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
# INFO:     Application startup complete.
```

**Keep this terminal window open!**

### Step 2: Start the Frontend Server

Open a **new terminal window**:

```bash
# Navigate to project root
cd FasarliAI

# Start Next.js development server
npm run dev

# You should see:
# ▲ Next.js 16.0.3
# - Local:        http://localhost:3000
```

### Step 3: Access the Application

1. Open your browser
2. Navigate to `http://localhost:3000`
3. You should see the sign-in page
4. Create an account or sign in

### Step 4: Test the Application

1. **Sign Up**: Create a new account
2. **Upload PDF**: Click "Upload a PDF to Get Started"
3. **Chat**: Ask questions about the PDF
4. **Quiz**: Switch to Quiz view and generate questions
5. **Flashcards**: Switch to Flashcards view and generate cards

---

## How to Run Production Build

### Step 1: Build the Frontend

```bash
# In project root
npm run build

# This creates an optimized production build in .next/ directory
```

### Step 2: Start Production Server

```bash
# Start Next.js production server
npm start

# Server runs on http://localhost:3000 (or PORT environment variable)
```

### Step 3: Set Up Production Backend

For production, you should:

1. **Deploy FastAPI Backend**:
   - Use a service like Railway, Render, or AWS
   - Set `GROQ_API_KEY` environment variable
   - Update `BACKEND_URL` in frontend `.env.local`

2. **Configure CORS**:
   - Update `allow_origins` in `backend/main.py` to include your production domain

3. **Set Up Environment Variables**:
   - Use your hosting platform's environment variable settings
   - Never commit `.env` files to version control

### Production Checklist

- [ ] Update `BACKEND_URL` to production URL
- [ ] Update CORS origins in FastAPI backend
- [ ] Set up proper error logging
- [ ] Configure rate limiting
- [ ] Set up monitoring/analytics
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure CDN for static assets

---

## Authentication Flow Explanation

### Sign Up Flow

```
1. User fills signup form (email, password, username)
   ↓
2. Frontend calls Supabase Auth signUp()
   ↓
3. Supabase creates user in auth.users table
   ↓
4. Database trigger (handle_new_user) fires
   ↓
5. User record created in public.users table
   ↓
6. User redirected to main page
   ↓
7. AuthContext provides user session
```

### Sign In Flow

```
1. User fills signin form (email, password)
   ↓
2. Frontend calls Supabase Auth signInWithPassword()
   ↓
3. Supabase validates credentials
   ↓
4. Session created and stored in cookies
   ↓
5. Middleware refreshes session on each request
   ↓
6. User redirected to main page
   ↓
7. AuthContext provides user session
```

### Session Management

- **Client-Side**: Supabase client stores session in browser
- **Server-Side**: Next.js middleware refreshes session using cookies
- **API Routes**: Use `getAuthenticatedUser(request)` to get current user
- **Auto-Refresh**: Middleware automatically refreshes expired sessions

### Protected Routes

- Main page (`/`) checks authentication
- Unauthenticated users redirected to `/signin`
- API routes return 401 if user not authenticated

---

## Storage Flow Explanation

### PDF Upload Flow

```
1. User selects PDF file
   ↓
2. Frontend sends file to /api/upload
   ↓
3. Next.js API route:
   a. Validates authentication
   b. Validates file (type, size)
   c. Creates conversation in database
   d. Forwards file to FastAPI backend
   ↓
4. FastAPI backend:
   a. Extracts text from PDF
   b. Splits text into chunks
   c. Creates embeddings
   d. Stores in FAISS vector store
   e. Returns session_id
   ↓
5. Next.js API route:
   a. Uploads PDF to Supabase Storage
   b. Saves PDF metadata to database
   c. Creates system message
   ↓
6. Frontend receives response with session_id
   ↓
7. User can now chat, generate quiz, etc.
```

### PDF Reload Flow (When Opening Conversation)

```
1. User clicks conversation in sidebar
   ↓
2. Frontend loads chat messages from database
   ↓
3. Frontend sets pdfLoading = true (disables chat input)
   ↓
4. Frontend calls /api/conversations/reload-pdf
   ↓
5. Next.js API route:
   a. Gets PDF metadata from database
   b. Downloads PDF from Supabase Storage
   c. Forwards PDF to FastAPI backend
   ↓
6. FastAPI backend:
   a. Processes PDF (same as upload)
   b. Returns new session_id
   ↓
7. Next.js API route updates session_id in database
   ↓
8. Frontend receives session_id
   ↓
9. Frontend sets pdfLoading = false (enables chat input)
```

### PDF Deletion Flow

```
1. User clicks delete conversation
   ↓
2. Frontend calls /api/conversations/delete
   ↓
3. Next.js API route:
   a. Gets PDF metadata (to find storage_path)
   b. Deletes PDF from Supabase Storage
   c. Deletes conversation from database (cascades to PDFs and messages)
   ↓
4. Frontend refreshes conversation list
```

---

## Vector Embeddings Flow Explanation

### Embedding Creation Process

```
1. PDF Uploaded
   ↓
2. Text Extraction (PyPDF)
   - Reads PDF pages
   - Extracts text content
   ↓
3. Text Chunking (RecursiveCharacterTextSplitter)
   - Splits text into chunks of 1000 characters
   - Overlap of 100 characters between chunks
   - Example: 10,000 char document → 10-11 chunks
   ↓
4. Embedding Generation (HuggingFace)
   - Model: sentence-transformers/all-MiniLM-L6-v2
   - Converts each chunk to 384-dimensional vector
   - Example: "Hello world" → [0.123, -0.456, ..., 0.789]
   ↓
5. Vector Store Creation (FAISS)
   - Stores all chunk embeddings
   - Indexes for fast similarity search
   - In-memory storage (session-based)
   ↓
6. Ready for RAG queries
```

### RAG (Retrieval Augmented Generation) Flow

```
1. User asks question: "What is machine learning?"
   ↓
2. Question Embedding
   - Convert question to embedding vector
   ↓
3. Similarity Search (FAISS)
   - Find top 4 most similar chunks
   - Uses cosine similarity
   ↓
4. Context Assembly
   - Combine retrieved chunks
   - Add to prompt as context
   ↓
5. LLM Generation (Groq)
   - Send context + question to LLM
   - LLM generates answer based on context
   ↓
6. Return Answer
   - Answer includes relevant PDF content
   - More accurate than general LLM
```

### Why This Works

- **Semantic Search**: Embeddings capture meaning, not just keywords
- **Context-Aware**: LLM receives relevant PDF content
- **Accurate Answers**: Responses based on actual document content
- **Fast Retrieval**: FAISS enables millisecond similarity search

---

## How PDFs are Uploaded, Stored, and Processed

### Step-by-Step Process

#### 1. Upload Phase

**Frontend (`components/chat-area.tsx`):**
- User selects PDF file via file input
- File validated (type, size)
- FormData created with file
- POST request to `/api/upload`

**Next.js API Route (`app/api/upload/route.ts`):**
- Validates authentication
- Validates file (PDF, <50MB)
- Creates conversation in database
- Forwards file to FastAPI backend

#### 2. Processing Phase

**FastAPI Backend (`backend/main.py`):**
```python
# Step 1: Save uploaded file temporarily
with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
    shutil.copyfileobj(file.file, tmp_file)
    tmp_path = tmp_file.name

# Step 2: Extract text
reader = PdfReader(tmp_path)
text = "\n".join([page.extract_text() for page in reader.pages])

# Step 3: Split into chunks
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
chunks = splitter.split_text(text)

# Step 4: Create embeddings
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Step 5: Create vector store
vector_store = FAISS.from_texts(chunks, embedding=embeddings)

# Step 6: Store in memory (keyed by session_id)
vector_stores[session_id] = vector_store
```

#### 3. Storage Phase

**Next.js API Route:**
- Uploads PDF to Supabase Storage
- Path: `{userId}/{conversationId}.pdf`
- Saves `storage_path` to database

**Supabase Storage:**
- File stored in `pdfs` bucket
- Private bucket (not publicly accessible)
- Access controlled by RLS policies

#### 4. Database Phase

**Next.js API Route:**
- Creates PDF record in `pdfs` table
- Saves: filename, size, chunks_count, session_id, storage_path
- Creates system message in `chat_messages` table

### Storage Locations

1. **Supabase Storage**: Original PDF file (persistent)
2. **Database**: PDF metadata (persistent)
3. **FastAPI Memory**: Vector store (temporary, session-based)

### Why This Architecture?

- **Storage**: PDFs persist across sessions
- **Processing**: Vector stores recreated on demand (fast)
- **Scalability**: Can move vector stores to persistent storage later

---

## How the Quizzes / Flashcards / Chat System Works

### Chat System

#### Architecture
- **RAG (Retrieval Augmented Generation)**: Combines vector search with LLM
- **Context Window**: Uses top 4 most relevant chunks
- **Chat History**: Maintains last 3 exchanges for context

#### Flow
```
User Question
   ↓
Question → Embedding
   ↓
FAISS Similarity Search (top 4 chunks)
   ↓
Combine: Context + History + Question
   ↓
Groq LLM Generation
   ↓
Response with Sources
```

#### Implementation
- **Backend**: `backend/main.py` - `/api/chat` endpoint
- **Frontend**: `components/chat-area.tsx` - Chat UI
- **Database**: Messages saved to `chat_messages` table

### Quiz System

#### Architecture
- **Question Generation**: LLM generates questions from PDF content
- **Multiple Choice**: 4 options per question (A, B, C, D)
- **Answer Validation**: Correct answer stored in response

#### Flow
```
User Clicks "Generate Quiz"
   ↓
Retrieve PDF Content (top 5 chunks)
   ↓
Send to Groq LLM with prompt:
  "Generate 5 multiple-choice questions..."
   ↓
LLM Returns JSON with questions
   ↓
Parse and Display Questions
```

#### Implementation
- **Backend**: `backend/main.py` - `/api/quiz` endpoint
- **Frontend**: `components/quiz-panel.tsx` - Quiz UI
- **Features**: Score tracking, answer feedback, navigation

### Flashcard System

#### Architecture
- **Card Generation**: LLM generates question-answer pairs
- **Flip Animation**: Front (question) / Back (answer)
- **Visual Design**: Color-coded cards with gradients

#### Flow
```
User Clicks "Generate Flashcards"
   ↓
Retrieve PDF Content (top 5 chunks)
   ↓
Send to Groq LLM with prompt:
  "Generate 5 flashcards with front/back..."
   ↓
LLM Returns JSON with flashcards
   ↓
Display Cards with Flip Animation
```

#### Implementation
- **Backend**: `backend/main.py` - `/api/flashcards` endpoint
- **Frontend**: `components/flashcard-panel.tsx` - Flashcard UI
- **Features**: Flip animation, navigation, color coding

### Common Features

- **Session-Based**: All features require active PDF session
- **Error Handling**: Graceful error messages
- **Loading States**: Visual feedback during generation
- **Timeout Protection**: 2-minute timeout for long requests

---

## API Endpoints

### Frontend API Routes (Next.js)

All routes are in `app/api/` directory.

#### Authentication Required
All endpoints (except health checks) require authentication via Supabase session.

#### 1. `/api/upload` (POST)
**Purpose**: Upload and process PDF file

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  ```json
  {
    "file": File,
    "conversationId": string (optional)
  }
  ```

**Response:**
```json
{
  "session_id": "uuid",
  "message": "PDF processed successfully",
  "chunks_count": 42,
  "conversation_id": "uuid"
}
```

**Errors:**
- `401`: Unauthorized
- `400`: Invalid file (not PDF, too large)
- `500`: Processing error

---

#### 2. `/api/chat` (POST)
**Purpose**: Send chat message and get AI response

**Request:**
```json
{
  "message": "What is machine learning?",
  "sessionId": "uuid",
  "conversationId": "uuid"
}
```

**Response:**
```json
{
  "id": "uuid",
  "author": "FasarliAI",
  "content": "Machine learning is...",
  "sources": [
    {
      "title": "Document Section",
      "description": "Relevant content..."
    }
  ],
  "timestamp": "2024-01-01T12:00:00Z"
}
```

**Errors:**
- `401`: Unauthorized
- `400`: Missing message or sessionId
- `504`: Request timeout

---

#### 3. `/api/quiz` (POST)
**Purpose**: Generate quiz questions from PDF

**Request:**
```json
{
  "sessionId": "uuid"
}
```

**Response:**
```json
{
  "questions": [
    {
      "question": "What is...?",
      "a": "Option A",
      "b": "Option B",
      "c": "Option C",
      "d": "Option D",
      "correct": "a"
    }
  ]
}
```

**Errors:**
- `400`: No sessionId or no PDF uploaded
- `504`: Request timeout

---

#### 4. `/api/flashcards` (POST)
**Purpose**: Generate flashcards from PDF

**Request:**
```json
{
  "sessionId": "uuid"
}
```

**Response:**
```json
{
  "flashcards": [
    {
      "front": "Question?",
      "back": "Answer"
    }
  ]
}
```

**Errors:**
- `400`: No sessionId or no PDF uploaded
- `504`: Request timeout

---

#### 5. `/api/conversations` (POST)
**Purpose**: Create a new conversation

**Request:**
```json
{
  "title": "My Conversation"
}
```

**Response:**
```json
{
  "conversation": {
    "id": "uuid",
    "user_id": "uuid",
    "title": "My Conversation",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

**Errors:**
- `401`: Unauthorized
- `400`: Missing title

---

#### 6. `/api/conversations/delete` (DELETE)
**Purpose**: Delete a conversation and its PDF from storage

**Request:**
- Method: `DELETE`
- Query Params: `?conversationId=uuid`

**Response:**
```json
{
  "success": true
}
```

**Errors:**
- `401`: Unauthorized
- `400`: Missing conversationId
- `404`: Conversation not found

---

#### 7. `/api/conversations/rename` (POST)
**Purpose**: Rename a conversation

**Request:**
```json
{
  "conversationId": "uuid",
  "title": "New Title"
}
```

**Response:**
```json
{
  "success": true,
  "conversation": { ... }
}
```

---

#### 8. `/api/conversations/reload-pdf` (POST)
**Purpose**: Reload PDF from storage and recreate vector store

**Request:**
```json
{
  "conversationId": "uuid"
}
```

**Response:**
```json
{
  "session_id": "uuid"
}
```

**Errors:**
- `401`: Unauthorized
- `404`: PDF not found
- `500`: Processing error

---

#### 9. `/api/conversations/generate-name` (POST)
**Purpose**: Generate conversation name from chat history

**Request:**
```json
{
  "conversationId": "uuid"
}
```

**Response:**
```json
{
  "name": "Machine Learning Basics"
}
```

---

#### 10. `/api/conversations/generate-name-from-pdf` (POST)
**Purpose**: Generate conversation name from PDF content

**Request:**
```json
{
  "sessionId": "uuid"
}
```

**Response:**
```json
{
  "name": "Introduction to AI"
}
```

---

### Backend API Routes (FastAPI)

All routes are in `backend/main.py`.

Base URL: `http://localhost:8000` (development)

#### 1. `POST /api/upload`
Upload and process PDF file.

#### 2. `POST /api/chat`
Get AI chat response using RAG.

#### 3. `POST /api/quiz`
Generate quiz questions.

#### 4. `POST /api/flashcards`
Generate flashcards.

#### 5. `POST /api/generate-conversation-name`
Generate conversation name from chat history.

#### 6. `POST /api/generate-conversation-name-from-pdf`
Generate conversation name from PDF content.

#### 7. `GET /api/health`
Health check endpoint.

#### 8. `GET /docs`
Interactive API documentation (Swagger UI).

---

## Folder Structure

```
FasarliAI/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (Next.js)
│   │   ├── chat/
│   │   │   └── route.ts         # Chat endpoint
│   │   ├── conversations/
│   │   │   ├── delete/
│   │   │   │   └── route.ts     # Delete conversation
│   │   │   ├── generate-name/
│   │   │   │   └── route.ts     # Generate name from chat
│   │   │   ├── generate-name-from-pdf/
│   │   │   │   └── route.ts     # Generate name from PDF
│   │   │   ├── reload-pdf/
│   │   │   │   └── route.ts     # Reload PDF from storage
│   │   │   ├── rename/
│   │   │   │   └── route.ts     # Rename conversation
│   │   │   └── route.ts         # Create conversation
│   │   ├── flashcards/
│   │   │   └── route.ts         # Flashcard generation
│   │   ├── quiz/
│   │   │   └── route.ts         # Quiz generation
│   │   └── upload/
│   │       └── route.ts         # PDF upload
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main page
│   ├── signin/
│   │   └── page.tsx             # Sign in page
│   └── signup/
│       └── page.tsx             # Sign up page
├── backend/                     # FastAPI Backend
│   ├── main.py                  # Main FastAPI application
│   ├── requirements.txt         # Python dependencies
│   ├── start.bat                # Windows startup script
│   ├── start.sh                 # Linux/Mac startup script
│   ├── .env                     # Backend environment variables
│   └── venv/                    # Python virtual environment
├── components/                  # React Components
│   ├── ui/                      # UI component library (Radix UI)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── form.tsx
│   │   └── ...                  # Other UI components
│   ├── chat-area.tsx            # Main chat interface
│   ├── chat-history.tsx         # Chat history display
│   ├── conversations-list.tsx   # Conversation sidebar
│   ├── flashcard-panel.tsx      # Flashcard interface
│   ├── message-bubble.tsx       # Chat message component
│   ├── quiz-panel.tsx           # Quiz interface
│   ├── sidebar.tsx              # Sidebar navigation
│   ├── sources-panel.tsx         # Source citations
│   └── theme-provider.tsx       # Theme context
├── contexts/                    # React Contexts
│   ├── auth-context.tsx         # Authentication context
│   └── session-context.tsx      # Session/PDF context
├── lib/                         # Utility Libraries
│   ├── supabase/
│   │   ├── client.ts            # Supabase client (browser)
│   │   ├── server.ts            # Supabase client (server)
│   │   ├── server-auth.ts       # Server auth utilities
│   │   ├── database.ts          # Database functions (client)
│   │   ├── database-server.ts   # Database functions (server)
│   │   └── storage.ts           # Storage functions
│   └── utils.ts                 # General utilities
├── supabase/                    # Supabase Configuration
│   ├── migrations/
│   │   ├── 001_initial_schema.sql    # Initial database schema
│   │   └── 002_add_storage_path.sql # Storage path migration
│   └── README.md                # Supabase setup guide
├── public/                      # Static Assets
│   ├── icon.svg
│   └── ...                      # Other static files
├── _middleware.ts               # Next.js middleware (Supabase session refresh)
├── .env.local                   # Frontend environment variables
├── .gitignore                   # Git ignore rules
├── components.json               # shadcn/ui configuration
├── next.config.js                # Next.js configuration
├── package.json                  # Node.js dependencies
├── postcss.config.mjs           # PostCSS configuration
├── README.md                     # This file
├── tsconfig.json                 # TypeScript configuration
└── tailwind.config.ts            # Tailwind CSS configuration
```

---

## Common Errors & Troubleshooting

### Backend Errors

#### Error: "Module not found" or "No module named 'fastapi'"

**Cause**: Python dependencies not installed or virtual environment not activated.

**Solution**:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

---

#### Error: "GROQ_API_KEY not configured"

**Cause**: Missing or incorrect Groq API key in backend `.env` file.

**Solution**:
1. Check `backend/.env` exists
2. Verify `GROQ_API_KEY=your_key_here` is set
3. Restart FastAPI server

---

#### Error: "Port 8000 is already in use"

**Cause**: Another process is using port 8000.

**Solution**:
```bash
# Find process using port 8000
# Windows:
netstat -ano | findstr :8000
# Kill process (replace PID):
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:8000 | xargs kill -9

# Or change port in uvicorn command:
uvicorn main:app --reload --port 8001
```

---

#### Error: "Failed to process PDF: No text could be extracted"

**Cause**: PDF is image-based (scanned) or corrupted.

**Solution**:
- Use a text-based PDF (not scanned images)
- Try OCR software to convert scanned PDFs
- Verify PDF is not corrupted

---

### Frontend Errors

#### Error: "Cannot connect to backend server"

**Cause**: FastAPI backend is not running or `BACKEND_URL` is incorrect.

**Solution**:
1. Verify backend is running: `http://localhost:8000/docs`
2. Check `BACKEND_URL` in `.env.local`
3. Restart Next.js dev server

---

#### Error: "Unauthorized" when uploading PDF

**Cause**: User not authenticated or session expired.

**Solution**:
1. Sign out and sign in again
2. Check Supabase credentials in `.env.local`
3. Clear browser cookies and try again

---

#### Error: "Failed to create conversation" (500 error)

**Cause**: Database connection issue or RLS policy blocking.

**Solution**:
1. Check Supabase project is active
2. Verify database migrations ran successfully
3. Check RLS policies in Supabase dashboard
4. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

#### Error: "POST /api/upload 500"

**Cause**: Multiple possible issues.

**Solution**:
1. Check backend logs for detailed error
2. Verify file size < 50MB
3. Verify file is a valid PDF
4. Check backend is running and accessible
5. Verify `GROQ_API_KEY` is set in backend

---

### Database Errors

#### Error: "relation 'users' does not exist"

**Cause**: Database migrations not run.

**Solution**:
1. Go to Supabase SQL Editor
2. Run `001_initial_schema.sql`
3. Run `002_add_storage_path.sql`
4. Verify tables exist in Table Editor

---

#### Error: "new row violates row-level security policy"

**Cause**: RLS policy blocking operation.

**Solution**:
1. Check RLS policies in Supabase dashboard
2. Verify user is authenticated
3. Check policy conditions match your use case
4. Temporarily disable RLS for testing (not recommended for production)

---

### Storage Errors

#### Error: "Bucket 'pdfs' not found"

**Cause**: Storage bucket not created.

**Solution**:
1. Go to Supabase Storage
2. Create bucket named `pdfs`
3. Set as private
4. Configure policies (see Storage Setup)

---

#### Error: "Failed to upload PDF to storage"

**Cause**: Storage policy blocking or bucket misconfigured.

**Solution**:
1. Check storage policies in Supabase dashboard
2. Verify bucket exists and is named `pdfs`
3. Check file size limit (50MB)
4. Verify MIME type allows `application/pdf`

---

### General Troubleshooting

#### Application loads but shows blank page

**Solution**:
1. Check browser console for errors
2. Verify all environment variables are set
3. Check network tab for failed requests
4. Clear browser cache and reload

---

#### Chat/Quiz/Flashcards not working

**Solution**:
1. Verify PDF was uploaded successfully
2. Check `sessionId` is set in session context
3. Verify backend is running and accessible
4. Check browser console for errors
5. Verify `GROQ_API_KEY` is valid

---

#### Conversations not loading

**Solution**:
1. Check Supabase database connection
2. Verify RLS policies allow SELECT
3. Check browser console for errors
4. Verify user is authenticated

---

### Getting Help

If you encounter errors not listed here:

1. **Check Logs**:
   - Browser console (F12)
   - Backend terminal output
   - Supabase logs (dashboard)

2. **Verify Setup**:
   - All environment variables set
   - All dependencies installed
   - Database migrations run
   - Storage bucket created

3. **Test Components**:
   - Backend: `http://localhost:8000/docs`
   - Frontend: `http://localhost:3000`
   - Supabase: Check dashboard

4. **Common Fixes**:
   - Restart both servers
   - Clear browser cache
   - Re-run database migrations
   - Reinstall dependencies

---

## License

MIT

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## Support

For issues and questions:
- Check this README first
- Review error logs
- Check Supabase and Groq documentation
- Open an issue on GitHub (if applicable)

---

**Happy Learning with FasarliAI! 🚀**
