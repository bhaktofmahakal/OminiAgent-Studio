import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

function getModel() {
    if (!model) {
        genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || 'placeholder');
        model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    }
    return model;
}

export async function getEmbedding(text: string): Promise<number[]> {
    try {
        const m = getModel();
        const result = await m.embedContent(text);
        return result.embedding.values;
    } catch (error) {
        console.error("Embedding generation error:", error);
        throw error;
    }
}

/**
 * Semantic chunking logic for RAG.
 * Splits text into chunks while respecting paragraph and sentence boundaries.
 */
export function chunkText(text: string, chunkSize: number = 2000, overlap: number = 200): string[] {
    if (!text) return [];
    if (text.length <= chunkSize) return [text];

    const chunks: string[] = [];

    // Split into logical paragraphs first
    const paragraphs = text.split(/\n\s*\n/);
    let currentChunk = "";

    for (const paragraph of paragraphs) {
        // If adding this paragraph exceeds chunk size
        if ((currentChunk + paragraph).length > chunkSize) {
            // Push current chunk if not empty
            if (currentChunk) {
                chunks.push(currentChunk.trim());
                // Handle overlap: take last 'overlap' characters from current chunk
                currentChunk = currentChunk.slice(-overlap);
            }

            // If the paragraph itself is larger than chunkSize, need to split it by sentences
            if (paragraph.length > chunkSize) {
                const sentences = paragraph.match(/[^.!?]+[.!?]+|\s*\n\s*|.+$/g) || [paragraph];
                for (const sentence of sentences) {
                    if ((currentChunk + sentence).length > chunkSize && currentChunk) {
                        chunks.push(currentChunk.trim());
                        currentChunk = currentChunk.slice(-overlap);
                    }
                    currentChunk += sentence;
                }
            } else {
                currentChunk += paragraph;
            }
        } else {
            currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}
