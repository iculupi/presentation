import axios from 'axios';
import type { JsonData } from '../types';

// Create axios instance with common configuration
export const api = axios.create({
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add response interceptor for error handling
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
);

// Helper for making GET requests
export async function fetchData<T>(url: string): Promise<T> {
    try {
        const response = await api.get<T>(url);
        const data = response.data;

        // Zabezpiecz oryginalne dane
        if (typeof data === 'object' && data !== null) {
            // Zamroźmy kluczowe pola
            Object.defineProperty(data, 'apikey', {
                value: data.apikey,
                writable: false,
                configurable: false
            });
            Object.defineProperty(data, 'description', {
                value: data.description,
                writable: false,
                configurable: false
            });
            Object.defineProperty(data, 'copyright', {
                value: data.copyright,
                writable: false,
                configurable: false
            });
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('API Error:', {
                status: error.response?.status,
                data: error.response?.data,
                url: url
            });
        }
        throw error;
    }
}

// Type guard for JsonData
function isJsonData(data: any): data is JsonData {
    return data && typeof data === 'object';
} 