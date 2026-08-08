import type {
  BlueprintAnswers,
  BlueprintDesignGap,
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

export function buildBlueprintDesignGaps(
  answers: BlueprintAnswers,
): BlueprintDesignGap[] {
  const gaps: BlueprintDesignGap[] = [];

  if (
    answerEquals(answers, "internetDependency", "critical") &&
    !answerIncludes(answers, "networkResilience", "ups")
  ) {
    gaps.push({
      id: "critical-internet-no-ups",
      severity: "critical",
      title: "Critical Internet Without UPS Protection",
      issue:
        "Internet connectivity was identified as critical, but UPS protection was not included in the network resilience plan.",
      action:
        "Add UPS protection for the modem or ONT, router, core switching, controller, and critical access points.",
    });
  }

  if (
    (
      answerEquals(answers, "workFromHome", "full-time") ||
      answerEquals(answers, "workFromHome", "multiple-users")
    ) &&
    !answerIncludes(answers, "wiredLocations", "office")
  ) {
    gaps.push({
      id: "work-from-home-no-ethernet",
      severity: "high",
      title: "Work-From-Home Connectivity Gap",
      issue:
        "The household relies heavily on work-from-home connectivity, but the infrastructure plan does not include wired Ethernet at office locations.",
      action:
        "Add dedicated Ethernet connections to primary work and study locations.",
    });
  }

  if (
    answerEquals(answers, "gamingUse", "competitive") &&
    !answerIncludes(
      answers,
      "gamingInfrastructure",
      "wired-ethernet",
    )
  ) {
    gaps.push({
      id: "competitive-gaming-no-ethernet",
      severity: "high",
      title: "Competitive Gaming Infrastructure Gap",
      issue:
        "Competitive gaming was selected, but dedicated wired Ethernet was not included in the gaming infrastructure plan.",
      action:
        "Provide dedicated Ethernet to primary gaming PCs and consoles.",
    });
  }

  if (
    (
      answerEquals(
        answers,
        "wifiCoveragePriority",
        "high-performance",
      ) ||
      answerEquals(
        answers,
        "wifiExperience",
        "high-performance",
      )
    ) &&
    !answerIncludes(
      answers,
      "wiredLocations",
      "network-access-points",
    )
  ) {
    gaps.push({
      id: "high-performance-wifi-no-ap-wiring",
      severity: "high",
      title: "High-Performance Wi-Fi Without Access-Point Wiring",
      issue:
        "The project calls for high-performance Wi-Fi, but dedicated wired access-point locations were not included.",
      action:
        "Add Ethernet and PoE-capable cabling to planned access-point locations.",
    });
  }

  if (
    (
      answerEquals(answers, "securityPriority", "high") ||
      answerEquals(
        answers,
        "securitySystemPreference",
        "comprehensive",
      )
    ) &&
    !answerIncludesAny(answers, "cameraInfrastructure", [
      "front-entry",
      "driveway",
      "garage",
      "rear-entry",
      "backyard",
      "detached-buildings",
    ])
  ) {
    gaps.push({
      id: "high-security-no-camera-plan",
      severity: "high",
      title: "Security Priority Without Camera Infrastructure",
      issue:
        "Security is a major project priority, but no dedicated camera infrastructure locations were selected.",
      action:
        "Confirm surveillance coverage goals and add wired camera locations where appropriate.",
    });
  }

  if (
    answerIncludesAny(answers, "outdoorCoverage", [
      "detached-garage",
      "outbuilding",
    ]) &&
    !answerIncludesAny(
      answers,
      "detachedBuildingPathway",
      ["conduit", "fiber", "copper", "wireless-bridge"],
    )
  ) {
    gaps.push({
      id: "detached-building-no-pathway",
      severity: "high",
      title: "Detached Building Connectivity Is Unresolved",
      issue:
        "Connectivity is desired at a detached structure, but no physical or wireless pathway strategy has been selected.",
      action:
        "Confirm distance and site conditions, then select conduit, fiber, copper, or a point-to-point wireless bridge.",
    });
  }

  if (
    answerIncludesAny(answers, "musicLifestyle", [
      "whole-home",
      "high-performance",
      "outdoor-audio",
    ]) &&
    !answerIncludesAny(answers, "audioPrewire", [
      "living-areas",
      "primary-suite",
      "entertainment-room",
      "outdoor",
      "whole-home",
    ])
  ) {
    gaps.push({
      id: "audio-priority-no-prewire",
      severity: "medium",
      title: "Audio Priority Without Matching Prewire",
      issue:
        "The household expressed interest in permanent or higher-performance audio, but no corresponding speaker prewire was selected.",
      action:
        "Confirm the desired audio zones and add speaker wiring before finishes restrict access.",
    });
  }

  if (
    answerEquals(answers, "futureExpansionPriority", "high") &&
    (
      answerEquals(answers, "spareCapacity", "minimal") ||
      answerEquals(answers, "conduitStrategy", "targeted")
    )
  ) {
    gaps.push({
      id: "future-ready-capacity-mismatch",
      severity: "medium",
      title: "Future-Readiness Priority Conflicts With Capacity Plan",
      issue:
        "Future expansion is a high priority, but the infrastructure plan provides limited spare capacity or limited conduit.",
      action:
        "Increase spare rack, switching, PoE, pathway, and cabling capacity before finalizing the infrastructure plan.",
    });
  }

  if (
    (
      answerEquals(answers, "cameraSystemPreference", "local") ||
      answerEquals(answers, "cameraSystemPreference", "hybrid")
    ) &&
    !answerIncludes(answers, "wiredLocations", "cameras")
  ) {
    gaps.push({
      id: "local-cameras-no-wired-camera-network",
      severity: "medium",
      title: "Local Camera Recording Without Wired Camera Infrastructure",
      issue:
        "Local or hybrid camera recording was selected, but camera Ethernet infrastructure is not included in the wired-location plan.",
      action:
        "Add dedicated Ethernet and PoE planning for surveillance locations.",
    });
  }

  if (
    answerEquals(
      answers,
      "preferredEquipmentLocation",
      "not-decided",
    )
  ) {
    gaps.push({
      id: "equipment-location-unresolved",
      severity: "high",
      title: "Technology Equipment Location Is Unresolved",
      issue:
        "The rack or primary technology equipment location has not yet been determined.",
      action:
        "Confirm a dry, accessible, ventilated equipment location with adequate power and room for future expansion.",
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
    gaps.push({
      id: "open-project-decisions",
      severity: "high",
      title: "Important Project Decisions Remain Open",
      issue:
        "One or more unresolved decisions could materially affect installation design, sequencing, or pricing.",
      action:
        "Resolve the flagged project decisions before treating the Blueprint as construction-ready.",
    });
  }

  if (
    answerEquals(answers, "constructionStage", "drywall-soon") &&
    answerIncludesAny(answers, "unresolvedDecisions", [
      "floor-plans",
      "equipment-location",
      "contractor",
    ])
  ) {
    gaps.push({
      id: "drywall-approaching-open-decisions",
      severity: "critical",
      title: "Infrastructure Decisions Are Still Open as Drywall Approaches",
      issue:
        "The project is nearing drywall while important technology design decisions remain unresolved.",
      action:
        "Resolve wiring, pathway, equipment-location, and contractor decisions before walls are closed.",
    });
  }

  return gaps;
}