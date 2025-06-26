import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navigation } from "@/components/ui/navigation";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Study Smarter, Not Harder with{" "}
            <span className="text-blue-600">LearnMate</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your academic content into digestible summaries,
            interactive quizzes, and organized learning materials powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/auth/register">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Powerful Features for Better Learning
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">📝</span>
                  </div>
                  Smart Summarization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Convert long academic texts into concise, easy-to-understand
                  summaries with key points and important concepts highlighted.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold">❓</span>
                  </div>
                  Quiz Generation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Generate interactive quizzes from your content to test
                  understanding and reinforce learning with multiple choice and
                  short answer questions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold">🏷️</span>
                  </div>
                  Smart Categorization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Automatically organize your learning materials by topic and
                  subject for easy retrieval and better study organization.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of students who are already studying smarter with
            LearnMate.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/auth/register">Start Learning Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
