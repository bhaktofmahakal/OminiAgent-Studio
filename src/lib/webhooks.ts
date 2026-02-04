import crypto from 'crypto';
import { supabaseAdmin } from './supabase-admin';

// Event types that can trigger webhooks
export type WebhookEventType =
    | 'chat.started'
    | 'chat.completed'
    | 'tool.executed'
    | 'approval.requested'
    | 'approval.granted'
    | 'approval.denied'
    | 'memory.stored'
    | 'document.uploaded'
    | 'error.occurred';

// Webhook event payload structure
export interface WebhookEvent {
    type: WebhookEventType;
    agentId: string;
    userId: string;
    timestamp: string;
    data: any;
}

// Webhook configuration from database
export interface Webhook {
    id: string;
    user_id: string;
    agent_id: string | null;
    name: string;
    url: string;
    events: string[];
    secret: string;
    is_active: boolean;
    retry_count: number;
    timeout_ms: number;
}

/**
 * Generate HMAC-SHA256 signature for webhook payload
 */
export function generateWebhookSignature(payload: string, secret: string): string {
    return crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
}

/**
 * Emit a webhook event to all registered webhooks
 */
export async function emitWebhookEvent(event: WebhookEvent): Promise<void> {
    try {
        // Find all active webhooks that listen to this event type
        const { data: webhooks, error } = await supabaseAdmin
            .from('webhooks')
            .select('*')
            .eq('is_active', true)
            .contains('events', [event.type]);

        if (error) {
            console.error('Error fetching webhooks:', error);
            return;
        }

        if (!webhooks || webhooks.length === 0) {
            return; // No webhooks registered for this event
        }

        // Filter webhooks by agent_id if specified
        const relevantWebhooks = webhooks.filter(webhook => {
            if (webhook.agent_id === null) return true; // Global webhook
            return webhook.agent_id === event.agentId;
        });

        // Deliver to all relevant webhooks (in parallel)
        await Promise.allSettled(
            relevantWebhooks.map(webhook => deliverWebhook(webhook, event))
        );
    } catch (error) {
        console.error('Error emitting webhook event:', error);
    }
}

/**
 * Deliver webhook to a specific endpoint with retry logic
 */
export async function deliverWebhook(
    webhook: Webhook,
    event: WebhookEvent,
    attemptNumber: number = 1
): Promise<void> {
    const payload = JSON.stringify({
        event: event.type,
        timestamp: event.timestamp,
        agent_id: event.agentId,
        user_id: event.userId,
        data: event.data
    });

    const signature = generateWebhookSignature(payload, webhook.secret);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), webhook.timeout_ms);

        const response = await fetch(webhook.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Webhook-Signature': signature,
                'X-Webhook-Event': event.type,
                'User-Agent': 'OmniAgent-Webhooks/1.0'
            },
            body: payload,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const responseBody = await response.text().catch(() => '');

        // Log successful delivery
        await supabaseAdmin.from('webhook_logs').insert({
            webhook_id: webhook.id,
            event_type: event.type,
            payload: event,
            status: response.ok ? 'success' : 'failed',
            status_code: response.status,
            response_body: responseBody.slice(0, 1000), // Limit to 1000 chars
            attempt_number: attemptNumber,
            delivered_at: new Date().toISOString()
        });

        // Retry if failed and attempts remaining
        if (!response.ok && attemptNumber < webhook.retry_count) {
            const delay = Math.min(1000 * Math.pow(2, attemptNumber), 30000); // Exponential backoff, max 30s
            setTimeout(() => {
                deliverWebhook(webhook, event, attemptNumber + 1);
            }, delay);
        }
    } catch (error: any) {
        // Log failed delivery
        await supabaseAdmin.from('webhook_logs').insert({
            webhook_id: webhook.id,
            event_type: event.type,
            payload: event,
            status: attemptNumber < webhook.retry_count ? 'retrying' : 'failed',
            error_message: error.message,
            attempt_number: attemptNumber,
            delivered_at: new Date().toISOString()
        });

        // Retry if attempts remaining
        if (attemptNumber < webhook.retry_count) {
            const delay = Math.min(1000 * Math.pow(2, attemptNumber), 30000);
            setTimeout(() => {
                deliverWebhook(webhook, event, attemptNumber + 1);
            }, delay);
        }
    }
}

/**
 * Manually retry a failed webhook delivery
 */
export async function retryWebhookDelivery(logId: string): Promise<void> {
    const { data: log, error } = await supabaseAdmin
        .from('webhook_logs')
        .select('*, webhooks(*)')
        .eq('id', logId)
        .single();

    if (error || !log || !log.webhooks) {
        throw new Error('Webhook log not found');
    }

    const event: WebhookEvent = log.payload as WebhookEvent;
    await deliverWebhook(log.webhooks, event, log.attempt_number + 1);
}

/**
 * Test a webhook by sending a sample payload
 */
export async function testWebhook(webhookId: string): Promise<boolean> {
    const { data: webhook, error } = await supabaseAdmin
        .from('webhooks')
        .select('*')
        .eq('id', webhookId)
        .single();

    if (error || !webhook) {
        throw new Error('Webhook not found');
    }

    const testEvent: WebhookEvent = {
        type: 'chat.completed',
        agentId: webhook.agent_id || 'test-agent',
        userId: webhook.user_id,
        timestamp: new Date().toISOString(),
        data: {
            message: 'This is a test webhook delivery',
            test: true
        }
    };

    try {
        await deliverWebhook(webhook, testEvent);
        return true;
    } catch (error) {
        return false;
    }
}
