import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Copy,
  Eye,
  EyeOff,
  Trophy,
  XCircle,
  CheckCircle,
} from "lucide-react";
import GlobalLayout from "../layout/GlobalLayout";
import { FlashcardStudyProps } from "@/types/flashcard";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { CardContent } from "../ui/card";
import { useState } from "react";

const FlashcardStudy = ({
  handleFlashcardNavigation,
  resetSession,
  copyToClipboard,
  flashcardSession,
  flashcards,
  currentFlashcard,
  setFlashcardSession,
  onSelectConfidence,
}: FlashcardStudyProps) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [confidence, setConfidence] = useState<
    "easy" | "medium" | "hard" | null
  >(null);

  const handleFlip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setFlashcardSession({
        ...flashcardSession,
        showAnswer: !flashcardSession.showAnswer,
      });
      setIsFlipping(false);
    }, 300);
  };

  const handleNext = () => {
    setConfidence(null);
    handleFlashcardNavigation("next");
  };

  const handlePrevious = () => {
    setConfidence(null);
    handleFlashcardNavigation("prev");
  };

  const progressPercentage = Math.round(
    ((flashcardSession.currentIndex + 1) / flashcards.length) * 100
  );

  return (
    <GlobalLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Flashcard Study
              </h1>
              <p className="text-lg text-muted-foreground">
                Card {flashcardSession.currentIndex + 1} of {flashcards.length}
              </p>
            </div>
            <Button
              onClick={resetSession}
              variant="outline"
              size="lg"
              className="hover:bg-destructive hover:text-destructive-foreground transition-colors bg-transparent"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Exit Study
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent" />
                <span className="font-semibold text-foreground">Progress</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-accent">
                  {progressPercentage}%
                </span>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-muted" />
          </div>

          <div className="flex justify-center">
            <Card
              className={`w-full max-w-2xl min-h-[400px] cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                isFlipping ? "flip-animation" : ""
              } ${flashcardSession.showAnswer ? "ring-2 ring-accent/50" : ""}`}
              onClick={handleFlip}
            >
              <CardContent className="p-12 h-full flex flex-col justify-center text-center space-y-8">
                {!flashcardSession.showAnswer ? (
                  /* Question Side */
                  <div className="space-y-6 slide-in">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-primary-foreground">
                        Q
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-4">
                      Question
                    </h2>
                    <p className="text-xl leading-relaxed text-foreground font-medium">
                      {currentFlashcard.front}
                    </p>
                    <div className="pt-4">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFlip();
                        }}
                        size="lg"
                        className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-accent-foreground px-8 py-3"
                      >
                        <Eye className="h-5 w-5 mr-2" />
                        Reveal Answer
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Answer Side */
                  <div className="space-y-6 slide-in">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-accent-foreground">
                        A
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-accent mb-4">
                      Answer
                    </h3>
                    <p className="text-xl leading-relaxed text-foreground font-medium">
                      {currentFlashcard.back}
                    </p>

                    <div className="pt-6 space-y-4">
                      <p className="text-sm text-muted-foreground">
                        How well did you know this?
                      </p>
                      <div className="flex justify-center gap-3">
                        <Button
                          onClick={async (e) => {
                            e.stopPropagation();
                            setConfidence("hard");
                            if (onSelectConfidence) {
                              await onSelectConfidence("hard");
                            }
                          }}
                          variant={
                            confidence === "hard" ? "default" : "outline"
                          }
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white border-red-500"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Hard
                        </Button>
                        <Button
                          onClick={async (e) => {
                            e.stopPropagation();
                            setConfidence("medium");
                            if (onSelectConfidence) {
                              await onSelectConfidence("medium");
                            }
                          }}
                          variant={
                            confidence === "medium" ? "default" : "outline"
                          }
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
                        >
                          Medium
                        </Button>
                        <Button
                          onClick={async (e) => {
                            e.stopPropagation();
                            setConfidence("easy");
                            if (onSelectConfidence) {
                              await onSelectConfidence("easy");
                            }
                          }}
                          variant={
                            confidence === "easy" ? "default" : "outline"
                          }
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white border-green-500"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Easy
                        </Button>
                      </div>

                      <div className="flex justify-center gap-3 pt-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(currentFlashcard.back);
                          }}
                          variant="ghost"
                          size="sm"
                          className="hover:bg-accent/10"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Answer
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFlip();
                          }}
                          variant="ghost"
                          size="sm"
                          className="hover:bg-accent/10"
                        >
                          <EyeOff className="h-4 w-4 mr-2" />
                          Hide Answer
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center gap-6">
            <Button
              onClick={handlePrevious}
              disabled={flashcardSession.currentIndex === 0}
              variant="outline"
              size="lg"
              className="px-8 py-3 disabled:opacity-50 hover:bg-accent hover:text-accent-foreground transition-colors bg-transparent"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={flashcardSession.currentIndex === flashcards.length - 1}
              size="lg"
              className="px-8 py-3 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent disabled:opacity-50"
            >
              Next
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border/50">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-accent">
                  {flashcardSession.currentIndex + 1}
                </p>
                <p className="text-sm text-muted-foreground">Current Card</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {flashcards.length}
                </p>
                <p className="text-sm text-muted-foreground">Total Cards</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {flashcards.length - flashcardSession.currentIndex - 1}
                </p>
                <p className="text-sm text-muted-foreground">Remaining</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlobalLayout>
  );
};

export default FlashcardStudy;
