import { getChatCompletion } from '../api/openai';
import { SystemPrompts } from '../prompts/systemPrompts';
import { MathFixer } from '../calculators/mathFixer';
import type { TestItem } from '../types';

export class TestFixer {
    private mathFixer: MathFixer;

    constructor() {
        this.mathFixer = new MathFixer();
    }

    public async fixTest(test: TestItem): Promise<TestItem> {
        const fixedTest = { ...test };

        try {
            // Sprawdź czy to pytanie matematyczne
            if (test.question.includes('+')) {
                const fixedCalc = this.mathFixer.fixCalculation(test.question, test.answer as number);
                if (fixedCalc !== test.question) {
                    fixedTest.answer = parseInt(fixedCalc.split('=')[1].trim());
                }
            }

            // Jeśli mamy pytanie otwarte, używamy nowego promptu bez predefiniowanych odpowiedzi
            if (test.test?.q && test.test.a === '???') {
                const answer = await getChatCompletion(
                    test.test.q,
                    SystemPrompts.TASK_003
                );
                
                if (answer) {
                    fixedTest.test = {
                        q: test.test.q,
                        a: answer
                    };
                }
            }
        } catch (error) {
            console.error('Error processing test:', error);
        }

        return fixedTest;
    }
} 