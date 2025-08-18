import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { BookOpen, CheckCircle, Lightbulb, Upload } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Target } from "lucide-react";

const RecentActivity = () => {
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
  ];

  const dailyTip = {
    title: "Today's Study Tip",
    content:
      "Use the Pomodoro Technique: 25 minutes of focused study followed by a 5-minute break. This helps maintain concentration and prevents mental fatigue.",
    author: "Study Psychology Research",
  };
  return (
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
  );
};

export default RecentActivity;
