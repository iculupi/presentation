/**
 * Splits an array into smaller chunks of specified size
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
    return array.reduce((chunks: T[][], item: T, index: number) => {
        const chunkIndex = Math.floor(index / size);
        if (!chunks[chunkIndex]) {
            chunks[chunkIndex] = [];
        }
        chunks[chunkIndex].push(item);
        return chunks;
    }, []);
}

/**
 * Processes array items in parallel with a limit
 */
export async function processInParallel<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    batchSize: number = 10
): Promise<R[]> {
    const results: R[] = [];
    const chunks = chunkArray(items, batchSize);

    for (const chunk of chunks) {
        const chunkResults = await Promise.all(
            chunk.map(item => processor(item))
        );
        results.push(...chunkResults);
    }

    return results;
} 