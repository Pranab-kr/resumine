"use client";

import { Check, AlertTriangle, Trophy, TrendingUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

export default function ATS({ score, suggestions }: ATSProps) {
  const gradientClass =
    score > 69
      ? "from-green-100 dark:from-green-900/30"
      : score > 49
      ? "from-yellow-100 dark:from-yellow-900/30"
      : "from-red-100 dark:from-red-900/30";

  const IconComponent =
    score > 69 ? Trophy : score > 49 ? TrendingUp : AlertCircle;

  const iconColor =
    score > 69
      ? "text-green-600 dark:text-green-400"
      : score > 49
      ? "text-yellow-600 dark:text-yellow-400"
      : "text-red-600 dark:text-red-400";

  const subtitle =
    score > 69
      ? "Great Job!"
      : score > 49
      ? "Good Start"
      : "Needs Improvement";

  return (
    <div
      className={cn(
        "bg-gradient-to-b to-card rounded-2xl shadow-md w-full p-4 md:p-6 border",
        gradientClass
      )}
    >
      {/* Top section with icon and headline */}
      <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
        <IconComponent className={cn("w-8 h-8 md:w-12 md:h-12", iconColor)} />
        <div>
          <h2 className="text-xl md:text-2xl font-bold">ATS Score - {score}/100</h2>
        </div>
      </div>

      {/* Description section */}
      <div className="mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-semibold mb-2">{subtitle}</h3>
        <p className="text-sm md:text-base text-muted-foreground mb-4">
          This score represents how well your resume is likely to perform in
          Applicant Tracking Systems used by employers.
        </p>

        {/* Suggestions list */}
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-2 md:gap-3">
              {suggestion.type === "good" ? (
                <Check className="w-4 h-4 md:w-5 md:h-5 mt-1 text-green-600 dark:text-green-400 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 mt-1 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
              )}
              <p
                className={cn(
                  "text-sm md:text-base",
                  suggestion.type === "good"
                    ? "text-green-700 dark:text-green-300"
                    : "text-amber-700 dark:text-amber-300"
                )}
              >
                {suggestion.tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing encouragement */}
      <p className="text-xs md:text-sm text-muted-foreground italic">
        Keep refining your resume to improve your chances of getting past ATS
        filters and into the hands of recruiters.
      </p>
    </div>
  );
}
