export interface ResumeSection {
  id: string;
  title: string;
  content: string;
  status: "good" | "warning" | "critical";
  issues: string[];
}

export interface Suggestion {
  id: string;
  sectionId: string;
  type: "replace" | "add" | "remove" | "rewrite";
  priority: "high" | "medium" | "low";
  title: string;
  currentText: string;
  suggestedText: string;
  reason: string;
  impact: string;
}

export interface ATSAnalysis {
  atsFriendlinessScore: number;
  jobMatchScore: number;
  atsFriendlinessBreakdown: {
    formatting: number;
    keywords: number;
    structure: number;
    readability: number;
  };
  resumeSections: ResumeSection[];
  suggestions: Suggestion[];
  missingKeywords: string[];
  matchedKeywords: string[];
  generalFeedback: string;
}

export type AppStep = "upload" | "analyzing" | "results";
