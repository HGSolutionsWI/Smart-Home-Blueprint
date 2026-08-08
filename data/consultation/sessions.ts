import { blueprintQuestions } from "@/data/consultation/blueprint";
import { discoveryQuestions } from "@/data/consultation/discovery";
import { infrastructureQuestions } from "@/data/consultation/infrastructure";
import { lifestyleQuestions } from "@/data/consultation/lifestyle";
import { technologyQuestions } from "@/data/consultation/technology";

export const blueprintSessions = [
  {
    id: "discovery",
    title: "Discover Your Home",
    description:
      "Understand the property, construction conditions, existing infrastructure, utilities, and physical opportunities that will shape the Smart Home Blueprint.",
    questions: discoveryQuestions,
  },
  {
    id: "lifestyle",
    title: "Discover Your Lifestyle",
    description:
      "Understand how the household works, entertains, travels, uses technology, values privacy, and prioritizes reliability, convenience, and security.",
    questions: lifestyleQuestions,
  },
  {
    id: "infrastructure",
    title: "Design Your Infrastructure",
    description:
      "Translate the home and lifestyle requirements into structured wiring, network, pathway, rack, security, audio, power, and future-ready infrastructure decisions.",
    questions: infrastructureQuestions,
  },
  {
    id: "technology",
    title: "Choose Your Technology",
    description:
      "Translate the project requirements into appropriate system levels for networking, security, lighting, automation, climate, audio, video, resilience, privacy, and control.",
    questions: technologyQuestions,
  },
  {
    id: "blueprint",
    title: "Build Your Blueprint",
    description:
      "Confirm implementation priorities, project assumptions, professional review needs, unresolved decisions, and readiness to generate the final Smart Home Blueprint.",
    questions: blueprintQuestions,
  },
] as const;