"use client";

import { useMemo, useState } from "react";

import { discoveryQuestions } from "@/data/consultation/discovery";
import type {
  BlueprintAnswer,
  BlueprintAnswers,
  BlueprintQuestion,
} from "@/types/blueprint";

function questionMatchesCondition(
  question: BlueprintQuestion,
  answers: BlueprintAnswers,
) {
  if (!question.condition) {
    return true;
  }

  const conditionAnswer = answers[question.condition.questionId];

  if (
    question.condition.equals !== undefined &&
    conditionAnswer !== question.condition.equals
  ) {
    return false;
  }

  if (question.condition.includes !== undefined) {
    if (!Array.isArray(conditionAnswer)) {
      return false;
    }

    if (!conditionAnswer.includes(question.condition.includes)) {
      return false;
    }
  }

  return true;
}

export function useBlueprint() {
  const [questionIndex, setQuestionIndex] = useState(0);

const [answers, setAnswers] = useState<BlueprintAnswers>({
  projectType: null,
  homeSize: null,
  finishedLevels: null,
  outdoorCoverage: null,
  constructionStage: null,
  remodelAccess: null,
  existingHomeAccess: null,
  existingStructuredWiring: null,
});

  const visibleQuestions = useMemo(
    () =>
      discoveryQuestions.filter((question) =>
        questionMatchesCondition(question, answers),
      ),
    [answers],
  );

  const safeQuestionIndex = Math.min(
    questionIndex,
    Math.max(visibleQuestions.length - 1, 0),
  );

  const currentQuestion = visibleQuestions[safeQuestionIndex];
  const currentAnswer = answers[currentQuestion.id] ?? null;

  const progress = Math.round(
    ((safeQuestionIndex + 1) / visibleQuestions.length) * 20,
  );

  const hasAnswer = Array.isArray(currentAnswer)
    ? currentAnswer.length > 0
    : currentAnswer !== null &&
      currentAnswer !== undefined &&
      currentAnswer !== "";

  const canContinue =
    currentQuestion.required === false || hasAnswer;

  function answerQuestion(answer: BlueprintAnswer) {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion.id]: answer,
    }));
  }

  function nextQuestion() {
    if (!canContinue) return;

    if (safeQuestionIndex < visibleQuestions.length - 1) {
      setQuestionIndex((current) => current + 1);
    }
  }

  function previousQuestion() {
    if (safeQuestionIndex > 0) {
      setQuestionIndex((current) => current - 1);
    }
  }

  return {
    answers,
    currentAnswer,
    currentQuestion,
    visibleQuestions,
    safeQuestionIndex,
    progress,
    canContinue,
    answerQuestion,
    nextQuestion,
    previousQuestion,
  };
}