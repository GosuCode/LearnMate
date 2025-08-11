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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Search,
  BookOpen,
  FileText,
  Play,
  Brain,
  GraduationCap,
  Download,
  Eye,
  Filter,
  Clock,
} from "lucide-react";

// Types
interface Subject {
  id: number;
  name: string;
  code: string;
  semester: string;
  completion: number;
  icon: React.ComponentType<{ className?: string }>;
}

// Mock data
const subjects: Subject[] = [
  {
    id: 1,
    name: "Data Structures & Algorithms",
    code: "DSA",
    semester: "3rd SEM",
    completion: 75,
    icon: BookOpen,
  },
  {
    id: 2,
    name: "Object Oriented Programming",
    code: "OOP",
    semester: "3rd SEM",
    completion: 60,
    icon: FileText,
  },
  {
    id: 3,
    name: "Computer Fundamentals",
    code: "CF",
    semester: "1st SEM",
    completion: 90,
    icon: BookOpen,
  },
  {
    id: 4,
    name: "C Programming",
    code: "CP",
    semester: "2nd SEM",
    completion: 85,
    icon: FileText,
  },
  {
    id: 5,
    name: "Web Technology",
    code: "WT",
    semester: "3rd SEM",
    completion: 45,
    icon: BookOpen,
  },
  {
    id: 6,
    name: "Database Management",
    code: "DB",
    semester: "4th SEM",
    completion: 30,
    icon: FileText,
  },
  {
    id: 7,
    name: "Operating Systems",
    code: "OS",
    semester: "4th SEM",
    completion: 20,
    icon: BookOpen,
  },
  {
    id: 8,
    name: "Computer Networks",
    code: "CN",
    semester: "5th SEM",
    completion: 15,
    icon: FileText,
  },
];

const subjectDetails = {
  notes: [
    { name: "Introduction to DSA.pdf", size: "2.4 MB", type: "PDF" },
    { name: "Arrays and Linked Lists.pdf", size: "1.8 MB", type: "PDF" },
    { name: "Stacks and Queues.pdf", size: "3.1 MB", type: "PDF" },
    { name: "Trees and Graphs.pdf", size: "4.2 MB", type: "PDF" },
  ],
  videos: [
    {
      title: "Introduction to Data Structures",
      duration: "15:30",
      thumbnail: "📊",
    },
    { title: "Array Implementation", duration: "22:15", thumbnail: "🔢" },
    { title: "Linked List Operations", duration: "28:45", thumbnail: "🔗" },
    { title: "Tree Traversal Methods", duration: "35:20", thumbnail: "🌳" },
  ],
  summaries: [
    {
      title: "Arrays Summary",
      content:
        "Arrays are linear data structures that store elements in contiguous memory locations...",
      date: "2 days ago",
    },
    {
      title: "Linked Lists Summary",
      content:
        "Linked lists are linear data structures where elements are stored in nodes...",
      date: "1 week ago",
    },
    {
      title: "Trees Summary",
      content:
        "Trees are hierarchical data structures with a root node and child nodes...",
      date: "2 weeks ago",
    },
  ],
  pastQuestions: [
    {
      question: "Explain the difference between arrays and linked lists",
      year: 2023,
      difficulty: "Medium",
      topic: "Arrays vs Linked Lists",
    },
    {
      question: "Write an algorithm for binary search",
      year: 2022,
      difficulty: "Easy",
      topic: "Searching Algorithms",
    },
    {
      question: "Implement a stack using arrays",
      year: 2023,
      difficulty: "Hard",
      topic: "Stacks",
    },
    {
      question: "What is the time complexity of quicksort?",
      year: 2022,
      difficulty: "Medium",
      topic: "Sorting Algorithms",
    },
  ],
};

const semesters = [
  "All Semesters",
  "1st SEM",
  "2nd SEM",
  "3rd SEM",
  "4th SEM",
  "5th SEM",
  "6th SEM",
  "7th SEM",
  "8th SEM",
];
const years = ["All Years", "2024", "2023", "2022", "2021", "2020"];
const difficulties = ["All Difficulties", "Easy", "Medium", "Hard"];

