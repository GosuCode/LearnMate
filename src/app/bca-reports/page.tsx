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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Search,
  FileText,
  Calendar,
  Trash2,
  Copy,
  Check,
  Settings,
  Download,
  Eye,
} from "lucide-react";
import { saveAs } from "file-saver";
import { bcaReportApi, apiService } from "@/lib";
import { BCAReport } from "@/types/bcaReport";
import { useRouter } from "next/navigation";

export default function BCAReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<BCAReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedText, setCopiedText] = useState<string>("");
  const [showGenerator, setShowGenerator] = useState(false);

  // Generator form state
  const [formData, setFormData] = useState({
    title: "",
    reportType: "main_report" as
      | "project_proposal"
      | "main_report"
      | "minor_project",
    additionalInstructions: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<{
    currentSection: number;
    totalSections: number;
    sectionName: string;
    message: string;
  } | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await bcaReportApi.getReports();
      setReports(data.reports || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(
        `Failed to load reports: ${
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
    fetchReports();
  }, [router]);

  const handleGenerate = async () => {
    if (!formData.title.trim()) {
      setError("Please enter a report title");
      return;
    }

    try {
      setIsGenerating(true);
      setError("");
      setGenerationProgress(null);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (!prev) {
            const sections =
              formData.reportType === "main_report"
                ? 8
                : formData.reportType === "project_proposal"
                ? 7
                : 7;
            return {
              currentSection: 1,
              totalSections: sections,
              sectionName: "Starting generation...",
              message: "Initializing report generation...",
            };
          }

          const nextSection = prev.currentSection + 1;
          if (nextSection <= prev.totalSections) {
            const sectionNames =
              formData.reportType === "main_report"
                ? [
                    "Abstract",
                    "Acknowledgement",
                    "Introduction",
                    "Background Study",
                    "System Analysis",
                    "Implementation",
                    "Conclusion",
                    "References",
                  ]
                : formData.reportType === "project_proposal"
                ? [
                    "Introduction",
                    "Problem Statement",
                    "Objectives",
                    "Methodology",
                    "Gantt Chart",
                    "Expected Outcome",
                    "References",
                  ]
                : [
                    "Introduction",
                    "Literature Review",
                    "System Analysis",
                    "Implementation",
                    "Testing",
                    "Conclusion",
                    "References",
                  ];

            return {
              currentSection: nextSection,
              totalSections: prev.totalSections,
              sectionName: sectionNames[nextSection - 1] || "Processing...",
              message: `Generating ${
                sectionNames[nextSection - 1] || "section"
              }...`,
            };
          }
          return prev;
        });
      }, 2000);

      const newReport = await bcaReportApi.generateReport(formData);

      clearInterval(progressInterval);
      setReports([newReport, ...reports]);
      setShowGenerator(false);
      setFormData({
        title: "",
        reportType: "main_report",
        additionalInstructions: "",
      });
    } catch (err) {
      console.error("Error generating report:", err);
      setError(
        `Failed to generate report: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsGenerating(false);
      setGenerationProgress(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      await bcaReportApi.deleteReport(id);
      setReports(reports.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error deleting report:", err);
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

  const handleDownload = async (report: BCAReport) => {
    try {
      const blob = await bcaReportApi.downloadReport(report.id);
      const filename = `${report.title.replace(/[^a-zA-Z0-9]/g, "_")}.docx`;
      saveAs(blob, filename);
    } catch (error) {
      console.error("Failed to download report:", error);
      setError(
        `Failed to download report: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const filteredReports = (reports || []).filter(
    (report) =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <GlobalLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your reports...</p>
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
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
              BCA Reports
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Generate and manage AI-powered BCA reports with custom formatting
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {filteredReports.length}{" "}
                  {filteredReports.length === 1 ? "report" : "reports"}
                </span>
              </div>
              <Button
                onClick={() => setShowGenerator(!showGenerator)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                {showGenerator ? "Hide Generator" : "Generate Report"}
              </Button>
            </div>
          </div>

          {/* Generator Form */}
          {showGenerator && (
            <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200">
                  Generate BCA Report
                </CardTitle>
                <CardDescription>
                  Create a comprehensive BCA report with AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Report Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter report title..."
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reportType">Report Type</Label>
                    <Select
                      value={formData.reportType}
                      onValueChange={(
                        value:
                          | "project_proposal"
                          | "main_report"
                          | "minor_project"
                      ) => setFormData({ ...formData, reportType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="project_proposal">
                          Project Proposal
                        </SelectItem>
                        <SelectItem value="main_report">Main Report</SelectItem>
                        <SelectItem value="minor_project">
                          Minor Project
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">
                    Additional Instructions (Optional)
                  </Label>
                  <Textarea
                    id="instructions"
                    placeholder="Any specific requirements or instructions..."
                    value={formData.additionalInstructions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        additionalInstructions: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>

                {/* Progress Indicator */}
                {isGenerating && generationProgress && (
                  <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        {generationProgress.message}
                      </span>
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        {generationProgress.currentSection} of{" "}
                        {generationProgress.totalSections}
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (generationProgress.currentSection /
                              generationProgress.totalSections) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Currently generating: {generationProgress.sectionName}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowGenerator(false)}
                    disabled={isGenerating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={!formData.title.trim() || isGenerating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 text-destructive bg-destructive/5 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Reports List */}
          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm ? "No reports found" : "No reports yet"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Generate your first BCA report to get started"}
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredReports.map((report) => (
                <Card key={report.id} className="shadow-sm border-border/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl font-serif line-clamp-2">
                          {report.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {report.reportType}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            BCA Report
                          </Badge>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleDownload(report)}
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs text-blue-600 hover:text-blue-700"
                          title="Download as DOCX"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button
                          onClick={() =>
                            handleCopyText(report.content, report.id)
                          }
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs"
                          title="Copy report"
                        >
                          {copiedText === report.id ? (
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
                          onClick={() => handleDelete(report.id)}
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs text-destructive hover:text-destructive"
                          title="Delete report"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Report Preview */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Report Preview
                        </h4>
                        <div className="p-3 bg-muted/30 border border-border/50 rounded-lg">
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {report.content.substring(0, 200)}...
                          </p>
                        </div>
                      </div>

                      {/* Report Info */}
                      <div className="p-3 bg-muted/20 border border-border/30 rounded-lg">
                        <h4 className="text-xs font-medium text-muted-foreground mb-2">
                          Report Information
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div>Type: {report.reportType.replace("_", " ")}</div>
                          <div>Format: DOCX</div>
                          <div>Font: {report.requirements.fontFamily}</div>
                          <div>Size: {report.requirements.fontSize}pt</div>
                        </div>
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
