// Przykład kodu do optymalizacji
export class SearchService {
    private products: Product[] = [];
    private categories: string[] = [];
    private searchHistory: string[] = [];

    async searchProducts(query: string, filters: {
        minPrice?: number;
        maxPrice?: number;
        categories?: string[];
        inStock?: boolean;
    }) {
        // Nieefektywne przeszukiwanie
        let results = this.products.filter(product => {
            const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) ||
                               product.description.toLowerCase().includes(query.toLowerCase());
            
            if (!matchesQuery) return false;

            if (filters.minPrice && product.price < filters.minPrice) return false;
            if (filters.maxPrice && product.price > filters.maxPrice) return false;
            if (filters.categories && !filters.categories.includes(product.category)) return false;
            if (filters.inStock && !product.inStock) return false;

            return true;
        });

        // Zapisywanie historii wyszukiwania bez limitu
        this.searchHistory.push(query);

        // Nieefektywne sortowanie
        results.sort((a, b) => {
            const aRelevance = this.calculateRelevance(a, query);
            const bRelevance = this.calculateRelevance(b, query);
            return bRelevance - aRelevance;
        });

        return results;
    }

    private calculateRelevance(product: Product, query: string): number {
        // Kosztowne obliczenia dla każdego produktu
        let score = 0;
        const words = query.toLowerCase().split(' ');
        
        words.forEach(word => {
            if (product.name.toLowerCase().includes(word)) score += 2;
            if (product.description.toLowerCase().includes(word)) score += 1;
            if (product.category.toLowerCase() === word) score += 3;
        });

        return score;
    }
} 