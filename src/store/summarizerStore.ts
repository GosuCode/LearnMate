import { create } from 'zustand';

interface SummarizationResult {
    summary: string;
    processing_time?: number;
}

interface FileProcessingResult {
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

interface SummarizerState {
    // Text summarization
    inputText: string;
    textSummary: SummarizationResult | null;
    isTextProcessing: boolean;
    textError: string;

    // File summarization
    selectedFile: File | null;
    fileResult: FileProcessingResult | null;
    isFileProcessing: boolean;
    fileError: string;

    // Settings
    maxLength: number;
    chunkSize: number;
    copiedText: string;

    // Actions
    setInputText: (text: string) => void;
    setTextSummary: (summary: SummarizationResult | null) => void;
    setTextProcessing: (processing: boolean) => void;
    setTextError: (error: string) => void;

    setSelectedFile: (file: File | null) => void;
    setFileResult: (result: FileProcessingResult | null) => void;
    setFileProcessing: (processing: boolean) => void;
    setFileError: (error: string) => void;

    setMaxLength: (length: number) => void;
    setChunkSize: (size: number) => void;
    setCopiedText: (type: string) => void;

    resetTextState: () => void;
    resetFileState: () => void;
    resetAll: () => void;
}

export const useSummarizerStore = create<SummarizerState>((set) => ({
    // Initial state
    inputText: "",
    textSummary: null,
    isTextProcessing: false,
    textError: "",

    selectedFile: null,
    fileResult: null,
    isFileProcessing: false,
    fileError: "",

    maxLength: 150,
    chunkSize: 1000,
    copiedText: "",

    // Actions
    setInputText: (text) => set({ inputText: text }),
    setTextSummary: (summary) => set({ textSummary: summary }),
    setTextProcessing: (processing) => set({ isTextProcessing: processing }),
    setTextError: (error) => set({ textError: error }),

    setSelectedFile: (file) => set({ selectedFile: file }),
    setFileResult: (result) => set({ fileResult: result }),
    setFileProcessing: (processing) => set({ isFileProcessing: processing }),
    setFileError: (error) => set({ fileError: error }),

    setMaxLength: (length) => set({ maxLength: length }),
    setChunkSize: (size) => set({ chunkSize: size }),
    setCopiedText: (type) => set({ copiedText: type }),

    resetTextState: () => set({
        inputText: "",
        textSummary: null,
        isTextProcessing: false,
        textError: ""
    }),

    resetFileState: () => set({
        selectedFile: null,
        fileResult: null,
        isFileProcessing: false,
        fileError: ""
    }),

    resetAll: () => set({
        inputText: "",
        textSummary: null,
        isTextProcessing: false,
        textError: "",
        selectedFile: null,
        fileResult: null,
        isFileProcessing: false,
        fileError: "",
        copiedText: ""
    })
}));
