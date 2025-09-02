"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Brain, Loader2, Play, AlertTriangle } from "lucide-react";
import { useQuizGenerator } from "@/hooks/quiz/use-quiz-generator";
import type { QuizQuestion } from "@/hooks/quiz/use-quiz";

const difficulties = ["Easy", "Medium", "Hard"];

interface QuizSetupProps {
  onQuestionsGenerated: (questions: QuizQuestion[]) => void;
  onStartQuiz: () => void;
  generatedQuestions: QuizQuestion[];
}

export function QuizSetup({
  onQuestionsGenerated,
  onStartQuiz,
  generatedQuestions,
}: QuizSetupProps) {
  const {
    inputText,
    setInputText,
    selectedDifficulty,
    setSelectedDifficulty,
    numQuestions,
    setNumQuestions,
    isGenerating,
    error,
    generateMCQs,
    clearError,
  } = useQuizGenerator();

  const handleGenerateMCQs = async () => {
    try {
      const questions = await generateMCQs();
      onQuestionsGenerated(questions);
    } catch (error) {
      // Error is handled in the hook
      console.error(error);
    }
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    clearError();
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                AI-Powered Quiz Generation
              </h3>
              <p className="text-muted-foreground mt-2">
                Transform your study material into interactive multiple choice
                questions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generator Form */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Custom Quiz</CardTitle>
          <CardDescription>
            Input your study material to create personalized quiz questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="text">Study Material</Label>
            <Textarea
              id="text"
              placeholder="Paste your notes, textbook content, or any study material here..."
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            difficulty === "Easy"
                              ? "bg-green-500"
                              : difficulty === "Medium"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        />
                        {difficulty}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="questions">Number of Questions</Label>
              <Input
                type="number"
                id="questions"
                min="1"
                max="10"
                value={numQuestions}
                onChange={(e) =>
                  setNumQuestions(Number.parseInt(e.target.value) || 1)
                }
              />
            </div>
          </div>

          <Button
            size="lg"
            onClick={handleGenerateMCQs}
            disabled={!inputText.trim() || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <Brain className="h-5 w-5 mr-2" />
                Generate Quiz Questions
              </>
            )}
          </Button>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-destructive/80 mt-1">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Questions Preview */}
      {generatedQuestions.length > 0 && (
        <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-200">
              Quiz Ready!
            </CardTitle>
            <CardDescription>
              {generatedQuestions.length} questions generated successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {generatedQuestions.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Questions ready • {selectedDifficulty || "Medium"} difficulty
              </p>
            </div>

            <Button size="lg" onClick={onStartQuiz} className="w-full">
              <Play className="h-4 w-4 mr-2" />
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
