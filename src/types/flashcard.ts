export interface FlashcardGenerationRequest {
    text: string;
    total_questions: number;
    userId?: string; // Optional since it's handled automatically by the API
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

// SM2 Spaced Repetition Types
export interface SM2Flashcard {
    id: string;
    front: string;
    back: string;
    easeFactor: number;
    interval: number;
    repetition: number;
    lastReviewed: string;
    nextReview: string;
}

// Database Flashcard with full SM2 data
export interface DatabaseFlashcard {
    id: string;
    front: string;
    back: string;
    easeFactor: number;
    interval: number;
    repetition: number;
    lastReviewed: string;
    nextReview: string;
    userId: string;
    contentId?: string;
    createdAt: string;
    updatedAt: string;
    content?: {
        id: string;
        title: string;
        type: string;
    };
}

export interface UserFlashcardsResponse {
    success: boolean;
    data: DatabaseFlashcard[];
    total: number;
    error: string | null;
}

export interface ReviewRequest {
    qualityScore: number;
}

export interface ReviewResponse {
    success: boolean;
    data: SM2Flashcard | null;
    error: string | null;
}

export interface DueFlashcardsResponse {
    success: boolean;
    data: SM2Flashcard[];
    error: string | null;
}

export interface FlashcardStats {
    totalCards: number;
    dueCards: number;
    averageEaseFactor: number;
}

export interface FlashcardStatsResponse {
    success: boolean;
    data: FlashcardStats | null;
    error: string | null;
}

export interface CreateFlashcardRequest {
    front: string;
    back: string;
    contentId?: string;
}

export interface CreateFlashcardResponse {
    success: boolean;
    data: SM2Flashcard | null;
    error: string | null;
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
    flashcards: DatabaseFlashcard[];
    currentFlashcard: DatabaseFlashcard;
    setFlashcardSession: (session: StudySession) => void;
    onSelectConfidence?: (level: "easy" | "medium" | "hard") => Promise<void> | void;
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

export interface FlashcardListProps {
    userFlashcards: DatabaseFlashcard[];
    isLoadingUserFlashcards: boolean;
    currentPage: number;
    setCurrentPage: (page: number | ((prev: number) => number)) => void;
    totalPages: number;
    fetchUserFlashcards: () => void;
    currentFlashcards: DatabaseFlashcard[];
    onStartStudy: (id: string) => void;
}