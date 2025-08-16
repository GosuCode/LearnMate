
export interface CreateSubjectRequest {
    name: string;
    description?: string;
    semesterId: string;
}

export interface UpdateSubjectRequest {
    name?: string;
    description?: string;
    semesterId?: string;
}

export interface CreateSemesterRequest {
    name: string;
    description?: string;
}

export interface UpdateSemesterRequest {
    name?: string;
    description?: string;
}

export interface CreateCourseRequest {
    title: string;
    description: string;
    subjectId: string;
    type: 'note' | 'video' | 'summary' | 'quiz';
    content?: string;
    fileUrl?: string;
}

export interface UpdateCourseRequest {
    title?: string;
    description?: string;
    subjectId?: string;
    type?: 'note' | 'video' | 'summary' | 'quiz';
    content?: string;
    fileUrl?: string;
}