import { BaseDemo } from './baseDemo';
import { api, fetchData } from '../../../utils/api/axios';
import { JsonSplitter } from '../../../utils/helpers/jsonSplitter';
import { TestFixer } from '../../../utils/testers/testFixer';
import type { JsonData, ApiResponse, TaskSubmission } from '../../../utils/types';
import { API_ENDPOINTS } from '../../../utils/constants';
import fs from 'fs/promises';
import path from 'path';

interface TestItem {
    question: string;
    answer?: number | string;
    test?: {
        q: string;
        a: string;
    };
}

/**
 * JSON Calibration Demo
 * 
 * This demo shows advanced JSON processing capabilities:
 * 1. Fetches and processes JSON data from API
 * 2. Splits large datasets into manageable chunks
 * 3. Validates and fixes data integrity
 * 4. Generates detailed processing reports
 */
export class JsonCalibrationDemo extends BaseDemo {
    private testFixer: TestFixer;
    private jsonSplitter: JsonSplitter;
    private readonly API_URL: string;

    constructor() {
        super('json-calibration');
        this.testFixer = new TestFixer();
        this.jsonSplitter = new JsonSplitter('json-calibration', 100);
        
        if (!process.env.PERSONAL_API_KEY) {
            throw new Error('PERSONAL_API_KEY is not set');
        }
        this.API_URL = `${API_ENDPOINTS.CENTRALA}/data/${process.env.PERSONAL_API_KEY}/json.txt`;
    }

    private async processChunk(chunk: JsonData): Promise<JsonData> {
        if (!chunk || !Array.isArray(chunk['test-data'])) {
            throw new Error('Invalid chunk format');
        }

        const fixedTests = await Promise.all(
            chunk['test-data'].map(async (test: TestItem) => {
                return await this.testFixer.fixTest(test);
            })
        );

        return {
            ...chunk,
            'test-data': fixedTests
        };
    }

    async run() {
        console.log('\n🔄 Demo 4: JSON Calibration and Processing');
        await this.cleanOutput();

        try {
            // Zabezpiecz klucz API
            const personalApiKey = process.env.PERSONAL_API_KEY!;
            Object.freeze(personalApiKey);

            console.log('🔄 Fetching JSON file...');
            const jsonData = await fetchData<JsonData>(this.API_URL);
            
            // Zapisz oryginalne dane
            await this.saveOutput('original-data.json', jsonData);

            // Podziel i przetwórz dane
            console.log('�� Splitting JSON file...');
            const chunks = await this.jsonSplitter.splitAndSave(jsonData);
            
            console.log(`\n🔍 Processing ${chunks.length} chunks...`);
            const processedChunks: JsonData[] = [];

            for (let i = 0; i < chunks.length; i++) {
                console.log(`Processing chunk ${i + 1}/${chunks.length}`);
                const chunk = await this.jsonSplitter.loadChunk(i + 1);
                const processedChunk = await this.processChunk(chunk);
                processedChunk.apikey = personalApiKey;
                processedChunks.push(processedChunk);
            }

            // Połącz wszystkie chunki
            const fixedJson: JsonData = {
                apikey: personalApiKey,
                description: jsonData.description,
                copyright: jsonData.copyright,
                'test-data': processedChunks.reduce((allTests, chunk) => 
                    allTests.concat(chunk['test-data']), [] as TestItem[])
            };

            // Przygotuj dane do wysłania
            const outputData: TaskSubmission = {
                task: 'JSON',
                apikey: personalApiKey,
                answer: fixedJson
            };

            // Wyślij dane do API
            console.log('📤 Sending data to API...');
            const response = await api.post<ApiResponse>(
                API_ENDPOINTS.REPORT,
                outputData
            );

            // Zapisz raport
            const report = {
                timestamp: new Date().toISOString(),
                response: response.data,
                requestSize: JSON.stringify(fixedJson).length,
                testsCount: fixedJson['test-data'].length,
                processingStats: {
                    chunksProcessed: chunks.length,
                    totalTests: fixedJson['test-data'].length,
                    apiResponse: response.data
                }
            };

            await this.saveOutput('processing-report.json', report);

            // Generuj podsumowanie
            const summary = `# JSON Calibration Results

## API Response
\`\`\`json
${JSON.stringify(response.data, null, 2)}
\`\`\`

## Statistics
- Total chunks processed: ${chunks.length}
- Total tests processed: ${fixedJson['test-data'].length}
- Processing completed at: ${new Date().toLocaleString()}

## Status
${response.data.code === 0 ? '✅ Success' : '❌ Failed'}
`;

            await this.saveOutput('summary.md', summary);

            console.log('\n✅ Generated:');
            console.log('1. Original data (original-data.json)');
            console.log('2. Processed chunks (chunks/*.json)');
            console.log('3. Processing report (processing-report.json)');
            console.log('4. Summary report (summary.md)');

        } catch (error) {
            console.error('❌ Processing failed:', error);
            throw error;
        }
    }
} 