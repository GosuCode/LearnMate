import { apiService } from './api';
import {
    FlashcardGenerationRequest,
    FlashcardGenerationResponse,
    MCQGenerationRequest,
    MCQGenerationResponse,
    FlashcardSet,
    CreateFlashcardSetRequest,
    UpdateFlashcardSetRequest
} from '@/types/flashcard';

class FlashcardApiService {
    private baseURL: string;

    constructor() {
        this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api';
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        // Add auth token if available
        const token = apiService.getToken();
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || errorData.message || 'API request failed');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Network error');
        }
    }

    // Generate flashcards from text
    async generateFlashcards(data: FlashcardGenerationRequest): Promise<FlashcardGenerationResponse> {
        return this.request<FlashcardGenerationResponse>('/flashcards/flashcards', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Generate MCQs from text
    async generateMCQs(data: MCQGenerationRequest): Promise<MCQGenerationResponse> {
        return this.request<MCQGenerationResponse>('/flashcards/mcqs', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Flashcard set management
    async getFlashcardSets(): Promise<FlashcardSet[]> {
        return this.request<FlashcardSet[]>('/flashcards/sets');
    }

    async getFlashcardSet(id: string): Promise<FlashcardSet> {
        return this.request<FlashcardSet>(`/flashcards/sets/${id}`);
    }

    async createFlashcardSet(data: CreateFlashcardSetRequest): Promise<FlashcardSet> {
        return this.request<FlashcardSet>('/flashcards/sets', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateFlashcardSet(id: string, data: UpdateFlashcardSetRequest): Promise<FlashcardSet> {
        return this.request<FlashcardSet>(`/flashcards/sets/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteFlashcardSet(id: string): Promise<void> {
        return this.request<void>(`/flashcards/sets/${id}`, {
            method: 'DELETE',
        });
    }

    // Get flashcard sets by subject
    async getFlashcardSetsBySubject(subjectId: string): Promise<FlashcardSet[]> {
        return this.request<FlashcardSet[]>(`/subjects/${subjectId}/flashcards`);
    }

    // Search flashcard sets
    async searchFlashcardSets(query: string): Promise<FlashcardSet[]> {
        return this.request<FlashcardSet[]>(`/flashcards/sets/search?q=${encodeURIComponent(query)}`);
    }

      // Health check
  async checkHealth(): Promise<{
    status: string;
    service: string;
    flashcard_generator_ready: boolean;
    mcq_generator_ready: boolean;
    fastapi_service_healthy: boolean;
    service_info: Record<string, unknown>;
  }> {
        return this.request('/flashcards/health');
    }
}

export const flashcardApi = new FlashcardApiService();
