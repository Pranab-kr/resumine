"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePuterStore } from "@/lib/puter-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function AuthContent() {
  const { isLoading, auth, init, puterReady } = usePuterStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push(next);
    }
  }, [auth.isAuthenticated, next, router]);

  return (
    <Card className="w-full max-w-md mx-4">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Welcome</CardTitle>
        <CardDescription className="text-lg">
          Log In to Continue Your Job Journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!puterReady ? (
          <Button className="w-full py-6 text-lg" disabled>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading...
          </Button>
        ) : isLoading ? (
          <Button className="w-full py-6 text-lg" disabled>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Signing you in...
          </Button>
        ) : auth.isAuthenticated ? (
          <Button
            className="w-full py-6 text-lg"
            variant="destructive"
            onClick={auth.signOut}
          >
            Log Out
          </Button>
        ) : (
          <Button
            className="w-full py-6 text-lg primary-gradient text-white"
            onClick={auth.signIn}
          >
            Log in with Puter
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
      <Suspense fallback={
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Welcome</CardTitle>
            <CardDescription className="text-lg">
              Log In to Continue Your Job Journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full py-6 text-lg" disabled>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading...
            </Button>
          </CardContent>
        </Card>
      }>
        <AuthContent />
      </Suspense>
    </main>
  );
}
