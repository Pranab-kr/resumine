"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "@/lib/puter-store";
import type { Resume } from "@/types";

interface ResumeCardProps {
  resume: Resume;
}

export default function ResumeCard({ resume }: ResumeCardProps) {
  const { id, companyName, jobTitle, feedback, imagePath } = resume;
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      setResumeUrl(url);
    };
    loadResume();
  }, [imagePath, fs]);

  return (
    <Link
      href={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000 hover:shadow-lg transition-shadow"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && (
            <h2 className="text-xl font-bold break-words">{companyName}</h2>
          )}
          {jobTitle && (
            <h3 className="text-lg break-words text-muted-foreground">
              {jobTitle}
            </h3>
          )}

          {!companyName && !jobTitle && (
            <h2 className="text-xl font-bold">Resume</h2>
          )}
        </div>

        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      {resumeUrl && (
        <div className="gradient-border animate-in fade-in duration-800">
          <div className="w-full h-full">
            <Image
              src={resumeUrl}
              alt="resume"
              width={400}
              height={350}
              className="w-full h-[350px] max-sm:h-[350px] object-cover object-top rounded-xl"
            />
          </div>
        </div>
      )}
    </Link>
  );
}
