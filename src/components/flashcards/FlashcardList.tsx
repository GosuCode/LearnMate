import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, BookOpen, Trash2 } from "lucide-react";
import { FlashcardListProps } from "@/types/flashcard";
import { useAuthStore } from "@/store";
import { flashcardApi } from "@/lib";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const FlashcardList = ({
  userFlashcards,
  isLoadingUserFlashcards,
  currentPage,
  setCurrentPage,
  totalPages,
  fetchUserFlashcards,
  currentFlashcards,
  onStartStudy,
}: FlashcardListProps) => {
  const { user } = useAuthStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteFlashcard = async (id: string) => {
    try {
      await flashcardApi.deleteFlashcard(id);
      toast({
        title: "Flashcard deleted",
        description: "The flashcard has been removed from your library.",
      });
      fetchUserFlashcards();
    } catch {
      toast({
        title: "Delete failed",
        description: "Could not delete the flashcard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {/* Delete Confirmation Dialog */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="text-red-600">Delete Flashcard</CardTitle>
              <CardDescription>
                Are you sure you want to delete this flashcard? This action
                cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 justify-end">
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  onClick={() => setDeletingId(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="cursor-pointer bg-red-500 text-white hover:bg-red-600"
                  variant="destructive"
                  onClick={() => handleDeleteFlashcard(deletingId)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {userFlashcards.length > 0 ? (
        <Card className="border-2 border-blue-500/20 shadow-xl bg-gradient-to-br from-card to-blue-500/5 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl text-blue-600">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              Your Flashcard Library
            </CardTitle>
            <CardDescription className="text-base">
              {userFlashcards.length} previously generated flashcards with
              spaced repetition data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {currentFlashcards.map((flashcard) => (
                <Card
                  onClick={() => onStartStudy(flashcard.id)}
                  key={flashcard.id}
                  className="cursor-pointer border border-blue-200/50 hover:border-blue-300/70 transition-all duration-200 hover:shadow-md"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(flashcard.nextReview).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium text-green-600">
                            {flashcard.easeFactor.toFixed(2)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingId(flashcard.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm line-clamp-6">{flashcard.front}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Repetitions: {flashcard.repetition}</span>
                      <span>Interval: {flashcard.interval} days</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center pt-4 space-y-4">
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3"
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3"
                  >
                    Next
                  </Button>
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} • Showing{" "}
                {currentFlashcards.length} of {userFlashcards.length} cards
              </div>

              <Button
                variant="outline"
                onClick={fetchUserFlashcards}
                disabled={isLoadingUserFlashcards}
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                {isLoadingUserFlashcards ? "Refreshing..." : "Refresh Library"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : !isLoadingUserFlashcards && user?.id ? (
        <Card className="border-2 border-blue-500/20 shadow-xl bg-gradient-to-br from-card to-blue-500/5 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl text-blue-600">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              Start Building Your Flashcard Library
            </CardTitle>
            <CardDescription className="text-base">
              Generate your first set of flashcards to start learning with
              spaced repetition
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Your generated flashcards will be automatically saved and tracked
              with the SM2 algorithm for optimal learning.
            </p>
            <Button
              variant="outline"
              onClick={fetchUserFlashcards}
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              Check for Flashcards
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
};

export default FlashcardList;
