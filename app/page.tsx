"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { usePuterStore } from "@/lib/puter-store";
import NavBar from "@/components/NavBar";
import ResumeCard from "@/components/ResumeCard";
import { GridBackground } from "@/components/GridBackground";
import { Upload, Loader2, LogIn } from "lucide-react";
import type { Resume, KVItem } from "@/types";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { TextAnimate } from "@/components/ui/text-animate";

export default function HomePage() {
  const {
    auth,
    kv,
    init,
    isLoading: puterLoading,
    puterReady,
  } = usePuterStore();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  // No longer redirect non-authenticated users - let them view the homepage

  useEffect(() => {
    const loadResumes = async () => {
      if (!auth.isAuthenticated) return;

      setIsLoading(true);
      const resumeList = (await kv.list("resume:*", true)) as KVItem[];

      const parsedResumes: Resume[] =
        resumeList?.map((resume) => JSON.parse(resume.value) as Resume) || [];

      setResumes(parsedResumes);
      setIsLoading(false);
    };

    if (auth.isAuthenticated) {
      loadResumes();
    }
  }, [auth.isAuthenticated, kv]);

  if (!puterReady || puterLoading) {
    return (
      <GridBackground>
        <main className="min-h-screen pt-10">
          <NavBar />
          <section className="main-section">
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Loading...</p>
            </div>
          </section>
        </main>
      </GridBackground>
    );
  }

  return (
    <GridBackground>
      <main className="min-h-screen pt-10">
        <NavBar />
        <section className="main-section">
          <div className="page-heading py-16">
            <h1 className="max-sm:text-4xl text-6xl text-gradient leading-tight font-semibold">
              <TextAnimate animation="blurInUp" duration={1} by="word">
                Track Your Application & Resume Rating
              </TextAnimate>
            </h1>
            {!isLoading && auth.isAuthenticated && resumes?.length === 0 ? (
              <TextAnimate
                animation="blurInUp"
                by="word"
                delay={1}
                duration={0.5}
                className="text-xl text-muted-foreground"
              >
                No resume found. Upload Your First resume to get feedback.
              </TextAnimate>
            ) : !isLoading && auth.isAuthenticated && resumes?.length > 0 ? (
              <TextAnimate
                animation="blurInUp"
                by="word"
                delay={1}
                duration={0.5}
                className="text-xl text-muted-foreground"
              >
                Review your Submission and check AI-powered Feedback
              </TextAnimate>
            ) : !auth.isAuthenticated ? (
              <TextAnimate
                animation="blurInUp"
                by="word"
                duration={0.5}
                delay={1}
                className="text-xl text-muted-foreground"
              >
                Get AI-powered feedback to improve your resume
              </TextAnimate>
            ) : null}
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
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              className="resumes-section"
            >
              {resumes.map((resume, index) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.4,
                    delay: 1 + index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <ResumeCard resume={resume} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {!isLoading && auth.isAuthenticated && resumes?.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 1.8, ease: "easeOut" }}
              className="flex flex-col items-center justify-center mt-10 gap-4"
            >
              <Link href="/upload">
                <HoverBorderGradient className="text-xl flex items-center font-semibold px-8 py-4 rounded-full">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Resume
                </HoverBorderGradient>
              </Link>
            </motion.div>
          )}

          {/* Show login prompt for non-authenticated users */}
          {!auth.isAuthenticated && puterReady && !puterLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
              className="flex flex-col items-center justify-center mt-10 gap-6"
            >
              <TextAnimate
                animation="blurInUp"
                by="word"
                delay={1.7}
                className="text-lg text-muted-foreground text-center max-w-md"
              >
                Sign in to upload your resume and get AI-powered feedback
              </TextAnimate>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.4, delay: 2.5, ease: "easeOut" }}
              >
                <Link href="/auth?next=/">
                  <HoverBorderGradient className="text-xl flex items-center font-semibold px-8 py-4 rounded-full">
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In to Get Started
                  </HoverBorderGradient>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </section>
      </main>
    </GridBackground>
  );
}
