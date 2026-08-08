import type {
  BlueprintAnswers,
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

export function buildBlueprintRecommendations(
  answers: BlueprintAnswers,
): BlueprintRecommendation[] {
  const recommendations: BlueprintRecommendation[] = [];

  /*
   * NETWORK
   */

  if (
    answerEquals(answers, "internetDependency", "critical") ||
    answerEquals(answers, "networkPlatformPreference", "advanced") ||
    answerEquals(answers, "wifiExperience", "high-performance")
  ) {
    recommendations.push({
      id: "managed-network",
      category: "network",
      priority: "high",
      title: "Deploy a Managed Network Platform",
      rationale:
        "The household places a high value on connectivity, network performance, or advanced management capability.",
      action:
        "Use dedicated routing, managed switching, wired access points, centralized monitoring, and a properly sized equipment location.",
    });
  }

  if (
    answerEquals(answers, "workFromHome", "full-time") ||
    answerEquals(answers, "workFromHome", "multiple-users")
  ) {
    recommendations.push({
      id: "wired-workspaces",
      category: "network",
      priority: "high",
      title: "Provide Wired Connectivity to Primary Workspaces",
      rationale:
        "Frequent work-from-home activity increases the importance of stable connectivity for video meetings, file transfers, VPN access, and other business applications.",
      action:
        "Provide dedicated Ethernet connections at permanent office and workstation locations instead of relying exclusively on Wi-Fi.",
    });
  }

  if (
    answerEquals(answers, "gamingUse", "regular") ||
    answerEquals(answers, "gamingUse", "competitive")
  ) {
    recommendations.push({
      id: "wired-gaming",
      category: "network",
      priority: answerEquals(
        answers,
        "gamingUse",
        "competitive",
      )
        ? "high"
        : "recommended",
      title: "Hardwire Primary Gaming Locations",
      rationale:
        "Regular or competitive gaming benefits from consistent latency, stable throughput, and reduced dependence on the wireless environment.",
      action:
        "Provide dedicated Ethernet runs to primary gaming PCs, consoles, and entertainment locations where practical.",
    });
  }

  if (
    answerEquals(answers, "wifiCoveragePriority", "high-performance") ||
    answerEquals(answers, "wifiExperience", "high-performance")
  ) {
    recommendations.push({
      id: "high-performance-wifi",
      category: "network",
      priority: "high",
      title: "Design Wi-Fi Around Multiple Wired Access Points",
      rationale:
        "The project calls for a higher-performance Wi-Fi experience with strong coverage, roaming, and capacity.",
      action:
        "Use multiple strategically placed wired access points rather than relying on a single router or wireless-only mesh topology.",
    });
  }

  /*
   * INFRASTRUCTURE
   */

  if (
    answerEquals(answers, "projectType", "new-construction") ||
    answerEquals(answers, "projectType", "remodel-addition")
  ) {
    recommendations.push({
      id: "structured-wiring",
      category: "infrastructure",
      priority: "high",
      title: "Install Structured Wiring Before Walls Close",
      rationale:
        "The project provides access to framing or construction areas where low-voltage infrastructure can be installed efficiently.",
      action:
        "Install Ethernet, access-point, camera, audio, control, and other planned low-voltage cabling before finishes are completed.",
    });

    recommendations.push({
      id: "future-conduit",
      category: "infrastructure",
      priority: "recommended",
      title: "Install Future Technology Pathways",
      rationale:
        "Accessible construction provides a low-cost opportunity to preserve options for technologies that may not be installed today.",
      action:
        "Provide conduit or other serviceable pathways between the primary technology location and strategic attic, basement, mechanical, exterior, and expansion locations.",
    });
  }

  if (
    answerEquals(answers, "projectType", "existing-home") &&
    answerIncludes(answers, "existingHomeAccess", "limited")
  ) {
    recommendations.push({
      id: "retrofit-pathway-review",
      category: "implementation",
      priority: "high",
      title: "Complete an Installer Pathway Review",
      rationale:
        "The finished home has limited installation access, which can materially affect labor, cable routing, feasibility, and final cost.",
      action:
        "Have the installer verify attic, basement, crawl-space, chase, closet, exterior, and selective drywall routes before finalizing the installation budget.",
    });
  }

  if (
    answerEquals(answers, "futureExpansionPriority", "high") ||
    answerEquals(answers, "budgetSensitivity", "future-ready")
  ) {
    recommendations.push({
      id: "expansion-capacity",
      category: "infrastructure",
      priority: "recommended",
      title: "Reserve Infrastructure Capacity for Future Expansion",
      rationale:
        "Future flexibility has been identified as an important project objective.",
      action:
        "Reserve rack space, switch capacity, PoE capacity, conduit space, spare cable runs, and electrical capacity where practical.",
    });
  }

  if (
    answerEquals(answers, "conduitStrategy", "extensive") ||
    answerEquals(answers, "futureExpansionPriority", "high")
  ) {
    recommendations.push({
      id: "strategic-conduit",
      category: "infrastructure",
      priority: "recommended",
      title: "Prioritize Strategic Conduit Pathways",
      rationale:
        "The project places meaningful value on long-term flexibility and serviceable future pathways.",
      action:
        "Install conduit at difficult-to-retrofit locations including displays, detached structures, service entrances, major equipment locations, and vertical pathways.",
    });
  }

  if (
    answerIncludesAny(answers, "outdoorCoverage", [
      "detached-garage",
      "outbuilding",
    ])
  ) {
    recommendations.push({
      id: "detached-building-link",
      category: "infrastructure",
      priority: "high",
      title: "Plan a Dedicated Connection to Detached Buildings",
      rationale:
        "Detached structures require deliberate planning for distance, trenching, electrical isolation, and future network capacity.",
      action:
        "Provide a dedicated pathway between structures and evaluate fiber as the preferred backbone where site conditions support it.",
    });
  }

  if (
    answerEquals(answers, "spareCapacity", "high") ||
    answerEquals(answers, "futureExpansionPriority", "high")
  ) {
    recommendations.push({
      id: "spare-capacity",
      category: "infrastructure",
      priority: "recommended",
      title: "Build in Spare Rack, Switching, and PoE Capacity",
      rationale:
        "The project prioritizes expansion and will benefit from infrastructure that can accept additional devices without immediate replacement.",
      action:
        "Leave spare rack units, switch ports, PoE budget, electrical capacity, and patch-panel space for future additions.",
    });
  }

  /*
   * SECURITY
   */

  if (
    answerEquals(answers, "securityPriority", "high") ||
    answerEquals(answers, "securitySystemPreference", "comprehensive")
  ) {
    recommendations.push({
      id: "security-platform",
      category: "security",
      priority: "high",
      title: "Use a Coordinated Security Architecture",
      rationale:
        "Security is a major household priority and should be treated as a coordinated system rather than a collection of unrelated devices.",
      action:
        "Coordinate intrusion detection, surveillance, entry monitoring, remote notifications, network requirements, and backup-power needs.",
    });
  }

  if (
    answerEquals(answers, "cameraSystemPreference", "local") ||
    answerEquals(answers, "cameraSystemPreference", "hybrid")
  ) {
    recommendations.push({
      id: "local-camera-recording",
      category: "security",
      priority: "recommended",
      title: "Provide Local Video Recording",
      rationale:
        "The selected surveillance preference favors local or hybrid recording rather than complete dependence on cloud storage.",
      action:
        "Provide PoE camera infrastructure, adequate network capacity, local recording hardware, storage capacity, and protected equipment power.",
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
    recommendations.push({
      id: "poe-camera-prewire",
      category: "security",
      priority: "recommended",
      title: "Use PoE Infrastructure for Planned Camera Locations",
      rationale:
        "The infrastructure plan includes dedicated camera locations that can benefit from centralized power and wired network reliability.",
      action:
        "Run dedicated Ethernet to planned surveillance locations and size switching and UPS capacity for the expected PoE camera load.",
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
    recommendations.push({
      id: "distributed-audio",
      category: "audio-video",
      priority: "recommended",
      title: "Plan a Wired Audio Foundation",
      rationale:
        "The desired audio experience benefits from permanent speaker infrastructure and centralized or coordinated amplification.",
      action:
        "Prewire planned indoor and outdoor audio zones and establish suitable amplifier and equipment locations before finishes limit access.",
    });
  }

  if (
    answerIncludesAny(answers, "musicLifestyle", [
      "whole-home",
      "high-performance",
      "outdoor-audio",
    ]) &&
    answerIncludesAny(answers, "audioPrewire", [
      "living-areas",
      "primary-suite",
      "entertainment-room",
      "outdoor",
      "whole-home",
    ])
  ) {
    recommendations.push({
      id: "audio-design-alignment",
      category: "audio-video",
      priority: "recommended",
      title: "Align Audio Prewire with Listening Priorities",
      rationale:
        "The household's audio priorities and the infrastructure plan both support permanent wired audio zones.",
      action:
        "Confirm speaker locations, wire routes, amplifier capacity, zone count, and equipment-rack requirements before finishes are completed.",
    });
  }

  if (
    answerEquals(answers, "videoSystemPreference", "advanced")
  ) {
    recommendations.push({
      id: "advanced-av",
      category: "audio-video",
      priority: "recommended",
      title: "Plan Dedicated AV Infrastructure",
      rationale:
        "Advanced theater or distributed-video requirements can require more infrastructure than standard streaming-TV locations.",
      action:
        "Coordinate display locations, equipment placement, Ethernet, control wiring, speaker infrastructure, power, ventilation, and service access.",
    });
  }

  if (
    answerIncludes(answers, "mediaInfrastructure", "conduit") ||
    answerIncludes(
      answers,
      "mediaInfrastructure",
      "centralized-video",
    )
  ) {
    recommendations.push({
      id: "media-pathways",
      category: "audio-video",
      priority: "recommended",
      title: "Preserve Serviceable Media Pathways",
      rationale:
        "The media infrastructure plan calls for future cable flexibility or centralized equipment.",
      action:
        "Use conduit and coordinated equipment pathways between display locations and source or rack locations.",
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
    recommendations.push({
      id: "central-automation",
      category: "automation",
      priority: "recommended",
      title: "Use a Coordinated Automation Platform",
      rationale:
        "The desired experience calls for multiple home systems to operate together rather than through unrelated applications.",
      action:
        "Select an automation architecture capable of coordinating lighting, climate, security, shades, audio, and other priority systems while preserving normal manual controls.",
    });
  }

  if (
    answerEquals(
      answers,
      "lightingControlPreference",
      "whole-home",
    )
  ) {
    recommendations.push({
      id: "whole-home-lighting",
      category: "automation",
      priority: "recommended",
      title: "Plan Whole-Home Lighting Control as a System",
      rationale:
        "Whole-home lighting performs best when keypad locations, dimming loads, scenes, electrical design, and automation are coordinated early.",
      action:
        "Coordinate the lighting-control architecture with the electrical plan before device and switch locations are finalized.",
    });
  }

  if (
    answerEquals(answers, "shadePreference", "whole-home") ||
    answerEquals(answers, "shadePreference", "future")
  ) {
    recommendations.push({
      id: "shade-infrastructure",
      category: "automation",
      priority: "recommended",
      title: "Coordinate Motorized Shade Infrastructure Early",
      rationale:
        "Motorized shade planning benefits from early coordination of power, wiring, window details, and future control requirements.",
      action:
        "Confirm shade power or wiring requirements before window trim, pockets, and finishes are finalized.",
    });
  }

  /*
   * RESILIENCE
   */

  if (answerEquals(answers, "internetDependency", "critical")) {
    recommendations.push({
      id: "network-ups",
      category: "resilience",
      priority: "critical",
      title: "Protect Core Network Equipment with UPS Power",
      rationale:
        "Internet connectivity has been identified as critical to the household.",
      action:
        "Provide UPS protection for the modem or ONT, router, core switch, controller, and critical wireless access-point infrastructure.",
    });
  }

  if (
    answerEquals(answers, "powerReliability", "frequent") ||
    answerIncludes(answers, "networkResilience", "ups")
  ) {
    recommendations.push({
      id: "extended-network-resilience",
      category: "resilience",
      priority: "high",
      title: "Design the Core Network for Power Interruptions",
      rationale:
        "Frequent outages or an explicit UPS requirement make network continuity an important design consideration.",
      action:
        "Size UPS runtime around the modem or ONT, router, switching, controllers, and critical access points, and coordinate recharge and generator behavior.",
    });
  }

  if (
    answerEquals(
      answers,
      "backupEnergyIntegration",
      "network-security",
    ) ||
    answerEquals(
      answers,
      "backupEnergyIntegration",
      "broader-technology",
    )
  ) {
    recommendations.push({
      id: "technology-backup-power",
      category: "resilience",
      priority: "high",
      title: "Coordinate Technology with Backup Power",
      rationale:
        "The project calls for important technology systems to remain operational during utility interruptions.",
      action:
        "Coordinate network, security, automation, and other critical technology loads with UPS, generator, or battery-backed circuits.",
    });
  }

  if (
    answerIncludes(answers, "networkResilience", "internet-failover")
  ) {
    recommendations.push({
      id: "secondary-internet",
      category: "resilience",
      priority: "recommended",
      title: "Consider Secondary Internet Failover",
      rationale:
        "The infrastructure plan identifies continuity of internet service as important enough to justify a secondary path.",
      action:
        "Evaluate cellular or secondary-WAN failover and confirm that the selected router or firewall supports automatic failover.",
    });
  }

  if (
    answerEquals(
      answers,
      "waterProtectionPreference",
      "automatic-shutoff",
    ) ||
    answerEquals(
      answers,
      "waterProtectionPreference",
      "comprehensive",
    )
  ) {
    recommendations.push({
      id: "water-protection",
      category: "resilience",
      priority: "recommended",
      title: "Provide Automatic Water Protection",
      rationale:
        "The selected protection level calls for more than notification-only leak detection.",
      action:
        "Coordinate distributed leak sensors with an automatic main-water shutoff device and remote alerting.",
    });
  }

  /*
   * IMPLEMENTATION
   */

  if (
    answerEquals(answers, "projectPhasing", "infrastructure-first")
  ) {
    recommendations.push({
      id: "infrastructure-first-plan",
      category: "implementation",
      priority: "high",
      title: "Separate Infrastructure from Electronics Purchasing",
      rationale:
        "The project is intentionally being phased with foundational work completed before all technology is purchased.",
      action:
        "Complete wiring, conduit, rack, electrical, speaker, camera, access-point, and other difficult-to-retrofit infrastructure first, then add electronics as priorities and budget allow.",
    });
  }

  if (
    answerIncludesAny(answers, "unresolvedDecisions", [
      "floor-plans",
      "equipment-location",
      "construction-timing",
      "contractor",
    ])
  ) {
    recommendations.push({
      id: "design-verification",
      category: "implementation",
      priority: "high",
      title: "Resolve Critical Design Assumptions Before Installation",
      rationale:
        "One or more project conditions that can materially affect installation remain unresolved.",
      action:
        "Treat unresolved floor plans, equipment locations, contractor coordination, and construction timing as open design items rather than final assumptions.",
    });
  }

  if (
    answerIncludesAny(answers, "professionalReviewAreas", [
      "cable-pathways",
      "equipment-location",
      "wifi-placement",
      "camera-placement",
      "electrical",
      "audio-video",
    ])
  ) {
    recommendations.push({
      id: "professional-review",
      category: "implementation",
      priority: "recommended",
      title: "Complete the Requested Professional Verification",
      rationale:
        "The homeowner identified specific areas where on-site professional confirmation would improve confidence before installation.",
      action:
        "Include the selected review areas in the installer or contractor scope before final pricing and installation.",
    });
  }

  if (
    answerEquals(answers, "installationPreference", "diy")
  ) {
    recommendations.push({
      id: "diy-documentation",
      category: "implementation",
      priority: "recommended",
      title: "Provide Detailed Installation Documentation",
      rationale:
        "A primarily DIY implementation benefits from especially clear labeling, diagrams, cable schedules, and commissioning notes.",
      action:
        "Preserve floor-plan locations, rack mapping, cable labels, test records, and system documentation as part of the final Blueprint.",
    });
  }

  return recommendations;
}