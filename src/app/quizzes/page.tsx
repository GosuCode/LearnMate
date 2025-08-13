"use client";

import { useState } from "react";
import GlobalLayout from "@/components/layout/GlobalLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Play,
  Brain,
  Clock,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Timer,
  Award,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Label } from "@/components/ui/label";

// Types
interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correct_answer_index: number;
  correct_answer: string;
  explanation: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
  difficulty: string;
  timeSpent: number;
  isCorrect: boolean;
}

interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  totalTime: number;
  averageTime: number;
  score: number;
  weakAreas: string[];
  timePerQuestion: QuizQuestion[];
}

interface Topic {
  id: string;
  name: string;
  description: string;
  questionCount: number;
}

// Mock data for topics (keeping this as it's just for display)
const topics: Topic[] = [
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    description: "Arrays, Linked Lists, Trees, Graphs",
    questionCount: 150,
  },
  {
    id: "oop",
    name: "Object Oriented Programming",
    description: "Classes, Inheritance, Polymorphism",
    questionCount: 120,
  },
  {
    id: "db",
    name: "Database Management",
    description: "SQL, Normalization, ACID",
    questionCount: 80,
  },
  {
    id: "os",
    name: "Operating Systems",
    description: "Processes, Memory, File Systems",
    questionCount: 95,
  },
  {
    id: "cn",
    name: "Computer Networks",
    description: "TCP/IP, Routing, Protocols",
    questionCount: 70,
  },
  {
    id: "web",
    name: "Web Technologies",
    description: "HTML, CSS, JavaScript, React",
    questionCount: 110,
  },
];

const difficulties = ["Easy", "Medium", "Hard"];

