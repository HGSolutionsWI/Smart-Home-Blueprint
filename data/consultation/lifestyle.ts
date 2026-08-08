import type { BlueprintQuestion } from "@/types/blueprint";

export const lifestyleQuestions: readonly BlueprintQuestion[] = [
  {
    id: "householdComposition",
    sessionId: "lifestyle",
    type: "multi-select",
    title: "Who lives in the home?",
    description:
      "Select every option that applies. Household makeup can influence safety, automation, access, privacy, and convenience recommendations.",
    required: true,
    options: [
      {
        id: "adults",
        icon: "👤",
        title: "Adults",
        description:
          "One or more adults live in the home.",
      },
      {
        id: "children",
        icon: "🧒",
        title: "Children",
        description:
          "Children live in or regularly use the home.",
      },
      {
        id: "teenagers",
        icon: "🎮",
        title: "Teenagers",
        description:
          "Teenagers live in the home and may have higher bandwidth or entertainment needs.",
      },
      {
        id: "older-adults",
        icon: "👵",
        title: "Older Adults",
        description:
          "Older adults live in or regularly use the home.",
      },
      {
        id: "pets",
        icon: "🐾",
        title: "Pets",
        description:
          "Pets may influence security, camera placement, access control, and automation routines.",
      },
      {
        id: "frequent-guests",
        icon: "👥",
        title: "Frequent Guests",
        description:
          "The home frequently hosts family, friends, clients, or visitors.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Understanding who uses the home helps us recommend systems that support the whole household rather than designing around a single user.",
      didYouKnow:
        "The best smart-home plan often reduces friction for guests and family members who do not want to use an app for every task.",
    },
  },

  {
    id: "workFromHome",
    sessionId: "lifestyle",
    type: "single-select",
    title: "How much work or school happens from home?",
    description:
      "Choose the option that best represents the household's typical use.",
    required: true,
    options: [
      {
        id: "rare",
        icon: "🏠",
        title: "Rarely",
        description:
          "Work or school from home is occasional and not a major technology driver.",
      },
      {
        id: "part-time",
        icon: "💻",
        title: "Part-Time",
        description:
          "At least one person works or studies from home on a regular part-time basis.",
      },
      {
        id: "full-time",
        icon: "🖥️",
        title: "Full-Time",
        description:
          "At least one person relies on the home for full-time work or education.",
      },
      {
        id: "multiple-users",
        icon: "👥",
        title: "Multiple Full-Time Users",
        description:
          "Several people regularly rely on the home network for work or education.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Work-from-home use increases the importance of reliable Wi-Fi, wired workstation options, video-call stability, and network resilience.",
      didYouKnow:
        "A wired connection at a primary workstation can improve reliability even when the rest of the home uses Wi-Fi.",
    },
  },

  {
    id: "internetDependency",
    sessionId: "lifestyle",
    type: "single-select",
    title: "How dependent is your household on internet connectivity?",
    description:
      "Consider work, school, communication, entertainment, security, and connected-home systems.",
    required: true,
    options: [
      {
        id: "basic",
        icon: "📶",
        title: "Basic",
        description:
          "Internet is useful, but short outages are generally manageable.",
      },
      {
        id: "important",
        icon: "🌐",
        title: "Important",
        description:
          "The household relies on internet service every day for several activities.",
      },
      {
        id: "critical",
        icon: "🚨",
        title: "Critical",
        description:
          "Internet availability is essential for work, security, communication, or other important functions.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Internet dependency helps determine how much emphasis we should place on network reliability, backup power, wired connections, and failover planning.",
      didYouKnow:
        "A high-speed internet plan does not guarantee a reliable home network if the internal network is poorly designed.",
    },
  },

  {
    id: "streamingUse",
    sessionId: "lifestyle",
    type: "single-select",
    title: "How much video streaming happens in the home?",
    description:
      "Think about televisions, phones, tablets, and simultaneous streaming.",
    required: true,
    options: [
      {
        id: "light",
        icon: "📺",
        title: "Light",
        description:
          "One or two devices stream occasionally.",
      },
      {
        id: "moderate",
        icon: "🎬",
        title: "Moderate",
        description:
          "Several devices stream regularly.",
      },
      {
        id: "heavy",
        icon: "🍿",
        title: "Heavy",
        description:
          "Multiple rooms or devices may stream high-resolution video at the same time.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Streaming demand influences network capacity, Wi-Fi coverage, wired TV locations, and switching requirements.",
      didYouKnow:
        "Many televisions benefit from wired Ethernet even if they also include Wi-Fi.",
    },
  },

  {
    id: "gamingUse",
    sessionId: "lifestyle",
    type: "single-select",
    title: "How important is gaming in the household?",
    description:
      "Consider consoles, gaming PCs, cloud gaming, and competitive online play.",
    required: true,
    options: [
      {
        id: "none",
        icon: "➖",
        title: "Not Important",
        description:
          "Gaming is not a meaningful part of the household's technology use.",
      },
      {
        id: "casual",
        icon: "🎮",
        title: "Casual",
        description:
          "Gaming happens occasionally without demanding performance requirements.",
      },
      {
        id: "regular",
        icon: "🕹️",
        title: "Regular",
        description:
          "Gaming is a common activity and reliable connectivity matters.",
      },
      {
        id: "competitive",
        icon: "⚡",
        title: "Competitive / Performance Focused",
        description:
          "Low latency and wired connectivity are high priorities.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Gaming requirements can justify wired network connections in specific rooms even when general household connectivity is wireless.",
      didYouKnow:
        "Latency and network stability often matter more to gaming performance than raw internet speed.",
    },
  },

  {
    id: "musicLifestyle",
    sessionId: "lifestyle",
    type: "multi-select",
    title: "How do you like to listen to music at home?",
    description:
      "Select every option that fits your household.",
    required: true,
    options: [
      {
        id: "casual-speakers",
        icon: "🔊",
        title: "Portable / Smart Speakers",
        description:
          "Music is primarily played through wireless or portable speakers.",
      },
      {
        id: "whole-home",
        icon: "🎵",
        title: "Whole-Home Audio",
        description:
          "You would like music available across several rooms.",
      },
      {
        id: "high-performance",
        icon: "🎚️",
        title: "High-Performance Listening",
        description:
          "Sound quality is a major priority in one or more rooms.",
      },
      {
        id: "outdoor-audio",
        icon: "🌳",
        title: "Outdoor Audio",
        description:
          "Music is important on patios, decks, pool areas, or other outdoor spaces.",
      },
      {
        id: "not-important",
        icon: "➖",
        title: "Not a Priority",
        description:
          "Audio is not a major part of the project.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Audio planning can range from simple wireless speakers to permanently wired whole-home systems. Your listening habits help us recommend the right level of infrastructure.",
      didYouKnow:
        "Speaker wire is inexpensive to install during construction and much harder to add cleanly after walls are finished.",
    },
  },

  {
    id: "securityPriority",
    sessionId: "lifestyle",
    type: "single-select",
    title: "How important is home security to you?",
    description:
      "Choose the level that best reflects your household's priorities.",
    required: true,
    options: [
      {
        id: "basic",
        icon: "🔒",
        title: "Basic",
        description:
          "Basic awareness and deterrence are sufficient.",
      },
      {
        id: "important",
        icon: "🛡️",
        title: "Important",
        description:
          "Cameras, alerts, and intrusion awareness are meaningful priorities.",
      },
      {
        id: "high",
        icon: "🚨",
        title: "High Priority",
        description:
          "Security, surveillance, access, and system reliability are major project goals.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Security priority influences camera coverage, network resilience, recording strategy, entry monitoring, and backup-power recommendations.",
      didYouKnow:
        "Security systems are only as reliable as the network and power infrastructure supporting them.",
    },
  },

  {
    id: "travelFrequency",
    sessionId: "lifestyle",
    type: "single-select",
    title: "How often is the home unoccupied for extended periods?",
    description:
      "Consider travel, seasonal use, second homes, or extended work trips.",
    required: true,
    options: [
      {
        id: "rare",
        icon: "🏠",
        title: "Rarely",
        description:
          "The home is usually occupied.",
      },
      {
        id: "occasionally",
        icon: "✈️",
        title: "Occasionally",
        description:
          "The household travels several times per year.",
      },
      {
        id: "frequently",
        icon: "🧳",
        title: "Frequently",
        description:
          "The home is regularly unoccupied for extended periods.",
      },
      {
        id: "seasonal",
        icon: "🌴",
        title: "Seasonal / Second Home",
        description:
          "The property may remain unoccupied for long stretches.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Extended absences increase the value of remote monitoring, water protection, cameras, environmental alerts, and reliable automation.",
      didYouKnow:
        "Water damage monitoring can be as important as security monitoring when a home is vacant.",
    },
  },

  {
    id: "outdoorLiving",
    sessionId: "lifestyle",
    type: "single-select",
    title: "How important are outdoor living spaces?",
    description:
      "Think about patios, decks, pools, fire pits, outdoor kitchens, and yard use.",
    required: true,
    options: [
      {
        id: "low",
        icon: "🌿",
        title: "Low Priority",
        description:
          "Outdoor technology is not a major concern.",
      },
      {
        id: "moderate",
        icon: "🪑",
        title: "Moderate",
        description:
          "Outdoor areas are used regularly and should have good connectivity.",
      },
      {
        id: "high",
        icon: "🏊",
        title: "High Priority",
        description:
          "Outdoor entertainment, audio, Wi-Fi, cameras, or automation are important.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Outdoor living priorities help us connect the Discovery coverage requirements to actual lifestyle use.",
      didYouKnow:
        "Outdoor technology often needs weather-rated equipment and dedicated planning rather than simply extending indoor devices outside.",
    },
  },

  {
    id: "automationInterest",
    sessionId: "lifestyle",
    type: "single-select",
    title: "How interested are you in home automation?",
    description:
      "Think about lighting scenes, routines, climate, shades, security, audio, and automatic responses.",
    required: true,
    options: [
      {
        id: "low",
        icon: "🎛️",
        title: "Low",
        description:
          "You prefer straightforward systems with minimal automation.",
      },
      {
        id: "moderate",
        icon: "✨",
        title: "Moderate",
        description:
          "You are interested in selected automations that simplify daily routines.",
      },
      {
        id: "high",
        icon: "🤖",
        title: "High",
        description:
          "You want a highly integrated home with scenes, schedules, and cross-system automation.",
      },
      {
        id: "unsure",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "You would like the Blueprint to recommend an appropriate automation level.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Automation should reduce friction, not create it. We will use your preference to determine how much integration makes sense.",
      didYouKnow:
        "The most successful automations usually handle repetitive tasks quietly without requiring the homeowner to think about them.",
    },
  },

  {
    id: "controlPreference",
    sessionId: "lifestyle",
    type: "multi-select",
    title: "How would you prefer to control technology in the home?",
    description:
      "Select every control method you would be comfortable using.",
    required: true,
    options: [
      {
        id: "physical-controls",
        icon: "🔘",
        title: "Physical Buttons / Keypads",
        description:
          "You prefer familiar wall controls and dedicated buttons.",
      },
      {
        id: "mobile-app",
        icon: "📱",
        title: "Mobile App",
        description:
          "You are comfortable using apps for system control.",
      },
      {
        id: "voice",
        icon: "🎙️",
        title: "Voice Control",
        description:
          "Voice assistants are a desirable control option.",
      },
      {
        id: "automatic",
        icon: "⚙️",
        title: "Automatic / Sensor-Based",
        description:
          "You prefer technology to respond automatically when possible.",
      },
      {
        id: "mixed",
        icon: "🔀",
        title: "A Mix of Methods",
        description:
          "You want multiple control options depending on the room or task.",
      },
    ],
    defaultGuidance: {
      consultant:
        "A strong smart-home design should not force one control method everywhere. Different rooms and household members may need different interfaces.",
      didYouKnow:
        "Physical controls remain important even in highly automated homes because they work for guests and during app or voice-service interruptions.",
    },
  },

  {
    id: "privacyPreference",
    sessionId: "lifestyle",
    type: "single-select",
    title: "How important is privacy and local control?",
    description:
      "Consider cloud services, cameras, voice assistants, local storage, and dependence on third-party services.",
    required: true,
    options: [
      {
        id: "standard",
        icon: "☁️",
        title: "Standard",
        description:
          "Cloud-connected products are acceptable when they provide useful features.",
      },
      {
        id: "balanced",
        icon: "⚖️",
        title: "Balanced",
        description:
          "You prefer a practical mix of local and cloud-based services.",
      },
      {
        id: "local-first",
        icon: "🔐",
        title: "Local Control Preferred",
        description:
          "You prefer systems that can operate locally with minimal cloud dependence.",
      },
      {
        id: "unsure",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "You would like guidance on the tradeoffs.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Privacy preferences can influence camera storage, automation platforms, voice assistants, access control, and product recommendations.",
      didYouKnow:
        "Some smart-home systems continue operating locally even when internet service is unavailable, while others depend heavily on cloud services.",
    },
  },

  {
    id: "accessibilityNeeds",
    sessionId: "lifestyle",
    type: "yes-no",
    title: "Should accessibility or aging-in-place needs influence the design?",
    description:
      "This can include mobility, vision, hearing, simplified controls, remote assistance, or future aging-in-place planning.",
    required: true,
    defaultGuidance: {
      consultant:
        "Accessibility planning can influence lighting controls, door access, notifications, voice control, interfaces, and automation routines.",
      didYouKnow:
        "Technology installed for convenience today can also support aging in place later if the infrastructure is planned thoughtfully.",
    },
  },

  {
    id: "technologyComfort",
    sessionId: "lifestyle",
    type: "single-select",
    title: "How comfortable is your household with technology?",
    description:
      "Choose the answer that best represents the people who will use the home every day.",
    required: true,
    options: [
      {
        id: "simple",
        icon: "🙂",
        title: "Keep It Simple",
        description:
          "The household prefers familiar controls and minimal complexity.",
      },
      {
        id: "comfortable",
        icon: "👍",
        title: "Comfortable",
        description:
          "Most household members are comfortable using apps and connected devices.",
      },
      {
        id: "advanced",
        icon: "🧠",
        title: "Advanced",
        description:
          "The household enjoys technology and is comfortable with more sophisticated systems.",
      },
      {
        id: "mixed",
        icon: "👥",
        title: "Mixed Household",
        description:
          "Some household members are highly technical while others prefer simple controls.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Technology comfort helps us balance capability with usability. More features are not automatically better if the household finds them frustrating.",
      didYouKnow:
        "A well-designed system should feel simple even when the technology behind it is sophisticated.",
    },
  },

  {
    id: "lifestylePriorities",
    sessionId: "lifestyle",
    type: "multi-select",
    title: "What matters most to your household?",
    description:
      "Select the priorities that should have the greatest influence on the Blueprint.",
    required: true,
    options: [
      {
        id: "reliability",
        icon: "🛡️",
        title: "Reliability",
        description:
          "Systems should be dependable and require minimal troubleshooting.",
      },
      {
        id: "security",
        icon: "🔒",
        title: "Security",
        description:
          "Protecting the property and household is a major priority.",
      },
      {
        id: "convenience",
        icon: "✨",
        title: "Convenience",
        description:
          "Technology should simplify everyday routines.",
      },
      {
        id: "entertainment",
        icon: "🎬",
        title: "Entertainment",
        description:
          "Audio, video, streaming, and media experiences are important.",
      },
      {
        id: "energy",
        icon: "🌱",
        title: "Energy Awareness",
        description:
          "Energy management and efficient operation are meaningful priorities.",
      },
      {
        id: "privacy",
        icon: "🔐",
        title: "Privacy",
        description:
          "Data privacy and local control should strongly influence product selection.",
      },
      {
        id: "future-ready",
        icon: "🚀",
        title: "Future Readiness",
        description:
          "The home should be easy to upgrade as technology changes.",
      },
    ],
    defaultGuidance: {
      consultant:
        "These priorities will help us resolve tradeoffs later when there are multiple valid technology choices.",
      didYouKnow:
        "A Blueprint is most useful when it reflects the household's priorities rather than simply recommending the largest possible technology package.",
    },
  },
];