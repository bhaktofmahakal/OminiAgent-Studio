# OmniAgent Studio 🤖

A **developer-first** AI agent builder that enables you to create, test, and deploy AI agents across multiple models (GPT-4o, Claude, Gemini, Groq) in minutes.

## 🚀 Features

### ✨ **Multi-Model AI Integration**
- **4 AI Models**: GPT-4o, Claude 3.5 Haiku, Gemini 1.5 Pro, Groq Mixtral
- **Smart Routing**: Automatically route prompts to optimal models based on task type
- **Real-time Performance**: Live latency tracking and cost monitoring
- **Unified API**: Single interface for all AI models with automatic fallbacks

### 🎨 **Modern UI/UX**
- **Developer-Centric Design**: Inspired by Cursor IDE and modern dev tools
- **Command Palette**: Press `⌘+K` for instant navigation and actions
- **Responsive Design**: Mobile-first with progressive enhancement
- **Dark/Light Mode**: System-aware theme switching
- **Gradient Animations**: Premium visual effects and micro-interactions

### 🛠️ **Agent Builder**
- **Visual Interface**: Two-panel design with live preview
- **Template Gallery**: Pre-built agents for common use cases
- **Real-time Testing**: Test your agent configurations instantly
- **Advanced Settings**: Temperature, tokens, tools, and guardrails
- **Tool Integration**: Web search, code execution, math solving
- **RAG Capability**: Intelligent document chunking and embedding storage in Supabase Vector database

### 📊 **Analytics Dashboard**
- **Real-time Metrics**: Request volume, costs, latency, success rates
- **Interactive Charts**: Trend analysis and model performance comparisons
- **Cost Optimization**: Token usage breakdown and recommendations

### 🔐 **Enterprise Authentication**
- **Clerk Integration**: Secure user management and authentication
- **Protected Routes**: Middleware-based route protection

### 🗄️ **Database & Storage**
- **Supabase PostgreSQL**: Scalable database with real-time features
- **Vector Storage**: pgvector support for RAG (Retrieval-Augmented Generation)
- **Row Level Security**: Data protection and user isolation

## 🏗️ **Technical Architecture**

### **Frontend Stack**
- **Next.js 15** - App Router with Server Components
- **React 19** - Latest features with Concurrent Rendering
- **TypeScript** - Full type safety across the application
- **TailwindCSS 4** - Utility-first styling with custom design system
- **Radix UI** - Accessible components with shadcn/ui
- **Framer Motion** - Smooth animations and transitions

### **Backend Integration**
- **REST API Routes** - Next.js API routes for backend logic
- **Supabase Client** - Real-time database and auth integration
- **AI Model APIs** - Direct integration with OpenAI, Anthropic, Google, Groq
- **Vector Search** - Semantic search using Google Generative AI embeddings

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+
- npm or yarn
- Supabase account with pgvector enabled
- Clerk account
- AI API keys (OpenAI, Google Gemini, Groq)

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/bhaktofmahakal/OminiAgent-Studio
cd OminiAgent-Studio
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env.local` file:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# AI Model APIs
GOOGLE_AI_API_KEY=AIza...
OPENROUTER_API_KEY=sk-or-...
```

4. **Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see your application!

## 🚀 **Deployment**

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy with automatic scaling and edge functions

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the OmniAgent Studio team**
