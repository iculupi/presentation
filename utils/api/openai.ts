import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// OpenAI client singleton
export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Common OpenAI request configuration
export const defaultConfig = {
    temperature: 0.3,
    max_tokens: 100
};

// Helper for chat completions
export async function getChatCompletion(
    prompt: string, 
    systemPrompt: string
): Promise<string | null> {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            ...defaultConfig
        });

        return completion.choices[0].message.content || null;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        return null;
    }
} 