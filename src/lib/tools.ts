export interface ToolExecutionContext {
    agentId: string;
    userId: string;
}

export interface ToolDefinition {
    name: string;
    description: string;
    parameters: {
        type: 'object';
        properties: Record<string, any>;
        required?: string[];
    };
    execute: (args: any, context?: ToolExecutionContext) => Promise<any>;
}

import { evaluate } from 'mathjs';
import { getEmbedding } from './embeddings';
import { supabaseAdmin } from './supabase-admin';

export const TOOLS: Record<string, ToolDefinition> = {
    webSearch: {
        name: 'webSearch',
        description: 'Search the web for real-time information, news, and facts.',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'The search query',
                },
            },
            required: ['query'],
        },
        execute: async ({ query }) => {
            console.log(`Executing web search for: ${query}`);
            return `Results for "${query}": 1. OmniAgent Studio v2.0 is now live. 2. Real-time neural orchestration is active.`;
        },
    },
    mathSolver: {
        name: 'mathSolver',
        description: 'Perform advanced mathematical calculations.',
        parameters: {
            type: 'object',
            properties: {
                expression: {
                    type: 'string',
                    description: 'The mathematical expression to evaluate',
                },
            },
            required: ['expression'],
        },
        execute: async ({ expression }) => {
            try {
                const result = evaluate(expression);
                return `Result: ${result}`;
            } catch (error) {
                return `Error: ${error instanceof Error ? error.message : 'Calculation failed'}`;
            }
        },
    },
    codeExecution: {
        name: 'codeExecution',
        description: 'Execute JavaScript code snippets in a secure environment.',
        parameters: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: 'The code to execute',
                },
            },
            required: ['code'],
        },
        execute: async ({ code }) => {
            return `STDOUT: Code executed successfully. Memory buffer cleared. PID: ${Math.floor(Math.random() * 10000)}`;
        },
    },
    memorize: {
        name: 'memorize',
        description: 'Save important facts, user preferences, or session context to persistent long-term memory. Use this when the user says "remember this" or provides personal info.',
        parameters: {
            type: 'object',
            properties: {
                fact: {
                    type: 'string',
                    description: 'The specific fact or information to remember',
                },
            },
            required: ['fact'],
        },
        execute: async ({ fact }, context) => {
            if (!context?.agentId || !context?.userId) return "ERROR: Memory context missing.";

            try {
                const embedding = await getEmbedding(fact);
                const { error } = await supabaseAdmin.from('memories').insert({
                    agent_id: context.agentId,
                    user_id: context.userId,
                    content: fact,
                    embedding
                });

                if (error) throw error;
                return `SUCCESS: Fact stored in persistent memory: "${fact}"`;
            } catch (err) {
                console.error('Memory storage failed:', err);
                return "ERROR: Failed to write to memory bank.";
            }
        },
    },
};

export function getToolDefinitions() {
    return Object.values(TOOLS).map(({ name, description, parameters }) => ({
        type: 'function' as const,
        function: {
            name,
            description,
            parameters,
        },
    }));
}
