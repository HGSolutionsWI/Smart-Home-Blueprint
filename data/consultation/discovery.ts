import type {
  BlueprintQuestion,
  ConsultantGuidance,
} from "@/types/blueprint";

export const discoveryQuestions: readonly BlueprintQuestion[] = [
  {
    id: "projectType",
    sessionId: "discovery",
    type: "single-select",
    title: "Tell us about your project.",
    description:
      "Choose the option that best describes the work you are planning. This decision will shape your infrastructure strategy and budget assumptions.",
    required: true,
    options: [
      {
        id: "new-construction",
        icon: "🏗️",
        title: "New Construction",
        description:
          "Walls are open, infrastructure costs are more predictable, and future-ready pathways can be planned before drywall.",
      },
      {
        id: "remodel-addition",
        icon: "🔨",
        title: "Remodel or Addition",
        description:
          "Some areas may be open while others remain finished. We will separate accessible work from retrofit work.",
      },
      {
        id: "existing-home",
        icon: "🏡",
        title: "Existing Home",
        description:
          "We will focus on practical cable pathways, access limitations, retrofit feasibility, and wider budget ranges.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Let’s begin with the project itself. This first answer determines how we approach wiring, access, risk, and budget confidence throughout the Blueprint.",
      didYouKnow:
        "The same technology package can have very different installation costs depending on whether walls are open or finished.",
    },
  },

  {
    id: "homeSize",
    sessionId: "discovery",
    type: "single-select",
    title: "How large is your home?",
    description:
      "Choose the approximate finished square footage. We will use this as a starting point for network coverage, equipment capacity, and project complexity.",
    required: true,
    options: [
      {
        id: "under-1500",
        icon: "🏠",
        title: "Under 1,500 sq. ft.",
        description:
          "A smaller footprint usually requires fewer network zones and shorter infrastructure runs.",
      },
      {
        id: "1500-2500",
        icon: "🏡",
        title: "1,500–2,500 sq. ft.",
        description:
          "A common home size that typically benefits from multiple wired network locations.",
      },
      {
        id: "2500-3500",
        icon: "🏘️",
        title: "2,500–3,500 sq. ft.",
        description:
          "Coverage, equipment capacity, and room-by-room planning become more important.",
      },
      {
        id: "3500-5000",
        icon: "🏛️",
        title: "3,500–5,000 sq. ft.",
        description:
          "Larger homes often require multiple network zones, additional switching, and more careful equipment planning.",
      },
      {
        id: "over-5000",
        icon: "🏰",
        title: "Over 5,000 sq. ft.",
        description:
          "Large or custom homes generally require a more advanced infrastructure and coverage strategy.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Home size helps us estimate preliminary network coverage, infrastructure quantities, switching capacity, and overall technology complexity.",
      didYouKnow:
        "Square footage alone does not determine Wi-Fi performance, but it provides a useful starting point before floor plans and construction materials are reviewed.",
    },
  },

  {
    id: "finishedLevels",
    sessionId: "discovery",
    type: "single-select",
    title: "How many finished levels does your home have?",
    description:
      "Include finished living levels that will require technology coverage. Count a finished basement as a level.",
    required: true,
    options: [
      {
        id: "1",
        icon: "1️⃣",
        title: "1 Level",
        description:
          "A single-level home generally simplifies network coverage and cable pathways.",
      },
      {
        id: "2",
        icon: "2️⃣",
        title: "2 Levels",
        description:
          "Two-level homes require planning for vertical pathways and coverage between floors.",
      },
      {
        id: "3",
        icon: "3️⃣",
        title: "3 Levels",
        description:
          "Three levels typically benefit from more deliberate network and infrastructure planning.",
      },
      {
        id: "4-plus",
        icon: "🏢",
        title: "4+ Levels",
        description:
          "Multi-level homes often require additional network zones and carefully planned vertical pathways.",
      },
    ],
    defaultGuidance: {
      consultant:
        "The number of finished levels helps us understand how technology needs to move vertically through the home. This affects network coverage, cable pathways, equipment placement, and installation complexity.",
      didYouKnow:
        "Wi-Fi signals weaken as they pass through floors, especially when those floors contain dense materials, mechanical systems, ductwork, or radiant heating.",
    },
  },

  {
    id: "outdoorCoverage",
    sessionId: "discovery",
    type: "multi-select",
    title: "Where would you like outdoor or detached-building coverage?",
    description:
      "Select every area where you would like reliable Wi-Fi or connected technology. Choose all that apply.",
    required: true,
    options: [
      {
        id: "patio-deck",
        icon: "🪑",
        title: "Patio or Deck",
        description:
          "Extend reliable connectivity to outdoor entertaining and seating areas.",
      },
      {
        id: "yard",
        icon: "🌳",
        title: "Yard",
        description:
          "Provide broader wireless coverage around the home's exterior and lawn areas.",
      },
      {
        id: "pool",
        icon: "🏊",
        title: "Pool Area",
        description:
          "Support mobile devices, audio, cameras, and connected pool equipment.",
      },
      {
        id: "attached-garage",
        icon: "🚗",
        title: "Attached Garage",
        description:
          "Improve connectivity for vehicles, cameras, door controls, and other connected equipment.",
      },
      {
        id: "detached-garage",
        icon: "🏠",
        title: "Detached Garage",
        description:
          "Plan connectivity between the main residence and a separate garage structure.",
      },
      {
        id: "outbuilding",
        icon: "🛠️",
        title: "Detached Outbuilding",
        description:
          "Plan connectivity for a workshop, barn, shed, studio, or other detached structure.",
      },
      {
        id: "driveway",
        icon: "🚙",
        title: "Driveway or Property Entrance",
        description:
          "Support cameras, access control, intercoms, or connectivity farther from the home.",
      },
      {
        id: "none",
        icon: "✓",
        title: "No Outdoor Coverage Needed",
        description:
          "Keep the initial network plan focused on the home's interior.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Outdoor coverage is planned differently from indoor coverage. Detached structures, distance, exterior materials, and available cable pathways can all affect the best solution.",
      didYouKnow:
        "A detached garage or outbuilding does not automatically require its own internet service. Depending on distance and available pathways, it may be connected back to the home's primary network.",
    },
  },

  {
    id: "constructionStage",
    sessionId: "discovery",
    type: "single-select",
    title: "What stage is your new construction project in?",
    description:
      "Choose the stage that best describes your project today.",
    required: true,
    condition: {
      questionId: "projectType",
      equals: "new-construction",
    },
    options: [
      {
        id: "planning",
        icon: "📐",
        title: "Planning or Design",
        description:
          "Architectural plans are still being developed or finalized.",
      },
      {
        id: "pre-construction",
        icon: "📝",
        title: "Pre-Construction",
        description:
          "Plans are mostly complete, but construction has not started.",
      },
      {
        id: "framing",
        icon: "🪚",
        title: "Framing",
        description:
          "The structure is being framed and walls are still open.",
      },
      {
        id: "rough-in",
        icon: "⚡",
        title: "Electrical / Mechanical Rough-In",
        description:
          "Electrical, plumbing, HVAC, or low-voltage work is underway.",
      },
      {
        id: "drywall-soon",
        icon: "🧱",
        title: "Drywall Soon",
        description:
          "The project is approaching insulation and drywall.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Construction stage determines how much time remains to coordinate wiring, conduit, equipment locations, and future-ready infrastructure.",
      didYouKnow:
        "The earlier technology planning happens, the easier it is to coordinate pathways before walls are closed.",
    },
  },

  {
    id: "remodelAccess",
    sessionId: "discovery",
    type: "multi-select",
    title: "Which areas of the remodel will be open or accessible?",
    description:
      "Select every condition that applies to the areas being remodeled.",
    required: true,
    condition: {
      questionId: "projectType",
      equals: "remodel-addition",
    },
    options: [
      {
        id: "walls-open",
        icon: "🧱",
        title: "Walls Will Be Open",
        description:
          "Stud bays will be accessible for new wiring and pathways.",
      },
      {
        id: "ceilings-open",
        icon: "🔨",
        title: "Ceilings Will Be Open",
        description:
          "Ceiling cavities will be accessible during construction.",
      },
      {
        id: "basement-access",
        icon: "⬇️",
        title: "Basement Access",
        description:
          "The remodel can be reached from an unfinished or accessible basement.",
      },
      {
        id: "attic-access",
        icon: "⬆️",
        title: "Attic Access",
        description:
          "The remodel can be reached from an accessible attic.",
      },
      {
        id: "limited-access",
        icon: "⚠️",
        title: "Mostly Finished Areas",
        description:
          "Only limited wall or ceiling access will be available.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Knowing which surfaces will already be open helps us separate low-cost infrastructure opportunities from areas that may require retrofit labor.",
      didYouKnow:
        "A remodel is often the best time to establish pathways for future technology even if some devices will be installed years later.",
    },
  },

  {
    id: "existingHomeAccess",
    sessionId: "discovery",
    type: "multi-select",
    title: "What access is available in your existing home?",
    description:
      "Select every access condition that could help an installer route cable.",
    required: true,
    condition: {
      questionId: "projectType",
      equals: "existing-home",
    },
    options: [
      {
        id: "unfinished-basement",
        icon: "⬇️",
        title: "Unfinished Basement",
        description:
          "Open basement ceilings can provide excellent cable pathways.",
      },
      {
        id: "finished-basement",
        icon: "🏠",
        title: "Finished Basement",
        description:
          "Cable routing may still be possible but access can be more limited.",
      },
      {
        id: "crawl-space",
        icon: "🛠️",
        title: "Crawl Space",
        description:
          "A crawl space may provide access to first-floor wall cavities.",
      },
      {
        id: "attic",
        icon: "⬆️",
        title: "Accessible Attic",
        description:
          "An attic can provide useful pathways for upper-floor wiring.",
      },
      {
        id: "existing-conduit",
        icon: "🔌",
        title: "Existing Conduit",
        description:
          "Existing pathways may allow new cable without opening finished surfaces.",
      },
      {
        id: "drywall-ok",
        icon: "🧰",
        title: "Drywall Patching Is Acceptable",
        description:
          "Selective openings can be made and repaired where necessary.",
      },
      {
        id: "limited",
        icon: "⚠️",
        title: "Very Limited Access",
        description:
          "Most pathways are finished and concealed.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Existing homes can still support excellent wired infrastructure, but access conditions strongly affect labor, feasibility, and budget confidence.",
      didYouKnow:
        "A short installer pathway walkthrough can dramatically improve the accuracy of a retrofit budget.",
    },
  },

  {
    id: "existingStructuredWiring",
    sessionId: "discovery",
    type: "yes-no",
    title: "Does your home already have structured wiring?",
    description:
      "This may include Ethernet, Cat5e, Cat6, coax, speaker wire, security wire, or other low-voltage cabling installed throughout the home.",
    required: true,
    defaultGuidance: {
      consultant:
        "Existing structured wiring can be extremely valuable. Even older cabling may provide usable pathways or infrastructure that can reduce installation work.",
      didYouKnow:
        "Existing Ethernet cabling does not necessarily need to be replaced just because it is older. Its condition, category, termination, and intended use should be evaluated before deciding whether replacement is necessary.",
    },
  },

  {
    id: "internetEntry",
    sessionId: "discovery",
    type: "single-select",
    title: "Where does internet service enter the home?",
    description:
      "Choose the location that best describes the current or planned internet service entry point.",
    required: true,
    options: [
      {
        id: "basement-mechanical",
        icon: "⬇️",
        title: "Basement or Mechanical Room",
        description:
          "A centralized utility area can be a strong starting point for network equipment and structured wiring.",
      },
      {
        id: "utility-room",
        icon: "🔧",
        title: "Utility Room",
        description:
          "Internet service enters near other building systems or utility equipment.",
      },
      {
        id: "garage",
        icon: "🚗",
        title: "Garage",
        description:
          "The service enters through the garage or near garage utility equipment.",
      },
      {
        id: "living-space-office",
        icon: "💻",
        title: "Living Space or Office",
        description:
          "The modem or gateway is currently located in a finished living area.",
      },
      {
        id: "exterior-demarcation",
        icon: "🏠",
        title: "Exterior Wall or Utility Demarcation",
        description:
          "Service reaches the exterior of the home, but the interior equipment location may still need to be planned.",
      },
      {
        id: "not-sure",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "The service entry point is not currently known.",
      },
      {
        id: "not-installed",
        icon: "📝",
        title: "Not Installed Yet",
        description:
          "The internet service entry point has not yet been established.",
      },
    ],
    defaultGuidance: {
      consultant:
        "The internet service entry point helps us understand where the home's network begins. From there, we can evaluate whether the modem, gateway, rack, and distribution equipment should remain nearby or be relocated to a better central location.",
      didYouKnow:
        "The best location for your internet provider's modem is not always the best location for your home's network equipment. A planned equipment location can improve serviceability, expansion, cooling, and cable organization.",
    },
  },

  {
    id: "preferredEquipmentLocation",
    sessionId: "discovery",
    type: "single-select",
    title: "Where would you prefer the home's network and technology equipment to live?",
    description:
      "Choose the location you would prefer for networking, control, and related low-voltage equipment.",
    required: true,
    options: [
      {
        id: "mechanical-room",
        icon: "⚙️",
        title: "Mechanical Room",
        description:
          "A dedicated mechanical or utility space can provide centralized access to equipment.",
      },
      {
        id: "basement",
        icon: "⬇️",
        title: "Basement",
        description:
          "A basement can provide a practical central location for racks, switches, and service equipment.",
      },
      {
        id: "utility-closet",
        icon: "🚪",
        title: "Utility Closet",
        description:
          "A dedicated closet can keep technology organized and out of living spaces.",
      },
      {
        id: "garage",
        icon: "🚗",
        title: "Garage",
        description:
          "A garage may work if temperature, dust, moisture, power, and serviceability are acceptable.",
      },
      {
        id: "office",
        icon: "💻",
        title: "Office",
        description:
          "An office may be convenient but can introduce noise, heat, and visible equipment concerns.",
      },
      {
        id: "not-decided",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "The ideal equipment location has not been selected yet.",
      },
    ],
    defaultGuidance: {
      consultant:
        "A good equipment location should be accessible, dry, ventilated, near reliable power, and large enough for future expansion.",
      didYouKnow:
        "Network racks and control equipment generate heat. A location that seems convenient today may become uncomfortable or difficult to service as the system grows.",
    },
  },

  {
    id: "powerReliability",
    sessionId: "discovery",
    type: "single-select",
    title: "How reliable is electrical power at the property?",
    description:
      "Choose the answer that best reflects your experience. For new construction, choose Unknown / Unsure if there is not enough operating history yet.",
    required: true,
    options: [
      {
        id: "reliable",
        icon: "⚡",
        title: "Reliable — Outages Are Rare",
        description:
          "Power interruptions are uncommon and generally not a significant concern.",
      },
      {
        id: "occasional",
        icon: "🌩️",
        title: "Occasional Outages",
        description:
          "The property experiences some outages during storms or utility events.",
      },
      {
        id: "frequent",
        icon: "🔋",
        title: "Frequent Outages",
        description:
          "Power interruptions happen often enough that backup strategy is important.",
      },
      {
        id: "unknown-unsure",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "You are unsure about power reliability, or this is a new construction project without operating history yet.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Power reliability affects how we think about network continuity, cameras, access control, automation, and other systems that may need to remain online during an outage.",
      didYouKnow:
        "Even when a home has a generator, networking equipment can still reboot during the delay before generator power becomes available unless a UPS bridges the gap.",
    },
  },

  {
    id: "backupPower",
    sessionId: "discovery",
    type: "multi-select",
    title: "What backup power is currently available or planned?",
    description:
      "Select every option that applies. If none are currently available, choose No Backup Power.",
    required: true,
    options: [
      {
        id: "whole-home-generator",
        icon: "⚙️",
        title: "Whole-Home Generator",
        description:
          "A permanently installed standby generator supports all or most of the home.",
      },
      {
        id: "portable-generator",
        icon: "⛽",
        title: "Portable Generator",
        description:
          "A portable generator can support selected circuits during an outage.",
      },
      {
        id: "battery-storage",
        icon: "🔋",
        title: "Battery / Energy Storage System",
        description:
          "A home battery or energy-storage system provides backup electrical power.",
      },
      {
        id: "ups",
        icon: "🔌",
        title: "UPS for Technology Equipment",
        description:
          "Network or technology equipment has dedicated short-term battery backup.",
      },
      {
        id: "planned",
        icon: "📝",
        title: "Backup Power Is Planned",
        description:
          "Backup power is part of the project but has not been installed yet.",
      },
      {
        id: "none",
        icon: "✕",
        title: "No Backup Power",
        description:
          "The property does not currently have a backup power system.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Backup power can protect far more than internet access. Cameras, network switches, access control, automation, and communication devices may all depend on the same technology infrastructure.",
      didYouKnow:
        "A modest UPS protecting core networking equipment can often keep internet and Wi-Fi operating through short power interruptions.",
    },
  },

  {
    id: "floorPlansAvailable",
    sessionId: "discovery",
    type: "yes-no",
    title: "Do you have floor plans available?",
    description:
      "Floor plans can improve room planning, device placement, cable-pathway discussions, and future AI-assisted design.",
    required: true,
    defaultGuidance: {
      consultant:
        "Floor plans are extremely useful, but they are not required to continue. If you have them, we can use them later in the Blueprint process for visual planning.",
      didYouKnow:
        "Even an older real-estate floor plan can provide useful context for room relationships, approximate device locations, and coverage planning.",
    },
  },

  {
    id: "utilityAccess",
    sessionId: "discovery",
    type: "multi-select",
    title: "Which utility or service areas are available?",
    description:
      "Select the areas that exist and could potentially support technology equipment or cable pathways.",
    required: true,
    options: [
      {
        id: "mechanical-room",
        icon: "⚙️",
        title: "Mechanical Room",
        description:
          "A dedicated mechanical area may support centralized technology infrastructure.",
      },
      {
        id: "electrical-room-panel",
        icon: "⚡",
        title: "Electrical Panel Area",
        description:
          "The electrical service area may influence equipment placement and backup-power planning.",
      },
      {
        id: "utility-closet",
        icon: "🚪",
        title: "Utility Closet",
        description:
          "A utility closet may provide organized space for low-voltage equipment.",
      },
      {
        id: "basement",
        icon: "⬇️",
        title: "Basement",
        description:
          "Basement access can simplify cable distribution and equipment placement.",
      },
      {
        id: "attic",
        icon: "⬆️",
        title: "Attic",
        description:
          "Attic access can provide valuable pathways to upper-floor locations.",
      },
      {
        id: "garage",
        icon: "🚗",
        title: "Garage",
        description:
          "The garage may provide utility access but environmental conditions should be reviewed.",
      },
      {
        id: "none-unknown",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "You are unsure which utility areas may be usable for technology infrastructure.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Utility spaces often become the backbone of the technology plan because they can provide power, pathways, service access, and centralized equipment locations.",
      didYouKnow:
        "A dedicated low-voltage equipment location does not need to be large, but planning it early can prevent technology from ending up scattered across closets and living spaces.",
    },
  },

  {
    id: "networkCondition",
    sessionId: "discovery",
    type: "single-select",
    title: "How would you describe the home's current network equipment?",
    description:
      "Choose the option that best describes the current router, switches, Wi-Fi equipment, and related networking hardware.",
    required: true,
    options: [
      {
        id: "none-new",
        icon: "🆕",
        title: "No Existing Network / New Project",
        description:
          "There is no meaningful network equipment to evaluate or reuse.",
      },
      {
        id: "basic-provider",
        icon: "📶",
        title: "Basic Provider Equipment",
        description:
          "The home primarily relies on an internet-provider modem/router or gateway.",
      },
      {
        id: "consumer-mesh",
        icon: "🔗",
        title: "Consumer Mesh System",
        description:
          "The home uses a consumer mesh Wi-Fi platform.",
      },
      {
        id: "prosumer-managed",
        icon: "🖧",
        title: "Prosumer / Managed Network",
        description:
          "The home already uses dedicated access points, managed switching, or similar equipment.",
      },
      {
        id: "unknown",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "You are not sure what networking equipment is currently installed.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Understanding the current network helps us identify what may be reusable, what is limiting performance, and whether the final plan should replace or build around existing equipment.",
      didYouKnow:
        "Poor Wi-Fi performance is often caused by equipment placement, coverage design, or wired backhaul limitations rather than internet speed alone.",
    },
  },

  {
    id: "securityInfrastructure",
    sessionId: "discovery",
    type: "multi-select",
    title: "What security infrastructure already exists?",
    description:
      "Select every system currently installed or already planned.",
    required: true,
    options: [
      {
        id: "wired-alarm",
        icon: "🚨",
        title: "Wired Alarm / Security Sensors",
        description:
          "Door, window, motion, or other security wiring already exists.",
      },
      {
        id: "wireless-alarm",
        icon: "📡",
        title: "Wireless Alarm System",
        description:
          "The property currently uses a primarily wireless security system.",
      },
      {
        id: "wired-cameras",
        icon: "📷",
        title: "Wired Cameras",
        description:
          "Network or coax-based surveillance cameras are already installed.",
      },
      {
        id: "wireless-cameras",
        icon: "📹",
        title: "Wireless / Battery Cameras",
        description:
          "The property uses Wi-Fi, battery, or cloud-connected cameras.",
      },
      {
        id: "video-doorbell",
        icon: "🔔",
        title: "Video Doorbell",
        description:
          "A video doorbell or entry camera is currently installed.",
      },
      {
        id: "none",
        icon: "✕",
        title: "None",
        description:
          "There is no existing security infrastructure to evaluate.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Existing security wiring and cameras may be reusable, but compatibility, cable condition, power method, and system ownership should be reviewed.",
      didYouKnow:
        "Existing security cable can sometimes support newer sensors even when the original alarm panel is being replaced.",
    },
  },

  {
    id: "audioInfrastructure",
    sessionId: "discovery",
    type: "multi-select",
    title: "What audio or speaker infrastructure already exists?",
    description:
      "Select every option that applies.",
    required: true,
    options: [
      {
        id: "in-ceiling-speakers",
        icon: "🔊",
        title: "In-Ceiling / In-Wall Speakers",
        description:
          "Permanent architectural speakers are already installed.",
      },
      {
        id: "speaker-wire",
        icon: "🧵",
        title: "Existing Speaker Wire",
        description:
          "Speaker wiring is installed even if speakers or amplifiers are not currently connected.",
      },
      {
        id: "distributed-audio",
        icon: "🎵",
        title: "Existing Distributed Audio System",
        description:
          "The home currently has centralized or multi-room audio equipment.",
      },
      {
        id: "wireless-audio",
        icon: "📶",
        title: "Wireless / Smart Speakers",
        description:
          "The home primarily uses wireless speakers or app-based audio products.",
      },
      {
        id: "none",
        icon: "✕",
        title: "None",
        description:
          "There is no existing audio infrastructure to evaluate.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Existing speaker wire and architectural speakers can reduce the cost of a future audio system if the wiring is accessible, correctly routed, and in good condition.",
      didYouKnow:
        "Many older in-ceiling speakers can remain useful even when the original audio electronics are obsolete.",
    },
  },

  {
    id: "futureExpansionPriority",
    sessionId: "discovery",
    type: "single-select",
    title: "How important is future expansion to you?",
    description:
      "Think about technologies you may add later, even if they are not part of the initial project.",
    required: true,
    options: [
      {
        id: "low",
        icon: "1️⃣",
        title: "Low Priority",
        description:
          "Focus primarily on the technology being installed now.",
      },
      {
        id: "moderate",
        icon: "2️⃣",
        title: "Moderate Priority",
        description:
          "Include reasonable spare capacity and selected future-ready pathways.",
      },
      {
        id: "high",
        icon: "3️⃣",
        title: "High Priority",
        description:
          "Prioritize conduit, spare cable capacity, rack space, and infrastructure designed for future technologies.",
      },
      {
        id: "unsure",
        icon: "❓",
        title: "Unknown / Unsure",
        description:
          "You would like the Blueprint to recommend an appropriate level of future readiness.",
      },
    ],
    defaultGuidance: {
      consultant:
        "Future readiness does not mean wiring for every imaginable device. It means identifying the pathways and infrastructure that are inexpensive to install now but difficult to add later.",
      didYouKnow:
        "Empty conduit can sometimes be more valuable than extra cable because it creates a pathway for technologies that do not exist yet.",
    },
  },
];

export const projectTypeGuidance: Record<
  "new-construction" | "remodel-addition" | "existing-home",
  ConsultantGuidance
> = {
  "new-construction": {
    consultant:
      "Excellent timing. Since the walls are open, we can prioritize wiring, conduit, equipment locations, and future expansion before those decisions become expensive to change.",
    didYouKnow:
      "Installing pathways during framing is usually far easier than opening finished walls later.",
  },

  "remodel-addition": {
    consultant:
      "This is a strong opportunity to improve infrastructure in the areas already under construction while planning realistic transitions into finished parts of the home.",
    didYouKnow:
      "A remodel can establish new technology pathways even when only part of the home is open.",
  },

  "existing-home": {
    consultant:
      "No problem. We will focus on practical routes through attics, basements, crawl spaces, closets, existing conduit, and selective drywall access where needed.",
    didYouKnow:
      "A finished home can still support excellent wired infrastructure, but installer pathway review becomes much more important.",
  },
};