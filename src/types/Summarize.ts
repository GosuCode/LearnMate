export interface FileUploadProps {
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selectedFile: File | null;
    maxLength: number;
    setMaxLength: (value: number) => void;
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
    max_length: number;
    chunk_size: number;
    processing_method: string;
}

export interface SummarizationResult {
    summary: string;
    processing_time?: number;
}

export interface SummarizeTextProps {
    inputText: string;
    setInputText: (value: string) => void;
    handleTextSummarization: () => void;
    isProcessing: boolean;
    error: string;
    summary: SummarizationResult | null;
    copiedText: string;
    handleCopyText: (text: string, type: string) => void;
}


export interface SummarizationRequest {
    text: string;
    max_length: number;
    num_beams?: number;
}

export interface SummarizationResponse {
    summary: string;
    processing_time?: number;
    processing_method: string;
    model_available: boolean;
}

export interface FileSummarizationRequest {
    file: File;
    max_length: number;
    chunk_size: number;
}