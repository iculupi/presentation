import { BaseDemo } from './baseDemo';
import { JsonSplitter } from '../../../utils/helpers/jsonSplitter';
import type { JsonData } from '../../../utils/types';
import fs from 'fs/promises';
import path from 'path';

export class DataProcessingDemo extends BaseDemo {
    constructor() {
        super('data-processing');
    }

    async run() {
        console.log('\n📈 Demo 2: Data Processing');
        await this.cleanOutput();

        // Load sample data
        const sampleData: JsonData = JSON.parse(
            await fs.readFile(
                path.join(__dirname, '../inputs/data-samples/server-logs.json'),
                'utf-8'
            )
        );

        // Save original data
        await this.saveOutput('original-data.json', sampleData);

        // Split data into chunks for analysis
        const splitter = new JsonSplitter('data-processing', 1);
        const chunks = await splitter.splitAndSave(sampleData);

        // Save analysis report
        const report = {
            totalChunks: chunks.length,
            analysisCapabilities: [
                'Log anomaly detection',
                'Error pattern identification',
                'Time-based event analysis',
                'System optimization suggestions'
            ],
            chunkPaths: chunks
        };

        await this.saveOutput('processing-report.json', report);
    }
} 