<p align="center">
  <img width="100%" alt="OmniAgent Studio Banner" src="https://raw.githubusercontent.com/bhaktofmahakal/OminiAgent-Studio/main/public/repository/banner.png" onerror="this.src='https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop'" />
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="#-key-features">Features</a> |
  <a href="#-quick-start">Quick Start</a> |
  <a href="#-tech-stack">Tech Stack</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/AI_Models-GPT--4o_|_Claude_|_Gemini-brightgreen?style=flat-square" alt="AI Models" />
  <img src="https://img.shields.io/badge/Vector_DB-Supabase-3ECF8E?style=flat-square&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat-square&logo=clerk" alt="Clerk" />
</p>

---

## 🤖 Overview

**OmniAgent Studio** is a developer-first AI agent builder that enables you to create, test, and deploy AI agents across multiple models (GPT-4o, Claude, Gemini, Groq) in minutes. Built for speed, scalability, and premium developer experience.

## ✨ Key Features

- **Multi-Model Orchestration**: Unified interface for GPT-4o, Claude 3.5, Gemini 1.5 Pro, and Groq.
- **Advanced RAG Engine**: Intelligent document chunking and semantic embedding storage via Supabase Vector.
- **Developer-First UI**: Cursor-inspired command palette (`⌘+K`), real-time latency tracking, and premium animations.
- **Enterprise-Grade Auth**: Secure user management powered by Clerk with Row-Level Security (RLS).
- **Real-time Analytics**: Live monitoring of token usage, costs, and model performance metrics.

## 🏗️ Tech Stack

### **Core**
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)

### **Backend & AI**
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + pgvector)
- **Auth**: [Clerk](https://clerk.com/)
- **AI Models**: OpenAI, Anthropic, Google Gemini, Groq
- **Embeddings**: Google Generative AI (text-embedding-004)

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+
- Supabase account with pgvector enabled
- Clerk account
- AI API keys (Google, OpenAI, OpenRouter)

### **Installation**

1. **Clone & Install**
```bash
git clone https://github.com/bhaktofmahakal/OminiAgent-Studio.git
cd OminiAgent-Studio
npm install
```

2. **Environment Configuration**
Create a `.env.local` file with your credentials:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
GOOGLE_AI_API_KEY=AIza...
```

3. **Run Development Server**
```bash
npm run dev
```

## 🚀 Deployment

The fastest way to deploy is via **Vercel**:

1. Fork this repository.
2. Connect your fork to Vercel.
3. Configure environment variables.
4. Deploy!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by the <b>OmniAgent Studio</b> team
</p>
