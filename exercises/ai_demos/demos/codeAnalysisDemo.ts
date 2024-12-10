import { BaseDemo } from './baseDemo';
import { openai } from '../../../utils/api/openai';
import { SystemPrompts } from '../../../utils/prompts/systemPrompts';
import fs from 'fs/promises';
import path from 'path';

export class CodeAnalysisDemo extends BaseDemo {
    constructor() {
        super('code-analysis');
    }

    async run() {
        console.log('📊 Demo 1: Analiza i Poprawa Kodu');
        await this.cleanOutput();

        // Wczytaj kod do analizy
        const sampleCode = await fs.readFile(
            path.join(__dirname, '../inputs/code-samples/user-service.ts'),
            'utf-8'
        );

        // Generuj analizę kodu
        const analysisCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: SystemPrompts.CODE_REVIEWER
                },
                {
                    role: "user",
                    content: `Przeanalizuj ten kod TypeScript i zaproponuj ulepszenia:
                    1. Typowanie i interfejsy
                    2. Obsługa błędów i walidacja
                    3. Bezpieczeństwo
                    4. Najlepsze praktyki
                    5. Testy jednostkowe
                    
                    Kod do analizy:\n${sampleCode}
                    
                    Format odpowiedzi:
                    1. Krótkie podsumowanie problemów
                    2. Lista konkretnych problemów z wyjaśnieniem
                    3. Sugerowane rozwiązania dla każdego problemu`
                }
            ],
            temperature: 0.3
        });

        // Zapisz wyniki analizy
        await this.saveOutput('code-review.md', analysisCompletion.choices[0].message.content || '');

        // Generuj poprawiony kod
        const improvedCodeCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `${SystemPrompts.CODE_REVIEWER}
                    Wygeneruj poprawioną wersję kodu TypeScript, która rozwiązuje wszystkie problemy.
                    Uwzględnij:
                    - Interfejsy i typy dla wszystkich struktur danych
                    - Walidację danych wejściowych
                    - Prawidłową obsługę błędów z własną hierarchią wyjątków
                    - Zabezpieczenia przed typowymi problemami bezpieczeństwa
                    - Najlepsze praktyki TypeScript i wzorce projektowe
                    
                    Zwróć TYLKO kod, bez komentarzy i wyjaśnień.
                    Kod powinien być kompletny i gotowy do użycia.`
                },
                {
                    role: "user",
                    content: `Popraw ten kod:\n${sampleCode}`
                }
            ],
            temperature: 0.2
        });

        // Zapisz poprawiony kod
        await this.saveOutput('improved-code.ts', improvedCodeCompletion.choices[0].message.content || '');

        console.log('\n✅ Wygenerowano:');
        console.log('1. Analizę kodu (code-review.md)');
        console.log('2. Poprawioną wersję kodu (improved-code.ts)');
    }
} 