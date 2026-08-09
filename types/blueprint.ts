export type QuestionType =
  | "single-select"
  | "multi-select"
  | "number"
  | "text"
  | "yes-no";

export type ConditionOperator = "AND" | "OR";

export type QuestionConditionRule = {
  questionId: string;
  equals?: string | number | boolean;
  includes?: string;
};

export type QuestionCondition = {
  operator?: ConditionOperator;
  rules: readonly QuestionConditionRule[];
};

export type BlueprintAnswer =
  | string
  | string[]
  | number
  | boolean
  | null;

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

  condition?: QuestionCondition;
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

export type BlueprintRecommendationCategory =
  | "network"
  | "infrastructure"
  | "security"
  | "audio-video"
  | "automation"
  | "resilience"
  | "implementation";

export type BlueprintRecommendationPriority =
  | "critical"
  | "high"
  | "recommended"
  | "consider";

export type BlueprintRecommendation = {
  id: string;
  category: BlueprintRecommendationCategory;
  priority: BlueprintRecommendationPriority;

  title: string;
  rationale: string;
  action: string;
};

export type BlueprintDesignGapSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type BlueprintDesignGap = {
  id: string;
  severity: BlueprintDesignGapSeverity;
  title: string;
  issue: string;
  action: string;
};

export type BlueprintImplementationPhaseId =
  | "resolve-first"
  | "infrastructure"
  | "core-systems"
  | "technology"
  | "future-expansion";

export type BlueprintImplementationItem = {
  id: string;
  phase: BlueprintImplementationPhaseId;
  title: string;
  reason: string;
  action: string;
};

export type BlueprintImplementationPhase = {
  id: BlueprintImplementationPhaseId;
  title: string;
  description: string;
  items: BlueprintImplementationItem[];
};

export type BlueprintBudgetLevel =
  | "foundation"
  | "enhanced"
  | "advanced"
  | "premium";

export type BlueprintBudgetDriver = {
  id: string;
  title: string;
  impact: "moderate" | "significant" | "major";
  explanation: string;
};

export type BlueprintBudgetGuidance = {
  level: BlueprintBudgetLevel;
  title: string;
  summary: string;
  confidence: "low" | "medium" | "high";
  drivers: BlueprintBudgetDriver[];
  planningNote: string;
};