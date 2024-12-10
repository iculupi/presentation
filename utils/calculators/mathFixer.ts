import { safeEval } from '../helpers/mathUtils';

export class MathFixer {
    public fixCalculation(calculation: string, expected: number): string {
        try {
            // Jeśli to proste dodawanie, sprawdźmy bezpośrednio
            if (calculation.includes('+')) {
                const numbers = calculation.split('+').map(n => parseInt(n.trim()));
                const sum = numbers[0] + numbers[1];
                if (sum !== expected) {
                    return `${numbers[0]} + ${numbers[1]} = ${sum}`; // Popraw błędny wynik
                }
            }
            
            // Istniejąca logika dla bardziej złożonych przypadków...
            const result = safeEval(calculation);
            if (Math.abs(result - expected) < Number.EPSILON) {
                return calculation;
            }

            return calculation; // Zachowaj oryginalne wyrażenie jeśli nie można naprawić
        } catch {
            return calculation;
        }
    }
} 