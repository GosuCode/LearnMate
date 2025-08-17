"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";
import type { QuizResult } from "@/hooks/quiz/use-quiz";

interface QuizResultsProps {
  results: QuizResult;
  difficulty: string;
  onRetakeQuiz: () => void;
}

export function QuizResults({
  results,
  difficulty,
  onRetakeQuiz,
}: QuizResultsProps) {
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { text: "Excellent!", variant: "default" as const };
    if (score >= 80)
      return { text: "Great Job!", variant: "secondary" as const };
    if (score >= 70)
      return { text: "Good Work!", variant: "secondary" as const };
    if (score >= 60)
      return { text: "Keep Practicing!", variant: "outline" as const };
    return { text: "Need More Study", variant: "outline" as const };
  };

  const scoreBadge = getScoreBadge(results.score);

  const toggleDetailedResults = () => {
    setShowDetailedResults(!showDetailedResults);
  };

  if (showDetailedResults) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Detailed Results</h1>
            <p className="text-muted-foreground">
              {difficulty} • {results.totalQuestions} questions
            </p>
          </div>
          <Button onClick={toggleDetailedResults} variant="outline" size="sm">
            <EyeOff className="h-4 w-4 mr-2" />
            Hide Details
          </Button>
        </div>

        {/* Questions and Answers */}
        <div className="space-y-4">
          {results.timePerQuestion.map((question, index) => {
            const isCorrect = question.isCorrect;

            return (
              <Card
                key={index}
                className={`border-2 ${
                  isCorrect
                    ? "border-green-200 bg-green-50/50"
                    : "border-red-200 bg-red-50/50"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Question Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Question {index + 1}
                      </h3>
                      <Badge variant={isCorrect ? "default" : "destructive"}>
                        {isCorrect ? "Correct" : "Incorrect"}
                      </Badge>
                    </div>

                    {/* Question */}
                    <div>
                      <p className="text-base leading-relaxed text-foreground">
                        {question.question}
                      </p>
                    </div>

                    {/* Options */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Options:
                      </h4>
                      <div className="grid gap-2">
                        {question.options.map((option, optionIndex) => {
                          const isCorrectAnswer =
                            optionIndex === question.correctAnswer;

                          let optionStyle = "p-3 rounded-lg border text-sm";
                          if (isCorrectAnswer) {
                            optionStyle +=
                              " bg-green-100 border-green-300 text-green-800";
                          } else {
                            optionStyle += " bg-gray-50 border-gray-200";
                          }

                          return (
                            <div key={optionIndex} className={optionStyle}>
                              <span className="font-medium mr-2">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              {option}
                              {isCorrectAnswer && (
                                <CheckCircle className="h-4 w-4 text-green-600 inline ml-2" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Back to Summary Button */}
        <div className="text-center">
          <Button onClick={toggleDetailedResults} variant="outline" size="lg">
            <Eye className="h-4 w-4 mr-2" />
            Back to Summary
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Quiz Complete!</h1>
        <p className="text-muted-foreground">
          {difficulty} • {results.totalQuestions} questions
        </p>
        <Badge variant={scoreBadge.variant} className="px-3 py-1">
          {scoreBadge.text}
        </Badge>
      </div>

      {/* Score Card */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div
              className={`text-6xl font-bold ${getScoreColor(results.score)}`}
            >
              {Math.round(results.score)}%
            </div>

            <div className="text-lg text-muted-foreground">
              {results.correctAnswers} out of {results.totalQuestions} correct
            </div>

            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{results.correctAnswers} Correct</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span>{results.incorrectAnswers} Incorrect</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>{Math.round(results.averageTime / 1000)}s Average</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={onRetakeQuiz}
          variant="outline"
          size="lg"
          className="flex-1 sm:flex-none bg-transparent"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Take Another Quiz
        </Button>
        <Button
          onClick={toggleDetailedResults}
          size="lg"
          className="flex-1 sm:flex-none"
        >
          <Eye className="h-4 w-4 mr-2" />
          View All Results
        </Button>
      </div>
    </div>
  );
}
