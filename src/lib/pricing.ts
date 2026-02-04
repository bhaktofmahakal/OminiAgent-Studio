/**
 * Pricing utility for AI models.
 * Centralizes the calculation of costs based on token usage.
 */

export interface ModelPricing {
    inputCostPer1k: number;
    outputCostPer1k: number;
}

export const PRICING_MAP: Record<string, ModelPricing> = {
    'claude-3-5-sonnet-latest': { inputCostPer1k: 0.003, outputCostPer1k: 0.015 },
    'gpt-4o': { inputCostPer1k: 0.0025, outputCostPer1k: 0.010 },
    'gpt-4o-mini': { inputCostPer1k: 0.00015, outputCostPer1k: 0.0006 },
    'gemini-1-5-pro-latest': { inputCostPer1k: 0.00125, outputCostPer1k: 0.005 },
    'llama-3.1-70b-groq': { inputCostPer1k: 0.0006, outputCostPer1k: 0.0006 },
    'llama-3.1-8b-groq': { inputCostPer1k: 0.00005, outputCostPer1k: 0.00008 },
    // Fallback for unknown models
    'default': { inputCostPer1k: 0.002, outputCostPer1k: 0.002 },
};

/**
 * Calculate the total cost of an AI interaction.
 */
export function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
    const pricing = PRICING_MAP[model] || PRICING_MAP['default'];
    const inputCost = (inputTokens / 1000) * pricing.inputCostPer1k;
    const outputCost = (outputTokens / 1000) * pricing.outputCostPer1k;

    // Add a small 5% buffer for infrastructure overhead/API provider fluctuations
    return (inputCost + outputCost) * 1.05;
}
