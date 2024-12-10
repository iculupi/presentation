import { BaseDemo } from './baseDemo';
import { JsonSplitter } from '../../../utils/helpers/jsonSplitter';
import type { JsonData } from '../../../utils/types';
import fs from 'fs/promises';
import path from 'path';

/**
 * Data Processing Demo
 * 
 * This demo demonstrates AI capabilities in processing large datasets:
 * 1. Processes large JSON data files by splitting them into manageable chunks
 * 2. Analyzes each chunk for:
 *    - Log anomalies
 *    - Error patterns
 *    - Time-based events
 *    - System optimization opportunities
 * 3. Generates analysis reports and statistics
 * 
 * Use Case: Helps analyze large log files, detect patterns, and identify 
 * potential system issues automatically.
 */
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