export default function SubjectsMaterialsPage() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("All Semesters");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState("All Difficulties");

  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester =
      selectedSemester === "All Semesters" ||
      subject.semester === selectedSemester;
    return matchesSearch && matchesSemester;
  });

  const filteredQuestions = subjectDetails.pastQuestions.filter((question) => {
    const matchesYear =
      selectedYear === "All Years" || question.year.toString() === selectedYear;
    const matchesDifficulty =
      selectedDifficulty === "All Difficulties" ||
      question.difficulty === selectedDifficulty;
    return matchesYear && matchesDifficulty;
  });

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject);
  };

  const handleBackClick = () => {
    setSelectedSubject(null);
  };

  // Circular Progress Component
  const CircularProgress = ({ percentage, size = 60 }: { percentage: number; size?: number }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-muted"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-primary"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-foreground">
            {percentage}%
          </span>
        </div>
      </div>
    );
  };

  if (selectedSubject) {
    return (
      <GlobalLayout>
        <div className="space-y-6">
          {/* Back Button and Subject Title */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleBackClick}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Subjects
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {selectedSubject.name}
              </h1>
              <p className="text-muted-foreground">
                {selectedSubject.semester} • {selectedSubject.code}
              </p>
            </div>
          </div>

          {/* Subject Tabs */}
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="notes">Notes & PDFs</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="summaries">Summaries</TabsTrigger>
              <TabsTrigger value="questions">Past Questions</TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="space-y-4">
              <div className="grid gap-4">
                {subjectDetails.notes.map((note, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-medium">{note.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {note.size} • {note.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="videos" className="space-y-4">
              <div className="grid gap-4">
                {subjectDetails.videos.map((video, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-16 bg-muted rounded-lg flex items-center justify-center text-2xl">
                          {video.thumbnail}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{video.title}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {video.duration}
                          </p>
                        </div>
                        <Button>
                          <Play className="h-4 w-4 mr-2" />
                          Play
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="summaries" className="space-y-4">
              <div className="grid gap-4">
                {subjectDetails.summaries.map((summary, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{summary.title}</CardTitle>
                      <CardDescription>{summary.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{summary.content}</p>
                      <Button variant="outline" className="mt-3">
                        <Brain className="h-4 w-4 mr-2" />
                        Read Full Summary
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="questions" className="space-y-4">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                      value={selectedYear}
                      onValueChange={setSelectedYear}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedDifficulty}
                      onValueChange={setSelectedDifficulty}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map((difficulty) => (
                          <SelectItem key={difficulty} value={difficulty}>
                            {difficulty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedYear("All Years");
                        setSelectedDifficulty("All Difficulties");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Questions List */}
              <div className="space-y-4">
                {filteredQuestions.map((question, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <p className="font-medium">{question.question}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{question.year}</Badge>
                          <Badge
                            variant={
                              question.difficulty === "Easy"
                                ? "default"
                                : question.difficulty === "Medium"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {question.difficulty}
                          </Badge>
                          <Badge variant="outline">{question.topic}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Answer
                          </Button>
                          <Button size="sm">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            Practice
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </GlobalLayout>
    );
  }

  return (
    <GlobalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Subjects & Materials
          </h1>
          <p className="text-muted-foreground">
            Browse and manage your academic subjects and study materials
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((semester) => (
                    <SelectItem key={semester} value={semester}>
                      {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSubjects.map((subject) => {
            const Icon = subject.icon;
            return (
              <Card
                key={subject.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => handleSubjectClick(subject)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Icon className="h-8 w-8 text-primary" />
                    <Badge variant="outline">{subject.code}</Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {subject.name}
                  </CardTitle>
                  <CardDescription>{subject.semester}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-center">
                    <CircularProgress percentage={subject.completion} />
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    {subject.completion}% Complete
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredSubjects.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No subjects found matching your search criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </GlobalLayout>
  );
}
