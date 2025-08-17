import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Brain, BookOpen, Target, Sparkles, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { FlashcardFormProps } from "@/types/flashcard";

const FlashcardForm = ({
  inputText,
  setInputText,
  totalQuestions,
  setTotalQuestions,
  generateFlashcards,
  isGenerating,
  error,
  setError,
}: FlashcardFormProps) => {
  return (
    <Card className="border-2 border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center">
            <Brain className="h-6 w-6 text-accent-foreground" />
          </div>
          Generate Flashcards
        </CardTitle>
        <CardDescription className="text-base">
          Input your study material and let AI create personalized flashcards
          for effective learning
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label
              htmlFor="text"
              className="text-base font-semibold flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Study Material
            </Label>
            <Textarea
              id="text"
              placeholder="Paste your notes, textbook content, lecture transcripts, or any study material here. The more detailed your content, the better the flashcards will be..."
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setError("");
              }}
              className="min-h-[160px] text-base border-2 focus:border-accent/50 transition-colors"
            />
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="totalQuestions"
              className="text-base font-semibold flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              Total Questions
            </Label>
            <select
              id="totalQuestions"
              value={totalQuestions}
              onChange={(e) =>
                setTotalQuestions(Number.parseInt(e.target.value))
              }
              className="w-full p-3 border-2 rounded-lg bg-background border-border focus:border-accent/50 transition-colors text-base"
            >
              {[2, 3].map((num) => (
                <option key={num} value={num}>
                  {num} questions
                </option>
              ))}
            </select>
          </div>

          <div className="text-center pt-6">
            <Button
              size="lg"
              onClick={generateFlashcards}
              disabled={!inputText.trim() || isGenerating}
              className="px-12 py-4 text-lg bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent disabled:opacity-50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                  Generating Flashcards...
                </>
              ) : (
                <>
                  <Sparkles className="h-6 w-6 mr-3" />
                  Generate Flashcards
                </>
              )}
            </Button>
            {!inputText.trim() && (
              <p className="text-sm text-muted-foreground mt-3">
                Please enter some text to generate flashcards
              </p>
            )}
            {error && <p className="text-sm text-destructive mt-3">{error}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlashcardForm;
