import type { BlueprintQuestion } from "@/types/blueprint";

export const blueprintQuestions: readonly BlueprintQuestion[] = [
  {
    id: "implementationTiming",
    sessionId: "blueprint",
    type: "single-select",
    title: "When do you expect to begin implementing the Smart Home Blueprint?",
    description:
      "Choose the timing that best matches your project so we can frame priorities and sequencing appropriately.",
    required: true,
    options: [
      {
        id: "immediately",
        icon: "🚀",
        title: "Immediately",
        description:
          "Implementation is ready to begin as soon as planning is complete.",
      },
      {
        id: "1-3-months",
        icon: "📅",
        title: "Within 1–3 Months",
        description:
          "The project is expected to begin in the near term.",
      },
      {
        id: "3-6-months",
        icon: "🗓️",
        title: "Within 3–6 Months",
        description:
          "There is time to refine plans and coordinate contractors before installation.",
      },
      {
        id: "6-12-months",
        icon: "⏳",
        title: "Within 6–12 Months",
        description:
          "The project is planned but not yet ready for implementation.",
      },
      {
        id: "future",
        icon: "🔭",
        title: "Future Planning",
        description:
          "The Blueprint is primarily being created for longer-term planning.",
      },
      {
        id: "unsure",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "The implementation timeline has not been established yet.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Project timing helps determine which recommendations are urgent, which can be phased, and which should be preserved as future-ready infrastructure.",
      didYouKnow:
        "A strong Blueprint can be useful long before installation begins because it gives builders and contractors clear technology requirements early.",
    },
  },

  {
    id: "projectPhasing",
    sessionId: "blueprint",
    type: "single-select",
    title: "How would you prefer to implement the project?",
    description:
      "Choose whether you want the technology installed as one project or divided into phases.",
    required: true,
    options: [
      {
        id: "all-at-once",
        icon: "🏠",
        title: "Complete Project",
        description:
          "Install the major infrastructure and technology systems together.",
      },
      {
        id: "infrastructure-first",
        icon: "🧱",
        title: "Infrastructure First",
        description:
          "Install wiring, pathways, rack, power, and other foundational infrastructure first, then add technology over time.",
      },
      {
        id: "priority-systems",
        icon: "🎯",
        title: "Priority Systems First",
        description:
          "Start with the highest-value systems and expand later.",
      },
      {
        id: "room-by-room",
        icon: "🚪",
        title: "Room by Room",
        description:
          "Implement the project gradually by room or area.",
      },
      {
        id: "unsure",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "Let the Blueprint recommend an appropriate implementation sequence.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Phasing can reduce upfront cost without sacrificing long-term quality if the foundational infrastructure is planned correctly from the beginning.",
      didYouKnow:
        "Installing cable and conduit now while postponing expensive electronics can be one of the best ways to control cost without limiting future options.",
    },
  },

  {
    id: "installationPreference",
    sessionId: "blueprint",
    type: "single-select",
    title: "Who do you expect will install the technology?",
    description:
      "Choose the installation approach that best matches your project.",
    required: true,
    options: [
      {
        id: "professional",
        icon: "🧰",
        title: "Professional Installation",
        description:
          "A low-voltage contractor, integrator, electrician, or other professional will perform most installation work.",
      },
      {
        id: "mixed",
        icon: "🤝",
        title: "Professional + DIY",
        description:
          "Professionals will handle infrastructure or complex systems while you complete selected work yourself.",
      },
      {
        id: "diy",
        icon: "🔧",
        title: "Mostly DIY",
        description:
          "You plan to install and configure most of the technology yourself.",
      },
      {
        id: "builder-managed",
        icon: "🏗️",
        title: "Builder / General Contractor Managed",
        description:
          "The builder or GC will coordinate the necessary trades.",
      },
      {
        id: "unsure",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "The installation approach has not been determined yet.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Installation responsibility affects how detailed the contractor instructions, product specifications, and coordination notes should be in the final Blueprint.",
      didYouKnow:
        "Some systems are homeowner-friendly while others benefit significantly from professional design, commissioning, or code-compliant installation.",
    },
  },

  {
    id: "budgetSensitivity",
    sessionId: "blueprint",
    type: "single-select",
    title: "How should the Blueprint balance budget against capability?",
    description:
      "This helps us prioritize recommendations when several technically valid options exist.",
    required: true,
    options: [
      {
        id: "lowest-cost",
        icon: "💲",
        title: "Control Cost Aggressively",
        description:
          "Prioritize essential functionality and minimize unnecessary spending.",
      },
      {
        id: "value",
        icon: "⚖️",
        title: "Best Overall Value",
        description:
          "Balance upfront cost, reliability, capability, and long-term value.",
      },
      {
        id: "performance",
        icon: "⚡",
        title: "Performance First",
        description:
          "Prioritize stronger capability and reliability even when costs are higher.",
      },
      {
        id: "future-ready",
        icon: "🚀",
        title: "Future Readiness First",
        description:
          "Prioritize infrastructure, capacity, and expansion potential even if initial costs increase.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Budget strategy helps us decide where premium investment creates meaningful value and where lower-cost solutions are perfectly appropriate.",
      didYouKnow:
        "The lowest upfront price can become more expensive over time if equipment must be replaced early or infrastructure has to be reopened later.",
    },
  },

  {
    id: "professionalReviewAreas",
    sessionId: "blueprint",
    type: "multi-select",
    title: "Which areas would you like a professional installer or contractor to verify?",
    description:
      "Select any areas where on-site confirmation would improve confidence before installation.",
    required: true,
    options: [
      {
        id: "cable-pathways",
        icon: "🧵",
        title: "Cable Pathways",
        description:
          "Confirm practical routes for low-voltage wiring and conduit.",
      },
      {
        id: "equipment-location",
        icon: "🖧",
        title: "Equipment Location",
        description:
          "Verify rack, panel, power, ventilation, and serviceability.",
      },
      {
        id: "wifi-placement",
        icon: "📡",
        title: "Wi-Fi Access Point Placement",
        description:
          "Validate access-point locations based on the actual structure and materials.",
      },
      {
        id: "camera-placement",
        icon: "📷",
        title: "Camera Placement",
        description:
          "Verify views, mounting positions, lighting, and cable routes.",
      },
      {
        id: "electrical",
        icon: "⚡",
        title: "Electrical / Backup Power",
        description:
          "Confirm circuits, outlets, surge protection, generator, UPS, or battery integration.",
      },
      {
        id: "audio-video",
        icon: "🎬",
        title: "Audio / Video Locations",
        description:
          "Validate speaker, display, theater, and AV-equipment locations.",
      },
      {
        id: "none",
        icon: "✓",
        title: "No Additional Review Requested",
        description:
          "Proceed using the Blueprint recommendations and normal contractor coordination.",
      },
    ],
    defaultGuidance: {
      consultant:
        "The Blueprint can provide strong planning guidance, but some conditions are best confirmed physically before work begins.",
      didYouKnow:
        "A short on-site verification before installation can prevent expensive changes once cable has been pulled or finishes are complete.",
    },
  },

  {
    id: "priorityConfirmation",
    sessionId: "blueprint",
    type: "multi-select",
    title: "Which outcomes should receive the highest priority in your final Blueprint?",
    description:
      "Choose the priorities that should influence final recommendations, tradeoffs, and implementation order.",
    required: true,
    options: [
      {
        id: "reliability",
        icon: "🛡️",
        title: "Reliability",
        description:
          "Prioritize dependable systems and reduced troubleshooting.",
      },
      {
        id: "performance",
        icon: "⚡",
        title: "Performance",
        description:
          "Prioritize network, audio, video, and system performance.",
      },
      {
        id: "security",
        icon: "🔒",
        title: "Security",
        description:
          "Prioritize surveillance, intrusion detection, access, and resilience.",
      },
      {
        id: "simplicity",
        icon: "🙂",
        title: "Simplicity",
        description:
          "Prioritize systems that are easy for the household and guests to use.",
      },
      {
        id: "automation",
        icon: "🤖",
        title: "Automation",
        description:
          "Prioritize integration, scenes, routines, and automatic behavior.",
      },
      {
        id: "privacy",
        icon: "🔐",
        title: "Privacy / Local Control",
        description:
          "Prioritize local operation and reduced cloud dependence.",
      },
      {
        id: "future-ready",
        icon: "🚀",
        title: "Future Readiness",
        description:
          "Prioritize expansion capacity, pathways, and long-term flexibility.",
      },
      {
        id: "budget",
        icon: "💲",
        title: "Budget Control",
        description:
          "Prioritize cost control and high-value recommendations.",
      },
    ],
    defaultGuidance: {
      consultant:
        "This final priority check gives us a clear way to resolve tradeoffs when two good solutions emphasize different benefits.",
      didYouKnow:
        "A strong technology plan is not defined by how much equipment it includes—it is defined by how well the recommendations support the homeowner's actual priorities.",
    },
  },

  {
    id: "unresolvedDecisions",
    sessionId: "blueprint",
    type: "multi-select",
    title: "Are any major decisions still unresolved?",
    description:
      "Select the areas where you expect additional planning, contractor input, or product selection before installation.",
    required: true,
    options: [
      {
        id: "budget",
        icon: "💰",
        title: "Final Budget",
        description:
          "The total project budget or spending limits still need refinement.",
      },
      {
        id: "floor-plans",
        icon: "📐",
        title: "Floor Plans / Layout",
        description:
          "The building layout or room details may still change.",
      },
      {
        id: "contractor",
        icon: "🧰",
        title: "Installer / Contractor",
        description:
          "The contractor or integrator has not yet been selected.",
      },
      {
        id: "products",
        icon: "📦",
        title: "Specific Products",
        description:
          "Final brands or equipment models still need to be selected.",
      },
      {
        id: "equipment-location",
        icon: "🖧",
        title: "Equipment Location",
        description:
          "The final rack or technology-room location is still unresolved.",
      },
      {
        id: "construction-timing",
        icon: "📅",
        title: "Construction Timing",
        description:
          "Project scheduling or construction milestones are still uncertain.",
      },
      {
        id: "none",
        icon: "✅",
        title: "No Major Open Decisions",
        description:
          "The project is ready for recommendation and implementation planning.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Open decisions do not prevent us from producing a useful Blueprint. We can clearly identify assumptions and items that require confirmation before installation.",
      didYouKnow:
        "Documenting unresolved decisions is valuable because it prevents assumptions from quietly becoming installation mistakes.",
    },
  },

  {
    id: "blueprintReadiness",
    sessionId: "blueprint",
    type: "yes-no",
    title: "Are you ready to build your Smart Home Blueprint?",
    description:
      "Your answers from all five sessions will be used to create the project recommendations, priorities, risks, and implementation plan.",
    required: true,
    defaultGuidance: {
      consultant:
        "Once you confirm, the next stage will synthesize everything we have learned about the home, household, infrastructure, technology preferences, and project priorities.",
      didYouKnow:
        "Because your answers are stored as structured project data, the same information can eventually drive budgets, contractor checklists, reports, product recommendations, and AI-assisted design review.",
    },
  },
];