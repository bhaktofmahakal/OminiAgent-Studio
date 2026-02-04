import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Chat Studio | OmniAgent Studio',
    description: 'Chat with GPT-4, Claude, Gemini, and more in a unified interface.',
}

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
