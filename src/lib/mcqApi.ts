import { apiService } from './api';
import { MCQGenerationRequest, MCQGenerationResponse, MCQQuiz, CreateQuizRequest, UpdateQuizRequest } from '@/types/mcq';

class MCQApiService {
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

  // Generate MCQs from text
  async generateMCQs(data: MCQGenerationRequest): Promise<MCQGenerationResponse> {
    return this.request<MCQGenerationResponse>('/mcq', {
      method: 'POST',
      body: JSON.stringify({
        text: data.text,
        num_questions: data.num_questions
      }),
    });
  }

  // Quiz management
  async getQuizzes(): Promise<MCQQuiz[]> {
    return this.request<MCQQuiz[]>('/mcq/quizzes');
  }

  async getQuiz(id: string): Promise<MCQQuiz> {
    return this.request<MCQQuiz>(`/mcq/quizzes/${id}`);
  }

  async createQuiz(data: CreateQuizRequest): Promise<MCQQuiz> {
    return this.request<MCQQuiz>('/mcq/quizzes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateQuiz(id: string, data: UpdateQuizRequest): Promise<MCQQuiz> {
    return this.request<MCQQuiz>(`/mcq/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteQuiz(id: string): Promise<void> {
    return this.request<void>(`/mcq/quizzes/${id}`, {
      method: 'DELETE',
    });
  }

  // Get quizzes by subject
  async getQuizzesBySubject(subjectId: string): Promise<MCQQuiz[]> {
    return this.request<MCQQuiz[]>(`/subjects/${subjectId}/quizzes`);
  }

  // Search quizzes
  async searchQuizzes(query: string): Promise<MCQQuiz[]> {
    return this.request<MCQQuiz[]>(`/mcq/quizzes/search?q=${encodeURIComponent(query)}`);
  }

  // Quiz results and analytics
  async submitQuizAnswers(quizId: string, answers: Record<string, number>): Promise<{
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    percentage: number;
    feedback: string;
    timeTaken: number;
  }> {
    return this.request(`/mcq/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  async getQuizAnalytics(quizId: string): Promise<{
    totalAttempts: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    completionRate: number;
    averageTime: number;
  }> {
    return this.request(`/mcq/quizzes/${quizId}/analytics`);
  }
}

export const mcqApi = new MCQApiService();
