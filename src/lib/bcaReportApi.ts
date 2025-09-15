import { apiService } from './api';
import {
    BCAReport,
    CreateBCAReportRequest,
    BCAReportResponse,
    BCAReportsListResponse
} from '@/types/bcaReport';

class BCAReportApiService {
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
                ...options.headers,
            },
            ...options,
        };

        // Only set Content-Type for requests with body
        if (options.body && !(config.headers as any)?.['Content-Type']) {
            config.headers = {
                ...config.headers,
                'Content-Type': 'application/json',
            };
        }

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

    // Generate BCA report
    async generateReport(data: CreateBCAReportRequest): Promise<BCAReport> {
        const response = await this.request<BCAReportResponse>('/bca-reports', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.data;
    }

    // Get user's BCA reports
    async getReports(page: number = 1, limit: number = 10): Promise<{ reports: BCAReport[]; pagination: any }> {
        const response = await this.request<BCAReportsListResponse>(`/bca-reports?page=${page}&limit=${limit}`);
        return response.data;
    }

    // Get specific BCA report
    async getReport(id: string): Promise<BCAReport> {
        const response = await this.request<BCAReportResponse>(`/bca-reports/${id}`);
        return response.data;
    }

    // Delete BCA report
    async deleteReport(id: string): Promise<void> {
        return this.request<void>(`/bca-reports/${id}`, {
            method: 'DELETE',
        });
    }


    // Download BCA report as DOCX
    async downloadReport(id: string): Promise<Blob> {
        const url = `${this.baseURL}/bca-reports/${id}/download`;
        const token = apiService.getToken();

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to download report');
        }

        return await response.blob();
    }
}

export const bcaReportApi = new BCAReportApiService();
