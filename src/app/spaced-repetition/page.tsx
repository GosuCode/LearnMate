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
import {
  Brain,
  BookOpen,
  Target,
  Plus,
  Play,
  BarChart3,
  CheckCircle,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { flashcardApi } from "@/lib";
import {
  CreateFlashcardRequest,
  SM2Flashcard,
  FlashcardStats,
} from "@/types/flashcard";
import { Progress } from "@/components/ui/progress";

export default function SpacedRepetitionPage() {
  const [studyMode, setStudyMode] = useState<"setup" | "study" | "create">(
    "setup"
  );
  const [createForm, setCreateForm] = useState<CreateFlashcardRequest>({
    front: "",
    back: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  const [dueFlashcards, setDueFlashcards] = useState<SM2Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<FlashcardStats | null>(null);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    total: 0,
    startTime: Date.now(),
  });

  useEffect(() => {
    if (studyMode === "study") {
      loadStudyData();
    }
  }, [studyMode]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await flashcardApi.getFlashcardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadStudyData = async () => {
    try {
      setIsLoading(true);
      const [dueResponse, statsResponse] = await Promise.all([
        flashcardApi.getDueFlashcards(),
        flashcardApi.getFlashcardStats(),
      ]);

      if (dueResponse.success && statsResponse.success) {
        setDueFlashcards(dueResponse.data || []);
        setStats(statsResponse.data);
        setCurrentCardIndex(0);
        setShowAnswer(false);
        setSessionStats({
          correct: 0,
          total: 0,
          startTime: Date.now(),
        });
      }
    } catch (error) {
      console.error("Error loading study data:", error);
      toast({
        title: "Error",
        description: "Failed to load study data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFlashcard = async () => {
    if (!createForm.front.trim() || !createForm.back.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both front and back of the flashcard.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);
      const response = await flashcardApi.createFlashcard(createForm);

      if (response.success) {
        toast({
          title: "Success",
          description: "Flashcard created successfully!",
        });
        setCreateForm({ front: "", back: "" });
        setStudyMode("setup");
      } else {
        throw new Error(response.error || "Failed to create flashcard");
      }
    } catch (error) {
      console.error("Error creating flashcard:", error);
      toast({
        title: "Error",
        description: "Failed to create flashcard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleQualityRating = async (qualityScore: number) => {
    if (currentCardIndex >= dueFlashcards.length) return;

    const currentCard = dueFlashcards[currentCardIndex];
    try {
      const response = await flashcardApi.reviewFlashcard(
        currentCard.id,
        qualityScore
      );

      if (response.success) {
        setSessionStats((prev) => ({
          ...prev,
          correct: prev.correct + (qualityScore >= 3 ? 1 : 0),
          total: prev.total + 1,
        }));

        if (currentCardIndex + 1 < dueFlashcards.length) {
          setCurrentCardIndex((prev) => prev + 1);
          setShowAnswer(false);
        } else {
          const sessionDuration = Math.round(
            (Date.now() - sessionStats.startTime) / 1000
          );
          const accuracy = Math.round(
            ((sessionStats.correct + (qualityScore >= 3 ? 1 : 0)) /
              (sessionStats.total + 1)) *
              100
          );

          toast({
            title: "Study Session Complete!",
            description: `Accuracy: ${accuracy}% | Time: ${sessionDuration}s`,
          });

          await loadStudyData();
        }
      }
    } catch (error) {
      console.error("Error reviewing flashcard:", error);
      toast({
        title: "Error",
        description: "Failed to save review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getQualityButtonColor = (score: number) => {
    if (score <= 1) return "bg-red-500 hover:bg-red-600";
    if (score <= 2) return "bg-orange-500 hover:bg-orange-600";
    if (score <= 3) return "bg-yellow-500 hover:bg-yellow-600";
    if (score <= 4) return "bg-blue-500 hover:bg-blue-600";
    return "bg-green-500 hover:bg-green-600";
  };

  const getQualityLabel = (score: number) => {
    if (score === 0) return "Complete Blackout";
    if (score === 1) return "Incorrect Response";
    if (score === 2) return "Hard Response";
    if (score === 3) return "Correct Response";
    if (score === 4) return "Perfect Response";
    return "Perfect Response";
  };

  if (studyMode === "study") {
    if (isLoading) {
      return (
        <GlobalLayout>
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading your study session...</p>
            </div>
          </div>
        </GlobalLayout>
      );
    }

    if (dueFlashcards.length === 0) {
      return (
        <GlobalLayout>
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="text-center py-8 space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold">All Caught Up!</h2>
              <p className="text-muted-foreground mb-6">
                You have no flashcards due for review. Great job staying on top
                of your studies!
              </p>
              <div className="space-x-4">
                <Button onClick={() => setStudyMode("setup")} variant="outline">
                  Back to Dashboard
                </Button>
                <Button onClick={() => setStudyMode("create")}>
                  Create New Flashcard
                </Button>
              </div>
            </div>
          </div>
        </GlobalLayout>
      );
    }

    const currentCard = dueFlashcards[currentCardIndex];
    const progress = ((currentCardIndex + 1) / dueFlashcards.length) * 100;
    const sessionAccuracy =
      sessionStats.total > 0
        ? Math.round((sessionStats.correct / sessionStats.total) * 100)
        : 0;

    return (
      <GlobalLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Session Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Card {currentCardIndex + 1} of {dueFlashcards.length}
              </span>
              <span className="text-sm text-muted-foreground">
                Session Accuracy: {sessionAccuracy}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Flashcard */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                {/* Front of card */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Question
                  </Label>
                  <div className="text-xl font-medium min-h-[80px] flex items-center justify-center">
                    {currentCard.front}
                  </div>
                </div>

                {/* Answer section */}
                {!showAnswer ? (
                  <Button
                    onClick={() => setShowAnswer(true)}
                    size="lg"
                    className="px-8"
                  >
                    Show Answer
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Answer
                      </Label>
                      <div className="text-lg font-medium min-h-[80px] flex items-center justify-center p-4 bg-muted rounded-lg">
                        {currentCard.back}
                      </div>
                    </div>

                    {/* Quality rating buttons */}
                    <div className="space-y-3">
                      <Label className="text-sm text-muted-foreground block">
                        How well did you know this?
                      </Label>
                      <div className="grid grid-cols-6 gap-2">
                        {[0, 1, 2, 3, 4, 5].map((score) => (
                          <Button
                            key={score}
                            onClick={() => handleQualityRating(score)}
                            variant="outline"
                            className={`${getQualityButtonColor(
                              score
                            )} text-white border-0 hover:scale-105 transition-transform`}
                            size="sm"
                          >
                            {score}
                          </Button>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground text-center">
                        {getQualityLabel(3)} (3) is the threshold for
                        &quot;correct&quot;
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Session Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Session Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {sessionStats.correct}
                  </div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-muted-foreground">
                    {sessionStats.total}
                  </div>
                  <div className="text-sm text-muted-foreground">Reviewed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">
                    {sessionAccuracy}%
                  </div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Button onClick={() => setStudyMode("setup")} variant="outline">
              End Session
            </Button>
          </div>
        </div>
      </GlobalLayout>
    );
  }

  if (studyMode === "create") {
    return (
      <GlobalLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Create New Flashcard</h1>
              <p className="text-muted-foreground">
                Add a new flashcard to your spaced repetition study deck
              </p>
            </div>

            {/* Create Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Flashcard Details
                </CardTitle>
                <CardDescription>
                  Fill in the question (front) and answer (back) for your new
                  flashcard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="front">Question (Front)</Label>
                  <Textarea
                    id="front"
                    placeholder="Enter the question or prompt..."
                    value={createForm.front}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, front: e.target.value })
                    }
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="back">Answer (Back)</Label>
                  <Textarea
                    id="back"
                    placeholder="Enter the answer or explanation..."
                    value={createForm.back}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, back: e.target.value })
                    }
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStudyMode("setup")}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateFlashcard}
                    disabled={
                      isCreating ||
                      !createForm.front.trim() ||
                      !createForm.back.trim()
                    }
                    className="flex-1"
                  >
                    {isCreating ? "Creating..." : "Create Flashcard"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </GlobalLayout>
    );
  }

  return (
    <GlobalLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Spaced Repetition
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Study smarter with AI-powered spaced repetition using the SM2
              algorithm. Review cards at optimal intervals for maximum
              retention.
            </p>
          </div>

          {/* Stats Overview */}
          {stats && (
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary">
                    {stats.totalCards}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Cards
                  </div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-accent">
                    {stats.dueCards}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Due for Review
                  </div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-green-600">
                    {stats.averageEaseFactor?.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Avg Ease Factor
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Start Study Session */}
            <Card className="border-2 border-primary/20 shadow-xl bg-gradient-to-br from-card to-primary/5 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl text-primary">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                  Start Study Session
                </CardTitle>
                <CardDescription className="text-base">
                  Review your due flashcards using spaced repetition
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center pt-4">
                  <Button
                    size="lg"
                    onClick={() => setStudyMode("study")}
                    disabled={stats?.dueCards === 0}
                    className="px-12 py-4 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="h-6 w-6 mr-3" />
                    {stats?.dueCards === 0
                      ? "No Cards Due"
                      : `Begin Studying (${stats?.dueCards || 0} due)`}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Create New Flashcard */}
            <Card className="border-2 border-accent/20 shadow-xl bg-gradient-to-br from-card to-accent/5 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl text-accent">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  Create Flashcard
                </CardTitle>
                <CardDescription className="text-base">
                  Add new flashcards to your study deck
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center pt-4">
                  <Button
                    size="lg"
                    onClick={() => setStudyMode("create")}
                    className="px-12 py-4 text-lg bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <Plus className="h-6 w-6 mr-3" />
                    Create New Card
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                How Spaced Repetition Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Study</h3>
                  <p className="text-sm text-muted-foreground">
                    Review flashcards and rate your recall quality from 0-5
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Algorithm</h3>
                  <p className="text-sm text-muted-foreground">
                    SM2 algorithm calculates optimal intervals based on your
                    performance
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">Optimize</h3>
                  <p className="text-sm text-muted-foreground">
                    Cards appear at perfect intervals for maximum retention
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </GlobalLayout>
  );
}
