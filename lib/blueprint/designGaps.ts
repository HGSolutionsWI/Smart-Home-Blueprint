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
  const answer =
    answers[questionId];

  return (
    Array.isArray(answer) &&
    answer.includes(value)
  );
}

function answerIncludesAny(
  answers: BlueprintAnswers,
  questionId: string,
  values: readonly string[],
): boolean {
  return values.some((value) =>
    answerIncludes(
      answers,
      questionId,
      value,
    ),
  );
}

function getStringArrayAnswer(
  answers: BlueprintAnswers,
  questionId: string,
): string[] {
  const answer =
    answers[questionId];

  if (!Array.isArray(answer)) {
    return [];
  }

  return answer.filter(
    (value): value is string =>
      typeof value === "string",
  );
}

export function buildBlueprintDesignGaps(
  answers: BlueprintAnswers,
): BlueprintDesignGap[] {
  const gaps:
    BlueprintDesignGap[] = [];

  const unresolvedDecisions =
    getStringArrayAnswer(
      answers,
      "unresolvedDecisions",
    );

  const drywallApproaching =
    answerEquals(
      answers,
      "constructionStage",
      "drywall-soon",
    );

  /*
   * NETWORK READINESS
   */

  if (
    answerEquals(
      answers,
      "internetDependency",
      "critical",
    ) &&
    !answerIncludes(
      answers,
      "networkResilience",
      "ups",
    )
  ) {
    gaps.push({
      id: "critical-internet-no-ups",
      severity: "critical",
      title:
        "Critical Network Equipment Has No Backup Power Plan",
      issue:
        "Internet service is considered critical to the household, but the network resilience plan does not currently include UPS protection. A short power interruption would therefore take down the modem or ONT, router, switching, and potentially the home's Wi-Fi even if internet service itself remains available.",
      action:
        "Add UPS protection for the modem or ONT, router or firewall, core switching, controller, and any access points that must remain online. Confirm the required runtime before sizing the UPS.",
    });
  }

  if (
    (
      answerEquals(
        answers,
        "workFromHome",
        "full-time",
      ) ||
      answerEquals(
        answers,
        "workFromHome",
        "multiple-users",
      )
    ) &&
    !answerIncludes(
      answers,
      "wiredLocations",
      "office",
    )
  ) {
    gaps.push({
      id: "work-from-home-no-ethernet",
      severity: "high",
      title:
        "Primary Workspaces Are Missing Wired Network Connections",
      issue:
        "The household depends heavily on work-from-home connectivity, but office locations are not included in the wired-network plan. That leaves primary work activity dependent on Wi-Fi for video meetings, VPN traffic, and large file transfers.",
      action:
        "Add dedicated Ethernet to each permanent office or primary work location and terminate those runs at the main network equipment location.",
    });
  }

  if (
    answerEquals(
      answers,
      "gamingUse",
      "competitive",
    ) &&
    !answerIncludes(
      answers,
      "gamingInfrastructure",
      "wired-ethernet",
    )
  ) {
    gaps.push({
      id: "competitive-gaming-no-ethernet",
      severity: "high",
      title:
        "Competitive Gaming Is Planned Without Wired Ethernet",
      issue:
        "Competitive gaming was selected as a household use case, but the gaming infrastructure does not currently include wired Ethernet. That creates an avoidable dependency on wireless latency and congestion.",
      action:
        "Add dedicated Ethernet to the primary gaming PC, console, or entertainment locations before finalizing the network plan.",
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
      title:
        "High-Performance Wi-Fi Is Planned Without Wired Access-Point Locations",
      issue:
        "The desired Wi-Fi experience requires strong coverage, capacity, and roaming, but the current infrastructure plan does not include dedicated Ethernet for access points.",
      action:
        "Identify likely ceiling or wall-mounted access-point locations and add PoE-capable Ethernet runs to those positions before relying on a wireless-only mesh design.",
    });
  }

  /*
   * SECURITY READINESS
   */

  if (
    (
      answerEquals(
        answers,
        "securityPriority",
        "high",
      ) ||
      answerEquals(
        answers,
        "securitySystemPreference",
        "comprehensive",
      )
    ) &&
    !answerIncludesAny(
      answers,
      "cameraInfrastructure",
      [
        "front-entry",
        "driveway",
        "garage",
        "rear-entry",
        "backyard",
        "detached-buildings",
      ],
    )
  ) {
    gaps.push({
      id: "high-security-no-camera-plan",
      severity: "high",
      title:
        "Security Is a High Priority but Camera Coverage Has Not Been Defined",
      issue:
        "The consultation identifies security as an important project objective, but no dedicated surveillance locations have been selected. Camera quantity, cabling, recording capacity, and PoE requirements cannot be finalized until coverage goals are known.",
      action:
        "Identify the entrances, driveway, garage, yard, and other areas that require surveillance coverage, then add the approved camera locations to the Blueprint.",
    });
  }

  if (
    (
      answerEquals(
        answers,
        "cameraSystemPreference",
        "local",
      ) ||
      answerEquals(
        answers,
        "cameraSystemPreference",
        "hybrid",
      )
    ) &&
    !answerIncludes(
      answers,
      "wiredLocations",
      "cameras",
    )
  ) {
    gaps.push({
      id: "local-cameras-no-wired-camera-network",
      severity: "medium",
      title:
        "Local Camera Recording Is Planned Without Camera Ethernet Infrastructure",
      issue:
        "Local or hybrid recording has been selected, but cameras are not included in the wired-location plan. A local surveillance system normally depends on reliable wired network and PoE connectivity.",
      action:
        "Add dedicated Ethernet and PoE planning for every approved surveillance location before sizing the recorder, switch, or storage.",
    });
  }

  /*
   * DETACHED STRUCTURES
   */

  if (
    answerIncludesAny(
      answers,
      "outdoorCoverage",
      [
        "detached-garage",
        "outbuilding",
      ],
    ) &&
    !answerIncludesAny(
      answers,
      "detachedBuildingPathway",
      [
        "conduit",
        "fiber",
        "copper",
        "wireless-bridge",
      ],
    )
  ) {
    gaps.push({
      id: "detached-building-no-pathway",
      severity: "high",
      title:
        "Connectivity Is Needed at a Detached Structure but No Backbone Has Been Chosen",
      issue:
        "The project calls for network coverage at a detached garage or outbuilding, but the connection between structures has not been defined. Distance, trenching, surge exposure, and electrical isolation can materially affect the correct solution.",
      action:
        "Measure the route and confirm site conditions, then select an appropriate backbone such as conduit with fiber, copper where appropriate, or a point-to-point wireless bridge.",
    });
  }

  /*
   * AUDIO READINESS
   */

  if (
    answerIncludesAny(
      answers,
      "musicLifestyle",
      [
        "whole-home",
        "high-performance",
        "outdoor-audio",
      ],
    ) &&
    !answerIncludesAny(
      answers,
      "audioPrewire",
      [
        "living-areas",
        "primary-suite",
        "entertainment-room",
        "outdoor",
        "whole-home",
      ],
    )
  ) {
    gaps.push({
      id: "audio-priority-no-prewire",
      severity: "medium",
      title:
        "Audio Goals Are Defined but Speaker Infrastructure Is Not",
      issue:
        "The household expressed interest in permanent, whole-home, outdoor, or higher-performance audio, but no corresponding speaker prewire has been selected.",
      action:
        "Identify the rooms and outdoor areas that should become audio zones, then define speaker locations, wire routes, and amplifier termination points before finishes restrict access.",
    });
  }

  /*
   * FUTURE CAPACITY
   */

  if (
    answerEquals(
      answers,
      "futureExpansionPriority",
      "high",
    ) &&
    (
      answerEquals(
        answers,
        "spareCapacity",
        "minimal",
      ) ||
      answerEquals(
        answers,
        "conduitStrategy",
        "targeted",
      )
    )
  ) {
    gaps.push({
      id: "future-ready-capacity-mismatch",
      severity: "medium",
      title:
        "Future-Expansion Goals Exceed the Planned Spare Capacity",
      issue:
        "The household places a high value on future flexibility, but the current infrastructure plan provides limited spare capacity or limited serviceable pathways. Those choices are working against each other.",
      action:
        "Increase spare rack space, switch ports, PoE capacity, patch-panel capacity, electrical capacity, and conduit or spare cabling at the locations most difficult to retrofit later.",
    });
  }

  /*
   * EQUIPMENT LOCATION
   */

  if (
    answerEquals(
      answers,
      "preferredEquipmentLocation",
      "not-decided",
    )
  ) {
    gaps.push({
      id: "equipment-location-unresolved",
      severity:
        drywallApproaching
          ? "critical"
          : "high",
      title:
        "The Main Technology Equipment Location Has Not Been Chosen",
      issue:
        "The rack or primary equipment location remains undefined. That decision affects nearly every cable length and pathway in the project as well as power, ventilation, rack size, service access, and future expansion.",
      action:
        "Choose a dry, accessible, ventilated technology location with adequate power and room for the expected rack, patching, networking, recording, control, and future equipment.",
    });
  }

  /*
   * SPECIFIC OPEN PROJECT INPUTS
   */

  if (
    unresolvedDecisions.includes(
      "floor-plans",
    )
  ) {
    gaps.push({
      id: "floor-plans-unresolved",
      severity:
        drywallApproaching
          ? "critical"
          : "high",
      title:
        "Final Floor Plans Are Still Needed",
      issue:
        "The Blueprint does not yet have confirmed floor-plan information. Device locations, cable pathways, quantities, and room-specific recommendations should not be treated as construction-ready until the physical layout is confirmed.",
      action:
        "Obtain the current floor plans and update the Blueprint with the actual room layout before approving final device locations or cable schedules.",
    });
  }

  if (
    unresolvedDecisions.includes(
      "equipment-location",
    ) &&
    !answerEquals(
      answers,
      "preferredEquipmentLocation",
      "not-decided",
    )
  ) {
    gaps.push({
      id: "equipment-location-project-decision",
      severity:
        drywallApproaching
          ? "critical"
          : "high",
      title:
        "Technology Equipment Location Still Requires Confirmation",
      issue:
        "The equipment location is still flagged as an unresolved project decision. Until that location is confirmed, cable routes, rack requirements, network layout, power, and ventilation remain provisional.",
      action:
        "Confirm the final rack or technology location and update the Blueprint before cable lengths and installation labor are finalized.",
    });
  }

  if (
    unresolvedDecisions.includes(
      "contractor",
    )
  ) {
    gaps.push({
      id: "contractor-unresolved",
      severity:
        drywallApproaching
          ? "critical"
          : "high",
      title:
        "Installer or Contractor Responsibility Has Not Been Assigned",
      issue:
        "The project does not yet have a confirmed party responsible for the technology infrastructure. That can create gaps between electrical, low-voltage, framing, drywall, and finish work.",
      action:
        "Identify who is responsible for low-voltage installation and coordination, then confirm that cable pathways, device locations, electrical requirements, and documentation are included in that scope.",
    });
  }

  if (
    unresolvedDecisions.includes(
      "construction-timing",
    )
  ) {
    gaps.push({
      id: "construction-timing-unresolved",
      severity:
        drywallApproaching
          ? "critical"
          : "high",
      title:
        "The Technology Installation Schedule Is Not Yet Coordinated",
      issue:
        "Construction timing remains unresolved, which creates a risk that low-voltage work could miss the window when framing, ceilings, or wall cavities are accessible.",
      action:
        "Coordinate the technology rough-in with framing, electrical, insulation, drywall, cabinetry, and finish milestones so required infrastructure is installed before access is lost.",
    });
  }

  return gaps;
}