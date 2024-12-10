import { BaseDemo } from './baseDemo';
import { openai } from '../../../utils/api/openai';
import { SystemPrompts } from '../../../utils/prompts/systemPrompts';
import fs from 'fs/promises';
import path from 'path';

interface GenerationResult {
    type: string;
    description: string;
    filePath: string;
    timestamp: string;
}

/**
 * Code Generation Demo
 * 
 * This demo showcases AI's ability to generate and improve code:
 * 1. Generates TypeScript interfaces from system descriptions
 *    - Creates properly typed interfaces
 *    - Includes JSDoc documentation
 *    - Follows TypeScript best practices
 * 
 * 2. Generates unit tests
 *    - Creates Jest test suites
 *    - Covers edge cases
 *    - Includes mocks and proper test setup
 * 
 * 3. Suggests code optimizations
 *    - Performance improvements
 *    - Memory usage optimization
 *    - Security enhancements
 * 
 * Use Case: Speeds up development by automating boilerplate code creation
 * and helping with test coverage.
 */
export class CodeGenerationDemo extends BaseDemo {
    constructor() {
        super('code-generation');
    }

    async run() {
        console.log('\n🔧 Demo 3: Code Generation');
        await this.cleanOutput();

        const results: GenerationResult[] = [];

        // 1. Generate interfaces
        await this.generateInterfaces();
        results.push({
            type: 'Interfaces',
            description: 'Generated TypeScript interfaces for e-commerce system',
            filePath: 'interfaces.ts',
            timestamp: new Date().toISOString()
        });

        // 2. Generate tests
        await this.generateTests();
        results.push({
            type: 'Tests',
            description: 'Generated unit tests',
            filePath: 'tests.test.ts',
            timestamp: new Date().toISOString()
        });

        // 3. Generate optimization suggestions
        await this.generateOptimizations();
        results.push({
            type: 'Optimizations',
            description: 'Code optimization suggestions',
            filePath: 'optimizations.md',
            timestamp: new Date().toISOString()
        });

        // Generate final report
        const summary = {
            title: 'Code Generation Report',
            timestamp: new Date().toISOString(),
            totalFiles: results.length,
            results,
            stats: {
                interfacesGenerated: true,
                testsGenerated: true,
                optimizationSuggestionsGenerated: true
            }
        };

        // Save JSON report
        await this.saveOutput('summary.json', summary);

        // Generate Markdown report
        const markdownSummary = `# Code Generation Report
Date: ${new Date().toLocaleString()}

## Generated Files

${results.map(result => `### ${result.type}
- Description: ${result.description}
- File: \`${result.filePath}\`
- Timestamp: ${new Date(result.timestamp).toLocaleString()}
`).join('\n')}

## Statistics
- ✅ TypeScript interfaces generated
- ✅ Unit tests generated
- ✅ Optimization suggestions generated

## Summary
All files have been successfully generated and are ready to use in the project.
`;

        // Save Markdown report
        await this.saveOutput('summary.md', markdownSummary);

        console.log('\n✅ Generated:');
        console.log('1. TypeScript interfaces (interfaces.ts)');
        console.log('2. Unit tests (tests.test.ts)');
        console.log('3. Optimization suggestions (optimizations.md)');
        console.log('4. Final report (summary.json, summary.md)');
    }

    private async generateInterfaces() {
        const description = `
        E-commerce system with:
        - Products (name, price, categories, variants)
        - Orders (products, status, payment)
        - Users (profile, addresses, order history)
        - Cart (products, discounts)
        - Discount system (codes, rules, limitations)
        `;

        const result = await this.generateWithAI(
            'Generating interfaces...',
            description,
            'interfaces.ts',
            this.getInterfacePrompt()
        );

        await this.saveOutput('interfaces.ts', result);
    }

    private async generateTests() {
        const sampleCode = `
        async function processOrder(order: Order, discountCode?: string): Promise<ProcessedOrder> {
            const discount = await getDiscount(discountCode);
            const items = await Promise.all(
                order.items.map(async item => {
                    const product = await getProduct(item.productId);
                    return {
                        ...item,
                        price: product.price,
                        total: product.price * item.quantity
                    };
                })
            );
            
            const subtotal = items.reduce((sum, item) => sum + item.total, 0);
            const total = discount 
                ? subtotal - (subtotal * discount.percentage)
                : subtotal;

            return {
                ...order,
                items,
                subtotal,
                discount: discount?.percentage || 0,
                total
            };
        }`;

        const result = await this.generateWithAI(
            'Generating tests...',
            sampleCode,
            'tests.test.ts',
            this.getTestsPrompt()
        );

        await this.saveOutput('tests.test.ts', result);
    }

    private async generateOptimizations() {
        const codeToOptimize = `
        async function searchProducts(criteria: {
            query?: string;
            category?: string;
            minPrice?: number;
            maxPrice?: number;
            inStock?: boolean;
        }) {
            const allProducts = await getAllProducts();
            
            return allProducts.filter(product => {
                if (criteria.query && !product.name.toLowerCase().includes(criteria.query.toLowerCase())) {
                    return false;
                }
                if (criteria.category && product.category !== criteria.category) {
                    return false;
                }
                if (criteria.minPrice && product.price < criteria.minPrice) {
                    return false;
                }
                if (criteria.maxPrice && product.price > criteria.maxPrice) {
                    return false;
                }
                if (criteria.inStock && product.stockQuantity <= 0) {
                    return false;
                }
                return true;
            });
        }`;

        const result = await this.generateWithAI(
            'Generating optimization suggestions...',
            codeToOptimize,
            'optimizations.md',
            this.getOptimizationPrompt()
        );

        await this.saveOutput('optimizations.md', result);
    }

    private async generateWithAI(
        message: string,
        content: string,
        filename: string,
        systemPrompt: string
    ): Promise<string> {
        console.log(message);

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content
                }
            ],
            temperature: 0.2
        });

        return completion.choices[0].message.content || '';
    }

    private getInterfacePrompt(): string {
        return `${SystemPrompts.CODE_REVIEWER}
        Generate TypeScript interfaces.
        Include:
        - Strict typing
        - Readonly where needed
        - JSDoc documentation
        - Nested interfaces
        - Utility types (Pick, Omit, etc.)`;
    }

    private getTestsPrompt(): string {
        return `${SystemPrompts.CODE_REVIEWER}
        Generate Jest tests with:
        - Descriptive test names
        - Edge cases
        - Mocked dependencies
        - Async tests
        - Setup and teardown where needed`;
    }

    private getOptimizationPrompt(): string {
        return `${SystemPrompts.CODE_REVIEWER}
        Analyze code for:
        - Performance
        - Computational complexity
        - Memory usage
        - Caching opportunities
        - Potential memory leaks`;
    }
} 