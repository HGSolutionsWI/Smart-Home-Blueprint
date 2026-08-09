import type {
  BlueprintAnswers,
  BlueprintBudgetDriver,
  BlueprintBudgetGuidance,
  BlueprintDesignGap,
  BlueprintRecommendation,
} from "@/types/blueprint";

function answerEquals(
  answers: BlueprintAnswers,
  questionId: string,
  value: string | number | boolean,
): boolean {
  return answers[questionId] === value;
}

function answerIncludes(
  answers: BlueprintAnswers,
  questionId: string,
  value: string,
): boolean {
  const answer = answers[questionId];

  return Array.isArray(answer) && answer.includes(value);
}

function answerIncludesAny(
  answers: BlueprintAnswers,
  questionId: string,
  values: readonly string[],
): boolean {
  return values.some((value) =>
    answerIncludes(answers, questionId, value),
  );
}

export function buildBlueprintBudgetGuidance(
  answers: BlueprintAnswers,
  recommendations: BlueprintRecommendation[],
  designGaps: BlueprintDesignGap[],
): BlueprintBudgetGuidance {
  const drivers: BlueprintBudgetDriver[] = [];

  let score = 0;

  /*
   * PROJECT CONDITIONS
   */

  if (answerEquals(answers, "projectType", "existing-home")) {
    score += 2;

    drivers.push({
      id: "existing-home-retrofit",
      title: "Existing-Home Retrofit",
      impact: "significant",
      explanation:
        "Finished construction can increase labor because cable pathways, equipment locations, and access must work around existing finishes.",
    });
  }

  if (answerEquals(answers, "projectType", "remodel-addition")) {
    score += 1;

    drivers.push({
      id: "remodel-coordination",
      title: "Remodel Coordination",
      impact: "moderate",
      explanation:
        "A remodel creates good infrastructure opportunities but may require coordination between open construction areas and finished portions of the home.",
    });
  }

  /*
   * NETWORK
   */

  if (
    answerEquals(answers, "internetDependency", "critical") ||
    answerEquals(answers, "networkPlatformPreference", "advanced") ||
    answerEquals(answers, "wifiExperience", "high-performance")
  ) {
    score += 2;

    drivers.push({
      id: "advanced-network",
      title: "Higher-Performance Network",
      impact: "significant",
      explanation:
        "Managed networking, multiple wired access points, PoE switching, UPS protection, and centralized equipment increase capability as well as project scope.",
    });
  }

  /*
   * SECURITY
   */

  if (
    answerEquals(answers, "securityPriority", "high") ||
    answerEquals(
      answers,
      "securitySystemPreference",
      "comprehensive",
    )
  ) {
    score += 2;

    drivers.push({
      id: "security-scope",
      title: "Comprehensive Security",
      impact: "significant",
      explanation:
        "Intrusion detection, surveillance, recording, entry monitoring, notifications, and backup-power integration can represent a substantial system scope.",
    });
  }

  if (
    answerIncludesAny(answers, "cameraInfrastructure", [
      "front-entry",
      "driveway",
      "garage",
      "rear-entry",
      "backyard",
      "detached-buildings",
    ])
  ) {
    score += 1;

    drivers.push({
      id: "camera-infrastructure",
      title: "Surveillance Infrastructure",
      impact: "moderate",
      explanation:
        "Multiple camera locations add cabling, PoE capacity, recording requirements, storage, mounting, and commissioning work.",
    });
  }

  /*
   * AUDIO / VIDEO
   */

  if (
    answerEquals(answers, "audioSystemPreference", "whole-home") ||
    answerEquals(
      answers,
      "audioSystemPreference",
      "high-performance",
    )
  ) {
    score += 2;

    drivers.push({
      id: "distributed-audio",
      title: "Distributed Audio",
      impact: "significant",
      explanation:
        "Permanent speaker infrastructure, amplification, multiple zones, equipment space, and control requirements increase project scope.",
    });
  }

  if (
    answerEquals(answers, "videoSystemPreference", "advanced")
  ) {
    score += 2;

    drivers.push({
      id: "advanced-av",
      title: "Advanced Audio / Video",
      impact: "significant",
      explanation:
        "Dedicated theater or advanced video systems can require specialized wiring, speakers, equipment, control, ventilation, and installation.",
    });
  }

  /*
   * AUTOMATION
   */

  if (
    answerEquals(
      answers,
      "automationPlatformPreference",
      "fully-integrated",
    )
  ) {
    score += 3;

    drivers.push({
      id: "integrated-automation",
      title: "Integrated Home Automation",
      impact: "major",
      explanation:
        "Coordinating lighting, climate, security, shades, audio, and other systems requires additional hardware, programming, integration, and commissioning.",
    });
  }

  if (
    answerEquals(
      answers,
      "lightingControlPreference",
      "whole-home",
    )
  ) {
    score += 2;

    drivers.push({
      id: "whole-home-lighting",
      title: "Whole-Home Lighting Control",
      impact: "significant",
      explanation:
        "Whole-home lighting control expands electrical coordination, control hardware, programming, keypad planning, and commissioning.",
    });
  }

  if (
    answerEquals(answers, "shadePreference", "whole-home")
  ) {
    score += 2;

    drivers.push({
      id: "motorized-shades",
      title: "Whole-Home Motorized Shades",
      impact: "significant",
      explanation:
        "Motorized shades can become a meaningful project investment because each opening requires compatible hardware, power or wiring, controls, and installation.",
    });
  }

  /*
   * RESILIENCE
   */

  if (
    answerEquals(
      answers,
      "backupEnergyIntegration",
      "broader-technology",
    )
  ) {
    score += 2;

    drivers.push({
      id: "backup-energy",
      title: "Technology Backup-Power Integration",
      impact: "significant",
      explanation:
        "Maintaining multiple technology systems during outages requires additional electrical coordination, UPS capacity, and potentially generator or battery integration.",
    });
  }

  /*
   * DETACHED STRUCTURES
   */

  if (
    answerIncludesAny(answers, "outdoorCoverage", [
      "detached-garage",
      "outbuilding",
    ])
  ) {
    score += 2;

    drivers.push({
      id: "detached-structures",
      title: "Detached-Building Connectivity",
      impact: "significant",
      explanation:
        "Connecting detached structures may require trenching, conduit, fiber, surge considerations, additional networking equipment, or point-to-point wireless hardware.",
    });
  }

  /*
   * FUTURE READINESS
   */

  if (
    answerEquals(answers, "futureExpansionPriority", "high") ||
    answerEquals(answers, "conduitStrategy", "extensive") ||
    answerEquals(answers, "spareCapacity", "high")
  ) {
    score += 1;

    drivers.push({
      id: "future-ready-infrastructure",
      title: "Future-Ready Infrastructure",
      impact: "moderate",
      explanation:
        "Additional conduit, spare cabling, rack capacity, switching capacity, and electrical headroom increase initial investment but can reduce future retrofit costs.",
    });
  }

  /*
   * DESIGN UNCERTAINTY
   */

  const majorGaps = designGaps.filter(
    (gap) =>
      gap.severity === "critical" ||
      gap.severity === "high",
  );

  const confidence =
    majorGaps.length >= 3
      ? "low"
      : majorGaps.length > 0
        ? "medium"
        : "high";

  /*
   * OVERALL LEVEL
   */

  const level =
    score >= 14
      ? "premium"
      : score >= 9
        ? "advanced"
        : score >= 4
          ? "enhanced"
          : "foundation";

  const title =
    level === "premium"
      ? "Premium Integrated Technology Project"
      : level === "advanced"
        ? "Advanced Smart Home Project"
        : level === "enhanced"
          ? "Enhanced Smart Home Foundation"
          : "Smart Home Foundation";

  const summary =
    level === "premium"
      ? "Your Blueprint includes multiple higher-scope technology systems and should be approached as an integrated residential technology project rather than a collection of individual devices."
      : level === "advanced"
        ? "Your Blueprint includes several higher-performance systems that will benefit from coordinated design, infrastructure, equipment planning, and professional implementation."
        : level === "enhanced"
          ? "Your project extends beyond basic connectivity and includes meaningful infrastructure or technology upgrades that should be planned together."
          : "Your project is primarily focused on establishing a reliable technology foundation while preserving sensible options for future expansion.";

  const highPriorityRecommendations = recommendations.filter(
    (recommendation) =>
      recommendation.priority === "critical" ||
      recommendation.priority === "high",
  ).length;

  const planningNote =
    highPriorityRecommendations > 0
      ? `Your Blueprint currently contains ${highPriorityRecommendations} high-priority or critical recommendation${
          highPriorityRecommendations === 1 ? "" : "s"
        }. Final investment should be established after site conditions, quantities, equipment selections, and installer labor requirements are verified.`
      : "Final investment should be established after site conditions, quantities, equipment selections, and installer labor requirements are verified.";

  return {
    level,
    title,
    summary,
    confidence,
    drivers,
    planningNote,
  };
}