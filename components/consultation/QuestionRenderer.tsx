"use client";

import { OptionCard } from "@/components/consultation/OptionCard";
import { theme } from "@/lib/constants/theme";
import type {
  BlueprintAnswer,
  BlueprintQuestion,
} from "@/types/blueprint";

type QuestionRendererProps = {
  question: BlueprintQuestion;
  answer: BlueprintAnswer;
  onAnswer: (answer: BlueprintAnswer) => void;
};

export function QuestionRenderer({
  question,
  answer,
  onAnswer,
}: QuestionRendererProps) {
  if (question.type === "single-select" && question.options) {
    return (
      <div
        style={{
          display: "grid",
          gap: theme.spacing.md,
          marginBottom: theme.spacing.xl,
        }}
      >
        {question.options.map((option) => (
          <OptionCard
            key={option.id}
            icon={option.icon ?? "✓"}
            title={option.title}
            description={option.description ?? ""}
            selected={answer === option.id}
            onSelect={() => onAnswer(option.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.medium,
        background: theme.colors.surface,
      }}
    >
      <p
        style={{
          color: theme.colors.textLight,
          margin: 0,
        }}
      >
        This question type is not supported yet.
      </p>
    </div>
  );
}