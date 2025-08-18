import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Clock, Brain, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { flashcardApi } from "@/lib";
import { FlashcardStats, DatabaseFlashcard } from "@/types/flashcard";

const ProgressSummaryCard = () => {
  const [stats, setStats] = useState<FlashcardStats | null>(null);
  const [recentFlashcards, setRecentFlashcards] = useState<DatabaseFlashcard[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFlashcardData();
  }, []);

  const loadFlashcardData = async () => {
    try {
      setIsLoading(true);
      const [statsResponse, userFlashcardsResponse] = await Promise.all([
        flashcardApi.getFlashcardStats(),
        flashcardApi.getUserFlashcards(),
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (userFlashcardsResponse.success) {
        // Get the 3 most recent flashcards
        const recent = userFlashcardsResponse.data?.slice(0, 3) || [];
        setRecentFlashcards(recent);
      }
    } catch (error) {
      console.error("Error loading flashcard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCompletionPercentage = () => {
    if (!stats) return 0;
    // Calculate completion based on due cards vs total cards
    // Lower due cards = higher completion
    const dueRatio = stats.dueCards / Math.max(stats.totalCards, 1);
    return Math.max(0, Math.min(100, Math.round((1 - dueRatio) * 100)));
  };

  const getAverageScore = () => {
    if (!stats || stats.totalCards === 0) return 0;
    // Calculate average score based on ease factor (0.1 to 2.5, where 2.5 is perfect)
    const normalizedScore = (stats.averageEaseFactor - 0.1) / (2.5 - 0.1);
    return Math.round(normalizedScore * 100);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Flashcard Progress Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Flashcard Progress
          </CardTitle>
          <CardDescription>Study completion status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-foreground">
                {getCompletionPercentage()}%
              </span>
              <span className="text-sm text-muted-foreground">Complete</span>
            </div>
            <Progress value={getCompletionPercentage()} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {stats?.dueCards || 0} cards due for review
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Study Performance Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Study Performance
          </CardTitle>
          <CardDescription>Learning effectiveness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-foreground">
                {getAverageScore()}%
              </span>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">
              Average ease factor:{" "}
              {stats?.averageEaseFactor?.toFixed(2) || "0.00"}
            </p>
            <p className="text-xs text-muted-foreground">
              Total cards: {stats?.totalCards || 0}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Card */}
      <Card className="max-w-md w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-orange-600" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest flashcards created</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentFlashcards.length > 0 ? (
              recentFlashcards.map((flashcard) => (
                <div
                  key={flashcard.id}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {flashcard.front}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created{" "}
                      {new Date(flashcard.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        Next:{" "}
                        {new Date(flashcard.nextReview).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  No flashcards yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Create your first one!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressSummaryCard;
