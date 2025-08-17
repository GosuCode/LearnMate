"use client";
import GlobalLayout from "@/components/layout/GlobalLayout";
import { useQuiz } from "@/hooks/quiz/use-quiz";
import { QuizSetup } from "@/components/quizzes/QuizSetup";
import { QuizQuestionComponent } from "@/components/quizzes/QuizQuestion";
import { QuizResults } from "@/components/quizzes/QuizResults";

export default function QuizzesPage() {
  const {
    quizState,
    currentQuestionIndex,
    quizResults,
    generatedQuestions,
    startQuiz,
    handleAnswer,
    resetQuiz,
    setGeneratedQuestions,
  } = useQuiz();

  const currentDifficulty = generatedQuestions[0]?.difficulty || "Medium";

  return (
    <GlobalLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Practice Quizzes
          </h1>
          <p className="text-muted-foreground mt-2">
            Test your knowledge and track your progress with AI-generated
            questions
          </p>
        </div>

        {/* Content based on quiz state */}
        {quizState === "setup" && (
          <QuizSetup
            onQuestionsGenerated={setGeneratedQuestions}
            onStartQuiz={startQuiz}
            generatedQuestions={generatedQuestions}
          />
        )}

        {quizState === "quiz" && generatedQuestions.length > 0 && (
          <QuizQuestionComponent
            question={generatedQuestions[currentQuestionIndex]}
            questionIndex={currentQuestionIndex}
            totalQuestions={generatedQuestions.length}
            difficulty={currentDifficulty}
            onAnswer={handleAnswer}
          />
        )}

        {quizState === "results" && quizResults && (
          <QuizResults
            results={quizResults}
            difficulty={currentDifficulty}
            onRetakeQuiz={resetQuiz}
          />
        )}
      </div>
    </GlobalLayout>
  );
}
