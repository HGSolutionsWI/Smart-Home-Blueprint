import type { BlueprintQuestion } from "@/types/blueprint";

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
];

export const projectTypeGuidance = {
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
      "A finished home can still support excellent wired technology, but installer pathway review becomes much more important.",
  },
} as const;