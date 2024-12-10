import * as fs from 'fs/promises';
import * as path from 'path';
import type { NavigationLog } from '../types';

export class LogManager {
    private readonly logPath: string;
    private logs: NavigationLog[] = [];

    constructor(taskDir: string, filename: string) {
        this.logPath = path.join(taskDir, filename);
    }

    async loadLogs(): Promise<NavigationLog[]> {
        try {
            const content = await fs.readFile(this.logPath, 'utf-8');
            this.logs = JSON.parse(content);
            return this.logs;
        } catch {
            this.logs = [];
            return [];
        }
    }

    async saveLog(log: NavigationLog): Promise<void> {
        this.logs.push(log);
        await fs.writeFile(
            this.logPath,
            JSON.stringify(this.logs, null, 2)
        );
    }

    getRecentLogs(count: number = 3): NavigationLog[] {
        return this.logs.slice(-count);
    }

    formatLogsForPrompt(logs: NavigationLog[]): string {
        if (logs.length === 0) return '';

        return logs.map(log => 
            `Previous attempt (${log.success ? 'succeeded' : 'failed'}): ${log.thoughts}`
        ).join('\n');
    }
} 