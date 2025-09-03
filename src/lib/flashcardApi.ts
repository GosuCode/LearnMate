import { apiService } from './api';
import {
    FlashcardGenerationRequest,
    FlashcardGenerationResponse,
    MCQGenerationRequest,
    MCQGenerationResponse,
    FlashcardSet,
    CreateFlashcardSetRequest,
    UpdateFlashcardSetRequest,
    UserFlashcardsResponse,
    CreateFlashcardRequest,
    CreateFlashcardResponse,
    DueFlashcardsResponse,
    ReviewResponse,
    FlashcardStatsResponse
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

    async generateFlashcards(data: Omit<FlashcardGenerationRequest, 'userId'>): Promise<FlashcardGenerationResponse> {

        const token = apiService.getToken();
        const user = apiService.getUser();

        if (!token || !user?.id) {
            throw new Error('Authentication required. Please log in to generate flashcards.');
        }

        const requestData = {
            ...data,
            userId: user.id
        };

        return this.request<FlashcardGenerationResponse>('/flashcards', {
            method: 'POST',
            body: JSON.stringify(requestData),
        });
    }

    async generateMCQs(data: MCQGenerationRequest): Promise<MCQGenerationResponse> {
        return this.request<MCQGenerationResponse>('/mcq', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

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

    async getFlashcardSetsBySubject(subjectId: string): Promise<FlashcardSet[]> {
        return this.request<FlashcardSet[]>(`/subjects/${subjectId}/flashcards`);
    }

    async searchFlashcardSets(query: string): Promise<FlashcardSet[]> {
        return this.request<FlashcardSet[]>(`/flashcards/sets/search?q=${encodeURIComponent(query)}`);
    }

    async getUserFlashcards(): Promise<UserFlashcardsResponse> {
        const token = apiService.getToken();
        const user = apiService.getUser();

        if (!token || !user?.id) {
            throw new Error('Authentication required. Please log in to fetch flashcards.');
        }

        return this.request<UserFlashcardsResponse>('/flashcards/user-flashcards');
    }

    async createFlashcard(data: CreateFlashcardRequest): Promise<CreateFlashcardResponse> {
        return this.request<CreateFlashcardResponse>('/flashcards/create', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async reviewFlashcard(id: string, qualityScore: number): Promise<ReviewResponse> {
        return this.request<ReviewResponse>(`/flashcards/review/${id}`, {
            method: 'POST',
            body: JSON.stringify({ qualityScore }),
        });
    }

    async getDueFlashcards(): Promise<DueFlashcardsResponse> {
        return this.request<DueFlashcardsResponse>('/flashcards/due');
    }

    async getFlashcardStats(): Promise<FlashcardStatsResponse> {
        return this.request<FlashcardStatsResponse>('/flashcards/stats');
    }

    async deleteFlashcard(id: string) {
        return this.request(`/flashcards/${id}`, {
            method: 'DELETE',
        });
    }

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
