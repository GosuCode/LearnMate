import { apiService } from './api';
import { Subject, Semester, Course } from '@/store/courseStore';
import { CreateSubjectRequest, UpdateSubjectRequest, CreateSemesterRequest, UpdateSemesterRequest, CreateCourseRequest, UpdateCourseRequest } from '@/types/course';

class CourseApiService {
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

  // Semester endpoints
  async getSemesters(): Promise<Semester[]> {
    return this.request<Semester[]>('/semesters');
  }

  async createSemester(data: CreateSemesterRequest): Promise<Semester> {
    return this.request<Semester>('/semesters', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSemester(id: string, data: UpdateSemesterRequest): Promise<Semester> {
    return this.request<Semester>(`/semesters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSemester(id: string): Promise<void> {
    return this.request<void>(`/semesters/${id}`, {
      method: 'DELETE',
    });
  }

  // Subject endpoints
  async getSubjects(): Promise<Subject[]> {
    return this.request<Subject[]>('/subjects');
  }

  async getSubjectsBySemester(semesterId: string): Promise<Subject[]> {
    return this.request<Subject[]>(`/semesters/${semesterId}/subjects`);
  }

  async createSubject(data: CreateSubjectRequest): Promise<Subject> {
    return this.request<Subject>('/subjects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSubject(id: string, data: UpdateSubjectRequest): Promise<Subject> {
    return this.request<Subject>(`/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSubject(id: string): Promise<void> {
    return this.request<void>(`/subjects/${id}`, {
      method: 'DELETE',
    });
  }

  // Course endpoints
  async getCourses(): Promise<Course[]> {
    return this.request<Course[]>('/courses');
  }

  async getCoursesBySubject(subjectId: string): Promise<Course[]> {
    return this.request<Course[]>(`/subjects/${subjectId}/courses`);
  }

  async getCourse(id: string): Promise<Course> {
    return this.request<Course>(`/courses/${id}`);
  }

  async createCourse(data: CreateCourseRequest): Promise<Course> {
    return this.request<Course>('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCourse(id: string, data: UpdateCourseRequest): Promise<Course> {
    return this.request<Course>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCourse(id: string): Promise<void> {
    return this.request<void>(`/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // Search and filter
  async searchCourses(query: string): Promise<Course[]> {
    return this.request<Course[]>(`/courses/search?q=${encodeURIComponent(query)}`);
  }

  async getCoursesByType(type: 'note' | 'video' | 'summary' | 'quiz'): Promise<Course[]> {
    return this.request<Course[]>(`/courses/type/${type}`);
  }
}

export const courseApi = new CourseApiService();
