import { apiService } from './api';
import { SummarizationRequest, SummarizationResponse, FileSummarizationRequest, FileProcessingResult } from '@/types/Summarize';

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

  async summarizeText(data: SummarizationRequest): Promise<SummarizationResponse> {
    return this.request<SummarizationResponse>('/summarize', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async summarizeFile(data: FileSummarizationRequest): Promise<FileProcessingResult> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('word_count', data.word_count.toString());
    formData.append('chunk_size', data.chunk_size.toString());

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
