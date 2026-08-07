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