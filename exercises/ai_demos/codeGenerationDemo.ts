import { openai } from '../../utils/api/openai';
import { SystemPrompts } from '../../utils/prompts/systemPrompts';

/**
 * Demonstrates AI-powered code generation capabilities
 */
export class CodeGenerationDemo {
    /**
     * Generates TypeScript interfaces from natural language description
     */
    async generateInterface(description: string): Promise<string> {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `${SystemPrompts.CODE_REVIEWER}
                    Generuj tylko interfejsy TypeScript.
                    Używaj:
                    - Strict typing
                    - Readonly gdzie potrzebne
                    - Dokumentacji JSDoc
                    - Zagnieżdżonych interfejsów
                    - Utility types (Pick, Omit, etc.)
                    `
                },
                {
                    role: "user",
                    content: `Wygeneruj interfejsy TypeScript dla: ${description}`
                }
            ],
            temperature: 0.2
        });

        return completion.choices[0].message.content || '';
    }

    /**
     * Generates unit tests for given code
     */
    async generateTests(code: string): Promise<string> {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `${SystemPrompts.CODE_REVIEWER}
                    Generuj testy Jest z:
                    - Opisowymi nazwami testów
                    - Testami edge cases
                    - Mockowanymi zależnościami
                    - Testami asynchronicznymi
                    - Setup i teardown gdzie potrzebne
                    `
                },
                {
                    role: "user",
                    content: `Wygeneruj testy dla:\n${code}`
                }
            ],
            temperature: 0.2
        });

        return completion.choices[0].message.content || '';
    }

    /**
     * Suggests code optimizations
     */
    async suggestOptimizations(code: string): Promise<string> {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `${SystemPrompts.CODE_REVIEWER}
                    Analizuj kod pod kątem:
                    - Wydajności
                    - Złożoności obliczeniowej
                    - Zużycia pamięci
                    - Możliwości cachowania
                    - Potencjalnych wycieków pamięci
                    `
                },
                {
                    role: "user",
                    content: `Zaproponuj optymalizacje dla:\n${code}`
                }
            ],
            temperature: 0.2
        });

        return completion.choices[0].message.content || '';
    }
} 