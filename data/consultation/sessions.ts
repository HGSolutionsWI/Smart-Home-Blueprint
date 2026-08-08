import { discoveryQuestions } from "@/data/consultation/discovery";
import { infrastructureQuestions } from "@/data/consultation/infrastructure";
import { lifestyleQuestions } from "@/data/consultation/lifestyle";

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
] as const;