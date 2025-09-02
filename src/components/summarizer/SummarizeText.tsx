import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Loader2,
  AlertCircle,
  Sparkles,
  Clock,
  Copy,
  Check,
  BarChart3,
} from "lucide-react";
import { SummarizeTextProps } from "@/types/Summarize";

const SummarizeText = ({
  inputText,
  setInputText,
  wordCount,
  setWordCount,
  handleTextSummarization,
  isProcessing,
  error,
  summary,
  copiedText,
  handleCopyText,
}: SummarizeTextProps) => {
  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-serif">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          Text Summarization
        </CardTitle>
        <CardDescription className="text-base">
          Enter text directly to generate an intelligent summary
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="text" className="text-sm font-medium">
            Input Text
          </Label>
          <Textarea
            id="text"
            placeholder="Paste your text here for summarization..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[150px] resize-none transition-colors focus:ring-2 focus:ring-primary/20"
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{inputText.length.toLocaleString()} characters</span>
            <span>Recommended: 500+ characters for best results</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label
            htmlFor="wordCount"
            className="text-sm font-medium flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Target Word Count
          </Label>
          <Input
            id="wordCount"
            type="number"
            min="50"
            max="500"
            value={wordCount}
            onChange={(e) => setWordCount(Number.parseInt(e.target.value))}
            className="transition-colors focus:ring-2 focus:ring-primary/20"
          />
          <p className="text-xs text-muted-foreground">
            Target words in summary (50-500)
          </p>
        </div>

        <Button
          onClick={handleTextSummarization}
          disabled={!inputText.trim() || isProcessing}
          className="w-full h-12 text-base font-medium shadow-sm hover:shadow-md transition-all"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Generating Summary...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Generate Summary
            </>
          )}
        </Button>

        {error && (
          <div className="flex items-center gap-3 p-4 text-destructive bg-destructive/5 border border-destructive/20 rounded-lg">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {summary && (
          <div className="space-y-4 p-6 border border-primary/20 rounded-xl bg-primary/5">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Generated Summary
              </Label>
              <div className="flex items-center gap-2">
                {summary.processing_time && (
                  <Badge
                    variant="outline"
                    className="bg-background border-primary/30 text-primary flex items-center gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    {summary.processing_time}ms
                  </Badge>
                )}
                <Button
                  onClick={() => handleCopyText(summary.summary, "text")}
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs border-primary/20 hover:bg-primary/5"
                >
                  {copiedText === "text" ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="p-4 bg-background border border-border rounded-lg text-sm leading-relaxed">
              {summary.summary}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummarizeText;
