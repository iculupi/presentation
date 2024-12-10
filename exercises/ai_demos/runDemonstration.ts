import { CodeAnalysisDemo } from './demos/codeAnalysisDemo';
import { DataProcessingDemo } from './demos/dataProcessingDemo';
import { CodeGenerationDemo } from './demos/codeGenerationDemo';
import { JsonCalibrationDemo } from './demos/jsonCalibrationDemo';

/**
 * AI Development Demonstration Suite
 * 
 * This demonstration showcases three key aspects of AI in software development:
 * 
 * 1. Code Analysis (demo:code)
 *    - AI-powered code review and improvement
 *    - Detection of potential issues and anti-patterns
 *    - Generation of improved code with proper typing and security
 * 
 * 2. Data Processing (demo:data)
 *    - Processing and analysis of large JSON datasets
 *    - Splitting data into manageable chunks
 *    - Pattern detection and anomaly identification
 * 
 * 3. Code Generation (demo:gen)
 *    - Automatic generation of TypeScript interfaces
 *    - Creation of unit tests with edge cases
 *    - Performance optimization suggestions
 * 
 * Each demo generates output files in its respective directory:
 * - /outputs/code-analysis/
 * - /outputs/data-processing/
 * - /outputs/code-generation/
 * 
 * Usage:
 * ```bash
 * # Run all demos
 * bun run demo:all
 * 
 * # Run individual demos
 * bun run demo:code    # Code Analysis
 * bun run demo:data    # Data Processing
 * bun run demo:gen     # Code Generation
 * ```
 */

async function runDemo(name: string, demo: () => Promise<void>) {
    console.log(`\n🎯 Running demo: ${name}`);
    console.log('='.repeat(50));
    
    try {
        await demo();
        console.log(`\n✅ Demo ${name} completed successfully`);
    } catch (error) {
        console.error(`\n❌ Demo ${name} failed:`, error);
    }
}

// Functions to run individual demos
export async function runCodeAnalysis() {
    const demo = new CodeAnalysisDemo();
    await runDemo('Code Analysis', () => demo.run());
}

export async function runDataProcessing() {
    const demo = new DataProcessingDemo();
    await runDemo('Data Processing', () => demo.run());
}

export async function runCodeGeneration() {
    const demo = new CodeGenerationDemo();
    await runDemo('Code Generation', () => demo.run());
}

export async function runJsonCalibration() {
    const demo = new JsonCalibrationDemo();
    await runDemo('JSON Calibration', () => demo.run());
}

export async function runAllDemos() {
    await runCodeAnalysis();
    await runDataProcessing();
    await runCodeGeneration();
    await runJsonCalibration();
}

// If file is run directly
if (require.main === module) {
    const arg = process.argv[2];
    
    switch (arg) {
        case 'code-analysis':
            runCodeAnalysis();
            break;
        case 'data-processing':
            runDataProcessing();
            break;
        case 'code-generation':
            runCodeGeneration();
            break;
        case 'json-calibration':
            runJsonCalibration();
            break;
        default:
            runAllDemos();
    }
} 