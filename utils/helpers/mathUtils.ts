/**
 * Safely evaluates mathematical expressions
 */
export function safeEval(expression: string): number {
    // Remove any non-mathematical characters
    const sanitized = expression.replace(/[^0-9+\-*/().]/g, '');
    
    try {
        // Use Function instead of eval for better security
        return new Function(`return ${sanitized}`)();
    } catch (error) {
        console.error('Math evaluation error:', error);
        throw new Error('Invalid mathematical expression');
    }
}

/**
 * Checks if a mathematical calculation is correct
 */
export function verifyCalculation(
    expression: string,
    expectedResult: number
): boolean {
    try {
        const result = safeEval(expression);
        return Math.abs(result - expectedResult) < Number.EPSILON;
    } catch {
        return false;
    }
} 