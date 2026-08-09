import type {
  BlueprintAnswers,
  BlueprintDesignGap,
  BlueprintImplementationPhase,
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

export function buildBlueprintImplementationPlan(
  answers: BlueprintAnswers,
  recommendations: BlueprintRecommendation[],
  designGaps: BlueprintDesignGap[],
): BlueprintImplementationPhase[] {
  const resolveFirstItems = [];
  const infrastructureItems = [];
  const coreSystemsItems = [];
  const technologyItems = [];
  const futureExpansionItems = [];

  /*
   * RESOLVE FIRST
   */

  designGaps
    .filter(
      (gap) =>
        gap.severity === "critical" ||
        gap.severity === "high",
    )
    .forEach((gap) => {
      resolveFirstItems.push({
        id: `resolve-${gap.id}`,
        phase: "resolve-first" as const,
        title: gap.title,
        reason: gap.issue,
        action: gap.action,
      });
    });

  if (
    answerEquals(
      answers,
      "preferredEquipmentLocation",
      "not-decided",
    )
  ) {
    resolveFirstItems.push({
      id: "resolve-equipment-location",
      phase: "resolve-first" as const,
      title: "Confirm the Main Technology Equipment Location",
      reason:
        "The network rack or primary technology location has not yet been finalized.",
      action:
        "Select a dry, accessible, ventilated location with reliable power and enough space for future expansion.",
    });
  }

  if (
    answerIncludesAny(answers, "unresolvedDecisions", [
      "floor-plans",
      "contractor",
      "equipment-location",
      "construction-timing",
    ])
  ) {
    resolveFirstItems.push({
      id: "resolve-open-decisions",
      phase: "resolve-first" as const,
      title: "Close the Remaining Project Decisions",
      reason:
        "Important project conditions are still open and could affect design, sequencing, or pricing.",
      action:
        "Resolve the flagged planning items before treating the Blueprint as construction-ready.",
    });
  }

  /*
   * INFRASTRUCTURE
   */

  if (
    answerEquals(answers, "projectType", "new-construction") ||
    answerEquals(answers, "projectType", "remodel-addition")
  ) {
    infrastructureItems.push({
      id: "install-structured-wiring",
      phase: "infrastructure" as const,
      title: "Install Structured Wiring Before Finishes Close",
      reason:
        "The project still provides an opportunity to install low-voltage infrastructure efficiently.",
      action:
        "Complete Ethernet, access-point, camera, audio, control, and other planned low-voltage cabling before drywall or finish work limits access.",
    });
  }

  if (
    answerEquals(answers, "conduitStrategy", "moderate") ||
    answerEquals(answers, "conduitStrategy", "extensive") ||
    answerEquals(answers, "futureExpansionPriority", "high")
  ) {
    infrastructureItems.push({
      id: "install-conduit",
      phase: "infrastructure" as const,
      title: "Install Strategic Future Pathways",
      reason:
        "The project places value on future flexibility and difficult-to-retrofit pathways.",
      action:
        "Install conduit or serviceable pathways to displays, equipment areas, detached structures, vertical routes, and other strategic locations.",
    });
  }

  if (
    answerIncludesAny(answers, "outdoorCoverage", [
      "detached-garage",
      "outbuilding",
    ])
  ) {
    infrastructureItems.push({
      id: "detached-building-pathway",
      phase: "infrastructure" as const,
      title: "Establish the Detached-Building Backbone",
      reason:
        "The project requires connectivity outside the main residence.",
      action:
        "Confirm the pathway between structures and install the selected conduit, fiber, copper, or wireless-bridge infrastructure.",
    });
  }

  if (
    answerIncludesAny(answers, "infrastructureDocumentation", [
      "cable-labels",
      "rack-map",
      "floor-plan",
      "photos",
      "test-results",
    ])
  ) {
    infrastructureItems.push({
      id: "document-infrastructure",
      phase: "infrastructure" as const,
      title: "Document the Hidden Infrastructure",
      reason:
        "The project includes documentation requirements that will improve future service and upgrades.",
      action:
        "Label cabling, preserve rack and floor-plan records, photograph concealed wiring, and retain cable test results where selected.",
    });
  }

  /*
   * CORE SYSTEMS
   */

  if (
    answerIncludes(answers, "wiredLocations", "network-access-points") ||
    answerEquals(answers, "wifiExperience", "high-performance") ||
    answerEquals(
      answers,
      "wifiCoveragePriority",
      "high-performance",
    )
  ) {
    coreSystemsItems.push({
      id: "deploy-core-network",
      phase: "core-systems" as const,
      title: "Deploy the Core Network First",
      reason:
        "Networking supports nearly every other smart-home system and should be stable before dependent systems are commissioned.",
      action:
        "Install and configure routing, switching, patching, wired access points, and the main network equipment before dependent systems are brought online.",
    });
  }

  if (
    answerEquals(answers, "internetDependency", "critical") ||
    answerIncludes(answers, "networkResilience", "ups")
  ) {
    coreSystemsItems.push({
      id: "protect-network-power",
      phase: "core-systems" as const,
      title: "Protect Critical Network Power",
      reason:
        "The household depends on reliable connectivity or explicitly selected UPS protection.",
      action:
        "Install and test UPS protection for the modem or ONT, router, switches, controller, and critical access points.",
    });
  }

  if (
    answerEquals(answers, "securityPriority", "high") ||
    answerEquals(
      answers,
      "securitySystemPreference",
      "comprehensive",
    )
  ) {
    coreSystemsItems.push({
      id: "commission-security",
      phase: "core-systems" as const,
      title: "Commission Security and Surveillance",
      reason:
        "Security is one of the higher-priority systems in the Blueprint.",
      action:
        "Install and verify intrusion, surveillance, entry monitoring, recording, notification, and backup-power functions before project closeout.",
    });
  }

  /*
   * TECHNOLOGY
   */

  recommendations
    .filter((recommendation) =>
      [
        "audio-video",
        "automation",
      ].includes(recommendation.category),
    )
    .forEach((recommendation) => {
      technologyItems.push({
        id: `technology-${recommendation.id}`,
        phase: "technology" as const,
        title: recommendation.title,
        reason: recommendation.rationale,
        action: recommendation.action,
      });
    });

  if (
    answerEquals(
      answers,
      "lightingControlPreference",
      "whole-home",
    )
  ) {
    technologyItems.push({
      id: "commission-lighting",
      phase: "technology" as const,
      title: "Commission Whole-Home Lighting Control",
      reason:
        "The project calls for a coordinated lighting-control experience.",
      action:
        "Program scenes, schedules, keypad behavior, and manual fallbacks after the electrical and network foundations are stable.",
    });
  }

  /*
   * FUTURE EXPANSION
   */

  if (
    answerEquals(answers, "futureExpansionPriority", "high") ||
    answerEquals(answers, "budgetSensitivity", "future-ready") ||
    answerEquals(answers, "spareCapacity", "high")
  ) {
    futureExpansionItems.push({
      id: "preserve-expansion-capacity",
      phase: "future-expansion" as const,
      title: "Preserve Capacity for Future Systems",
      reason:
        "The project places meaningful value on long-term flexibility.",
      action:
        "Leave spare rack space, switch ports, PoE budget, electrical capacity, patch-panel capacity, and pathway space for future additions.",
    });
  }

  if (
    answerEquals(
      answers,
      "projectPhasing",
      "infrastructure-first",
    ) ||
    answerEquals(
      answers,
      "projectPhasing",
      "priority-systems",
    ) ||
    answerEquals(
      answers,
      "projectPhasing",
      "room-by-room",
    )
  ) {
    futureExpansionItems.push({
      id: "phase-future-systems",
      phase: "future-expansion" as const,
      title: "Use the Blueprint as the Long-Term Expansion Map",
      reason:
        "The project is intentionally being implemented in phases.",
      action:
        "Preserve the final Blueprint and use it to guide future equipment purchases, room expansions, and system upgrades.",
    });
  }

  return [
    {
      id: "resolve-first",
      title: "1. Resolve First",
      description:
        "Close the decisions and design gaps that could affect installation, pricing, or sequencing.",
      items: resolveFirstItems,
    },
    {
      id: "infrastructure",
      title: "2. Infrastructure",
      description:
        "Complete the difficult-to-retrofit wiring, pathways, equipment locations, and documentation before finishes limit access.",
      items: infrastructureItems,
    },
    {
      id: "core-systems",
      title: "3. Core Systems",
      description:
        "Bring the network, resilience, and security foundations online before layering dependent technology on top.",
      items: coreSystemsItems,
    },
    {
      id: "technology",
      title: "4. Technology",
      description:
        "Install and commission the homeowner-facing systems after the infrastructure and core platform are stable.",
      items: technologyItems,
    },
    {
      id: "future-expansion",
      title: "5. Future Expansion",
      description:
        "Preserve capacity and documentation so the home can evolve without starting over.",
      items: futureExpansionItems,
    },
  ];
}