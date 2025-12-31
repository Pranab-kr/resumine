"use client";

import { Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Feedback } from "@/types";

interface ScoreBadgeProps {
  score: number;
}

const DetailScoreBadge = ({ score }: ScoreBadgeProps) => {
  return (
    <div
      className={cn(
        "flex flex-row gap-1 items-center px-2 py-0.5 rounded-full",
        score > 69
          ? "bg-green-100 dark:bg-green-900/30"
          : score > 39
          ? "bg-yellow-100 dark:bg-yellow-900/30"
          : "bg-red-100 dark:bg-red-900/30"
      )}
    >
      {score > 69 ? (
        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
      ) : (
        <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
      )}
      <p
        className={cn(
          "text-sm font-medium",
          score > 69
            ? "text-green-700 dark:text-green-300"
            : score > 39
            ? "text-yellow-700 dark:text-yellow-300"
            : "text-red-700 dark:text-red-300"
        )}
      >
        {score}/100
      </p>
    </div>
  );
};

interface CategoryHeaderProps {
  title: string;
  categoryScore: number;
}

const CategoryHeader = ({ title, categoryScore }: CategoryHeaderProps) => {
  return (
    <div className="flex flex-row gap-4 items-center py-2">
      <p className="text-xl font-semibold">{title}</p>
      <DetailScoreBadge score={categoryScore} />
    </div>
  );
};

interface Tip {
  type: "good" | "improve";
  tip: string;
  explanation: string;
}

interface CategoryContentProps {
  tips: Tip[];
}

const CategoryContent = ({ tips }: CategoryContentProps) => {
  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <div className="bg-muted w-full rounded-lg px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div className="flex flex-row gap-2 items-center" key={index}>
            {tip.type === "good" ? (
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            )}
            <p className="text-muted-foreground">{tip.tip}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 w-full">
        {tips.map((tip, index) => (
          <div
            key={index + tip.tip}
            className={cn(
              "flex flex-col gap-2 rounded-2xl p-4",
              tip.type === "good"
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300"
            )}
          >
            <div className="flex flex-row gap-2 items-center">
              {tip.type === "good" ? (
                <Check className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
              <p className="text-lg font-semibold">{tip.tip}</p>
            </div>
            <p>{tip.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

interface DetailsProps {
  feedback: Feedback;
}

export default function Details({ feedback }: DetailsProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Accordion className="w-full">
        <AccordionItem>
          <AccordionTrigger>
            <CategoryHeader
              title="Tone & Style"
              categoryScore={feedback.toneAndStyle.score}
            />
          </AccordionTrigger>
          <AccordionContent>
            <CategoryContent tips={feedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem>
          <AccordionTrigger>
            <CategoryHeader
              title="Content"
              categoryScore={feedback.content.score}
            />
          </AccordionTrigger>
          <AccordionContent>
            <CategoryContent tips={feedback.content.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem>
          <AccordionTrigger>
            <CategoryHeader
              title="Structure"
              categoryScore={feedback.structure.score}
            />
          </AccordionTrigger>
          <AccordionContent>
            <CategoryContent tips={feedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem>
          <AccordionTrigger>
            <CategoryHeader
              title="Skills"
              categoryScore={feedback.skills.score}
            />
          </AccordionTrigger>
          <AccordionContent>
            <CategoryContent tips={feedback.skills.tips} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
