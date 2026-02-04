export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { testWebhook } from '@/lib/webhooks';

// POST /api/webhooks/[id]/test - Test webhook delivery
export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    const { id } = await context.params;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const success = await testWebhook(id);

        return NextResponse.json({
            success,
            message: success
                ? 'Test webhook sent successfully'
                : 'Test webhook failed to deliver'
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
