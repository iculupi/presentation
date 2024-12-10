import fs from 'fs/promises';
import path from 'path';
import { BaseApi } from '../api/baseApi';

export interface TaskOutput {
    timestamp: string;
    stage: 'input' | 'processed' | 'response' | 'error' | 'summary';
    data: any;
    metadata?: {
        tags?: string[];
        notes?: string;
        references?: string[];
        iteration?: number;
        timestamp?: string;
        totalProcessedTests?: number;
    };
}

export abstract class BaseTask extends BaseApi {
    protected readonly taskDir: string;
    protected readonly outputPath: string;
    protected readonly historyPath: string;
    protected readonly summaryPath: string;

    constructor(taskNumber: string) {
        super();
        this.taskDir = path.join(process.cwd(), 'exercises', taskNumber);
        this.outputPath = path.join(this.taskDir, 'output.json');
        this.historyPath = path.join(this.taskDir, 'history.json');
        this.summaryPath = path.join(this.taskDir, 'summary.md');
    }

    protected async saveOutput(data: Omit<TaskOutput, 'timestamp'>) {
        try {
            const output: TaskOutput = {
                ...data,
                timestamp: new Date().toISOString()
            };

            // Save current output
            await fs.writeFile(
                this.outputPath,
                JSON.stringify(output, null, 2)
            );

            // Append to history
            const history = await this.loadHistory();
            history.push(output);
            await fs.writeFile(
                this.historyPath,
                JSON.stringify(history, null, 2)
            );

            console.log('💾 Output saved to:', this.outputPath);
            return output;
        } catch (error) {
            console.error('Failed to save output:', error);
            throw error;
        }
    }

    protected async loadHistory(): Promise<TaskOutput[]> {
        try {
            const content = await fs.readFile(this.historyPath, 'utf-8');
            return JSON.parse(content);
        } catch {
            return [];
        }
    }

    protected async getLastOutput(stage?: TaskOutput['stage']): Promise<TaskOutput | null> {
        const history = await this.loadHistory();
        if (stage) {
            return history.findLast(output => output.stage === stage) || null;
        }
        return history[history.length - 1] || null;
    }

    protected async saveSummary(content: string) {
        await fs.writeFile(this.summaryPath, content);
    }

    abstract execute(): Promise<void>;
} 