"use client";

import GlobalLayout from "@/components/layout/GlobalLayout";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import ProgressSummaryCard from "@/components/dashboard/ProgressSummaryCard";

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

  return (
    <GlobalLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, Al
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to crush your goals today? Let&apos;s make this study session
            count! 🚀
          </p>
        </div>

        {/* Progress Summary Cards */}
        <ProgressSummaryCard progressData={progressData} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Activity & Daily Tip Row */}
        <RecentActivity />
      </div>
    </GlobalLayout>
  );
}
