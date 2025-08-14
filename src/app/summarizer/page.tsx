"use client";

import { useState } from "react";
import GlobalLayout from "@/components/layout/GlobalLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Loader2, AlertCircle } from "lucide-react";

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
  const [maxLength, setMaxLength] = useState(150);
  const [chunkSize, setChunkSize] = useState(1000);

  const handleTextSummarization = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    setError("");

    try {
      const response = await fetch("http://localhost:9000/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          max_length: 150,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
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

  const handleFileProcessing = async () => {
    if (!selectedFile) return;

    setIsFileProcessing(true);
    setFileError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("max_length", maxLength.toString());
      formData.append("chunk_size", chunkSize.toString());

      const response = await fetch(
        "http://localhost:9000/api/files/upload-and-summarize",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process file");
      }

      const data = await response.json();
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

  const handleTextExtraction = async () => {
    if (!selectedFile) return;

    setIsFileProcessing(true);
    setFileError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(
        "http://localhost:9000/api/files/extract-text",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to extract text");
      }

      const data = await response.json();
      setFileResult(data);
    } catch (error: unknown) {
      console.error("Error extracting text:", error);
      setFileError(
        error instanceof Error
          ? error.message
          : "Failed to extract text. Please try again."
      );
    } finally {
      setIsFileProcessing(false);
    }
  };

  return (
    <GlobalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            AI Text Summarizer
          </h1>
          <p className="text-muted-foreground">
            Generate concise summaries from text or uploaded documents
          </p>
        </div>

        {/* File Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Document
            </CardTitle>
            <CardDescription>
              Upload PDF or DOCX files to extract text and generate summaries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Select File</Label>
              <input
                id="file"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{selectedFile.name}</span>
                  <Badge variant="secondary">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Badge>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxLength">Summary Length</Label>
                <input
                  id="maxLength"
                  type="number"
                  min="50"
                  max="500"
                  value={maxLength}
                  onChange={(e) => setMaxLength(parseInt(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chunkSize">Chunk Size</Label>
                <input
                  id="chunkSize"
                  type="number"
                  min="500"
                  max="2000"
                  value={chunkSize}
                  onChange={(e) => setChunkSize(parseInt(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleFileProcessing}
                disabled={!selectedFile || isFileProcessing}
                className="flex-1"
              >
                {isFileProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Process & Summarize
                  </>
                )}
              </Button>
              <Button
                onClick={handleTextExtraction}
                disabled={!selectedFile || isFileProcessing}
                variant="outline"
              >
                Extract Text Only
              </Button>
            </div>

            {fileError && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {fileError}
              </div>
            )}

            {fileResult && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">
                    Results for {fileResult.filename}
                  </h4>
                  <Badge variant="outline">{fileResult.file_type}</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Original:</span>
                    <div className="font-medium">
                      {fileResult.original_text_length} chars
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cleaned:</span>
                    <div className="font-medium">
                      {fileResult.cleaned_text_length} chars
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Summary:</span>
                    <div className="font-medium">
                      {fileResult.summary_length} chars
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Method:</span>
                    <div className="font-medium">
                      {fileResult.processing_method}
                    </div>
                  </div>
                </div>

                {fileResult.summary && (
                  <div className="space-y-2">
                    <Label>Generated Summary</Label>
                    <div className="p-3 bg-background border rounded-md text-sm">
                      {fileResult.summary}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Text Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Text Summarization</CardTitle>
            <CardDescription>
              Enter text directly to generate a summary
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Input Text</Label>
              <Textarea
                id="text"
                placeholder="Enter your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <Button
              onClick={handleTextSummarization}
              disabled={!inputText.trim() || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Summary...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Summary
                </>
              )}
            </Button>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {summary && (
              <div className="space-y-2">
                <Label>Generated Summary</Label>
                <div className="p-3 bg-muted border rounded-md">
                  {summary.summary}
                </div>
                {summary.processing_time && (
                  <div className="text-sm text-muted-foreground">
                    Processing time: {summary.processing_time}ms
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </GlobalLayout>
  );
}
