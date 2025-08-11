"use client";

import { useState, useRef } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Copy,
  Download,
  Brain,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileUp,
} from "lucide-react";

interface SummaryResponse {
  summary: string;
  wordCount: number;
  keyPoints: string[];
  confidence: number;
}

export default function SummarizerPage() {
  const [activeTab, setActiveTab] = useState("file");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [textInput, setTextInput] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");

  const materials = [
    "Data Structures Notes",
    "Java Programming Guide",
    "Web Technology PDF",
    "Database Management Notes",
    "Operating Systems Material",
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError("Please select a valid file type (PDF, DOCX, or TXT)");
        setSelectedFile(null);
      }
    }
  };

  const handleFileDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleSummarize = async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      let response;
      let formData;

      switch (activeTab) {
        case "file":
          if (!selectedFile) {
            throw new Error("Please select a file to summarize");
          }
          formData = new FormData();
          formData.append("file", selectedFile);
          response = await fetch("http://localhost:9000/api/summarize", {
            method: "POST",
            body: formData,
          });
          break;

        case "text":
          if (!textInput.trim()) {
            throw new Error("Please enter text to summarize");
          }
          response = await fetch("http://localhost:9000/api/summarize", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: textInput }),
          });
          break;

        case "link":
          if (!selectedMaterial) {
            throw new Error("Please select a material to summarize");
          }
          response = await fetch("http://localhost:9000/api/summarize", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ link: selectedMaterial }),
          });
          break;

        default:
          throw new Error("Invalid input method");
      }

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const isInputValid = () => {
    switch (activeTab) {
      case "file":
        return selectedFile !== null;
      case "text":
        return textInput.trim().length > 0;
      case "link":
        return selectedMaterial !== "";
      default:
        return false;
    }
  };

  return (
    <GlobalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Summarizer</h1>
          <p className="text-muted-foreground">
            Upload documents, paste text, or select materials to get
            AI-generated summaries
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Input Options
              </CardTitle>
              <CardDescription>
                Choose how you want to provide content for summarization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="file">File Upload</TabsTrigger>
                  <TabsTrigger value="text">Paste Text</TabsTrigger>
                  <TabsTrigger value="link">Materials Link</TabsTrigger>
                </TabsList>

                <TabsContent value="file" className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="file-upload">Upload Document</Label>
                    <div
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      onDrop={handleFileDrop}
                      onDragOver={handleDragOver}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileSelect}
                      />
                      <FileUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">
                        Drag and drop a file here, or click to browse
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supports PDF, DOCX, and TXT files
                      </p>
                    </div>
                    {selectedFile && (
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                          {selectedFile.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="text-input">Paste Your Text</Label>
                    <Textarea
                      id="text-input"
                      placeholder="Paste or type the text you want to summarize..."
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className="min-h-[200px] resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      {textInput.length} characters
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="link" className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="material-select">Select Material</Label>
                    <Select
                      value={selectedMaterial}
                      onValueChange={setSelectedMaterial}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose from your stored materials" />
                      </SelectTrigger>
                      <SelectContent>
                        {materials.map((material) => (
                          <SelectItem key={material} value={material}>
                            {material}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Select from your previously uploaded or stored materials
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                onClick={handleSummarize}
                disabled={isLoading || !isInputValid()}
                className="w-full h-12"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Summarizing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Summarize
                  </>
                )}
              </Button>

              {/* Error Display */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Summary Output
              </CardTitle>
              <CardDescription>
                Your AI-generated summary will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {summary ? (
                <div className="space-y-4">
                  {/* Summary Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{summary.wordCount} words</span>
                    <span>{summary.confidence * 100}% confidence</span>
                  </div>

                  {/* Summary Text */}
                  <ScrollArea className="h-64 w-full rounded-md border p-4">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {summary.summary}
                    </p>
                  </ScrollArea>

                  {/* Key Points */}
                  {summary.keyPoints && summary.keyPoints.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Key Points:</Label>
                      <ul className="space-y-1">
                        {summary.keyPoints.map((point, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm"
                          >
                            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-muted-foreground">
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(summary.summary);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="flex-1"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy to Clipboard
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const element = document.createElement("a");
                        const file = new Blob([summary.summary], {
                          type: "text/plain",
                        });
                        element.href = URL.createObjectURL(file);
                        element.download = "summary.txt";
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download as TXT
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {isLoading
                      ? "Generating your summary..."
                      : "Your summary will appear here after processing"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </GlobalLayout>
  );
}
