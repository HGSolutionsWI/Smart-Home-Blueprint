export const projectOptions = [
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
] as const;

export const homeSizeOptions = [
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
] as const;

export const guidanceByProject = {
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

export type ProjectType = keyof typeof guidanceByProject;
export type HomeSize = (typeof homeSizeOptions)[number]["id"];