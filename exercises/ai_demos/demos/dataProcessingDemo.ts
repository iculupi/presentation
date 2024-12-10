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
        console.log('\n📈 Demo 2: Przetwarzanie Dużych Zbiorów Danych');
        await this.cleanOutput();

        // Wczytaj przykładowe dane
        const sampleData: JsonData = JSON.parse(
            await fs.readFile(
                path.join(__dirname, '../inputs/data-samples/server-logs.json'),
                'utf-8'
            )
        );

        // Zapisz oryginalne dane
        await this.saveOutput('original-data.json', sampleData);

        // Podział danych na mniejsze części do analizy
        const splitter = new JsonSplitter('data-processing', 1);
        const chunks = await splitter.splitAndSave(sampleData);

        // Zapisz raport
        const report = {
            totalChunks: chunks.length,
            analysisCapabilities: [
                'Wykrywanie anomalii w logach',
                'Identyfikacja wzorców błędów',
                'Analiza czasowa zdarzeń',
                'Sugestie optymalizacji systemu'
            ],
            chunkPaths: chunks
        };

        await this.saveOutput('processing-report.json', report);
    }
} 