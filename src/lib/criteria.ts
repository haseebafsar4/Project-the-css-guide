import { BookOpen, Check, Sparkles, Target, Layers, Link2, Wind, KeyRound, Eye } from "lucide-react";

export type CriterionKey =
  | "spelling" | "grammar" | "vocabulary" | "topicRelevance"
  | "structure" | "coherence" | "flow" | "keywords" | "clarity";

export const CRITERIA: { key: CriterionKey; label: string; icon: any; description: string }[] = [
  { key: "spelling", label: "Spelling", icon: Check, description: "Accurate word forms and proper noun casing." },
  { key: "grammar", label: "Grammar", icon: BookOpen, description: "Tense, agreement, articles, and syntax." },
  { key: "vocabulary", label: "Vocabulary", icon: Sparkles, description: "Range, precision, and register of word choice." },
  { key: "topicRelevance", label: "Topic Relevance", icon: Target, description: "Adherence to and depth on the given topic." },
  { key: "structure", label: "Structure", icon: Layers, description: "Topic sentence, body, conclusion balance." },
  { key: "coherence", label: "Coherence", icon: Link2, description: "Logical unity and idea connection." },
  { key: "flow", label: "Flow", icon: Wind, description: "Sentence variety and rhythm." },
  { key: "keywords", label: "Keywords", icon: KeyRound, description: "Use of topic-specific terminology." },
  { key: "clarity", label: "Clarity", icon: Eye, description: "Unambiguous, reader-friendly meaning." },
];

export const scoreColor = (score: number) => {
  if (score >= 8) return "text-emerald-400";
  if (score >= 5) return "text-gold";
  return "text-destructive";
};
export const scoreBg = (score: number) => {
  if (score >= 8) return "from-emerald-500 to-emerald-400";
  if (score >= 5) return "from-amber-500 to-yellow-400";
  return "from-red-500 to-rose-400";
};
