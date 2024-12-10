import { CodeAnalysisDemo } from './demos/codeAnalysisDemo';
import { DataProcessingDemo } from './demos/dataProcessingDemo';
import { CodeGenerationDemo } from './demos/codeGenerationDemo';

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

export async function runAllDemos() {
    await runCodeAnalysis();
    await runDataProcessing();
    await runCodeGeneration();
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
        default:
            runAllDemos();
    }
} 