export interface MCQGenerationRequest {
    text: string;
    num_questions: number;
    use_bart?: boolean;
}

export interface MCQQuestion {
    id?: string;
    question: string;
    options: string[];
    correct_answer_index: number;
    answer?: string;
    explanation?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
}

export interface MCQGenerationResponse {
    mcqs: MCQQuestion[];
    total_questions: number;
    text_length: number;
    processing_method: string;
    service?: string;
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