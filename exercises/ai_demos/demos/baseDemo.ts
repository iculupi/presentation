import fs from 'fs/promises';
import path from 'path';

/**
 * Base class for all demos
 */
export abstract class BaseDemo {
    protected readonly outputDir: string;

    constructor(demoName: string) {
        this.outputDir = path.join(__dirname, '../outputs', demoName);
    }

    /**
     * Saves demo result to a file
     */
    protected async saveOutput(filename: string, content: string | object) {
        await fs.mkdir(this.outputDir, { recursive: true });
        const outputPath = path.join(this.outputDir, filename);
        
        const contentToSave = typeof content === 'string' 
            ? content 
            : JSON.stringify(content, null, 2);

        await fs.writeFile(outputPath, contentToSave);
        console.log(`📝 Result saved to: ${outputPath}`);
    }

    /**
     * Cleans output directory
     */
    protected async cleanOutput() {
        try {
            await fs.rm(this.outputDir, { recursive: true, force: true });
        } catch (error) {
            console.warn('Cannot clean directory:', error);
        }
    }

    abstract run(): Promise<void>;
} 