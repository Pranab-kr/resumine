"use client";

import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
}

export default function ScoreBadge({ score }: ScoreBadgeProps) {
  const getBadgeStyle = () => {
    if (score > 70) {
      return {
        bgClass: "bg-green-100 dark:bg-green-900/30",
        textClass: "text-green-600 dark:text-green-400",
        label: "Strong",
      };
    } else if (score > 49) {
      return {
        bgClass: "bg-yellow-100 dark:bg-yellow-900/30",
        textClass: "text-yellow-600 dark:text-yellow-400",
        label: "Good Start",
      };
    } else {
      return {
        bgClass: "bg-red-100 dark:bg-red-900/30",
        textClass: "text-red-600 dark:text-red-400",
        label: "Needs Work",
      };
    }
  };

  const { bgClass, textClass, label } = getBadgeStyle();

  return (
    <div
      className={cn(
        "inline-flex px-3 py-1 rounded-full text-sm font-medium",
        bgClass
      )}
    >
      <p className={textClass}>{label}</p>
    </div>
  );
}
