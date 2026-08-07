export type QuestionType =
  | "single-select"
  | "multi-select"
  | "number"
  | "text"
  | "yes-no";

export type BlueprintAnswer = string | string[] | number | boolean | null;

export type QuestionOption = {
  id: string;
  icon?: string;
  title: string;
  description?: string;
};

export type ConsultantGuidance = {
  consultant: string;
  didYouKnow: string;
};

export type BlueprintQuestion = {
  id: string;
  sessionId: string;
  type: QuestionType;

  title: string;
  description?: string;

  options?: readonly QuestionOption[];

  defaultGuidance: ConsultantGuidance;

  required?: boolean;
};

export type BlueprintAnswers = Record<string, BlueprintAnswer>;

export type BlueprintSession = {
  id: string;
  title: string;
  description?: string;
  questions: readonly BlueprintQuestion[];
};

export type BlueprintProject = {
  id?: string;
  name?: string;

  answers: BlueprintAnswers;

  currentSessionId: string;
  currentQuestionId: string;

  createdAt?: string;
  updatedAt?: string;
};