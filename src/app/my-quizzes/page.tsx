"use client";

import { useState, useEffect } from "react";
import GlobalLayout from "@/components/layout/GlobalLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Search,
  Brain,
  Calendar,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { mcqApi, apiService } from "@/lib";
import { MCQQuiz } from "@/types/mcq";
import { useRouter } from "next/navigation";

export default function MyQuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<MCQQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedText, setCopiedText] = useState<string>("");

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await mcqApi.getSavedQuizzes();
      setQuizzes(data.quizzes || []);
    } catch (err) {
      setError(
        `Failed to load quizzes: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!apiService.isAuthenticated()) {
      router.push("/auth/login");
      return;
    }
    fetchQuizzes();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await mcqApi.deleteSavedQuiz(id);
      setQuizzes(quizzes.filter((q) => q.id !== id));
    } catch (err) {
      console.error("Error deleting quiz:", err);
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

  const filteredQuizzes = (quizzes || []).filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quiz.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <GlobalLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your quizzes...</p>
            </div>
          </div>
        </div>
      </GlobalLayout>
    );
  }

  return (
    <GlobalLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-serif font-bold text-foreground tracking-tight">
              My Quizzes
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              View and manage all your saved quizzes
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 text-destructive bg-destructive/5 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Quizzes List */}
          {filteredQuizzes.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm ? "No quizzes found" : "No quizzes yet"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Generate some quizzes to see them here"}
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredQuizzes.map((quiz) => (
                <Card key={quiz.id} className="shadow-sm border-border/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl font-serif line-clamp-2">
                          {quiz.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(quiz.createdAt).toLocaleDateString()}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {quiz.questions.length} questions
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            MCQ Quiz
                          </Badge>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() =>
                            handleCopyText(
                              JSON.stringify(quiz.questions, null, 2),
                              quiz.id
                            )
                          }
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs"
                        >
                          {copiedText === quiz.id ? (
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
                        <Button
                          onClick={() => handleDelete(quiz.id)}
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Questions Preview */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Questions Preview
                        </h4>
                        {quiz.questions.slice(0, 2).map((question, index) => (
                          <div
                            key={index}
                            className="p-3 bg-muted/30 border border-border/50 rounded-lg"
                          >
                            <p className="text-sm font-medium mb-2">
                              {question.question}
                            </p>
                            <div className="space-y-1">
                              {question.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className="text-xs text-muted-foreground"
                                >
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        {quiz.questions.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{quiz.questions.length - 2} more questions...
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      {quiz.description && (
                        <div className="p-3 bg-muted/20 border border-border/30 rounded-lg">
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">
                            Description
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {quiz.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </GlobalLayout>
  );
}
