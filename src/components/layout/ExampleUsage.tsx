import GlobalLayout from "./GlobalLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Example Dashboard Page
export function DashboardPage() {
  return (
    <GlobalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your studies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Subjects</CardTitle>
              <CardDescription>Subjects you've been studying</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Computer Fundamentals, C Programming, Data Structures
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quiz Progress</CardTitle>
              <CardDescription>Your recent quiz performance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                85% average score across 12 quizzes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Study Time</CardTitle>
              <CardDescription>Time spent studying this week</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                12 hours 30 minutes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </GlobalLayout>
  );
}

// Example Subjects Page
export function SubjectsPage() {
  return (
    <GlobalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Subjects & Materials
          </h1>
          <p className="text-muted-foreground">
            Browse and manage your academic subjects and study materials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "Computer Fundamentals",
            "C Programming",
            "Data Structures",
            "OOP in Java",
            "Web Technology",
          ].map((subject) => (
            <Card
              key={subject}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-lg">{subject}</CardTitle>
                <CardDescription>BCA Semester Course</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Click to view materials, notes, and resources
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </GlobalLayout>
  );
}

// Example Quizzes Page
export function QuizzesPage() {
  return (
    <GlobalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quizzes</h1>
          <p className="text-muted-foreground">
            Test your knowledge with AI-generated quizzes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "Computer Fundamentals Quiz",
            "C Programming Basics",
            "Data Structures Test",
            "Java OOP Quiz",
          ].map((quiz) => (
            <Card
              key={quiz}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-lg">{quiz}</CardTitle>
                <CardDescription>20 questions • 30 minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Click to start the quiz
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </GlobalLayout>
  );
}

// Example Summarizer Page
export function SummarizerPage() {
  return (
    <GlobalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Summarizer</h1>
          <p className="text-muted-foreground">
            Upload documents or paste text to get AI-generated summaries.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New Summary</CardTitle>
            <CardDescription>
              Upload a document or paste text content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                Drag and drop files here or click to browse
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Or paste text directly:
              </label>
              <textarea
                className="w-full h-32 p-3 border border-border rounded-md resize-none"
                placeholder="Paste your text content here..."
              />
            </div>
            <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90">
              Generate Summary
            </button>
          </CardContent>
        </Card>
      </div>
    </GlobalLayout>
  );
}
