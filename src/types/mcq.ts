export interface MCQGenerationRequest {
    text: string;
    num_questions: number;
    use_bart?: boolean;
}

export interface MCQQuestion {
    id: string;
    question: string;
    options: string[];
    correct_answer: number;
    explanation?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
}

export interface MCQGenerationResponse {
    questions: MCQQuestion[];
    total_questions: number;
    processing_time?: number;
    model_used: string;
}

export interface MCQQuiz {
    id: string;
    title: string;
    description?: string;
    subjectId?: string;
    questions: MCQQuestion[];
    timeLimit?: number; // in minutes
    passingScore?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateQuizRequest {
    title: string;
    description?: string;
    subjectId?: string;
    questions: MCQQuestion[];
    timeLimit?: number;
    passingScore?: number;
}

export interface UpdateQuizRequest {
    title?: string;
    description?: string;
    subjectId?: string;
    questions?: MCQQuestion[];
    timeLimit?: number;
    passingScore?: number;
}