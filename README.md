<p align="center">
  <img width="100%" alt="OmniAgent Studio Banner" src="https://raw.githubusercontent.com/bhaktofmahakal/OminiAgent-Studio/main/public/repository/banner.png" onerror="this.src='https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop'" />
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-key-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-deployment">Deployment</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
</p>

---

## 🤖 Overview

**OmniAgent Studio** is more than just an AI playground—it's a production-ready studio for building, testing, and deploying multi-model agents. Whether you're leveraging **GPT-4o**, **Claude 3.5**, **Gemini 1.5 Pro**, or **Groq**, OmniAgent Studio provides a unified interface and a robust RAG (Retrieval-Augmented Generation) pipeline to turn prompts into powerful, data-aware tools.

> "Built by developers, for developers who demand speed, scalability, and a premium UX."

---

## ✨ Key Features

### 🚀 Multi-Model Orchestration
Switch between top-tier LLMs instantly. Test how your agents perform on different architectures without rewriting code.

### 🧠 Advanced RAG Engine
Semantic search powered by **Supabase Vector**. Upload your documents, and let OmniAgent Studio handle the chunking, embedding, and retrieval with millisecond latency.

### 🎨 Premium Developer Experience
- **Command Palette (`⌘+K`)**: Navigate the entire studio with your keyboard.
- **Glassmorphic UI**: A dark-mode first design inspired by modern tools like Cursor and Linear.
- **Real-time Metrics**: Track token costs, latency, and model performance in live dashboards.

### 🔒 Enterprise Security
- **Clerk Integration**: Bulletproof authentication and user management.
- **Row-Level Security (RLS)**: Your data stays yours, secured directly at the database layer.

---

## 🏗️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | [Next.js 15](https://nextjs.org/), [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/) |
| **Backend** | [Supabase](https://supabase.com/) (PostgreSQL + pgvector) |
| **Auth** | [Clerk](https://clerk.com/) |
| **AI Layer** | OpenAI (GPT-4), Anthropic (Claude), Google Gemini, Groq (Llama 3) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |

---

## 🚀 Quick Start

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/bhaktofmahakal/OminiAgent-Studio.git
cd OminiAgent-Studio
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env.local` file with the following:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

GOOGLE_AI_API_KEY=AIza...
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

### 4️⃣ Launch the Studio
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to see your studio in action.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with obsession by the <b>OmniAgent Studio</b> team
</p>
