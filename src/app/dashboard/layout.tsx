import { Metadata } from 'next'
import React from 'react'
import DashboardSidebar from '@/components/dashboard-sidebar'

export const metadata: Metadata = {
    title: 'Dashboard | OmniAgent Studio',
    description: 'Manage your AI agents and monitor performance',
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-background">
            <DashboardSidebar />
            <main className="flex-1 lg:ml-64">
                {children}
            </main>
        </div>
    )
}
