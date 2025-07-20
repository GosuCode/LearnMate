"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, HomeIcon } from "lucide-react";

const semesters = [
  {
    label: "1ST SEM",
    subjects: [
      {
        name: "Computer Fundamentals & Applications",
        href: "/subject/computer-fundamentals-and-applications",
      },
      {
        name: "Society and Technology",
        href: "/subject/society-and-technology",
      },
      { name: "English I", href: "/subject/english-1" },
      { name: "Mathematics I", href: "/subject/math-1" },
      { name: "Digital Logic", href: "/subject/digital-logic" },
    ],
  },
  {
    label: "2ND SEM",
    subjects: [
      { name: "C Programming", href: "/subject/c-programming" },
      { name: "Financial Accounting", href: "/subject/financial-accounting" },
      { name: "English II", href: "/subject/english-2" },
      { name: "Mathematics II", href: "/subject/math-2" },
      {
        name: "Microprocessor and Computer Architecture",
        href: "/subject/microprocessor-and-computer-architecture",
      },
    ],
  },
  {
    label: "3RD SEM",
    subjects: [
      {
        name: "Data Structures and Algorithms",
        href: "/subject/data-structures-and-algorithms",
      },
      {
        name: "Probability and Statistics",
        href: "/subject/probability-and-statistics",
      },
      {
        name: "System Analysis and Design",
        href: "/subject/system-analysis-and-design",
      },
      { name: "OOP in Java", href: "/subject/oop-in-java" },
      { name: "Web Technology", href: "/subject/web-technology" },
    ],
  },
  {
    label: "4TH SEM",
    subjects: [
      { name: "Operating Systems", href: "/subject/os" },
      { name: "Numerical Methods", href: "/subject/numerical-methods" },
      { name: "Software Engineering", href: "/subject/software-engineering" },
      { name: "Scripting Language", href: "/subject/scripting-language" },
      {
        name: "Database Management System",
        href: "/subject/database-management-system",
      },
      {
        name: "Project I",
        href: "/subject/project-1",
      },
    ],
  },
  {
    label: "5TH SEM",
    subjects: [
      { name: "MIS and E-Business", href: "/subject/mis-e-business" },
      { name: "DotNet Technology", href: "/subject/dotnet-technology" },
      { name: "Computer Networking", href: "/subject/computer-networking" },
      { name: "Introduction to Management", href: "/subject/management" },
      {
        name: "Computer Graphics and Animation",
        href: "/subject/computer-graphics-animation",
      },
    ],
  },
  {
    label: "6TH SEM",
    subjects: [
      { name: "Mobile Programming", href: "/subject/mobile-programming" },
      { name: "Distributed System", href: "/subject/distributed-system" },
      { name: "Applied Economics", href: "/subject/applied-economics" },
      { name: "Advanced Java Programming", href: "/subject/advanced-java" },
      { name: "Network Programming", href: "/subject/network-programming" },
      { name: "Project II", href: "/subject/project-2" },
    ],
  },
  {
    label: "7TH SEM",
    subjects: [
      { name: "Cyber Law and Professional Ethics", href: "/subject/cyber-law" },
      { name: "Cloud Computing", href: "/subject/cloud-computing" },
      { name: "Internship", href: "/subject/internship" },
      {
        name: "Elective I - Image Processing",
        href: "/subject/image-processing",
      },
      {
        name: "Elective I - Database Administration",
        href: "/subject/database-administration",
      },
      {
        name: "Elective I - Network Administration",
        href: "/subject/network-administration",
      },
      {
        name: "Elective II - Advanced Dot Net Technology",
        href: "/subject/advanced-dotnet",
      },
      { name: "Elective II - E-Governance", href: "/subject/e-governance" },
      {
        name: "Elective II - Artificial Intelligence",
        href: "/subject/artificial-intelligence",
      },
    ],
  },
  {
    label: "8TH SEM",
    subjects: [
      { name: "Operations Research", href: "/subject/operations-research" },
      { name: "Project III", href: "/subject/project-3" },
      {
        name: "Elective III - Database Programming",
        href: "/subject/database-programming",
      },
      { name: "Elective III - GIS", href: "/subject/gis" },
      {
        name: "Elective III - Data Analysis & Visualization",
        href: "/subject/data-visualization",
      },
      {
        name: "Elective III - Machine Learning",
        href: "/subject/machine-learning",
      },
      { name: "Elective IV - Multimedia System", href: "/subject/multimedia" },
      {
        name: "Elective IV - Knowledge Engineering",
        href: "/subject/knowledge-engineering",
      },
      {
        name: "Elective IV - Information Security",
        href: "/subject/information-security",
      },
      { name: "Elective IV - Internet of Things", href: "/subject/iot" },
    ],
  },
  {
    label: "MORE",
    subjects: [{ name: "BCA Notice", href: "/notice" }],
  },
];

export default function Header() {
  return (
    <header className="bg-accent-foreground shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary">
          <HomeIcon />
        </Link>

        <div className="flex flex-wrap gap-3">
          {semesters.map((sem) => (
            <DropdownMenu key={sem.label}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {sem.label} <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {sem.subjects.map((subj) => (
                  <DropdownMenuItem key={subj.href} asChild>
                    <Link href={subj.href}>{subj.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>
      </nav>
    </header>
  );
}
