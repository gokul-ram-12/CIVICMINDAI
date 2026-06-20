export interface ScoreMetrics {
  innovation: number;       // 0-100
  feasibility: number;      // 0-100
  judgeAppeal: number;      // 0-100
  complexity: number;       // 0-100
  marketPotential: number;  // 0-100
}

export interface WinningProbability {
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  improvements: string[];
}

export interface TechStackItem {
  name: string;
  category: string; // e.g. "Frontend", "Backend", "Database", "AI", "Deployment"
  reason: string;
}

export interface FeatureItem {
  title: string;
  description: string;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  type: 'user' | 'frontend' | 'backend' | 'database' | 'ai' | 'external';
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label?: string;
}

export interface ArchitectureData {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

export interface TimelineStage {
  stage: string;       // e.g. "Hours 1–2", "Hours 3–4", etc.
  title: string;
  tasks: string[];
}

export interface JudgePerspective {
  standoutReason: string;
  innovationPoints: string[];
  businessValue: string;
  technicalDepth: string;
  demoImpact: string;
}

export interface Blueprint {
  projectName: string;
  tagline: string;
  elevatorPitch: string;
  problemStatement: string;
  solutionOverview: string;
  scores: ScoreMetrics;
  winningProbability: WinningProbability;
  coreFeatures: FeatureItem[];
  techStack: TechStackItem[];
  architecture: ArchitectureData;
  folderStructure: string;
  timeline: TimelineStage[];
  deployment: {
    provider: string;
    steps: string[];
  };
  judgePerspective: JudgePerspective;
  winningHighlights: string[];
}

export interface FormInputs {
  theme: string;
  timeLimit: string;
  teamSize: number;
  skills: string;
  goal: 'Winning' | 'Learning' | 'MVP' | 'Social Impact' | 'Startup Idea';
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  inputs: FormInputs;
  blueprint: Blueprint;
}
