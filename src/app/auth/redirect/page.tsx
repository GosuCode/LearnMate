"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/hooks/use-toast";

export default function AuthRedirectPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle } = useAuthStore();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const success = searchParams.get("success");
        const error = searchParams.get("error");
        const message = searchParams.get("message");
        const userParam = searchParams.get("user");
        const token = searchParams.get("token");

        if (error) {
          setError(message || "Google authentication was cancelled or failed");
          setIsLoading(false);
          return;
        }

        if (success === "true" && userParam && token) {
          try {
            const user = JSON.parse(userParam);

            // Store the user data and token
            await loginWithGoogle(user, token);

            toast({
              title: "Welcome!",
              description: `Successfully signed in as ${user.name}`,
            });

            // Redirect to dashboard
            router.push("/dashboard");
          } catch (parseError) {
            console.error("Error parsing user data:", parseError);
            setError("Invalid user data received");
            setIsLoading(false);
          }
        } else {
          setError("Authentication failed - missing data");
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Google OAuth error:", err);
        setError("An error occurred during authentication");
        setIsLoading(false);
      }
    };

    handleGoogleCallback();
  }, [searchParams, loginWithGoogle, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Completing sign in...</h2>
          <p className="text-muted-foreground">
            Please wait while we finish setting up your account.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Authentication Failed
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}
