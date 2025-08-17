"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { QuizQuestion } from "@/hooks/quiz/use-quiz";

interface QuizQuestionProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  difficulty: string;
  onAnswer: (selectedAnswer: number) => void;
}

export function QuizQuestionComponent({
  question,
  questionIndex,
  totalQuestions,
  difficulty,
  onAnswer,
}: QuizQuestionProps) {
  const progress = ((questionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Quiz in Progress</h1>
            <p className="text-muted-foreground">
              Question {questionIndex + 1} of {totalQuestions}
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            {difficulty} • {question.topic}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3 text-foreground">
                Question
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                {question.question}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-medium">Choose your answer:</h3>
              <div className="grid gap-3">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-4 px-4 hover:bg-primary/5 hover:border-primary/20 transition-colors bg-transparent hover:text-foreground"
                    onClick={() => onAnswer(index)}
                  >
                    <span className="font-semibold mr-3 text-primary">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="flex-1">{option}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
