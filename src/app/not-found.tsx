import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, BookOpen, HelpCircle, Users, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{
        backgroundImage: 'url("/404-notfound.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>

      <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10">
        {/* Main Error Message */}
        <div className="space-y-4">
          <h1 className="text-6xl font-serif font-black text-primary">404</h1>
          <h2 className="text-3xl font-serif font-bold text-foreground">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground font-sans leading-relaxed max-w-md mx-auto">
            Don&apos;t worry, lets get you back to learning! The page
            you&apos;re looking for might have been moved or doesn&apos;t exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="h-12 px-8 text-base font-medium">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Go to Homepage
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base font-medium border-primary/20 hover:bg-primary/5 bg-transparent"
          >
            <Link href="/courses" className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Browse Courses
            </Link>
          </Button>
        </div>

        {/* Helpful Links */}
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-serif font-semibold text-foreground mb-4">
              Need Help Finding Something?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/search"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-foreground">
                    Search Courses
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Find what you&apos;re looking for
                  </div>
                </div>
              </Link>

              <Link
                href="/help"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <HelpCircle className="h-4 w-4 text-accent" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-foreground">Help Center</div>
                  <div className="text-sm text-muted-foreground">
                    Get support and FAQs
                  </div>
                </div>
              </Link>

              <Link
                href="/popular"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-foreground">
                    Popular Courses
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Most enrolled courses
                  </div>
                </div>
              </Link>

              <Link
                href="/community"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <Users className="h-4 w-4 text-accent" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-foreground">Community</div>
                  <div className="text-sm text-muted-foreground">
                    Connect with learners
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer Message */}
        <div className="pt-4">
          <p className="text-sm text-muted-foreground font-sans">
            &quot;Every expert was once a beginner. Keep learning, keep
            growing.&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
