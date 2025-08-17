export interface FlashcardGenerationRequest {
    text: string;
    total_questions: number;
}

export interface Flashcard {
    question: string;
    answer: string;
}

export interface FlashcardGenerationResponse {
    flashcards: Flashcard[];
    total_flashcards: number;
    text_length: number;
    processing_method: string;
}

export interface MCQGenerationRequest {
    text: string;
    total_questions: number;
}

export interface MCQ {
    id?: number;
    question: string;
    options: string[];
    correct_answer_index: number;
    correct_answer: string;
    explanation?: string;
}

export interface MCQGenerationResponse {
    mcqs: MCQ[];
    total_mcqs: number;
    text_length: number;
    processing_method: string;
}

export interface FlashcardSet {
    id: string;
    title: string;
    description?: string;
    subjectId?: string;
    flashcards: Flashcard[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateFlashcardSetRequest {
    title: string;
    description?: string;
    subjectId?: string;
    flashcards: Flashcard[];
}

export interface UpdateFlashcardSetRequest {
    title?: string;
    description?: string;
    subjectId?: string;
    flashcards?: Flashcard[];
}

export interface StudySession {
    currentIndex: number;
    showAnswer: boolean;
    correctAnswers: number;
    totalQuestions: number;
    startTime: number;
}

export interface FlashcardStudyProps {
    handleFlashcardNavigation: (direction: "next" | "prev") => void;
    resetSession: () => void;
    copyToClipboard: (text: string) => void;
    flashcardSession: StudySession;
    flashcards: Flashcard[];
    currentFlashcard: Flashcard;
    setFlashcardSession: (session: StudySession) => void;
}

export interface FlashcardFormProps {
    inputText: string;
    setInputText: (text: string) => void;
    totalQuestions: number;
    setTotalQuestions: (total: number) => void;
    generateFlashcards: () => void;
    isGenerating: boolean;
    error: string;
    setError: (error: string) => void;
}