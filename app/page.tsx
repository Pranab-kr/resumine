"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { usePuterStore } from "@/lib/puter-store";
import NavBar from "@/components/NavBar";
import ResumeCard from "@/components/ResumeCard";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import type { Resume, KVItem } from "@/types";

export default function HomePage() {
  const { auth, kv, init, isLoading: puterLoading, puterReady } = usePuterStore();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (puterReady && !puterLoading && !auth.isAuthenticated) {
      router.push("/auth?next=/");
    }
  }, [puterReady, puterLoading, auth.isAuthenticated, router]);

  useEffect(() => {
    const loadResumes = async () => {
      if (!auth.isAuthenticated) return;

      setIsLoading(true);
      const resumeList = (await kv.list("resume:*", true)) as KVItem[];

      const parsedResumes: Resume[] = resumeList?.map(
        (resume) => JSON.parse(resume.value) as Resume
      ) || [];

      setResumes(parsedResumes);
      setIsLoading(false);
    };

    if (auth.isAuthenticated) {
      loadResumes();
    }
  }, [auth.isAuthenticated, kv]);

  if (!puterReady || puterLoading) {
    return (
      <main className="min-h-screen pt-10">
        <NavBar />
        <section className="main-section">
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-10">
      <NavBar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1 className="max-sm:text-4xl text-6xl text-gradient leading-tight font-semibold">
            Track Your Application & Resume Rating
          </h1>
          {!isLoading && resumes?.length === 0 ? (
            <p className="text-xl text-muted-foreground">
              No resume found. Upload Your First resume to get feedback.
            </p>
          ) : (
            <p className="text-xl text-muted-foreground">
              Review your Submission and check AI-powered Feedback
            </p>
          )}
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/images/resume-scan-2.gif"
              alt="Loading"
              width={200}
              height={200}
              className="w-[200px]"
              unoptimized
            />
          </div>
        )}

        {!isLoading && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!isLoading && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link href="/upload">
              <Button className="primary-gradient text-white text-xl font-semibold px-8 py-6 rounded-full">
                <Upload className="w-5 h-5 mr-2" />
                Upload Resume
              </Button>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
