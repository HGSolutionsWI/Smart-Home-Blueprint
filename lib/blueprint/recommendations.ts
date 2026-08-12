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

function formatLabel(
  value: string,
): string {
  return value
    .replaceAll("-", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

function formatList(
  values: string[],
): string {
  const formatted =
    values.map(
      formatLabel,
    );

  if (formatted.length === 0) {
    return "";
  }

  if (formatted.length === 1) {
    return formatted[0];
  }

  if (formatted.length === 2) {
    return `${formatted[0]} and ${formatted[1]}`;
  }

  return `${formatted
    .slice(0, -1)
    .join(", ")}, and ${
    formatted[
      formatted.length - 1
    ]
  }`;
}

export function buildBlueprintRecommendations(
  answers: BlueprintAnswers,
): BlueprintRecommendation[] {
  const recommendations:
    BlueprintRecommendation[] = [];

  /*
   * SHARED PROJECT CONTEXT
   */

  const isExistingHome =
    answerEquals(
      answers,
      "projectType",
      "existing-home",
    );

  const hasLimitedAccess =
    answerIncludes(
      answers,
      "existingHomeAccess",
      "limited",
    );

  const isNewConstruction =
    answerEquals(
      answers,
      "projectType",
      "new-construction",
    );

  const isRemodel =
    answerEquals(
      answers,
      "projectType",
      "remodel-addition",
    );

  const internetIsCritical =
    answerEquals(
      answers,
      "internetDependency",
      "critical",
    );

  const highFutureExpansion =
    answerEquals(
      answers,
      "futureExpansionPriority",
      "high",
    );

  const futureReadyBudget =
    answerEquals(
      answers,
      "budgetSensitivity",
      "future-ready",
    );

  const highSecurityPriority =
    answerEquals(
      answers,
      "securityPriority",
      "high",
    );

  const comprehensiveSecurity =
    answerEquals(
      answers,
      "securitySystemPreference",
      "comprehensive",
    );

  const localCameraRecording =
    answerEquals(
      answers,
      "cameraSystemPreference",
      "local",
    );

  const hybridCameraRecording =
    answerEquals(
      answers,
      "cameraSystemPreference",
      "hybrid",
    );

  const cameraLocations =
    getStringArrayAnswer(
      answers,
      "cameraInfrastructure",
    );

  const audioPrewireLocations =
    getStringArrayAnswer(
      answers,
      "audioPrewire",
    );

  const professionalReviewAreas =
    getStringArrayAnswer(
      answers,
      "professionalReviewAreas",
    );

  const unresolvedDecisions =
    getStringArrayAnswer(
      answers,
      "unresolvedDecisions",
    );

  const cameraLocationText =
    formatList(
      cameraLocations,
    );

  const audioLocationText =
    formatList(
      audioPrewireLocations,
    );

  /*
   * NETWORK
   */

  if (
    internetIsCritical ||
    answerEquals(
      answers,
      "networkPlatformPreference",
      "advanced",
    ) ||
    answerEquals(
      answers,
      "wifiExperience",
      "high-performance",
    )
  ) {
    const criticalContext =
      internetIsCritical
        ? "Internet service is considered critical to the household, so the network should be treated as core home infrastructure rather than a collection of consumer Wi-Fi devices."
        : "The requested network experience calls for stronger performance, visibility, and control than a typical all-in-one router provides.";

    recommendations.push({
      id: "managed-network",
      category: "network",
      priority: "high",
      title:
        "Build the Home Around a Managed Network Core",
      rationale:
        criticalContext,
      action:
        "Use a dedicated router or firewall, managed switching, wired access points, centralized monitoring, and a defined equipment location. Size the switching and PoE platform for the cameras, access points, and other wired devices planned for the home.",
    });
  }

  if (
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
  ) {
    const multipleUsers =
      answerEquals(
        answers,
        "workFromHome",
        "multiple-users",
      );

    recommendations.push({
      id: "wired-workspaces",
      category: "network",
      priority: "high",
      title:
        multipleUsers
          ? "Hardwire Each Primary Work-From-Home Location"
          : "Hardwire the Primary Work-From-Home Location",
      rationale:
        multipleUsers
          ? "Multiple household members regularly depend on the home network for work, making simultaneous video meetings, VPN traffic, and large file transfers a predictable daily load."
          : "Full-time work from home makes reliable connectivity at the primary workspace more important than convenience alone.",
      action:
        "Provide dedicated Ethernet at each permanent office or workstation and connect those runs directly to the managed network. Keep Wi-Fi available for mobility, but do not make the primary work connection dependent on wireless coverage.",
    });
  }

  if (
    answerEquals(
      answers,
      "gamingUse",
      "regular",
    ) ||
    answerEquals(
      answers,
      "gamingUse",
      "competitive",
    )
  ) {
    const competitive =
      answerEquals(
        answers,
        "gamingUse",
        "competitive",
      );

    recommendations.push({
      id: "wired-gaming",
      category: "network",
      priority:
        competitive
          ? "high"
          : "recommended",
      title:
        "Provide Wired Network Connections at Primary Gaming Locations",
      rationale:
        competitive
          ? "Competitive gaming makes latency consistency and connection stability especially important; those requirements are better served by wired Ethernet than by Wi-Fi."
          : "Regular gaming benefits from stable throughput and reduced dependence on wireless congestion.",
      action:
        "Run dedicated Ethernet to the primary gaming PC, console, or entertainment locations. If several devices share one media location, provide enough ports locally or plan a small managed switch rather than repeatedly adding wireless clients.",
    });
  }

  if (
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
  ) {
    recommendations.push({
      id: "high-performance-wifi",
      category: "network",
      priority: "high",
      title:
        "Design Wi-Fi Coverage Before Choosing Access Points",
      rationale:
        "The requested Wi-Fi experience emphasizes strong coverage, roaming, and capacity. Those results depend more on access-point placement and wired backhaul than on buying a more powerful consumer router.",
      action:
        "Plan multiple ceiling or wall-mounted wired access points based on the home's layout, construction materials, and outdoor coverage goals. Home-run Ethernet to each access-point location and avoid wireless-only mesh except where wiring is genuinely impractical.",
    });
  }

  /*
   * INFRASTRUCTURE
   */

  if (
    isNewConstruction ||
    isRemodel
  ) {
    recommendations.push({
      id: "structured-wiring",
      category: "infrastructure",
      priority: "high",
      title:
        "Complete Low-Voltage Prewire Before Walls Close",
      rationale:
        isNewConstruction
          ? "New construction provides the least expensive and most flexible opportunity the home will ever have to install technology infrastructure."
          : "The remodel creates temporary access to framing and wall cavities that will become substantially more expensive to reach after finishes are restored.",
      action:
        "Install the planned Ethernet, access-point, camera, audio, control, display, and other low-voltage cabling before drywall and finishes are completed. Photograph cable routes and record every termination before walls are closed.",
    });

    recommendations.push({
      id: "future-conduit",
      category: "infrastructure",
      priority: "recommended",
      title:
        "Install Serviceable Pathways at Difficult-to-Reach Locations",
      rationale:
        "Open construction creates a low-cost opportunity to preserve future cable access without predicting every technology the home may use later.",
      action:
        "Provide conduit or another serviceable pathway from the primary technology location to strategic attic, basement, mechanical, exterior, display, and expansion areas. Prioritize locations that would otherwise require opening finished walls later.",
    });
  }

  if (
    isExistingHome &&
    hasLimitedAccess
  ) {
    let rationale =
      "This is a finished home with limited installation access, so cable routing—not equipment selection—is likely to be one of the largest variables affecting feasibility, labor, and final cost.";

    if (
      cameraLocations.length >
      0
    ) {
      rationale += ` The plan also includes camera infrastructure at ${cameraLocationText}, making route verification especially important before surveillance equipment is finalized.`;
    }

    recommendations.push({
      id: "retrofit-pathway-review",
      category: "implementation",
      priority: "high",
      title:
        "Verify Retrofit Cable Routes Before Finalizing Equipment",
      rationale,
      action:
        "Walk the home with the installer and verify usable attic, basement, crawl-space, chase, closet, exterior, and selective drywall routes. Document which planned device locations can be reached cleanly, which require alternate paths, and which may need conduit or finish repair before approving the final equipment list and labor budget.",
    });
  }

  if (
    highFutureExpansion ||
    futureReadyBudget
  ) {
    recommendations.push({
      id: "expansion-capacity",
      category: "infrastructure",
      priority: "recommended",
      title:
        "Reserve Capacity for the Next Generation of the System",
      rationale:
        "Future flexibility is a stated project objective, so the infrastructure should accommodate additions without forcing an early replacement of the rack, switch, power distribution, or pathways.",
      action:
        "Leave usable rack space, spare patch-panel positions, available switch ports, PoE headroom, electrical capacity, and accessible pathways. Where practical, include spare cable runs to difficult-to-reach areas rather than filling the system to today's exact device count.",
    });
  }

  if (
    answerEquals(
      answers,
      "conduitStrategy",
      "extensive",
    ) ||
    highFutureExpansion
  ) {
    recommendations.push({
      id: "strategic-conduit",
      category: "infrastructure",
      priority: "recommended",
      title:
        "Use Conduit Where Future Cable Replacement Would Be Difficult",
      rationale:
        "The project places meaningful value on long-term flexibility. Conduit is most valuable where the future cost of reaching the location again would be high.",
      action:
        "Prioritize conduit at displays, detached structures, service entrances, vertical transitions between floors, major equipment locations, and other routes likely to become inaccessible after construction or finishing.",
    });
  }

  if (
    answerIncludesAny(
      answers,
      "outdoorCoverage",
      [
        "detached-garage",
        "outbuilding",
      ],
    )
  ) {
    recommendations.push({
      id: "detached-building-link",
      category: "infrastructure",
      priority: "high",
      title:
        "Plan a Dedicated Backbone to Detached Structures",
      rationale:
        "Detached structures introduce distance, trenching, surge exposure, electrical-potential differences, and future bandwidth requirements that should be addressed as infrastructure rather than treated as a Wi-Fi coverage problem.",
      action:
        "Provide a dedicated pathway between structures and evaluate fiber as the preferred backbone where practical. Coordinate trench depth, conduit size, pull points, equipment locations, and power before landscaping or hardscape work makes the route difficult to access.",
    });
  }

  if (
    answerEquals(
      answers,
      "spareCapacity",
      "high",
    ) ||
    highFutureExpansion
  ) {
    recommendations.push({
      id: "spare-capacity",
      category: "infrastructure",
      priority: "recommended",
      title:
        "Do Not Size the Rack and Network to Today's Exact Device Count",
      rationale:
        "The project anticipates future expansion, and a fully occupied rack or switch at initial installation creates unnecessary replacement costs when the first additions are made.",
      action:
        "Leave spare rack units, patch-panel positions, switch ports, PoE budget, UPS capacity, and electrical outlets. A reasonable reserve now is typically easier and less expensive than replacing core infrastructure later.",
    });
  }

  /*
   * SECURITY
   */

  if (
    highSecurityPriority ||
    comprehensiveSecurity
  ) {
    let rationale =
      "Security is a major household priority and should be designed as a coordinated system instead of a collection of unrelated cameras, sensors, and applications.";

    if (
      localCameraRecording ||
      hybridCameraRecording
    ) {
      rationale +=
        " The preference for local or hybrid video recording also makes the network, recording hardware, storage, and backup-power strategy part of the security design.";
    }

    recommendations.push({
      id: "security-platform",
      category: "security",
      priority: "high",
      title:
        "Design Security as One Coordinated Architecture",
      rationale,
      action:
        "Coordinate intrusion detection, surveillance, entry monitoring, remote notifications, local recording requirements, network connectivity, and backup power before selecting individual devices. Keep critical security functions usable even if a cloud service or internet connection is unavailable.",
    });
  }

  if (
    localCameraRecording ||
    hybridCameraRecording
  ) {
    recommendations.push({
      id: "local-camera-recording",
      category: "security",
      priority: "recommended",
      title:
        "Size Local Recording Around the Final Camera Plan",
      rationale:
        localCameraRecording
          ? "The surveillance strategy relies on local recording, so storage capacity, recording hardware, network throughput, and protected power must be sized as part of the core system."
          : "The surveillance strategy combines local and cloud capabilities, so the home still needs enough local storage and network capacity to operate reliably when cloud connectivity is unavailable.",
      action:
        "Confirm the final camera count, resolution, frame-rate expectations, retention period, and continuous-versus-event recording strategy before sizing the recorder and storage. Include the recorder, PoE switching, and core network on protected power.",
    });
  }

  if (
    cameraLocations.length >
    0
  ) {
    const limitedRetrofitText =
      isExistingHome &&
      hasLimitedAccess
        ? " Because this is a finished home with limited access, verify each cable route before selecting final camera hardware."
        : "";

    recommendations.push({
      id: "poe-camera-prewire",
      category: "security",
      priority: "recommended",
      title:
        "Home-Run Ethernet to Each Planned Camera Position",
      rationale:
        `The consultation identifies camera infrastructure at ${cameraLocationText}. Wired PoE provides centralized power, predictable network performance, and simpler service than relying on nearby outlets and Wi-Fi.${limitedRetrofitText}`,
      action:
        "Run an individual Cat6 or better cable from the technology location to each approved camera position. Label every run, leave serviceable cable at the device end, and size the PoE switch and UPS around the final number and power requirements of the cameras.",
    });
  }

  /*
   * AUDIO / VIDEO
   */

  if (
    answerEquals(
      answers,
      "audioSystemPreference",
      "whole-home",
    ) ||
    answerEquals(
      answers,
      "audioSystemPreference",
      "high-performance",
    )
  ) {
    const highPerformance =
      answerEquals(
        answers,
        "audioSystemPreference",
        "high-performance",
      );

    recommendations.push({
      id: "distributed-audio",
      category: "audio-video",
      priority: "recommended",
      title:
        highPerformance
          ? "Plan Speaker Wiring and Equipment Capacity as Part of the AV Design"
          : "Establish a Wired Foundation for Whole-Home Audio",
      rationale:
        highPerformance
          ? "The desired listening experience may require dedicated speaker placement, amplification, equipment ventilation, and cable infrastructure that should be resolved before finishes limit access."
          : "Whole-home audio is easier to service and expand when permanent speaker wiring and amplifier locations are planned before relying on individual wireless speakers.",
      action:
        "Confirm the intended audio zones, speaker locations, wire routes, amplifier locations, and equipment-rack requirements before installation. Home-run speaker cabling where centralized amplification is planned and document every zone.",
    });
  }

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
    audioPrewireLocations.length >
    0
  ) {
    recommendations.push({
      id: "audio-design-alignment",
      category: "audio-video",
      priority: "recommended",
      title:
        "Finalize the Planned Audio Zones Before Prewire",
      rationale:
        audioLocationText
          ? `The consultation calls for permanent audio infrastructure in ${audioLocationText}. Those areas should be treated as defined audio zones rather than generic speaker-wire locations.`
          : "The household's listening priorities and infrastructure choices support permanent wired audio zones.",
      action:
        "For each planned zone, confirm speaker count and placement, stereo versus mono requirements, independent volume/control needs, amplifier channels, cable routes, and where the speaker wiring will terminate. Resolve outdoor speaker and equipment requirements before exterior finishes are completed.",
    });
  }

  if (
    answerEquals(
      answers,
      "videoSystemPreference",
      "advanced",
    )
  ) {
    recommendations.push({
      id: "advanced-av",
      category: "audio-video",
      priority: "recommended",
      title:
        "Design Advanced AV Locations as Complete Systems",
      rationale:
        "Advanced theater or distributed-video locations typically require more than a display and an electrical outlet; source equipment, networking, audio, control, ventilation, service access, and future cable replacement all need coordination.",
      action:
        "At each advanced AV location, define where source equipment will live, how video and network signals reach the display, speaker and control requirements, power locations, ventilation, and a serviceable pathway for future cabling.",
    });
  }

  if (
    answerIncludes(
      answers,
      "mediaInfrastructure",
      "conduit",
    ) ||
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
      title:
        "Keep Display-to-Equipment Pathways Serviceable",
      rationale:
        "The media strategy includes centralized equipment or future cable flexibility, so the connection between displays and source locations must remain replaceable as video standards change.",
      action:
        "Provide appropriately sized conduit or another serviceable pathway between major display locations and the source or rack location. Avoid burying irreplaceable HDMI or proprietary cabling in inaccessible walls without a future pull path.",
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
      title:
        "Choose the Automation Architecture Before Selecting Subsystems",
      rationale:
        "The desired experience calls for lighting, climate, security, shades, audio, and other systems to operate together. Those integration goals should influence product selection rather than being added after each subsystem is purchased.",
      action:
        "Select an automation architecture capable of coordinating the priority systems while preserving normal manual operation. Confirm network requirements, controller location, supported integrations, and what continues to work if the automation controller or internet connection is unavailable.",
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
      title:
        "Coordinate Whole-Home Lighting Before the Electrical Plan Is Final",
      rationale:
        "Whole-home lighting control affects keypad locations, dimming compatibility, circuit design, scenes, automation, and how occupants operate the home every day.",
      action:
        "Coordinate the lighting-control architecture with the electrician before switch boxes, device locations, and load assignments are finalized. Define where conventional controls remain appropriate and where keypads or centralized controls will be used.",
    });
  }

  if (
    answerEquals(
      answers,
      "shadePreference",
      "whole-home",
    ) ||
    answerEquals(
      answers,
      "shadePreference",
      "future",
    )
  ) {
    recommendations.push({
      id: "shade-infrastructure",
      category: "automation",
      priority: "recommended",
      title:
        "Resolve Motorized Shade Power Before Window Finishes",
      rationale:
        "Shade wiring and power are inexpensive to coordinate before window trim and finishes are complete but can be disruptive to retrofit later.",
      action:
        "Identify the windows likely to receive motorized shades and confirm the selected shade platform's power or low-voltage requirements. Route the required wiring before trim, pockets, and finish work limit access.",
    });
  }

  /*
   * RESILIENCE
   */

  if (
    internetIsCritical
  ) {
    recommendations.push({
      id: "network-ups",
      category: "resilience",
      priority: "critical",
      title:
        "Keep the Core Network Online During Short Power Outages",
      rationale:
        "Internet connectivity is classified as critical to the household, so a brief utility interruption should not immediately take down the modem or ONT, router, switching, and wireless infrastructure.",
      action:
        "Provide UPS protection for the modem or ONT, router or firewall, core switch, network controller, and the PoE load required to keep critical access points operating. Size runtime around the household's actual continuity requirement rather than simply purchasing the smallest UPS that fits.",
    });
  }

  if (
    answerEquals(
      answers,
      "powerReliability",
      "frequent",
    ) ||
    answerIncludes(
      answers,
      "networkResilience",
      "ups",
    )
  ) {
    recommendations.push({
      id: "extended-network-resilience",
      category: "resilience",
      priority: "high",
      title:
        "Size Network Backup Power for the Home's Actual Outage Pattern",
      rationale:
        "Frequent outages or an explicit UPS requirement make network continuity an operational requirement rather than an optional accessory.",
      action:
        "Calculate the combined load of the modem or ONT, router, switches, controllers, critical access points, cameras, and recorder that must remain online. Size UPS runtime accordingly and coordinate how the network transitions to generator or battery-backed circuits if longer backup is available.",
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
      title:
        "Put Critical Technology Loads on the Backup-Power Plan",
      rationale:
        "The project expects important technology systems to continue operating during utility interruptions, so their circuits and power requirements should be coordinated with the home's backup-energy design.",
      action:
        "Identify which network, security, automation, AV, and control loads must remain available during an outage. Coordinate those loads with UPS, generator, or battery-backed circuits and make sure the required equipment outlets are on the intended protected circuits.",
    });
  }

  if (
    answerIncludes(
      answers,
      "networkResilience",
      "internet-failover",
    )
  ) {
    recommendations.push({
      id: "secondary-internet",
      category: "resilience",
      priority: "recommended",
      title:
        "Provide an Automatic Secondary Internet Path",
      rationale:
        "The consultation identifies internet continuity as important enough to justify service beyond the primary ISP connection.",
      action:
        "Confirm that the router or firewall supports automatic WAN failover and evaluate cellular or a second wired provider. Test which household services continue to function on the backup connection and whether data limits or reduced bandwidth require prioritization.",
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
      title:
        "Combine Leak Detection with Automatic Water Shutoff",
      rationale:
        "The selected protection level calls for preventing continued water flow after a leak is detected rather than only sending a notification.",
      action:
        "Place leak sensors at the highest-risk plumbing and appliance locations, coordinate them with an automatic main-water shutoff device, and confirm that alerts and manual override remain available when internet service is unavailable.",
    });
  }

  /*
   * IMPLEMENTATION
   */

  if (
    answerEquals(
      answers,
      "projectPhasing",
      "infrastructure-first",
    )
  ) {
    recommendations.push({
      id: "infrastructure-first-plan",
      category: "implementation",
      priority: "high",
      title:
        "Complete Difficult-to-Retrofit Infrastructure Before Buying Every Device",
      rationale:
        "The project is intentionally being phased, which creates an opportunity to preserve the final design without purchasing electronics that may become outdated before they are installed.",
      action:
        "Complete wiring, conduit, rack preparation, electrical coordination, speaker prewire, camera cabling, access-point cabling, and other permanent infrastructure first. Purchase and commission electronics as priorities and budget allow.",
    });
  }

  if (
    answerIncludesAny(
      answers,
      "unresolvedDecisions",
      [
        "floor-plans",
        "equipment-location",
        "construction-timing",
        "contractor",
      ],
    )
  ) {
    const unresolvedText =
      formatList(
        unresolvedDecisions.filter(
          (item) =>
            [
              "floor-plans",
              "equipment-location",
              "construction-timing",
              "contractor",
            ].includes(item),
        ),
      );

    recommendations.push({
      id: "design-verification",
      category: "implementation",
      priority: "high",
      title:
        "Resolve the Open Design Inputs Before Final Pricing",
      rationale:
        unresolvedText
          ? `The consultation still identifies ${unresolvedText} as unresolved. Those items can materially change cable routes, equipment placement, labor, and final scope.`
          : "One or more project conditions that materially affect installation remain unresolved.",
      action:
        "Treat these items as open design decisions rather than assumptions. Resolve them before approving final equipment quantities, labor estimates, or cable schedules so the installation is priced against the actual project conditions.",
    });
  }

  if (
    answerIncludesAny(
      answers,
      "professionalReviewAreas",
      [
        "cable-pathways",
        "equipment-location",
        "wifi-placement",
        "camera-placement",
        "electrical",
        "audio-video",
      ],
    )
  ) {
    const reviewText =
      formatList(
        professionalReviewAreas.filter(
          (item) =>
            [
              "cable-pathways",
              "equipment-location",
              "wifi-placement",
              "camera-placement",
              "electrical",
              "audio-video",
            ].includes(item),
        ),
      );

    recommendations.push({
      id: "professional-review",
      category: "implementation",
      priority: "recommended",
      title:
        "Complete the Requested On-Site Design Verification",
      rationale:
        reviewText
          ? `The homeowner specifically requested professional verification of ${reviewText}. Those are the areas where site conditions can materially change the design or installation approach.`
          : "The homeowner identified specific areas where on-site professional confirmation would improve confidence before installation.",
      action:
        "Add the selected review items to the installer or contractor scope and document the resulting decisions in the Blueprint before final pricing and installation begin.",
    });
  }

  if (
    answerEquals(
      answers,
      "installationPreference",
      "diy",
    )
  ) {
    recommendations.push({
      id: "diy-documentation",
      category: "implementation",
      priority: "recommended",
      title:
        "Document the Installation as Carefully as the Equipment",
      rationale:
        "A primarily DIY implementation depends heavily on accurate records because there may not be a professional installer available later to explain cable routes, terminations, configuration, or commissioning decisions.",
      action:
        "Preserve floor-plan device locations, cable labels, rack mapping, termination schedules, network information, test records, product manuals, and commissioning notes in the Blueprint and Smart Manual as the work is completed.",
    });
  }

  return recommendations;
}