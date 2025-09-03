"use client";

import { useState } from "react";
import GlobalLayout from "@/components/layout/GlobalLayout";
import SummarizeFileUpload from "@/components/summarizer/SummarizeFileUpload";
import SummarizeText from "@/components/summarizer/SummarizeText";
import { Sparkles, FileText, Upload } from "lucide-react";
import { FileProcessingResult, SummarizationResult } from "@/types/Summarize";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { summarizerApi } from "@/lib";

export default function SummarizerPage() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState<SummarizationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileResult, setFileResult] = useState<FileProcessingResult | null>(
    null
  );
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  const [fileError, setFileError] = useState<string>("");
  const [wordCount, setWordCount] = useState(100);
  const [chunkSize, setChunkSize] = useState(1000);
  const [copiedText, setCopiedText] = useState<string>("");

  const handleTextSummarization = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    setError("");

    try {
      const data = await summarizerApi.summarizeText({
        text: inputText,
        word_count: wordCount,
        save: true,
      });
      setSummary(data);
    } catch (error) {
      console.error("Error generating summary:", error);
      setError("Failed to generate summary. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.name.toLowerCase().split(".").pop();
      if (fileType !== "pdf" && fileType !== "docx") {
        setFileError("Please select a PDF or DOCX file");
        return;
      }

      setSelectedFile(file);
      setFileError("");
      setFileResult(null);
    }
  };

  const handleCopyText = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(""), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleFileProcessing = async () => {
    if (!selectedFile) return;

    setIsFileProcessing(true);
    setFileError("");

    try {
      const data = await summarizerApi.summarizeFile({
        file: selectedFile,
        word_count: wordCount,
        chunk_size: chunkSize,
      });
      setFileResult(data);
    } catch (error: unknown) {
      console.error("Error processing file:", error);
      setFileError(
        error instanceof Error
          ? error.message
          : "Failed to process file. Please try again."
      );
    } finally {
      setIsFileProcessing(false);
    }
  };

  return (
    <GlobalLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl font-serif font-bold text-foreground tracking-tight">
                AI Text Summarizer
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Transform lengthy documents and text into concise, meaningful
                summaries using advanced AI technology
              </p>
            </div>

            {/* Summarization Tabs */}
            <Tabs defaultValue="file" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="file" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  File Upload
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Text Input
                </TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="mt-6">
                <SummarizeFileUpload
                  handleFileUpload={handleFileUpload}
                  selectedFile={selectedFile}
                  wordCount={wordCount}
                  setWordCount={setWordCount}
                  chunkSize={chunkSize}
                  setChunkSize={setChunkSize}
                  handleFileProcessing={handleFileProcessing}
                  isFileProcessing={isFileProcessing}
                  fileError={fileError}
                  fileResult={fileResult}
                  handleCopyText={handleCopyText}
                  copiedText={copiedText}
                />
              </TabsContent>

              <TabsContent value="text" className="mt-6">
                <SummarizeText
                  inputText={inputText}
                  setInputText={setInputText}
                  wordCount={wordCount}
                  setWordCount={setWordCount}
                  handleTextSummarization={handleTextSummarization}
                  isProcessing={isProcessing}
                  error={error}
                  summary={summary}
                  copiedText={copiedText}
                  handleCopyText={handleCopyText}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </GlobalLayout>
  );
}
