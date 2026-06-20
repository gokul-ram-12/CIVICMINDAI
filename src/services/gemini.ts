import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Blueprint, FormInputs } from '../types/blueprint';

/**
 * Generates a hackathon project blueprint using Gemini AI.
 * 
 * @param inputs - The hackathon parameters entered by the user
 * @param customApiKey - Optional custom API key provided in the UI
 * @returns A promise resolving to the structured Blueprint object
 */
export async function generateBlueprint(inputs: FormInputs, customApiKey?: string): Promise<Blueprint> {
  const apiKey = customApiKey || import.meta.env.VITE_GEMINI_API_KEY || '';

  if (!apiKey) {
    throw new Error('Google Gemini API Key is missing. Please add it via the Settings modal (gear icon in header) or in the VITE_GEMINI_API_KEY environment variable.');
  }

  // Initialize the Gemini API client
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Use gemini-2.5-flash as the fast, cost-effective default model
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    }
  });

  const prompt = `
Act as an expert hackathon mentor, startup architect, product manager, and senior software engineer.
Based on the following hackathon inputs, design a complete, innovative, realistic, and award-winning project plan.

HACKATHON INPUTS:
- Theme: "${inputs.theme}"
- Available Time: "${inputs.timeLimit}"
- Team Size: ${inputs.teamSize} member(s)
- Skills/Technologies: "${inputs.skills}"
- Goal/Target: "${inputs.goal}" (e.g. Winning the hackathon, Learning new tech, building a working MVP, Social Impact, or proving a Startup Idea)

You must output a single, valid JSON object that exactly matches the following interface:

interface Blueprint {
  projectName: string;
  tagline: string;
  elevatorPitch: string; // Compelling 30-second elevator pitch
  problemStatement: string; // The problem this project solves
  solutionOverview: string; // Summary of the unique solution
  scores: {
    innovation: number;       // Score 0-100 reflecting how unique the idea is
    feasibility: number;      // Score 0-100 reflecting if it is buildable in the given time
    judgeAppeal: number;      // Score 0-100 reflecting how much judges will love it
    complexity: number;       // Score 0-100 reflecting the depth of tech implementation
    marketPotential: number;  // Score 0-100 reflecting future commercial viability
  };
  winningProbability: {
    strengths: string[];      // 3-4 strengths of the project in a hackathon context
    weaknesses: string[];    // 2-3 weaknesses/drawbacks to be aware of
    risks: string[];         // 2-3 development or demo risks
    improvements: string[];  // 3-4 actionable tips to make it a winning project
  };
  coreFeatures: {
    title: string;
    description: string;
  }[]; // Provide 3-5 core features to implement
  techStack: {
    name: string;
    category: string; // "Frontend", "Backend", "Database", "AI/ML", "Deployment", "APIs/Other"
    reason: string;   // Brief explanation of why this tech is selected for this team/time
  }[];
  architecture: {
    nodes: { 
      id: string; 
      label: string; 
      type: 'user' | 'frontend' | 'backend' | 'database' | 'ai' | 'external' 
    }[];
    edges: { 
      from: string; 
      to: string; 
      label?: string 
    }[];
  }; // Construct a clear sequential node diagram (e.g., user -> web app -> database -> gemini)
  folderStructure: string; // Suggested repository layout (represented as a text tree structure)
  timeline: {
    stage: string;       // e.g. "Hours 1–2", "Hours 3–4", "Hours 5–8", "Hours 9–12", "Final Hours"
    title: string;       // Actionable stage title
    tasks: string[];     // List of tasks for this stage
  }[]; // Break down the available time (${inputs.timeLimit}) into 5 logical phases
  deployment: {
    provider: string;    // Recommended deployment provider (Vercel, Netlify, Render, etc.)
    steps: string[];     // Step-by-step instructions to deploy
  };
  judgePerspective: {
    standoutReason: string; // Single paragraph explaining why this project stands out
    innovationPoints: string[]; // 2-3 unique technical/design points
    businessValue: string; // The practical real-world or startup potential
    technicalDepth: string; // The clever code or algorithmic complexity judges respect
    demoImpact: string; // How to demo it for maximum "wow" factor (e.g. mock data setups, key UI screens)
  };
  winningHighlights: string[]; // 3-4 bullet points highlighting the "killer feature" or judge attraction
}

Ensure the project is tailored perfectly to the team size (${inputs.teamSize}) and the skills/technologies listed (${inputs.skills}). If time is short (e.g., 24 hours), focus on building a robust MVP, choosing rapid development tools, and keeping features concise yet high-impact.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();
    
    // Clean potential markdown wrap if any (sometimes models output ```json ... ``` despite system prompt)
    const jsonText = rawText
      .replace(/^```json\s*/i, '')
      .replace(/```\s*$/, '')
      .trim();

    const parsed: Blueprint = JSON.parse(jsonText);

    // Validate the minimum structure is present, otherwise inject fallbacks
    if (!parsed.projectName || !parsed.scores || !parsed.techStack || !parsed.timeline) {
      throw new Error('The AI generated an invalid data structure. Please try again.');
    }

    return parsed;
  } catch (error: any) {
    console.error('Gemini Generation Error:', error);
    throw new Error(error?.message || 'Failed to generate blueprint. Please check your API key and connection and try again.');
  }
}

/**
 * Formats a Blueprint object into a beautiful Markdown document.
 * This is used for exporting the generated blueprint.
 */
export function formatBlueprintToMarkdown(blueprint: Blueprint, inputs: FormInputs): string {
  return `# HackForge AI Project Blueprint: ${blueprint.projectName}
> **Tagline**: ${blueprint.tagline}
> **Goal**: ${inputs.goal} | **Time Limit**: ${inputs.timeLimit} | **Team Size**: ${inputs.teamSize} member(s)
> **Technologies Specified**: ${inputs.skills}

---

## 30-Second Elevator Pitch
${blueprint.elevatorPitch}

---

## Problem & Solution
### Problem Statement
${blueprint.problemStatement}

### Solution Overview
${blueprint.solutionOverview}

---

## AI Confidence & Judging Scores
- **Innovation**: ${blueprint.scores.innovation}/100
- **Feasibility**: ${blueprint.scores.feasibility}/100
- **Judge Appeal**: ${blueprint.scores.judgeAppeal}/100
- **Technical Complexity**: ${blueprint.scores.complexity}/100
- **Market Potential**: ${blueprint.scores.marketPotential}/100

---

## Winning Probability Analysis
### Strengths
${blueprint.winningProbability.strengths.map(s => `- ${s}`).join('\n')}

### Weaknesses & Risks
${blueprint.winningProbability.weaknesses.map(w => `- **Weakness**: ${w}`).join('\n')}
${blueprint.winningProbability.risks.map(r => `- **Risk**: ${r}`).join('\n')}

### Actionable Suggestions for Judges
${blueprint.winningProbability.improvements.map(i => `- ${i}`).join('\n')}

---

## Core Features
${blueprint.coreFeatures.map(f => `### ${f.title}\n${f.description}`).join('\n\n')}

---

## Technology Stack
${blueprint.techStack.map(t => `- **${t.name}** (${t.category}): ${t.reason}`).join('\n')}

---

## System Architecture
\`\`\`
${blueprint.architecture.nodes.map(n => `[Node: ${n.label} (Type: ${n.type})]`).join('\n')}
${blueprint.architecture.edges.map(e => `${e.from} --(${e.label || 'connected'})--> ${e.to}`).join('\n')}
\`\`\`

---

## Suggested Repository Structure
\`\`\`
${blueprint.folderStructure}
\`\`\`

---

## Hackathon Timeline Planner (${inputs.timeLimit})
${blueprint.timeline.map(t => `### ${t.stage}: ${t.title}
${t.tasks.map(task => `- [ ] ${task}`).join('\n')}`).join('\n\n')}

---

## Deployment Plan
Recommended Provider: **${blueprint.deployment.provider}**

### Action Steps:
${blueprint.deployment.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

---

## Judge Perspective ("Judge View Mode")
### Why It Stands Out
${blueprint.judgePerspective.standoutReason}

### Key Innovation Points
${blueprint.judgePerspective.innovationPoints.map(ip => `- ${ip}`).join('\n')}

### Business & Market Value
${blueprint.judgePerspective.businessValue}

### Technical Depth Showcase
${blueprint.judgePerspective.technicalDepth}

### Recommended Demo Strategy (Demo Impact)
${blueprint.judgePerspective.demoImpact}

---
*Blueprint generated by HackForge AI - Your Co-Founder for Hackathons*
`;
}
