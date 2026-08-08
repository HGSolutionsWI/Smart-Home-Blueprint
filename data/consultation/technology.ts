import type { BlueprintQuestion } from "@/types/blueprint";

export const technologyQuestions: readonly BlueprintQuestion[] = [
  {
    id: "networkPlatformPreference",
    sessionId: "technology",
    type: "single-select",
    title: "What kind of home network experience do you want?",
    description:
      "Choose the level of networking capability and management that best fits your household.",
    required: true,
    options: [
      {
        id: "simple",
        icon: "📶",
        title: "Simple and Reliable",
        description:
          "Prioritize straightforward operation with minimal management.",
      },
      {
        id: "managed",
        icon: "🖧",
        title: "Managed Home Network",
        description:
          "Use dedicated routing, switching, access points, and centralized management.",
      },
      {
        id: "advanced",
        icon: "⚙️",
        title: "Advanced / Prosumer",
        description:
          "Prioritize deeper controls, segmentation, monitoring, and future flexibility.",
      },
      {
        id: "unsure",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "Let the Blueprint recommend the appropriate network platform level.",
      },
    ],
    defaultGuidance: {
      consultant:
        "The right network platform should match both the home's complexity and the household's comfort with technology.",
      didYouKnow:
        "A managed network can improve reliability and visibility without requiring the homeowner to manage it every day.",
    },
  },

  {
    id: "wifiExperience",
    sessionId: "technology",
    type: "single-select",
    title: "What Wi-Fi experience are you aiming for?",
    description:
      "Choose the level that best matches your expectations for coverage, roaming, and performance.",
    required: true,
    options: [
      {
        id: "good",
        icon: "📶",
        title: "Good Everyday Wi-Fi",
        description:
          "Reliable coverage for normal household use.",
      },
      {
        id: "strong",
        icon: "🏠",
        title: "Strong Whole-Home Wi-Fi",
        description:
          "Consistent coverage and better roaming throughout the home.",
      },
      {
        id: "high-performance",
        icon: "⚡",
        title: "High-Performance Wi-Fi",
        description:
          "Prioritize capacity, roaming, performance, and dense-device support.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Your Wi-Fi experience should reflect actual usage, not just internet speed. The Blueprint will combine this preference with home size, floor count, materials, and device needs.",
      didYouKnow:
        "Access-point placement and wired backhaul usually matter more than simply buying the most expensive router.",
    },
  },

  {
    id: "securitySystemPreference",
    sessionId: "technology",
    type: "single-select",
    title: "What level of security system do you want?",
    description:
      "Choose the level that best matches your security priorities.",
    required: true,
    condition: {
      operator: "OR",
      rules: [
        {
          questionId: "securityPriority",
          equals: "important",
        },
        {
          questionId: "securityPriority",
          equals: "high",
        },
      ],
    },
    options: [
      {
        id: "basic",
        icon: "🔒",
        title: "Basic Security",
        description:
          "Door, window, motion, and basic alerting are sufficient.",
      },
      {
        id: "enhanced",
        icon: "🛡️",
        title: "Enhanced Security",
        description:
          "Combine intrusion detection, cameras, entry monitoring, and stronger system integration.",
      },
      {
        id: "comprehensive",
        icon: "🚨",
        title: "Comprehensive Security",
        description:
          "Prioritize robust surveillance, access, monitoring, resilience, and system coordination.",
      },
      {
        id: "unsure",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "Let the Blueprint recommend the appropriate security level.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Security recommendations should reflect both risk tolerance and how much active monitoring you actually want.",
      didYouKnow:
        "A highly capable security system can still feel simple if alerts and controls are carefully designed.",
    },
  },

  {
    id: "cameraSystemPreference",
    sessionId: "technology",
    type: "single-select",
    title: "What kind of camera system do you prefer?",
    description:
      "Choose the surveillance approach that best fits your priorities.",
    required: true,
    condition: {
      operator: "OR",
      rules: [
        {
          questionId: "securityPriority",
          equals: "important",
        },
        {
          questionId: "securityPriority",
          equals: "high",
        },
        {
          questionId: "securityInfrastructure",
          includes: "wired-cameras",
        },
        {
          questionId: "securityInfrastructure",
          includes: "wireless-cameras",
        },
      ],
    },
    options: [
      {
        id: "cloud",
        icon: "☁️",
        title: "Cloud-Based Cameras",
        description:
          "Prioritize easy remote access and cloud-managed video services.",
      },
      {
        id: "local",
        icon: "💾",
        title: "Local Recording",
        description:
          "Prioritize local video storage and reduced cloud dependence.",
      },
      {
        id: "hybrid",
        icon: "⚖️",
        title: "Hybrid",
        description:
          "Use a mix of local recording and cloud-connected features.",
      },
      {
        id: "unsure",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "Let the Blueprint recommend the best architecture.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Camera architecture affects privacy, storage, bandwidth, remote access, and ongoing subscription costs.",
      didYouKnow:
        "Local recording can reduce cloud dependence, while cloud services often simplify remote access and notifications.",
    },
  },

  {
    id: "accessControlPreference",
    sessionId: "technology",
    type: "multi-select",
    title: "Which smart entry features interest you?",
    description:
      "Select every option you would like considered.",
    required: true,
    options: [
      {
        id: "smart-locks",
        icon: "🔐",
        title: "Smart Locks",
        description:
          "Control and monitor door locks digitally.",
      },
      {
        id: "video-doorbell",
        icon: "🔔",
        title: "Video Doorbell",
        description:
          "Combine entry video, communication, and notifications.",
      },
      {
        id: "garage-control",
        icon: "🚗",
        title: "Garage Door Control",
        description:
          "Monitor and control garage access remotely.",
      },
      {
        id: "gate-control",
        icon: "🚧",
        title: "Gate / Property Access",
        description:
          "Control or monitor remote property entrances.",
      },
      {
        id: "intercom",
        icon: "🎙️",
        title: "Intercom / Entry Communication",
        description:
          "Support visitor communication at doors or gates.",
      },
      {
        id: "none",
        icon: "➖",
        title: "None",
        description:
          "Smart entry features are not a priority.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Entry technology works best when locks, cameras, doorbells, garage controls, and access methods are planned together.",
      didYouKnow:
        "A smart lock is most useful when the household also has a clear strategy for guests, backup access, and remote management.",
    },
  },

  {
    id: "lightingControlPreference",
    sessionId: "technology",
    type: "single-select",
    title: "What level of lighting control do you want?",
    description:
      "Choose the lighting-control experience that best matches your household.",
    required: true,
    options: [
      {
        id: "standard",
        icon: "💡",
        title: "Standard Smart Switches",
        description:
          "Use selected connected switches and dimmers without a whole-home lighting system.",
      },
      {
        id: "selected-scenes",
        icon: "✨",
        title: "Selected Scenes and Automation",
        description:
          "Use scenes, schedules, and automation in important rooms.",
      },
      {
        id: "whole-home",
        icon: "🏠",
        title: "Whole-Home Lighting Control",
        description:
          "Coordinate lighting throughout the home with centralized scenes and consistent controls.",
      },
      {
        id: "unsure",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "Let the Blueprint recommend the appropriate lighting strategy.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Lighting control can range from a few smart dimmers to a fully integrated whole-home system.",
      didYouKnow:
        "The best lighting automation usually preserves normal wall controls while adding scenes and automatic behavior.",
    },
  },

  {
    id: "shadePreference",
    sessionId: "technology",
    type: "single-select",
    title: "Are motorized shades or window treatments part of your vision?",
    description:
      "Choose the level of interest that best matches the project.",
    required: true,
    options: [
      {
        id: "none",
        icon: "➖",
        title: "Not a Priority",
        description:
          "Motorized shades are not currently part of the project.",
      },
      {
        id: "selected",
        icon: "🪟",
        title: "Selected Rooms",
        description:
          "Consider motorized shades in bedrooms, large windows, or key living spaces.",
      },
      {
        id: "whole-home",
        icon: "🏠",
        title: "Whole-Home / Major Areas",
        description:
          "Plan coordinated motorized shading across many rooms.",
      },
      {
        id: "future",
        icon: "🚀",
        title: "Future-Ready Only",
        description:
          "Plan power or wiring now even if shades will be added later.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Motorized shade planning is easiest when power, wiring, pockets, and window details are coordinated early.",
      didYouKnow:
        "Prewiring for shades can preserve future options even if the motors and fabrics are not purchased during the initial project.",
    },
  },

  {
    id: "climateControlPreference",
    sessionId: "technology",
    type: "single-select",
    title: "What level of climate control do you want?",
    description:
      "Think about thermostats, zoning, remote access, schedules, and automation.",
    required: true,
    options: [
      {
        id: "basic-smart",
        icon: "🌡️",
        title: "Basic Smart Thermostat",
        description:
          "Use connected thermostats with schedules and remote access.",
      },
      {
        id: "zoned",
        icon: "🏠",
        title: "Multi-Zone Climate Control",
        description:
          "Coordinate multiple zones or HVAC systems throughout the home.",
      },
      {
        id: "integrated",
        icon: "⚙️",
        title: "Integrated Climate Automation",
        description:
          "Tie climate into occupancy, scenes, shades, and other home systems.",
      },
      {
        id: "unsure",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "Let the Blueprint recommend the appropriate level.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Climate control should reflect the HVAC system, number of zones, comfort priorities, and desired level of automation.",
      didYouKnow:
        "Smart thermostats cannot create true HVAC zoning unless the mechanical system itself supports zoning.",
    },
  },

  {
    id: "waterProtectionPreference",
    sessionId: "technology",
    type: "single-select",
    title: "How much water-leak protection do you want?",
    description:
      "Choose the level that best matches your risk tolerance and travel habits.",
    required: true,
    options: [
      {
        id: "basic-sensors",
        icon: "💧",
        title: "Leak Sensors",
        description:
          "Use sensors in high-risk areas such as water heaters, sinks, laundry, and mechanical rooms.",
      },
      {
        id: "automatic-shutoff",
        icon: "🚰",
        title: "Automatic Water Shutoff",
        description:
          "Use leak detection with automatic main-water shutoff capability.",
      },
      {
        id: "comprehensive",
        icon: "🛡️",
        title: "Comprehensive Water Protection",
        description:
          "Combine shutoff, distributed sensors, alerts, and broader monitoring.",
      },
      {
        id: "not-priority",
        icon: "➖",
        title: "Not a Priority",
        description:
          "Water protection is not currently a major project goal.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Water protection can provide significant value, especially for homes that are frequently unoccupied.",
      didYouKnow:
        "A relatively small plumbing leak can cause more financial damage than many security incidents if it continues unnoticed.",
    },
  },

  {
    id: "audioSystemPreference",
    sessionId: "technology",
    type: "single-select",
    title: "What kind of home audio experience do you want?",
    description:
      "Choose the system level that best matches your listening habits.",
    required: true,
    condition: {
      operator: "OR",
      rules: [
        {
          questionId: "musicLifestyle",
          includes: "whole-home",
        },
        {
          questionId: "musicLifestyle",
          includes: "high-performance",
        },
        {
          questionId: "musicLifestyle",
          includes: "outdoor-audio",
        },
        {
          questionId: "audioInfrastructure",
          includes: "in-ceiling-speakers",
        },
        {
          questionId: "audioInfrastructure",
          includes: "speaker-wire",
        },
      ],
    },
    options: [
      {
        id: "wireless",
        icon: "📶",
        title: "Primarily Wireless Audio",
        description:
          "Use smart or wireless speakers with minimal permanent infrastructure.",
      },
      {
        id: "selected-wired",
        icon: "🔊",
        title: "Wired Audio in Selected Rooms",
        description:
          "Use architectural speakers in important spaces and wireless audio elsewhere.",
      },
      {
        id: "whole-home",
        icon: "🎵",
        title: "Whole-Home Distributed Audio",
        description:
          "Use centralized or coordinated audio across many rooms and outdoor areas.",
      },
      {
        id: "high-performance",
        icon: "🎚️",
        title: "High-Performance Audio",
        description:
          "Prioritize sound quality in selected listening or theater spaces.",
      },
    ],
    defaultGuidance: {
      consultant:
        "The audio platform should match both how many rooms need music and how important sound quality is in each area.",
      didYouKnow:
        "A home can combine whole-home background audio with higher-performance systems in only the rooms where sound quality matters most.",
    },
  },

  {
    id: "videoSystemPreference",
    sessionId: "technology",
    type: "single-select",
    title: "How sophisticated should the home's video and entertainment systems be?",
    description:
      "Choose the level that best matches your entertainment expectations.",
    required: true,
    options: [
      {
        id: "simple",
        icon: "📺",
        title: "Simple Streaming TVs",
        description:
          "Use smart TVs and local streaming devices with minimal centralized equipment.",
      },
      {
        id: "enhanced",
        icon: "🎬",
        title: "Enhanced Media Rooms",
        description:
          "Use upgraded displays, audio, and dedicated media equipment in selected rooms.",
      },
      {
        id: "advanced",
        icon: "🍿",
        title: "Advanced Theater / Distributed Video",
        description:
          "Consider theater-grade systems, centralized sources, or advanced media distribution.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Video-system complexity should match actual viewing habits rather than adding centralized equipment where simple streaming would work just as well.",
      didYouKnow:
        "Modern streaming has reduced the need for centralized video distribution in many homes, but dedicated theaters and specialty rooms may still benefit from advanced designs.",
    },
  },

  {
    id: "automationPlatformPreference",
    sessionId: "technology",
    type: "single-select",
    title: "How integrated should the smart home be?",
    description:
      "Choose the level of coordination you want between lighting, climate, security, audio, shades, and other systems.",
    required: true,
    condition: {
      operator: "OR",
      rules: [
        {
          questionId: "automationInterest",
          equals: "moderate",
        },
        {
          questionId: "automationInterest",
          equals: "high",
        },
        {
          questionId: "automationInterest",
          equals: "unsure",
        },
      ],
    },
    options: [
      {
        id: "independent",
        icon: "📱",
        title: "Mostly Independent Systems",
        description:
          "Use separate apps and simple integrations where useful.",
      },
      {
        id: "moderately-integrated",
        icon: "🔗",
        title: "Moderately Integrated",
        description:
          "Coordinate important systems through shared scenes and routines.",
      },
      {
        id: "fully-integrated",
        icon: "🏠",
        title: "Highly Integrated Home",
        description:
          "Use a central automation platform to coordinate many systems throughout the home.",
      },
      {
        id: "unsure",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "Let the Blueprint recommend the appropriate integration level.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Integration should make the home easier to use, not simply connect everything because it is technically possible.",
      didYouKnow:
        "The highest-value integrations often connect only a few systems around meaningful routines such as Away, Good Night, or Arrive Home.",
    },
  },

  {
    id: "voiceAssistantPreference",
    sessionId: "technology",
    type: "single-select",
    title: "How do you feel about voice assistants?",
    description:
      "Choose the role voice control should play in the home.",
    required: true,
    options: [
      {
        id: "avoid",
        icon: "🔇",
        title: "Prefer to Avoid",
        description:
          "Do not make voice assistants part of the core design.",
      },
      {
        id: "optional",
        icon: "🎙️",
        title: "Optional Convenience",
        description:
          "Voice control is useful but should not be required for everyday operation.",
      },
      {
        id: "important",
        icon: "🗣️",
        title: "Important Control Method",
        description:
          "Voice assistants should be widely available throughout the home.",
      },
      {
        id: "unsure",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "Let the Blueprint recommend whether voice integration makes sense.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Voice assistants can be convenient, but the home should still remain usable when cloud services or voice recognition are unavailable.",
      didYouKnow:
        "Voice control works best as an additional interface rather than the only way to control important home functions.",
    },
  },

  {
    id: "backupEnergyIntegration",
    sessionId: "technology",
    type: "single-select",
    title: "How much should backup power integrate with the technology systems?",
    description:
      "Choose the level that best reflects your resilience goals.",
    required: true,
    condition: {
      operator: "OR",
      rules: [
        {
          questionId: "backupPower",
          includes: "whole-home-generator",
        },
        {
          questionId: "backupPower",
          includes: "battery-storage",
        },
        {
          questionId: "backupPower",
          includes: "planned",
        },
        {
          questionId: "internetDependency",
          equals: "critical",
        },
      ],
    },
    options: [
      {
        id: "core-network",
        icon: "🔋",
        title: "Protect Core Network Only",
        description:
          "Keep modem, router, switches, and access points online.",
      },
      {
        id: "network-security",
        icon: "🛡️",
        title: "Network + Security",
        description:
          "Protect core networking, cameras, access, and security systems.",
      },
      {
        id: "broader-technology",
        icon: "🏠",
        title: "Broader Technology Backup",
        description:
          "Coordinate backup power for networking, security, automation, controls, and selected AV systems.",
      },
      {
        id: "unsure",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "Let the Blueprint recommend the appropriate resilience level.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Backup-energy planning should prioritize the systems that preserve connectivity, safety, and control during an outage.",
      didYouKnow:
        "A whole-home generator does not eliminate the value of a UPS because the UPS can bridge the transition before backup power is available.",
    },
  },

  {
    id: "localVsCloudPreference",
    sessionId: "technology",
    type: "single-select",
    title: "How much cloud dependence are you comfortable with?",
    description:
      "Choose the approach that best matches your privacy and reliability preferences.",
    required: true,
    options: [
      {
        id: "cloud-ok",
        icon: "☁️",
        title: "Cloud Services Are Fine",
        description:
          "Use cloud-connected services when they provide the best experience.",
      },
      {
        id: "balanced",
        icon: "⚖️",
        title: "Balanced Local + Cloud",
        description:
          "Prefer local operation for important functions while using cloud services where useful.",
      },
      {
        id: "local-first",
        icon: "🔐",
        title: "Local-First",
        description:
          "Prioritize systems that continue operating locally with minimal cloud dependence.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Cloud dependence affects privacy, subscriptions, outage behavior, and long-term platform flexibility.",
      didYouKnow:
        "A locally controlled system can often continue basic operation even if the internet connection is down.",
    },
  },

  {
    id: "subscriptionTolerance",
    sessionId: "technology",
    type: "single-select",
    title: "How do you feel about ongoing technology subscriptions?",
    description:
      "Consider camera storage, monitoring, cloud services, software, and premium features.",
    required: true,
    options: [
      {
        id: "avoid",
        icon: "💵",
        title: "Prefer to Avoid Subscriptions",
        description:
          "Prioritize products with low or no recurring fees.",
      },
      {
        id: "selective",
        icon: "⚖️",
        title: "Selective Subscriptions Are Fine",
        description:
          "Pay recurring fees only where the value is clear.",
      },
      {
        id: "comfortable",
        icon: "✅",
        title: "Comfortable with Subscriptions",
        description:
          "Recurring services are acceptable when they improve capability or support.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Recurring costs can materially change the long-term cost of ownership, so the Blueprint should consider them alongside equipment price.",
      didYouKnow:
        "Two systems with similar purchase prices can have very different five-year ownership costs once subscriptions are included.",
    },
  },

  {
    id: "ecosystemPreference",
    sessionId: "technology",
    type: "multi-select",
    title: "Are there technology ecosystems or platforms you already prefer?",
    description:
      "Select every ecosystem you actively use or would like considered.",
    required: true,
    options: [
      {
        id: "apple",
        icon: "🍎",
        title: "Apple / HomeKit",
        description:
          "Apple devices and HomeKit compatibility are important.",
      },
      {
        id: "google",
        icon: "G",
        title: "Google",
        description:
          "Google Home or Google Assistant compatibility is important.",
      },
      {
        id: "amazon",
        icon: "A",
        title: "Amazon Alexa",
        description:
          "Alexa compatibility is important.",
      },
      {
        id: "home-assistant",
        icon: "🏠",
        title: "Home Assistant",
        description:
          "Local, flexible, enthusiast-oriented integration is desirable.",
      },
      {
        id: "professional",
        icon: "🎛️",
        title: "Professional Control Platform",
        description:
          "You are open to a professionally designed centralized control system.",
      },
      {
        id: "none",
        icon: "➖",
        title: "No Strong Preference",
        description:
          "Choose platforms based on fit rather than an existing ecosystem.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Existing ecosystem preferences matter, but they should not force every subsystem into a poor-fit product choice.",
      didYouKnow:
        "The best smart-home designs often use several specialized technologies behind one consistent user experience.",
    },
  },

  {
    id: "technologyTierPreference",
    sessionId: "technology",
    type: "single-select",
    title: "What overall technology tier feels right for this project?",
    description:
      "This is not a final budget commitment. It helps us understand the balance you want between cost, capability, reliability, and polish.",
    required: true,
    options: [
      {
        id: "budget",
        icon: "💲",
        title: "Budget-Conscious",
        description:
          "Prioritize essential capability and value while controlling equipment cost.",
      },
      {
        id: "better",
        icon: "💲💲",
        title: "Balanced / Better",
        description:
          "Balance reliability, capability, user experience, and long-term value.",
      },
      {
        id: "best",
        icon: "💲💲💲",
        title: "Premium / Best",
        description:
          "Prioritize higher performance, polish, integration, and future flexibility.",
      },
      {
        id: "mixed",
        icon: "⚖️",
        title: "Mix Tiers by System",
        description:
          "Spend more in high-priority areas and control costs elsewhere.",
      },
      {
        id: "unsure",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "Let the Blueprint recommend where different technology tiers make sense.",
      },
    ],
    defaultGuidance: {
      consultant:
        "A mixed-tier strategy is often the smartest approach because not every subsystem deserves the same level of investment.",
      didYouKnow:
        "The most expensive product is not automatically the best value if its additional capability does not support a household priority.",
    },
  },
];