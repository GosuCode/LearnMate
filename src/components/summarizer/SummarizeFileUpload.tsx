"use client";

import type React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Upload,
  Loader2,
  AlertCircle,
  Sparkles,
  BarChart3,
  Copy,
  Check,
} from "lucide-react";
import { FileUploadProps } from "@/types/Summarize";

const SummarizeFileUpload = ({
  handleFileUpload,
  selectedFile,
  maxLength,
  setMaxLength,
  chunkSize,
  setChunkSize,
  handleFileProcessing,
  isFileProcessing,
  fileError,
  fileResult,
  handleCopyText,
  copiedText,
}: FileUploadProps) => {
  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-serif">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Upload className="h-5 w-5 text-primary" />
          </div>
          Upload Document
        </CardTitle>
        <CardDescription className="text-base">
          Upload PDF or DOCX files to extract text and generate intelligent
          summaries
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="file" className="text-sm font-medium">
            Select File
          </Label>
          <div className="relative">
            <input
              id="file"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:transition-colors cursor-pointer border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors"
            />
          </div>
          {selectedFile && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
              <FileText className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <span className="font-medium text-sm">{selectedFile.name}</span>
              </div>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20"
              >
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Badge>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label
              htmlFor="maxLength"
              className="text-sm font-medium flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Summary Length
            </Label>
            <Input
              id="maxLength"
              type="number"
              min="50"
              max="500"
              value={maxLength}
              onChange={(e) => setMaxLength(Number.parseInt(e.target.value))}
              className="transition-colors focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-xs text-muted-foreground">
              Characters in summary (50-500)
            </p>
          </div>
          <div className="space-y-3">
            <Label
              htmlFor="chunkSize"
              className="text-sm font-medium flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Chunk Size
            </Label>
            <Input
              id="chunkSize"
              type="number"
              min="500"
              max="2000"
              value={chunkSize}
              onChange={(e) => setChunkSize(Number.parseInt(e.target.value))}
              className="transition-colors focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-xs text-muted-foreground">
              Text processing chunks (500-2000)
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleFileProcessing}
            disabled={!selectedFile || isFileProcessing}
            className="flex-1 h-12 text-base font-medium shadow-sm hover:shadow-md transition-all"
            size="lg"
          >
            {isFileProcessing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing Document...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Process & Summarize
              </>
            )}
          </Button>
        </div>

        {fileError && (
          <div className="flex items-center gap-3 p-4 text-destructive bg-destructive/5 border border-destructive/20 rounded-lg">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">{fileError}</span>
          </div>
        )}

        {fileResult && (
          <div className="space-y-4 p-6 border border-primary/20 rounded-xl bg-primary/5">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-semibold text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Results for {fileResult.filename}
              </h4>
              <Badge
                variant="outline"
                className="bg-background border-primary/30 text-primary"
              >
                {fileResult.file_type.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-background/50 rounded-lg border border-border/50">
                <div className="text-2xl font-bold text-primary">
                  {fileResult.original_text_length.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Original chars
                </div>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg border border-border/50">
                <div className="text-2xl font-bold text-primary">
                  {fileResult.cleaned_text_length.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Cleaned chars
                </div>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg border border-border/50">
                <div className="text-2xl font-bold text-primary">
                  {fileResult.summary_length?.toLocaleString() || "0"}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Summary chars
                </div>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg border border-border/50">
                <div className="text-sm font-semibold text-primary">
                  {fileResult.processing_method}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Method
                </div>
              </div>
            </div>

            {fileResult.summary && fileResult.summary.trim() && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Generated Summary
                  </Label>
                  <Button
                    onClick={() => handleCopyText(fileResult.summary, "file")}
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs border-primary/20 hover:bg-primary/5"
                  >
                    {copiedText === "file" ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="p-4 bg-background border border-border rounded-lg text-sm leading-relaxed">
                  {fileResult.summary}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummarizeFileUpload;
