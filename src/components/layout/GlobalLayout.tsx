"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Brain,
  GraduationCap,
  TrendingUp,
  Settings,
  Search,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface GlobalLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Subjects & Materials", href: "/subjects", icon: BookOpen },
  { name: "Quizzes", href: "/quizzes", icon: FileText },
  { name: "Summarizer", href: "/summarizer", icon: Brain },
  { name: "Past Papers", href: "/past-papers", icon: GraduationCap },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function GlobalLayout({ children }: GlobalLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout, isLoading } = useAuthStore();
  const [notifications] = useState(3);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Fixed Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              {!sidebarCollapsed && (
                <span className="font-bold text-lg text-card-foreground">
                  LearnMate
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8 p-0"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start h-10 cursor-pointer ${
                    sidebarCollapsed ? "px-2" : "px-3"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {!sidebarCollapsed && (
                    <span className="ml-3">{item.name}</span>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Top Bar */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search subjects, materials, quizzes..."
                className="pl-10 bg-background"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* Profile Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="hidden sm:block capitalize">
                      {user.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none capitalize">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Account Settings</DropdownMenuItem>
                  <DropdownMenuItem>Help & Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
