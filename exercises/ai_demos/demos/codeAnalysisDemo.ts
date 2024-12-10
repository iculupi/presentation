import { BaseDemo } from './baseDemo';
import { openai } from '../../../utils/api/openai';
import { SystemPrompts } from '../../../utils/prompts/systemPrompts';
import fs from 'fs/promises';
import path from 'path';

/**
 * Code Analysis Demo
 * 
 * This demo shows how AI can help with code review and improvement:
 * 1. Analyzes existing TypeScript code for potential issues
 * 2. Identifies problems with types, security, and best practices
 * 3. Generates improved version of the code with proper:
 *    - TypeScript interfaces and types
 *    - Error handling
 *    - Security improvements
 *    - Best practices implementation
 * 
 * Use Case: Helps developers improve code quality and catch potential issues
 * during code review process.
 */
export class CodeAnalysisDemo extends BaseDemo {
    constructor() {
        super('code-analysis');
    }

    async run() {
        console.log('\n📊 Demo 1: Code Analysis and Improvement');
        await this.cleanOutput();

        // Load code for analysis
        const sampleCode = await fs.readFile(
            path.join(__dirname, '../inputs/code-samples/user-service.ts'),
            'utf-8'
        );

        // Generate code analysis
        const analysisCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: SystemPrompts.CODE_REVIEWER
                },
                {
                    role: "user",
                    content: `Analyze this TypeScript code and suggest improvements:
                    1. Types and interfaces
                    2. Error handling and validation
                    3. Security
                    4. Best practices
                    5. Unit tests
                    
                    Code to analyze:\n${sampleCode}
                    
                    Response format:
                    1. Brief summary of issues
                    2. List of specific issues with explanation
                    3. Suggested solutions for each issue`
                }
            ],
            temperature: 0.3
        });

        // Save analysis results
        await this.saveOutput('code-review.md', analysisCompletion.choices[0].message.content || '');

        // Generate improved code
        const improvedCodeCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `${SystemPrompts.CODE_REVIEWER}
                    Generate improved TypeScript code that solves all issues.
                    Include:
                    - Interfaces and types for all data structures
                    - Input data validation
                    - Proper error handling with custom error hierarchy
                    - Protection against common security issues
                    - TypeScript best practices and design patterns
                    
                    Return ONLY code, without comments or explanations.
                    Code should be complete and ready to use.`
                },
                {
                    role: "user",
                    content: `Improve this code:\n${sampleCode}`
                }
            ],
            temperature: 0.2
        });

        // Save improved code
        await this.saveOutput('improved-code.ts', improvedCodeCompletion.choices[0].message.content || '');

        console.log('\n✅ Generated:');
        console.log('1. Code analysis (code-review.md)');
        console.log('2. Improved code version (improved-code.ts)');
    }
} 