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
import { Play } from "lucide-react";
import { flashcardApi } from "@/lib";
import { Flashcard, StudySession } from "@/types/flashcard";
import { toast } from "@/hooks/use-toast";
import FlashcardStudy from "@/components/flashcards/FlashcardStudy";
import FlashcardForm from "@/components/flashcards/FlashcardForm";

export default function FlashcardsPage() {
  const [inputText, setInputText] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>("");

  // Flashcards state
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashcardSession, setFlashcardSession] = useState<StudySession | null>(
    null
  );

  // Study mode state
  const [studyMode, setStudyMode] = useState<"setup" | "study" | "review">(
    "setup"
  );

  // Generate flashcards from text
  const generateFlashcards = async () => {
    if (!inputText.trim()) return;

    setIsGenerating(true);
    setError("");

    try {
      const result = await flashcardApi.generateFlashcards({
        text: inputText,
        total_questions: totalQuestions,
      });

      setFlashcards(result.flashcards);
      toast({
        title: "Flashcards Generated!",
        description: `Successfully created ${result.total_flashcards} flashcards.`,
      });
    } catch (error) {
      console.error("Error generating flashcards:", error);
      setError("Failed to generate flashcards. Please try again.");
      toast({
        title: "Generation Failed",
        description:
          "Could not generate flashcards. Please check your input and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Start flashcard study session
  const startFlashcardSession = () => {
    if (flashcards.length === 0) return;

    setFlashcardSession({
      currentIndex: 0,
      showAnswer: false,
      correctAnswers: 0,
      totalQuestions: flashcards.length,
      startTime: Date.now(),
    });
    setStudyMode("study");
  };

  // Handle flashcard navigation
  const handleFlashcardNavigation = (direction: "next" | "prev") => {
    if (!flashcardSession) return;

    if (
      direction === "next" &&
      flashcardSession.currentIndex < flashcards.length - 1
    ) {
      setFlashcardSession({
        ...flashcardSession,
        currentIndex: flashcardSession.currentIndex + 1,
        showAnswer: false,
      });
    } else if (direction === "prev" && flashcardSession.currentIndex > 0) {
      setFlashcardSession({
        ...flashcardSession,
        currentIndex: flashcardSession.currentIndex - 1,
        showAnswer: false,
      });
    }
  };

  // Reset study session
  const resetSession = () => {
    setFlashcardSession(null);
    setStudyMode("setup");
  };

  // Copy text to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard.",
      });
    } catch {
      toast({
        title: "Copy Failed",
        description: "Could not copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  // Study mode view
  if (studyMode === "study") {
    if (flashcardSession) {
      const currentFlashcard = flashcards[flashcardSession.currentIndex];

      return (
        <FlashcardStudy
          handleFlashcardNavigation={handleFlashcardNavigation}
          resetSession={resetSession}
          copyToClipboard={copyToClipboard}
          currentFlashcard={currentFlashcard}
          flashcardSession={flashcardSession}
          flashcards={flashcards}
          setFlashcardSession={setFlashcardSession}
        />
      );
    }
  }

  return (
    <GlobalLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Flashcards & Study
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your study material into interactive flashcards powered
              by AI. Study smarter with spaced repetition and confidence
              tracking.
            </p>
          </div>

          <FlashcardForm
            inputText={inputText}
            setInputText={setInputText}
            totalQuestions={totalQuestions}
            setTotalQuestions={setTotalQuestions}
            generateFlashcards={generateFlashcards}
            isGenerating={isGenerating}
            error={error}
            setError={setError}
          />

          {flashcards.length > 0 && (
            <Card className="border-2 border-accent/20 shadow-xl bg-gradient-to-br from-card to-accent/5 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl text-accent">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                  Flashcards Ready!
                </CardTitle>
                <CardDescription className="text-base">
                  {flashcards.length} flashcards generated and ready for study
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center pt-4">
                  <Button
                    size="lg"
                    onClick={startFlashcardSession}
                    className="px-12 py-4 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg pulse-glow"
                  >
                    <Play className="h-6 w-6 mr-3" />
                    Start Studying ({flashcards.length} cards)
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </GlobalLayout>
  );
}
