"use client";

import { useEffect, useMemo, useState } from "react";

import { blueprintSessions } from "@/data/consultation/sessions";
import {
  loadBlueprintProject,
  saveBlueprintProject,
} from "@/lib/blueprint/storage";
import type {
  BlueprintAnswer,
  BlueprintAnswers,
  BlueprintQuestion,
  QuestionConditionRule,
} from "@/types/blueprint";

function ruleMatches(
  rule: QuestionConditionRule,
  answers: BlueprintAnswers,
): boolean {
  const answer = answers[rule.questionId];

  if (rule.equals !== undefined) {
    return answer === rule.equals;
  }

  if (rule.includes !== undefined) {
    return Array.isArray(answer) && answer.includes(rule.includes);
  }

  return false;
}

function questionMatchesCondition(
  question: BlueprintQuestion,
  answers: BlueprintAnswers,
): boolean {
  if (!question.condition) {
    return true;
  }

  const { rules, operator = "AND" } = question.condition;

  if (!rules || rules.length === 0) {
    return true;
  }

  if (operator === "OR") {
    return rules.some((rule) => ruleMatches(rule, answers));
  }

  return rules.every((rule) => ruleMatches(rule, answers));
}

function clearHiddenAnswers(
  answers: BlueprintAnswers,
  questions: readonly BlueprintQuestion[],
): BlueprintAnswers {
  const cleanedAnswers: BlueprintAnswers = {
    ...answers,
  };

  questions.forEach((question) => {
    if (
      question.condition &&
      !questionMatchesCondition(question, cleanedAnswers)
    ) {
      cleanedAnswers[question.id] = null;
    }
  });

  return cleanedAnswers;
}

export function useBlueprint() {
  const [sessionIndex, setSessionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<BlueprintAnswers>({});
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  useEffect(() => {
    const storedProject = loadBlueprintProject();

    if (storedProject) {
      setAnswers(storedProject.answers);
      setSessionIndex(
        Math.min(
          storedProject.sessionIndex,
          blueprintSessions.length - 1,
        ),
      );
      setQuestionIndex(Math.max(storedProject.questionIndex, 0));
    }

    setHasLoadedStorage(true);
  }, []);

  const currentSession = blueprintSessions[sessionIndex];

  const visibleQuestions = useMemo(() => {
    return currentSession.questions.filter((question) =>
      questionMatchesCondition(question, answers),
    );
  }, [currentSession, answers]);

  const safeQuestionIndex = Math.min(
    questionIndex,
    Math.max(visibleQuestions.length - 1, 0),
  );

  const currentQuestion = visibleQuestions[safeQuestionIndex];

  const currentAnswer = currentQuestion
    ? answers[currentQuestion.id] ?? null
    : null;

  const hasAnswer = Array.isArray(currentAnswer)
    ? currentAnswer.length > 0
    : currentAnswer !== null &&
      currentAnswer !== undefined &&
      currentAnswer !== "";

  const canContinue =
    currentQuestion?.required === false || hasAnswer;

  const sessionProgress =
    visibleQuestions.length > 0
      ? Math.round(
          ((safeQuestionIndex + 1) / visibleQuestions.length) * 100,
        )
      : 0;

  const overallProgress = Math.round(
    ((sessionIndex +
      (visibleQuestions.length > 0
        ? (safeQuestionIndex + 1) / visibleQuestions.length
        : 0)) /
      blueprintSessions.length) *
      100,
  );

  useEffect(() => {
    if (!hasLoadedStorage) {
      return;
    }

    saveBlueprintProject({
      answers,
      sessionIndex,
      questionIndex: safeQuestionIndex,
    });
  }, [
    answers,
    sessionIndex,
    safeQuestionIndex,
    hasLoadedStorage,
  ]);

  function answerQuestion(answer: BlueprintAnswer) {
    if (!currentQuestion) {
      return;
    }

    setAnswers((previousAnswers) => {
      const updatedAnswers: BlueprintAnswers = {
        ...previousAnswers,
        [currentQuestion.id]: answer,
      };

      const allQuestions = blueprintSessions.flatMap(
        (session) => session.questions,
      );

      return clearHiddenAnswers(updatedAnswers, allQuestions);
    });
  }

  function nextQuestion() {
    if (!currentQuestion || !canContinue) {
      return;
    }

    if (safeQuestionIndex < visibleQuestions.length - 1) {
      setQuestionIndex((current) => current + 1);
      return;
    }

    if (sessionIndex < blueprintSessions.length - 1) {
      setSessionIndex((current) => current + 1);
      setQuestionIndex(0);
    }
  }

  function previousQuestion() {
    if (safeQuestionIndex > 0) {
      setQuestionIndex((current) => current - 1);
      return;
    }

    if (sessionIndex > 0) {
      const previousSessionIndex = sessionIndex - 1;
      const previousSession = blueprintSessions[previousSessionIndex];

      const previousVisibleQuestions =
        previousSession.questions.filter((question) =>
          questionMatchesCondition(question, answers),
        );

      setSessionIndex(previousSessionIndex);

      setQuestionIndex(
        Math.max(previousVisibleQuestions.length - 1, 0),
      );
    }
  }

  return {
    answers,

    sessionIndex,
    currentSession,

    currentAnswer,
    currentQuestion,

    visibleQuestions,
    safeQuestionIndex,

    sessionProgress,
    overallProgress,

    canContinue,
    hasLoadedStorage,

    answerQuestion,
    nextQuestion,
    previousQuestion,
  };
}