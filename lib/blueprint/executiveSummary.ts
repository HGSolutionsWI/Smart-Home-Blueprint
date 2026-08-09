import type {
  BlueprintAnswers,
  BlueprintBudgetGuidance,
  BlueprintDesignGap,
  BlueprintExecutiveSummary,
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

function getProjectDescription(
  answers: BlueprintAnswers,
): string {
  if (answerEquals(answers, "projectType", "new-construction")) {
    return "new-construction project";
  }

  if (answerEquals(answers, "projectType", "remodel-addition")) {
    return "remodel or addition";
  }

  if (answerEquals(answers, "projectType", "existing-home")) {
    return "existing-home technology project";
  }

  return "residential technology project";
}

export function buildBlueprintExecutiveSummary(
  answers: BlueprintAnswers,
  recommendations: BlueprintRecommendation[],
  designGaps: BlueprintDesignGap[],
  budgetGuidance: BlueprintBudgetGuidance,
): BlueprintExecutiveSummary {
  const projectDescription =
    getProjectDescription(answers);

  const highPriorityRecommendations = recommendations.filter(
    (recommendation) =>
      recommendation.priority === "critical" ||
      recommendation.priority === "high",
  );

  const majorDesignGaps = designGaps.filter(
    (gap) =>
      gap.severity === "critical" ||
      gap.severity === "high",
  );

  /*
   * HEADLINE
   */

  let headline =
    "Build the foundation first, then layer technology around the way you live.";

  if (
    answerEquals(answers, "futureExpansionPriority", "high")
  ) {
    headline =
      "Build for today while preserving the pathways and capacity for tomorrow.";
  }

  if (
    answerEquals(
      answers,
      "automationPlatformPreference",
      "fully-integrated",
    )
  ) {
    headline =
      "Treat the home as one coordinated technology environment, not a collection of individual devices.";
  }

  if (majorDesignGaps.length > 0) {
    headline =
      "Resolve the critical design decisions first, then build the technology foundation in the right sequence.";
  }

  /*
   * OVERVIEW
   */

  let overview =
    `This ${projectDescription} is best approached as a coordinated technology plan rather than a series of isolated device purchases. ` +
    `Your consultation points toward a ${budgetGuidance.title.toLowerCase()}, with the strongest results coming from establishing the infrastructure and core systems before selecting every homeowner-facing device.`;

  if (
    answerEquals(answers, "projectType", "new-construction")
  ) {
    overview +=
      " Because the project is new construction, decisions made before the walls close can preserve options that become significantly harder or more expensive to add later.";
  }

  if (
    answerEquals(answers, "projectType", "remodel-addition")
  ) {
    overview +=
      " The remodel creates an important opportunity to improve infrastructure in areas already under construction while planning practical transitions into finished portions of the home.";
  }

  if (
    answerEquals(answers, "projectType", "existing-home")
  ) {
    overview +=
      " Because this is an existing home, successful implementation will depend more heavily on realistic cable pathways, accessible equipment locations, and selective retrofit strategies.";
  }

  /*
   * STRATEGY
   */

  const strategyParts: string[] = [];

  if (
    answerEquals(answers, "internetDependency", "critical") ||
    answerEquals(answers, "wifiExperience", "high-performance") ||
    answerIncludes(
      answers,
      "wiredLocations",
      "network-access-points",
    )
  ) {
    strategyParts.push(
      "A reliable wired network and properly planned Wi-Fi system should serve as the backbone for the rest of the home's technology.",
    );
  }

  if (
    answerEquals(answers, "futureExpansionPriority", "high") ||
    answerEquals(answers, "conduitStrategy", "extensive") ||
    answerEquals(answers, "spareCapacity", "high")
  ) {
    strategyParts.push(
      "Future-ready pathways, spare capacity, and documentation should be treated as part of the initial infrastructure rather than optional extras.",
    );
  }

  if (
    answerEquals(answers, "securityPriority", "high") ||
    answerEquals(
      answers,
      "securitySystemPreference",
      "comprehensive",
    )
  ) {
    strategyParts.push(
      "Security and surveillance should be designed as a coordinated system with appropriate wiring, network capacity, recording, notifications, and backup-power considerations.",
    );
  }

  if (
    answerEquals(
      answers,
      "automationPlatformPreference",
      "fully-integrated",
    ) ||
    answerEquals(
      answers,
      "lightingControlPreference",
      "whole-home",
    )
  ) {
    strategyParts.push(
      "Automation should be layered onto stable infrastructure and core systems so convenience does not come at the expense of reliability or maintainability.",
    );
  }

  if (
    answerIncludesAny(answers, "outdoorCoverage", [
      "detached-garage",
      "outbuilding",
    ])
  ) {
    strategyParts.push(
      "Connectivity to detached structures should be treated as part of the property's core network design rather than solved later as an isolated Wi-Fi problem.",
    );
  }

  const strategy =
    strategyParts.length > 0
      ? strategyParts.join(" ")
      : "The recommended strategy is to establish dependable infrastructure and core systems first, then add technology in a controlled sequence that matches household priorities.";

  /*
   * PRIORITIES
   */

  let priorities: string;

  if (majorDesignGaps.length > 0) {
    priorities =
      `The Blueprint currently identifies ${majorDesignGaps.length} critical or high-priority design ${
        majorDesignGaps.length === 1 ? "issue" : "issues"
      } that should be addressed before the project is considered installation-ready. ` +
      "Resolving these items first will reduce the risk of rework, conflicting system decisions, or infrastructure being installed before important requirements are known.";
  } else if (highPriorityRecommendations.length > 0) {
    priorities =
      `No major design conflicts are currently preventing the project from moving forward. The Blueprint does, however, contain ${highPriorityRecommendations.length} high-priority or critical ${
        highPriorityRecommendations.length === 1
          ? "recommendation"
          : "recommendations"
      } that deserve early attention during design, budgeting, and contractor coordination.`;
  } else {
    priorities =
      "The current consultation answers are generally aligned, with no major design conflicts identified. The focus can remain on disciplined infrastructure planning, system coordination, and preserving appropriate options for future expansion.";
  }

  /*
   * IMPLEMENTATION
   */

  let implementation =
    "Implementation should follow the sequence established in this Blueprint: resolve open design decisions, complete difficult-to-retrofit infrastructure, commission the core network and foundational systems, then install homeowner-facing technology.";

  if (
    answerEquals(
      answers,
      "projectPhasing",
      "infrastructure-first",
    )
  ) {
    implementation +=
      " Your preference for an infrastructure-first approach fits this strategy particularly well and allows technology purchases to be phased without sacrificing the underlying foundation.";
  }

  if (
    answerEquals(
      answers,
      "projectPhasing",
      "priority-systems",
    )
  ) {
    implementation +=
      " Since the project will be phased around priority systems, the initial infrastructure should still anticipate later systems so future phases do not require unnecessary reconstruction.";
  }

  if (
    answerEquals(
      answers,
      "projectPhasing",
      "room-by-room",
    )
  ) {
    implementation +=
      " A room-by-room rollout can work well, but shared infrastructure such as networking, equipment locations, pathways, and backbone cabling should still be planned at the whole-home level.";
  }

  implementation +=
    " Final equipment quantities, installation methods, and pricing should be verified against actual site conditions before work begins.";

  return {
    headline,
    overview,
    strategy,
    priorities,
    implementation,
  };
}