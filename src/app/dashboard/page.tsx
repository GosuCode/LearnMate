"use client";

import GlobalLayout from "@/components/layout/GlobalLayout";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import ProgressSummaryCard from "@/components/dashboard/ProgressSummaryCard";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <GlobalLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Hi, {user?.name}
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to crush your goals today? Let&apos;s make this study session
            count!
          </p>
        </div>

        {/* Progress Summary Cards */}
        <ProgressSummaryCard />

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Activity & Daily Tip Row */}
        <RecentActivity />
      </div>
    </GlobalLayout>
  );
}
