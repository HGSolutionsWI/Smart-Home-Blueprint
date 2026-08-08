import { discoveryQuestions } from "@/data/consultation/discovery";
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
] as const;