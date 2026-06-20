# HackForge AI — Your AI Co-Founder for Hackathons

HackForge AI is a premium SaaS-style AI web application designed to help hackathon teams generate complete, award-winning project blueprints based on theme, timeframe, team size, skills, and goals. Powered by **Google Gemini AI**.

Built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4** for lightning-fast speeds and high-performance visual states.

---

## ⚡ Key Features

*   **Premium SaaS Aesthetics**: Stripe/Apple-inspired dark UI, smooth glowing glassmorphism gradients, and loading shimmer effects.
*   **Immersive 5-Stage Loading Screen**: Watch the AI work through a visual milestone progress dashboard (Analyzing Theme, Opportunity, Solution, Architecture, Pitch).
*   **AI Confidence & Judging Metrics**: Circular radial SVG meters displaying Innovation, Feasibility, Judge Appeal, Complexity, and Market Potential.
*   **SWOT / Winning Probability Audit**: Actionable breakdowns of Strengths, Weaknesses, Development Risks, and Judges improvements.
*   **Interactive System Architecture Diagram**: Dynamically sorts nodes into logical sequences (Users → Frontends → API Services → Databases/AI) with hover highlights and edges.
*   **Hour-by-Hour Timeline Planner**: A fully interactive vertical timeline checklist. Check off milestones in real-time as your team builds.
*   **Judge perspective Tab ("Judge View")**: Highlights standout points, business and commercial value, code depth, and demo strategies.
*   **Multi-Format Exports**: One-click download for Markdown documents (`.md`), config JSON files (`.json`), or a beautifully styled professional PDF directly via native print sheets (`Ctrl+P` / print-to-PDF).
*   **Local Storage Session History**: Automatically saves the last 5 generations locally.

---

## 🛠️ Tech Stack

*   **Core**: React 19, TypeScript
*   **Build tool**: Vite 8
*   **Styling**: Tailwind CSS v4 (native `@tailwindcss/vite` configuration)
*   **Icons**: Lucide React
*   **AI Engine**: Google Gemini API SDK (`@google/generative-ai`)

---

## 🚀 Setup & Local Installation

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### 1. Clone & Install Dependencies
Navigate to the project root directory and run:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add your Google Gemini API Key:
```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
```
*Note: If no env key is provided, the application will display a secure Settings dialog in the top right to configure the API key in local storage.*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to launch HackForge AI.

### 4. Build for Production
To build the optimized static assets:
```bash
npm run build
```

---

## ☁️ Deployment on Vercel

HackForge AI is fully optimized for continuous deployment on **Vercel** with a single click.

1.  Push your code to a GitHub, GitLab, or Bitbucket repository.
2.  Import your repository into the [Vercel Dashboard](https://vercel.com).
3.  Under **Build & Development Settings**, configure:
    *   **Framework Preset**: Vite
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
4.  Under **Environment Variables**, add:
    *   `VITE_GEMINI_API_KEY` = *[Your Gemini API Key]*
5.  Click **Deploy**. Vercel will build the React bundle and host it on a global edge CDN.

---

## 📝 Gemini Prompt & Prompting Strategy

HackForge AI instructs Gemini to behave as an expert hackathon mentor, startup architect, and product manager. It requests the model to respond in a strict, parsed JSON schema that powers the circular gauges, checklist timeline, and interactive diagram nodes.

Check [src/services/gemini.ts](src/services/gemini.ts) for details.
