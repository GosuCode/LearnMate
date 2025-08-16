import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, TrendingUp, Calendar, Target, Clock } from "lucide-react";

const ProgressSummaryCard = ({
  progressData,
}: {
  progressData: {
    syllabusCompleted: number;
    quizzesTaken: number;
    upcomingDeadlines: { title: string; date: string; type: string }[];
  };
}) => {
  return (
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
            <Progress value={progressData.syllabusCompleted} className="h-2" />
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
            <p className="text-sm text-muted-foreground">Average score: 87%</p>
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
  );
};

export default ProgressSummaryCard;
