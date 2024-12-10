import { API_ENDPOINTS } from '../constants';
import dotenv from 'dotenv';

dotenv.config();

export abstract class BaseApi {
    protected readonly API_URL: string;

    constructor() {
        if (!process.env.PERSONAL_API_KEY) {
            throw new Error('PERSONAL_API_KEY is not set');
        }
        this.API_URL = `${API_ENDPOINTS.CENTRALA}/data/${process.env.PERSONAL_API_KEY}/json.txt`;
    }
} 