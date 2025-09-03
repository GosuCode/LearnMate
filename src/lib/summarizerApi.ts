import { apiService } from './api';
import { SummarizationRequest, SummarizationResponse, FileSummarizationRequest, FileProcessingResult, GetSummariesResponse, SavedSummary } from '@/types/Summarize';

class SummarizerApiService {
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

  async summarizeText(data: SummarizationRequest & { title?: string }): Promise<SummarizationResponse> {
    return this.request<SummarizationResponse>('/summarize', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSummaries(params?: { page?: number; limit?: number; search?: string }): Promise<GetSummariesResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    return this.request(`/summarize${queryString ? `?${queryString}` : ''}`);
  }

  async getSummary(id: string): Promise<SavedSummary> {
    return this.request(`/summarize/${id}`);
  }

  async deleteSummary(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/summarize/${id}`, {
      method: 'DELETE',
    });
  }

  async summarizeFile(data: FileSummarizationRequest & { title?: string }): Promise<FileProcessingResult> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('word_count', data.word_count.toString());
    formData.append('chunk_size', data.chunk_size.toString());
    if (data.title) {
      formData.append('title', data.title);
    }

    const url = `${this.baseURL}/files/upload-and-summarize`;

    const token = apiService.getToken();
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || 'File processing failed');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  async extractText(file: File): Promise<FileProcessingResult> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseURL}/files/extract-text`;

    const token = apiService.getToken();
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || 'Text extraction failed');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  async getSupportedFormats(): Promise<{
    supported_formats: string[];
    max_file_size: string;
    max_text_length: string;
    processing_features: string[];
  }> {
    return this.request('/files/supported-formats');
  }
}

export const summarizerApi = new SummarizerApiService();
