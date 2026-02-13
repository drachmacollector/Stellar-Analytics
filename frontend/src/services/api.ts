import axios from 'axios';
import { PredictionRequest, PredictionResponse } from '@/types/prediction';

const API_create = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 10000,
});

export const predict = async (
    features: Record<string, number>
): Promise<PredictionResponse> => {
    try {
        const payload: PredictionRequest = {
            features,
            tasks: ['classification'],
        };

        // Simulate slight delay for loading effect if response is instant
        // const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        // await delay(800);

        const response = await API_create.post<PredictionResponse>('/predict', payload);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.detail || error.message || 'Failed to fetch prediction'
            );
        }
        throw new Error('An unexpected error occurred');
    }
};
