"use client";

import GlobalLayout from "@/components/layout/GlobalLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  FileText,
  TrendingUp,
  Calendar,
  BookOpen,
  Target,
  Lightbulb,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  // Mock data
  const progressData = {
    syllabusCompleted: 68,
    quizzesTaken: 24,
    upcomingDeadlines: [
      {
        title: "Data Structures Assignment",
        date: "Dec 15, 2024",
        type: "Assignment",
      },
      { title: "Java OOP Quiz", date: "Dec 18, 2024", type: "Quiz" },
    ],
  };

  const recentActivity = [
    {
      action: "Opened",
      item: "Data Structures.pdf",
      time: "2 hours ago",
      icon: BookOpen,
    },
    {
      action: "Completed",
      item: "JavaScript Quiz",
      time: "4 hours ago",
      icon: CheckCircle,
    },
    {
      action: "Uploaded",
      item: "Web Technology Notes",
      time: "1 day ago",
      icon: Upload,
    },
    {
      action: "Started",
      item: "Database Design Course",
      time: "2 days ago",
      icon: Target,
    },
    {
      action: "Reviewed",
      item: "Python Basics",
      time: "3 days ago",
      icon: FileText,
    },
  ];

  const dailyTip = {
    title: "Today's Study Tip",
    content:
      "Use the Pomodoro Technique: 25 minutes of focused study followed by a 5-minute break. This helps maintain concentration and prevents mental fatigue.",
    author: "Study Psychology Research",
  };

  return (
    <GlobalLayout>
      <div className="space-y-6"></div>
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, Al</h1>
        <p className="text-muted-foreground text-lg">
          Ready to crush your goals today? Let&apos;s make this study session
          count! 🚀
        </p>
      </div>

      {/* Progress Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Syllabus Progress Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Syllabus Progress
            </CardTitle>
            <CardDescription>Overall completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-foreground">
                  {progressData.syllabusCompleted}%
                </span>
                <span className="text-sm text-muted-foreground">Complete</span>
              </div>
              <Progress
                value={progressData.syllabusCompleted}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {100 - progressData.syllabusCompleted}% remaining
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quizzes Taken Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Quizzes Taken
            </CardTitle>
            <CardDescription>Total assessments completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-foreground">
                  {progressData.quizzesTaken}
                </span>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground">
                Average score: 87%
              </p>
              <p className="text-xs text-muted-foreground">
                Last quiz: 2 days ago
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>Next important dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {progressData.upcomingDeadlines.map((deadline, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {deadline.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {deadline.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {deadline.date}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Due soon</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with your studies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1 h-12" size="lg">
              <Upload className="mr-2 h-5 w-5" />
              Upload Notes
            </Button>
            <Button className="flex-1 h-12" variant="outline" size="lg">
              <FileText className="mr-2 h-5 w-5" />
              Start Quiz
            </Button>
            <Button className="flex-1 h-12" variant="outline" size="lg">
              <TrendingUp className="mr-2 h-5 w-5" />
              View Recommended Topics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Daily Tip Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest study actions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-md transition-colors"
                      >
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            <span className="text-muted-foreground">
                              {activity.action}:
                            </span>{" "}
                            {activity.item}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Daily Tip */}
        <div className="lg:col-span-1">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                {dailyTip.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-blue-800 leading-relaxed">
                {dailyTip.content}
              </p>
              <div className="pt-2 border-t border-blue-200">
                <p className="text-xs text-blue-700 font-medium">
                  — {dailyTip.author}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </GlobalLayout>
  );
}