export default function QuizzesPage() {
  const [activeMode, setActiveMode] = useState("practice");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [quizState, setQuizState] = useState<"setup" | "quiz" | "results">(
    "setup"
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);

  // New state for MCQ generation
  const [inputText, setInputText] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<QuizQuestion[]>(
    []
  );
  const [error, setError] = useState<string>("");

  const canStartQuiz =
    selectedDifficulty && selectedTopic && generatedQuestions.length > 0;

  // Function to generate MCQs from text
  const generateMCQs = async () => {
    if (!inputText.trim()) return;

    setIsGenerating(true);
    setError(""); // Clear any previous errors
    try {
      const response = await fetch("http://localhost:9000/api/mcq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          num_questions: numQuestions,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate MCQs");
      }

      const data = await response.json();

      // Extract questions from response
      if (!data.questions || data.questions.length === 0) {
        throw new Error(
          "No questions were generated. Please try with different text."
        );
      }

      // Transform MCQ data to QuizQuestion format
      const transformedQuestions: QuizQuestion[] = data.questions.map(
        (mcq: MCQQuestion, index: number) => ({
          id: index + 1,
          question: mcq.question,
          options: mcq.options,
          correctAnswer: mcq.correct_answer_index,
          topic: selectedTopic || "Custom Topic",
          difficulty: selectedDifficulty || "Medium",
          timeSpent: 0,
          isCorrect: false,
        })
      );

      setGeneratedQuestions(transformedQuestions);
    } catch (error) {
      console.error("Error generating MCQs:", error);
      setError("Failed to generate MCQs. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartQuiz = () => {
    setQuizState("quiz");
    setCurrentQuestionIndex(0);
    setQuizStartTime(Date.now());
  };

  const handleAnswerQuestion = (answerIndex: number) => {
    const currentQuestion = generatedQuestions[currentQuestionIndex];
    const timeSpent = Date.now() - quizStartTime;

    // Update question with answer and time
    const updatedQuestion = {
      ...currentQuestion,
      timeSpent: Math.round(timeSpent / 1000), // Convert to seconds
      isCorrect: answerIndex === currentQuestion.correctAnswer,
    };

    // Move to next question or finish quiz
    if (currentQuestionIndex < generatedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuizStartTime(Date.now()); // Reset timer for next question
    } else {
      // Quiz finished - calculate results
      const allQuestions = [
        ...generatedQuestions.slice(0, currentQuestionIndex),
        updatedQuestion,
      ];
      const correctAnswers = allQuestions.filter((q) => q.isCorrect).length;
      const totalTime = allQuestions.reduce((sum, q) => sum + q.timeSpent, 0);

      const result: QuizResult = {
        totalQuestions: allQuestions.length,
        correctAnswers,
        totalTime,
        averageTime: Math.round(totalTime / allQuestions.length),
        score: Math.round((correctAnswers / allQuestions.length) * 100),
        weakAreas: allQuestions
          .filter((q) => !q.isCorrect)
          .map((q) => q.topic)
          .filter((topic, index, arr) => arr.indexOf(topic) === index), // Remove duplicates
        timePerQuestion: allQuestions,
      };

      setQuizResults(result);
      setQuizState("results");
    }
  };

  const handleRetakeQuiz = () => {
    setQuizState("setup");
    setSelectedDifficulty("");
    setSelectedTopic("");
    setCurrentQuestionIndex(0);
    setQuizResults(null);
    setGeneratedQuestions([]);
    setInputText("");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (quizState === "quiz") {
    const currentQuestion = generatedQuestions[currentQuestionIndex];

    return (
      <GlobalLayout>
        <div className="space-y-6">
          {/* Quiz Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Quiz in Progress
              </h1>
              <p className="text-muted-foreground">
                Question {currentQuestionIndex + 1} of{" "}
                {generatedQuestions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className={getDifficultyColor(currentQuestion.difficulty)}
              >
                {currentQuestion.difficulty}
              </Badge>
              <Badge variant="outline">{currentQuestion.topic}</Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>
                {Math.round(
                  ((currentQuestionIndex + 1) / generatedQuestions.length) * 100
                )}
                %
              </span>
            </div>
            <Progress
              value={
                ((currentQuestionIndex + 1) / generatedQuestions.length) * 100
              }
            />
          </div>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto p-4 text-left"
                    onClick={() => handleAnswerQuestion(index)}
                  >
                    <span className="mr-3 font-medium text-primary">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </GlobalLayout>
    );
  }

  if (quizState === "results" && quizResults) {
    return (
      <GlobalLayout>
        <div className="space-y-6">
          {/* Results Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Quiz Results</h1>
            <p className="text-muted-foreground">
              {selectedTopic} • {selectedDifficulty} •{" "}
              {quizResults.totalQuestions} questions
            </p>
          </div>

          {/* Score Overview */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Final Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-6xl font-bold text-primary">
                {quizResults.score}%
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>
                  {quizResults.correctAnswers} correct out of{" "}
                  {quizResults.totalQuestions}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <span>
                  Average time: {quizResults.averageTime}s per question
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weak Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Areas for Improvement
                </CardTitle>
                <CardDescription>
                  Topics where you scored below 70%
                </CardDescription>
              </CardHeader>
              <CardContent>
                {quizResults.weakAreas.length > 0 ? (
                  <div className="space-y-2">
                    {quizResults.weakAreas.map((area, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span>{area}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Award className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p>Great job! No weak areas detected.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Time Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-blue-500" />
                  Time Analysis
                </CardTitle>
                <CardDescription>Time spent on each question</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quizResults.timePerQuestion.map((question, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-muted-foreground">
                        Q{index + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {question.timeSpent}s
                        </span>
                        {question.isCorrect ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                Performance by Topic
              </CardTitle>
              <CardDescription>
                Your score breakdown across different topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        topic: selectedTopic,
                        score: quizResults.score,
                        questions: quizResults.totalQuestions,
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="topic" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#2f27ce" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button onClick={handleRetakeQuiz} variant="outline">
              <Brain className="h-4 w-4 mr-2" />
              Take Another Quiz
            </Button>
            <Button>
              <TrendingUp className="h-4 w-4 mr-2" />
              View Detailed Report
            </Button>
          </div>
        </div>
      </GlobalLayout>
    );
  }

  // Quiz Setup View
  return (
    <GlobalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Quizzes & Assessments
          </h1>
          <p className="text-muted-foreground">
            Test your knowledge and track your progress
          </p>
        </div>

        {/* Mode Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Select Quiz Mode</CardTitle>
            <CardDescription className="text-center">
              Choose how you want to practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeMode}
              onValueChange={setActiveMode}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="practice"
                  className="flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" />
                  Practice Mode
                </TabsTrigger>
                <TabsTrigger value="exam" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Exam Simulation
                </TabsTrigger>
              </TabsList>

              <TabsContent value="practice" className="space-y-4 mt-6">
                <div className="text-center space-y-2">
                  <Brain className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-lg font-semibold">Practice Mode</h3>
                  <p className="text-muted-foreground">
                    Learn at your own pace with instant feedback and
                    explanations
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="exam" className="space-y-4 mt-6">
                <div className="text-center space-y-2">
                  <Target className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-lg font-semibold">Exam Simulation</h3>
                  <p className="text-muted-foreground">
                    Simulate real exam conditions with timed questions and no
                    hints
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* MCQ Generation */}
        <Card>
          <CardHeader>
            <CardTitle>Generate MCQs from Text</CardTitle>
            <CardDescription>
              Input your study material to generate custom quiz questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="text">Study Material</Label>
                <Textarea
                  id="text"
                  placeholder="Paste your notes, textbook content, or any study material here..."
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    setError(""); // Clear error when user types
                  }}
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Difficulty Selector */}
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={selectedDifficulty}
                    onValueChange={setSelectedDifficulty}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                difficulty === "Easy"
                                  ? "bg-green-500"
                                  : difficulty === "Medium"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            />
                            {difficulty}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Topic Selector */}
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Select
                    value={selectedTopic}
                    onValueChange={setSelectedTopic}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          <div className="space-y-1">
                            <div className="font-medium">{topic.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {topic.questionCount} questions available
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numQuestions">Number of Questions</Label>
                <Select
                  value={numQuestions.toString()}
                  onValueChange={(value) => setNumQuestions(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 5, 10, 15, 20].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} questions
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Generate MCQs Button */}
              <div className="text-center pt-4">
                <Button
                  size="lg"
                  onClick={generateMCQs}
                  disabled={!inputText.trim() || isGenerating}
                  className="px-8 py-6 text-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                      Generating MCQs...
                    </>
                  ) : (
                    <>
                      <Brain className="h-6 w-6 mr-3" />
                      Generate MCQs
                    </>
                  )}
                </Button>
                {!inputText.trim() && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Please enter some text to generate MCQs
                  </p>
                )}
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Configuration */}
        {generatedQuestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Quiz Ready!</CardTitle>
              <CardDescription>
                {generatedQuestions.length} questions generated from your text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center pt-4">
                <Button
                  size="lg"
                  onClick={handleStartQuiz}
                  disabled={!canStartQuiz}
                  className="px-8 py-6 text-lg"
                >
                  <Play className="h-6 w-6 mr-3" />
                  Start Quiz
                </Button>
                {!canStartQuiz && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Please select both difficulty and topic to start
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Topics */}
        <Card>
          <CardHeader>
            <CardTitle>Available Topics</CardTitle>
            <CardDescription>
              Browse all available quiz topics and their question counts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{topic.name}</h4>
                    <Badge variant="secondary">{topic.questionCount}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {topic.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </GlobalLayout>
  );
}
