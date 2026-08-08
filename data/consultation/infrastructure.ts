import type { BlueprintQuestion } from "@/types/blueprint";

export const infrastructureQuestions: readonly BlueprintQuestion[] = [
  {
    id: "wiredNetworkPriority",
    sessionId: "infrastructure",
    type: "single-select",
    title: "How important is wired networking in your home?",
    description:
      "Think about offices, televisions, gaming systems, access points, cameras, and other fixed devices.",
    required: true,
    options: [
      {
        id: "minimal",
        icon: "📶",
        title: "Minimal",
        description:
          "Use Wi-Fi for most devices and add Ethernet only where clearly necessary.",
      },
      {
        id: "balanced",
        icon: "🔗",
        title: "Balanced",
        description:
          "Use Ethernet for important fixed devices while Wi-Fi handles mobile and general-use devices.",
      },
      {
        id: "wired-first",
        icon: "🖧",
        title: "Wired First",
        description:
          "Prioritize Ethernet wherever practical for performance, reliability, and future flexibility.",
      },
      {
        id: "unsure",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "You would like the Blueprint to recommend an appropriate wired-network strategy.",
      },
    ],
    defaultGuidance: {
      consultant:
        "A strong home network usually combines wired and wireless connectivity. Fixed devices often benefit from Ethernet while mobile devices depend on Wi-Fi.",
      didYouKnow:
        "Every device moved from Wi-Fi to Ethernet reduces wireless congestion for the devices that actually need to remain wireless.",
    },
  },

  {
    id: "wiredLocations",
    sessionId: "infrastructure",
    type: "multi-select",
    title: "Which locations should receive wired Ethernet?",
    description:
      "Select all locations where you would like reliable wired connectivity.",
    required: true,
    options: [
      {
        id: "office",
        icon: "💻",
        title: "Home Office",
        description:
          "Provide stable wired connectivity for workstations, docks, phones, printers, or other office equipment.",
      },
      {
        id: "tv-media",
        icon: "📺",
        title: "TV / Media Locations",
        description:
          "Provide Ethernet to televisions, streaming devices, media players, and entertainment equipment.",
      },
      {
        id: "gaming",
        icon: "🎮",
        title: "Gaming Locations",
        description:
          "Provide wired connectivity for consoles and gaming PCs.",
      },
      {
        id: "network-access-points",
        icon: "📡",
        title: "Wi-Fi Access Points",
        description:
          "Provide Ethernet and PoE-capable cabling to planned access-point locations.",
      },
      {
        id: "cameras",
        icon: "📷",
        title: "Security Cameras",
        description:
          "Provide wired network connections to PoE camera locations.",
      },
      {
        id: "printers-devices",
        icon: "🖨️",
        title: "Printers / Fixed Devices",
        description:
          "Provide Ethernet to fixed devices that benefit from stable network access.",
      },
      {
        id: "automation",
        icon: "⚙️",
        title: "Automation / Control Equipment",
        description:
          "Provide network connectivity for centralized smart-home and control equipment.",
      },
      {
        id: "other",
        icon: "➕",
        title: "Other Fixed Devices",
        description:
          "Plan spare wired locations for additional fixed technology.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Wired locations form the backbone of a reliable smart home. We will use these selections to estimate cable quantities, switching capacity, and rack requirements.",
      didYouKnow:
        "Ethernet cable can carry both data and power through PoE, allowing many cameras, access points, intercoms, and other devices to operate from one cable.",
    },
  },

  {
    id: "wifiCoveragePriority",
    sessionId: "infrastructure",
    type: "single-select",
    title: "What level of Wi-Fi coverage do you want inside the home?",
    description:
      "Choose the coverage level that best matches your expectations.",
    required: true,
    options: [
      {
        id: "basic",
        icon: "📶",
        title: "Basic Coverage",
        description:
          "Reliable Wi-Fi in primary living areas is sufficient.",
      },
      {
        id: "whole-home",
        icon: "🏠",
        title: "Whole-Home Coverage",
        description:
          "Consistent Wi-Fi should be available throughout the finished living space.",
      },
      {
        id: "high-performance",
        icon: "⚡",
        title: "High-Performance Whole-Home",
        description:
          "Prioritize strong coverage, roaming, capacity, and performance throughout the home.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Wi-Fi design depends on more than square footage. Floor count, construction materials, room layout, and device density all influence access-point placement.",
      didYouKnow:
        "One powerful router is rarely the best solution for a large home. Multiple properly placed wired access points usually provide better coverage and roaming.",
    },
  },

  {
    id: "challengingMaterials",
    sessionId: "infrastructure",
    type: "multi-select",
    title: "Are any of these construction materials common in the home?",
    description:
      "Select every material that may affect wireless coverage or cable routing.",
    required: true,
    options: [
      {
        id: "concrete",
        icon: "🧱",
        title: "Concrete",
        description:
          "Concrete walls or floors can significantly weaken wireless signals.",
      },
      {
        id: "masonry",
        icon: "🧱",
        title: "Brick / Masonry",
        description:
          "Dense masonry can reduce Wi-Fi range and complicate retrofit pathways.",
      },
      {
        id: "metal",
        icon: "🔩",
        title: "Metal Framing / Metal Surfaces",
        description:
          "Metal can reflect or block wireless signals.",
      },
      {
        id: "radiant",
        icon: "♨️",
        title: "Radiant Floor Systems",
        description:
          "Radiant systems may affect both wireless propagation and cable pathway options.",
      },
      {
        id: "stone",
        icon: "🪨",
        title: "Stone",
        description:
          "Dense stone can significantly reduce signal penetration.",
      },
      {
        id: "none",
        icon: "✓",
        title: "None / Not Significant",
        description:
          "No major signal-blocking materials are known.",
      },
      {
        id: "unknown",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "You are unsure which building materials may affect coverage.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Dense materials can create coverage gaps that cannot be solved simply by increasing transmitter power. Placement becomes more important.",
      didYouKnow:
        "Wi-Fi can pass through standard drywall relatively well, but concrete, masonry, metal, and some specialty materials can dramatically reduce signal strength.",
    },
  },

  {
    id: "workstationInfrastructure",
    sessionId: "infrastructure",
    type: "multi-select",
    title: "What should we plan for at work-from-home locations?",
    description:
      "Select all infrastructure you would like at primary work or study locations.",
    required: true,
    condition: {
      operator: "OR",
      rules: [
        {
          questionId: "workFromHome",
          equals: "part-time",
        },
        {
          questionId: "workFromHome",
          equals: "full-time",
        },
        {
          questionId: "workFromHome",
          equals: "multiple-users",
        },
      ],
    },
    options: [
      {
        id: "dual-ethernet",
        icon: "🔗",
        title: "Multiple Ethernet Connections",
        description:
          "Provide more than one wired network port for workstations and peripherals.",
      },
      {
        id: "voip",
        icon: "☎️",
        title: "VoIP / Business Phone Support",
        description:
          "Plan connectivity for dedicated business or IP phones.",
      },
      {
        id: "printer",
        icon: "🖨️",
        title: "Network Printer",
        description:
          "Provide wired or dedicated network support for printers and multifunction devices.",
      },
      {
        id: "ups",
        icon: "🔋",
        title: "Battery Backup",
        description:
          "Protect critical workstation or network equipment during brief outages.",
      },
      {
        id: "spare",
        icon: "➕",
        title: "Spare Capacity",
        description:
          "Include extra ports or pathways for future office equipment.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Dedicated work locations benefit from predictable connectivity and simple expansion options.",
      didYouKnow:
        "A second Ethernet run to a home office can cost very little during construction and provide valuable flexibility later.",
    },
  },

  {
    id: "gamingInfrastructure",
    sessionId: "infrastructure",
    type: "multi-select",
    title: "What should we plan for at gaming locations?",
    description:
      "Select every infrastructure feature that matters to your gaming setup.",
    required: true,
    condition: {
      operator: "OR",
      rules: [
        {
          questionId: "gamingUse",
          equals: "regular",
        },
        {
          questionId: "gamingUse",
          equals: "competitive",
        },
      ],
    },
    options: [
      {
        id: "wired-ethernet",
        icon: "🎮",
        title: "Dedicated Ethernet",
        description:
          "Provide wired Ethernet directly to gaming consoles or PCs.",
      },
      {
        id: "multiple-ports",
        icon: "🔗",
        title: "Multiple Network Ports",
        description:
          "Support multiple consoles, computers, or streaming devices at the same location.",
      },
      {
        id: "ups",
        icon: "🔋",
        title: "Battery Backup",
        description:
          "Protect gaming or network equipment during short power interruptions.",
      },
      {
        id: "future-capacity",
        icon: "🚀",
        title: "Future Capacity",
        description:
          "Include additional cabling or pathways for future gaming technology.",
      },
    ],
    defaultGuidance: {
      consultant:
        "For performance-focused gaming, a direct wired connection is usually preferable to relying exclusively on Wi-Fi.",
      didYouKnow:
        "Gaming performance is often limited more by latency and network stability than by maximum download speed.",
    },
  },

  {
    id: "mediaInfrastructure",
    sessionId: "infrastructure",
    type: "multi-select",
    title: "What infrastructure should we provide at TV and media locations?",
    description:
      "Select all options that fit your entertainment plans.",
    required: true,
    options: [
      {
        id: "ethernet",
        icon: "🔗",
        title: "Ethernet",
        description:
          "Provide wired network connectivity for televisions and streaming devices.",
      },
      {
        id: "coax",
        icon: "📺",
        title: "Coax",
        description:
          "Provide coax where cable, antenna, satellite, or specialty systems may require it.",
      },
      {
        id: "conduit",
        icon: "🧵",
        title: "Conduit to Display",
        description:
          "Create a pathway between equipment and wall-mounted displays for future cables.",
      },
      {
        id: "local-power",
        icon: "⚡",
        title: "Power Behind Display",
        description:
          "Coordinate power locations for clean wall-mounted installations.",
      },
      {
        id: "centralized-video",
        icon: "🎬",
        title: "Centralized Video Equipment",
        description:
          "Plan for media equipment located away from the display.",
      },
    ],
    defaultGuidance: {
      consultant:
        "TV locations are much easier to keep clean and serviceable when power, data, and cable pathways are coordinated before installation.",
      didYouKnow:
        "Installing conduit behind a wall-mounted TV can preserve flexibility when video standards and cable types change.",
    },
  },

  {
    id: "audioPrewire",
    sessionId: "infrastructure",
    type: "multi-select",
    title: "Where should we plan permanent speaker wiring?",
    description:
      "Select all areas where architectural or wired audio may be useful.",
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
      ],
    },
    options: [
      {
        id: "living-areas",
        icon: "🛋️",
        title: "Living Areas",
        description:
          "Plan speaker wiring for family rooms, great rooms, kitchens, or similar spaces.",
      },
      {
        id: "primary-suite",
        icon: "🛏️",
        title: "Primary Suite",
        description:
          "Plan audio wiring for the primary bedroom or bath.",
      },
      {
        id: "entertainment-room",
        icon: "🎬",
        title: "Media / Theater Room",
        description:
          "Provide dedicated surround or high-performance audio wiring.",
      },
      {
        id: "outdoor",
        icon: "🌳",
        title: "Outdoor Areas",
        description:
          "Plan weather-appropriate speaker wiring for exterior living spaces.",
      },
      {
        id: "whole-home",
        icon: "🎵",
        title: "Multiple Rooms / Whole Home",
        description:
          "Design a distributed audio wiring strategy across many rooms.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Speaker prewire is inexpensive while walls are accessible and can preserve future options even if amplifiers or speakers are installed later.",
      didYouKnow:
        "A future audio zone may only require speaker cable today, making prewire one of the easiest future-ready upgrades during construction.",
    },
  },

  {
    id: "cameraInfrastructure",
    sessionId: "infrastructure",
    type: "multi-select",
    title: "Which areas should be prewired for security cameras?",
    description:
      "Select all areas that should have camera infrastructure.",
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
        id: "front-entry",
        icon: "🚪",
        title: "Front Entry",
        description:
          "Provide coverage for the primary entrance and approach.",
      },
      {
        id: "driveway",
        icon: "🚗",
        title: "Driveway",
        description:
          "Monitor vehicles, arrivals, and the approach to the home.",
      },
      {
        id: "garage",
        icon: "🏠",
        title: "Garage",
        description:
          "Provide coverage for garage doors, vehicles, or interior garage areas.",
      },
      {
        id: "rear-entry",
        icon: "🚪",
        title: "Rear / Side Entries",
        description:
          "Cover secondary entry doors and access points.",
      },
      {
        id: "backyard",
        icon: "🌳",
        title: "Backyard / Patio",
        description:
          "Provide surveillance coverage of outdoor living areas.",
      },
      {
        id: "detached-buildings",
        icon: "🏚️",
        title: "Detached Buildings",
        description:
          "Provide infrastructure for garages, barns, workshops, or other separate structures.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Camera wiring is most effective when coverage goals, viewing angles, lighting, and cable pathways are considered together.",
      didYouKnow:
        "PoE cameras can receive both power and network connectivity through a single Ethernet cable.",
    },
  },

  {
    id: "entryInfrastructure",
    sessionId: "infrastructure",
    type: "multi-select",
    title: "Which entry points should receive smart-home infrastructure?",
    description:
      "Select all entry locations where you may want doorbells, locks, access control, sensors, or intercoms.",
    required: true,
    options: [
      {
        id: "front-door",
        icon: "🚪",
        title: "Front Door",
        description:
          "Plan for video doorbell, lock, contact sensor, or access-control infrastructure.",
      },
      {
        id: "garage-entry",
        icon: "🚗",
        title: "Garage Entry",
        description:
          "Plan infrastructure for vehicle and pedestrian garage access.",
      },
      {
        id: "side-rear",
        icon: "🔑",
        title: "Side / Rear Doors",
        description:
          "Provide wiring or power for secondary access points.",
      },
      {
        id: "gate",
        icon: "🚧",
        title: "Gate / Property Entrance",
        description:
          "Plan network, intercom, camera, or access-control pathways to a remote entrance.",
      },
      {
        id: "none",
        icon: "➖",
        title: "No Special Entry Infrastructure",
        description:
          "Standard entry planning is sufficient.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Door and gate technology often requires coordination between low-voltage wiring, power, networking, and the door or gate hardware itself.",
      didYouKnow:
        "Planning access-control pathways before doors, trim, and exterior finishes are complete can avoid visible retrofit wiring later.",
    },
  },

  {
    id: "detachedBuildingPathway",
    sessionId: "infrastructure",
    type: "multi-select",
    title: "How should detached buildings connect back to the main home?",
    description:
      "Select the pathways or capabilities you would like planned.",
    required: true,
    condition: {
      operator: "OR",
      rules: [
        {
          questionId: "outdoorCoverage",
          includes: "detached-garage",
        },
        {
          questionId: "outdoorCoverage",
          includes: "outbuilding",
        },
      ],
    },
    options: [
      {
        id: "conduit",
        icon: "🧵",
        title: "Underground Conduit",
        description:
          "Plan a dedicated pathway between structures for future cabling.",
      },
      {
        id: "fiber",
        icon: "💡",
        title: "Fiber Connection",
        description:
          "Plan fiber between structures for high performance and electrical isolation.",
      },
      {
        id: "copper",
        icon: "🔗",
        title: "Copper Data Cabling",
        description:
          "Plan copper Ethernet where distance and electrical conditions permit.",
      },
      {
        id: "wireless-bridge",
        icon: "📡",
        title: "Wireless Bridge",
        description:
          "Use a point-to-point wireless link when trenching or conduit is impractical.",
      },
      {
        id: "unsure",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "Let the Blueprint recommend the best pathway after reviewing distance and site conditions.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Detached structures should be treated as part of the network design, not as an afterthought. Distance, grounding, trenching, and future capacity all matter.",
      didYouKnow:
        "Fiber is often an excellent choice between separate buildings because it avoids electrical grounding differences between structures.",
    },
  },

  {
    id: "conduitStrategy",
    sessionId: "infrastructure",
    type: "single-select",
    title: "How much conduit and future pathway planning should we include?",
    description:
      "Choose the level of future pathway flexibility you want.",
    required: true,
    options: [
      {
        id: "targeted",
        icon: "🧵",
        title: "Targeted",
        description:
          "Use conduit only at high-value locations such as TVs, service entrances, and difficult future pathways.",
      },
      {
        id: "moderate",
        icon: "🔧",
        title: "Moderate",
        description:
          "Provide conduit to several strategic locations and major future expansion areas.",
      },
      {
        id: "extensive",
        icon: "🚀",
        title: "Extensive Future-Ready Pathways",
        description:
          "Prioritize broad conduit coverage and easy future cable replacement or expansion.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Conduit is most valuable where future access will be difficult or where cable standards are likely to change.",
      didYouKnow:
        "An empty conduit does not become obsolete when technology changes—it simply provides a path for whatever cable comes next.",
    },
  },

  {
    id: "rackStrategy",
    sessionId: "infrastructure",
    type: "single-select",
    title: "How should centralized technology equipment be organized?",
    description:
      "Choose the approach that best matches your preferred level of organization and expansion.",
    required: true,
    options: [
      {
        id: "small-panel",
        icon: "📦",
        title: "Compact Structured Wiring Panel",
        description:
          "Use a smaller enclosure for basic networking and low-voltage distribution.",
      },
      {
        id: "wall-rack",
        icon: "🖧",
        title: "Wall-Mounted Rack",
        description:
          "Use a dedicated rack for networking, patch panels, power, and control equipment.",
      },
      {
        id: "floor-rack",
        icon: "🏢",
        title: "Floor-Standing Rack",
        description:
          "Use a larger rack for advanced networking, AV, automation, surveillance, and expansion.",
      },
      {
        id: "unsure",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "Let the Blueprint recommend the appropriate rack or enclosure size.",
      },
    ],
    defaultGuidance: {
      consultant:
        "The equipment enclosure should be sized for the system you expect to have in several years, not just the equipment installed on day one.",
      didYouKnow:
        "Leaving rack space for patch panels, UPS equipment, PoE switches, and future devices can make upgrades dramatically easier.",
    },
  },

  {
    id: "networkResilience",
    sessionId: "infrastructure",
    type: "multi-select",
    title: "How should we protect the core network during power or service interruptions?",
    description:
      "Select the resilience features you would like considered.",
    required: true,
    condition: {
      operator: "OR",
      rules: [
        {
          questionId: "internetDependency",
          equals: "critical",
        },
        {
          questionId: "powerReliability",
          equals: "occasional",
        },
        {
          questionId: "powerReliability",
          equals: "frequent",
        },
        {
          questionId: "securityPriority",
          equals: "high",
        },
      ],
    },
    options: [
      {
        id: "ups",
        icon: "🔋",
        title: "UPS for Core Network",
        description:
          "Provide battery backup for modem, router, firewall, switches, and access points.",
      },
      {
        id: "surge",
        icon: "⚡",
        title: "Surge Protection",
        description:
          "Protect sensitive network and control equipment from electrical events.",
      },
      {
        id: "generator-integration",
        icon: "⚙️",
        title: "Generator / Battery Integration",
        description:
          "Coordinate technology circuits with whole-home backup systems.",
      },
      {
        id: "internet-failover",
        icon: "📡",
        title: "Secondary Internet / Failover",
        description:
          "Consider cellular or secondary-WAN connectivity for critical internet needs.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Resilience planning should protect the systems that keep the home connected, secure, and controllable during an interruption.",
      didYouKnow:
        "A generator may restore power after several seconds, but a UPS can keep the network alive continuously during that transition.",
    },
  },

  {
    id: "spareCapacity",
    sessionId: "infrastructure",
    type: "single-select",
    title: "How much spare infrastructure capacity should we plan?",
    description:
      "Consider unused switch ports, rack space, spare cable runs, PoE capacity, and future devices.",
    required: true,
    options: [
      {
        id: "minimal",
        icon: "1️⃣",
        title: "Minimal Spare Capacity",
        description:
          "Size infrastructure closely around the current design.",
      },
      {
        id: "moderate",
        icon: "2️⃣",
        title: "Moderate Spare Capacity",
        description:
          "Include reasonable expansion room for common future additions.",
      },
      {
        id: "high",
        icon: "3️⃣",
        title: "High Spare Capacity",
        description:
          "Prioritize expansion room in cabling, switching, PoE, rack space, and pathways.",
      },
    ],
    defaultGuidance: {
      consultant:
        "A little spare capacity is inexpensive during initial installation and can prevent premature equipment replacement later.",
      didYouKnow:
        "Leaving unused switch ports and rack space is not wasteful when the home is expected to gain technology over time.",
    },
  },

  {
    id: "infrastructureDocumentation",
    sessionId: "infrastructure",
    type: "multi-select",
    title: "What documentation should be included with the infrastructure plan?",
    description:
      "Select the documentation you would like preserved for installers and future service.",
    required: true,
    options: [
      {
        id: "cable-labels",
        icon: "🏷️",
        title: "Cable Labeling Standard",
        description:
          "Define consistent labels for cables, rooms, ports, and equipment.",
      },
      {
        id: "rack-map",
        icon: "🖧",
        title: "Rack / Patch Panel Map",
        description:
          "Document equipment and patch-panel assignments.",
      },
      {
        id: "floor-plan",
        icon: "📐",
        title: "Floor-Plan Device Locations",
        description:
          "Record key network, camera, speaker, TV, and device positions on plans.",
      },
      {
        id: "photos",
        icon: "📷",
        title: "Pre-Drywall Photos",
        description:
          "Document wiring and pathway locations before walls are closed.",
      },
      {
        id: "test-results",
        icon: "✅",
        title: "Cable Test Results",
        description:
          "Preserve test records for installed network cabling.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Good documentation transforms hidden infrastructure into a maintainable system that future owners and installers can understand.",
      didYouKnow:
        "Photos taken before drywall can save hours of investigation years later when a cable or conduit needs to be located.",
    },
  },
];