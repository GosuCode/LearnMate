"use client";

import { useState, useEffect } from "react";
import GlobalLayout from "@/components/layout/GlobalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      const data = await summarizerApi.getSummaries();
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                My Summaries
              </h1>
            </div>

            {/* Search and Stats */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search summaries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {filteredSummaries.length}{" "}
                    {filteredSummaries.length === 1 ? "summary" : "summaries"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-4 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
                  Error Loading Summaries
                </h3>
                <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Summaries List */}
          {filteredSummaries.length === 0 ? (
            <div className="text-center py-20 mt-10">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl mb-6">
                <FileText className="h-12 w-12 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                {searchTerm ? "No summaries found" : "No summaries yet"}
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                {searchTerm
                  ? "Try adjusting your search terms or create a new summary"
                  : "Start by generating your first summary to build your knowledge library"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => router.push("/summarizer")}
                  className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-medium"
                >
                  Create First Summary
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSummaries.map((summary) => (
                <Card
                  key={summary.id}
                  className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {summary.title}
                        </CardTitle>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                            <Calendar className="h-4 w-4" />
                            {new Date(summary.createdAt).toLocaleDateString()}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0"
                          >
                            {summary.wordCount} words
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 ml-4">
                        <Button
                          onClick={() =>
                            handleCopyText(summary.summary, summary.id)
                          }
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Copy summary"
                        >
                          {copiedText === summary.id ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4 text-slate-500" />
                          )}
                        </Button>
                        <Button
                          onClick={() => handleDelete(summary.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Delete summary"
                        >
                          <Trash2 className="h-4 w-4 text-slate-500 hover:text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/30 rounded-xl">
                        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Summary
                        </h4>
                        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 line-clamp-4">
                          {summary.summary}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg">
                        <h4 className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                          Original Text
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
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
