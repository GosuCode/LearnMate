import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { FileText, TrendingUp, Upload } from "lucide-react";
import Link from "next/link";

const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Get started with your studies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/summarizer" className="flex-1">
            <Button className="w-full h-12 cursor-pointer" size="lg">
              <Upload className="mr-2 h-5 w-5" />
              Summarize Notes
            </Button>
          </Link>
          <Link href="/quizzes" className="flex-1">
            <Button
              className="w-full h-12 cursor-pointer"
              variant="outline"
              size="lg"
            >
              <FileText className="mr-2 h-5 w-5" />
              Start Quiz
            </Button>
          </Link>
          <Link href="/flashcards" className="flex-1">
            <Button
              className="w-full h-12 cursor-pointer"
              variant="outline"
              size="lg"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Flashcards
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
