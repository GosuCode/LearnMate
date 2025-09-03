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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Search,
  FileText,
  Calendar,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { summarizerApi, apiService } from "@/lib";
import { SavedSummary } from "@/types/Summarize";
import { useRouter } from "next/navigation";

export default function MySummariesPage() {
  const router = useRouter();
  const [summaries, setSummaries] = useState<SavedSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedText, setCopiedText] = useState<string>("");

  const fetchSummaries = async () => {
    try {
      setLoading(true);
      console.log("Fetching summaries...");
      console.log("Auth token:", apiService.getToken());
      console.log("Is authenticated:", apiService.isAuthenticated());
      const data = await summarizerApi.getSummaries();
      console.log("Summaries data:", data);
      setSummaries(data.summaries);
    } catch (err) {
      console.error("Error fetching summaries:", err);
      setError(
        `Failed to load summaries: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    if (!apiService.isAuthenticated()) {
      router.push("/auth/login");
      return;
    }
    fetchSummaries();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this summary?")) return;

    try {
      await summarizerApi.deleteSummary(id);
      setSummaries(summaries.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting summary:", err);
    }
  };

  const handleCopyText = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(""), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const filteredSummaries = summaries.filter(
    (summary) =>
      summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summary.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <GlobalLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your summaries...</p>
            </div>
          </div>
        </div>
      </GlobalLayout>
    );
  }

  return (
    <GlobalLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-serif font-bold text-foreground tracking-tight">
              My Summaries
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              View and manage all your saved summaries
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search summaries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 text-destructive bg-destructive/5 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Summaries List */}
          {filteredSummaries.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm ? "No summaries found" : "No summaries yet"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Generate some summaries to see them here"}
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredSummaries.map((summary) => (
                <Card key={summary.id} className="shadow-sm border-border/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl font-serif line-clamp-2">
                          {summary.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(summary.createdAt).toLocaleDateString()}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {summary.wordCount} words
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {summary.processingMethod}
                          </Badge>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() =>
                            handleCopyText(summary.summary, summary.id)
                          }
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs"
                        >
                          {copiedText === summary.id ? (
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
                        <Button
                          onClick={() => handleDelete(summary.id)}
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-4 bg-muted/30 border border-border/50 rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                          Summary
                        </h4>
                        <p className="text-sm leading-relaxed line-clamp-4">
                          {summary.summary}
                        </p>
                      </div>
                      <div className="p-3 bg-muted/20 border border-border/30 rounded-lg">
                        <h4 className="text-xs font-medium text-muted-foreground mb-1">
                          Original Text
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {summary.originalText}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </GlobalLayout>
  );
}
