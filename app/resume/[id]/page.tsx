"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { usePuterStore } from "@/lib/puter-store";
import Summary from "@/components/Summary";
import ATS from "@/components/ATS";
import Details from "@/components/Details";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Feedback } from "@/types";

interface ResumePageProps {
  params: Promise<{ id: string }>;
}

export default function ResumePage({ params }: ResumePageProps) {
  const { id } = use(params);
  const { auth, isLoading: puterLoading, fs, kv, init, puterReady } = usePuterStore();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const router = useRouter();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (puterReady && !puterLoading && !auth.isAuthenticated) {
      router.push(`/auth?next=/resume/${id}`);
    }
  }, [puterReady, puterLoading, auth.isAuthenticated, router, id]);

  useEffect(() => {
    const loadResume = async () => {
      if (!auth.isAuthenticated) return;

      const resume = await kv.get(`resume:${id}`);

      if (!resume) return;

      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);
      if (resumeBlob) {
        const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
        const url = URL.createObjectURL(pdfBlob);
        setResumeUrl(url);
      }

      const imageBlob = await fs.read(data.imagePath);
      if (imageBlob) {
        const url = URL.createObjectURL(imageBlob);
        setImageUrl(url);
      }

      setFeedback(data.feedback);
    };

    if (auth.isAuthenticated) {
      loadResume();
    }
  }, [id, auth.isAuthenticated, kv, fs]);

  return (
    <main className="pt-0 min-h-screen">
      <nav className="resume-nav">
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Homepage
          </Button>
        </Link>
      </nav>

      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section sticky top-0 items-center justify-center">
          {imageUrl && resumeUrl ? (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-fit w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <Image
                  src={imageUrl}
                  alt="Resume preview"
                  width={500}
                  height={700}
                  className="w-full h-full object-contain rounded-2xl"
                />
              </a>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2 className="text-4xl font-bold">Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />
              <Details feedback={feedback} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Image
                src="/images/resume-scan-2.gif"
                alt="Loading feedback"
                width={200}
                height={200}
                className="w-full max-w-xs"
                unoptimized
              />
              <p className="text-muted-foreground mt-4">Loading feedback...</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
