"use client";

import { useState, useEffect, useCallback } from "react";
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
import { StudySession, DatabaseFlashcard } from "@/types/flashcard";
import { toast } from "@/hooks/use-toast";
import FlashcardStudy from "@/components/flashcards/FlashcardStudy";
import FlashcardForm from "@/components/flashcards/FlashcardForm";
import { useAuthStore } from "@/store/authStore";
import FlashcardList from "@/components/flashcards/FlashcardList";

export default function FlashcardsPage() {
  const { user } = useAuthStore();
  const [inputText, setInputText] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>("");

  const [flashcards, setFlashcards] = useState<DatabaseFlashcard[]>([]);
  const [flashcardSession, setFlashcardSession] = useState<StudySession | null>(
    null
  );

  const [userFlashcards, setUserFlashcards] = useState<DatabaseFlashcard[]>([]);
  const [isLoadingUserFlashcards, setIsLoadingUserFlashcards] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(6);

  const [studyMode, setStudyMode] = useState<"setup" | "study" | "review">(
    "setup"
  );

  const totalPages = Math.ceil(userFlashcards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentFlashcards = userFlashcards.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [userFlashcards.length]);

  const fetchUserFlashcards = useCallback(async () => {
    if (!user?.id) return;

    setIsLoadingUserFlashcards(true);
    try {
      const response = await flashcardApi.getUserFlashcards();
      if (response.success) {
        setUserFlashcards(response.data);
      }
    } catch (error) {
      console.error("Error fetching user flashcards:", error);
      toast({
        title: "Failed to load flashcards",
        description: "Could not load your previously generated flashcards.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingUserFlashcards(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchUserFlashcards();
    }
  }, [user?.id, fetchUserFlashcards]);

  const generateFlashcards = async () => {
    if (!inputText.trim()) return;

    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate flashcards.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      await flashcardApi.generateFlashcards({
        text: inputText,
        total_questions: totalQuestions,
      });

      const res = await flashcardApi.getUserFlashcards();
      if (res.success) {
        const latest = res.data
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, totalQuestions);
        setUserFlashcards(res.data);
        setFlashcards(latest);
      }

      toast({
        title: "Flashcards Generated!",
        description: `Successfully created and saved ${totalQuestions} flashcards.`,
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

  const resetSession = () => {
    setFlashcardSession(null);
    setStudyMode("setup");
  };

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
          onSelectConfidence={async (level) => {
            const quality = level === "easy" ? 5 : level === "medium" ? 3 : 1;
            try {
              await flashcardApi.reviewFlashcard(currentFlashcard.id, quality);
              handleFlashcardNavigation("next");
            } catch {
              toast({
                title: "Review failed",
                description: "Could not record your review.",
                variant: "destructive",
              });
            }
          }}
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

          {/* Start Studying Flashcards */}
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

          {/* Previously Generated Flashcards */}
          <FlashcardList
            userFlashcards={userFlashcards}
            isLoadingUserFlashcards={isLoadingUserFlashcards}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            fetchUserFlashcards={fetchUserFlashcards}
            currentFlashcards={currentFlashcards}
            onStartStudy={(id) => {
              setFlashcards(userFlashcards);
              const index = userFlashcards.findIndex((f) => f.id === id);
              if (index === -1) return;
              setFlashcardSession({
                currentIndex: index,
                showAnswer: false,
                correctAnswers: 0,
                totalQuestions: userFlashcards.length,
                startTime: Date.now(),
              });
              setStudyMode("study");
            }}
          />
        </div>
      </div>
    </GlobalLayout>
  );
}
