export interface FileUploadProps {
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selectedFile: File | null;
    wordCount: number;
    setWordCount: (value: number) => void;
    chunkSize: number;
    setChunkSize: (value: number) => void;
    handleFileProcessing: () => void;
    isFileProcessing: boolean;
    fileError: string;
    fileResult: FileProcessingResult | null;
    handleCopyText: (text: string, type: string) => void;
    copiedText: string;
}

export interface FileProcessingResult {
    filename: string;
    file_type: string;
    original_text_length: number;
    cleaned_text_length: number;
    summary: string;
    summary_length: number;
    word_count: number;
    chunk_size: number;
    processing_method: string;
    saved?: boolean;
    savedSummary?: {
        id: string;
        title: string;
        createdAt: string;
    };
    saveError?: string;
}

export interface SummarizationResult {
    summary: string;
    processing_time?: number;
    saved?: boolean;
    savedSummary?: {
        id: string;
        title: string;
        createdAt: string;
    };
    saveError?: string;
}

export interface SummarizeTextProps {
    inputText: string;
    setInputText: (value: string) => void;
    wordCount: number;
    setWordCount: (value: number) => void;
    handleTextSummarization: () => void;
    isProcessing: boolean;
    error: string;
    summary: SummarizationResult | null;
    copiedText: string;
    handleCopyText: (text: string, type: string) => void;
}


export interface SummarizationRequest {
    text: string;
    word_count: number;
    num_beams?: number;
}

export interface SummarizationResponse {
    summary: string;
    processing_time?: number;
    processing_method: string;
    model_available: boolean;
    saved?: boolean;
    savedSummary?: {
        id: string;
        title: string;
        createdAt: string;
    };
    saveError?: string;
}

export interface FileSummarizationRequest {
    file: File;
    word_count: number;
    chunk_size: number;
}

export interface SavedSummary {
    id: string;
    title: string;
    originalText: string;
    summary: string;
    wordCount: number;
    processingMethod: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export interface GetSummariesResponse {
    summaries: SavedSummary[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}