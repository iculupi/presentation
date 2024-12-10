import fs from 'fs/promises';
import path from 'path';
import type { JsonData, TestItem } from '../types';

export class JsonSplitter {
    private readonly chunkSize: number;
    private readonly taskDir: string;
    private readonly chunksDir: string;

    constructor(taskNumber: string, chunkSize: number = 100) {
        this.chunkSize = chunkSize;
        this.taskDir = path.join(process.cwd(), 'exercises', taskNumber);
        this.chunksDir = path.join(this.taskDir, 'chunks');
    }

    private async cleanDirectory() {
        try {
            // Sprawdź czy katalog istnieje
            try {
                await fs.access(this.chunksDir);
            } catch {
                return; // Katalog nie istnieje, nie ma co czyścić
            }

            // Usuń wszystkie pliki w katalogu chunks
            const files = await fs.readdir(this.chunksDir);
            await Promise.all(
                files.map(file => 
                    fs.unlink(path.join(this.chunksDir, file))
                        .catch(err => console.warn(`Failed to delete ${file}:`, err))
                )
            );

            // Usuń sam katalog
            await fs.rmdir(this.chunksDir);
            console.log('🧹 Cleaned previous chunks');
        } catch (error) {
            console.warn('Warning: Failed to clean chunks directory:', error);
        }
    }

    public async splitAndSave(jsonData: JsonData): Promise<string[]> {
        // Wyczyść poprzednie chunki
        await this.cleanDirectory();

        // Utwórz katalogi jeśli nie istnieją
        await fs.mkdir(this.chunksDir, { recursive: true });

        // Zapisz oryginalny plik
        const originalPath = path.join(this.taskDir, 'original.json');
        await fs.writeFile(originalPath, JSON.stringify(jsonData, null, 2));
        console.log('💾 Original file saved to:', originalPath);

        // Podziel dane na chunki
        const chunks: TestItem[][] = [];
        for (let i = 0; i < jsonData['test-data'].length; i += this.chunkSize) {
            chunks.push(jsonData['test-data'].slice(i, i + this.chunkSize));
        }

        // Zapisz chunki
        const chunkPaths: string[] = [];
        for (let i = 0; i < chunks.length; i++) {
            const chunkPath = path.join(this.chunksDir, `chunk_${i + 1}.json`);
            const chunkData = {
                ...jsonData,
                'test-data': chunks[i],
                chunk: {
                    number: i + 1,
                    total: chunks.length,
                    size: chunks[i].length,
                    range: {
                        from: i * this.chunkSize,
                        to: Math.min((i + 1) * this.chunkSize, jsonData['test-data'].length)
                    }
                }
            };
            await fs.writeFile(chunkPath, JSON.stringify(chunkData, null, 2));
            chunkPaths.push(chunkPath);
            console.log(`📁 Chunk ${i + 1}/${chunks.length} saved to:`, chunkPath);
        }

        // Zapisz metadane
        const metaPath = path.join(this.taskDir, 'metadata.json');
        const metadata = {
            timestamp: new Date().toISOString(),
            totalTests: jsonData['test-data'].length,
            chunks: chunks.length,
            chunkSize: this.chunkSize,
            apikey: jsonData.apikey,
            description: jsonData.description,
            copyright: jsonData.copyright
        };
        await fs.writeFile(metaPath, JSON.stringify(metadata, null, 2));
        console.log('📊 Metadata saved to:', metaPath);

        return chunkPaths;
    }

    public async loadChunk(chunkNumber: number): Promise<JsonData> {
        const chunkPath = path.join(this.chunksDir, `chunk_${chunkNumber}.json`);
        const content = await fs.readFile(chunkPath, 'utf-8');
        return JSON.parse(content);
    }

    public async loadAllChunks(): Promise<JsonData[]> {
        const files = await fs.readdir(this.chunksDir);
        const chunkFiles = files.filter(f => f.startsWith('chunk_')).sort();
        
        return Promise.all(
            chunkFiles.map(async file => {
                const content = await fs.readFile(path.join(this.chunksDir, file), 'utf-8');
                return JSON.parse(content);
            })
        );
    }

    public async cleanup(): Promise<void> {
        await this.cleanDirectory();
        
        // Opcjonalnie: usuń też pliki metadata i original
        try {
            await fs.unlink(path.join(this.taskDir, 'metadata.json'))
                .catch(() => {}); // Ignoruj błąd jeśli plik nie istnieje
            await fs.unlink(path.join(this.taskDir, 'original.json'))
                .catch(() => {});
            console.log('🧹 Cleaned all task files');
        } catch (error) {
            console.warn('Warning: Failed to clean task files:', error);
        }
    }
} 