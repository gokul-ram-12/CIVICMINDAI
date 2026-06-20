import type { Blueprint, FormInputs } from '../types/blueprint';

export interface MockSprint {
  id: string;
  timestamp: string;
  inputs: FormInputs;
  blueprint: Blueprint;
}

export const MOCK_SPRINTS: MockSprint[] = [
  {
    id: 'eco-track',
    timestamp: '3 days ago',
    inputs: {
      theme: 'AI Carbon Footprint Tracker',
      timeLimit: '24 Hours',
      teamSize: 3,
      skills: 'React, Vite, Tailwind CSS, Gemini API, Supabase',
      goal: 'Winning'
    },
    blueprint: {
      projectName: 'EcoTrack AI',
      tagline: 'AI-powered carbon footprint tracker with smart recommendations.',
      elevatorPitch: 'EcoTrack AI transforms behavioral user data into actionable carbon reduction scores. By combining real-time API integrations with Google Gemini recommendation matrices, we empower users to audit, track, and offset their personal greenhouse emissions in under 60 seconds.',
      problemStatement: 'Tracking personal carbon footprint is currently tedious, requiring manual entries and obscure conversion math, leading to low user engagement.',
      solutionOverview: 'EcoTrack AI automates emissions accounting by parsing user transaction receipts and transit logs using Gemini OCR and offering custom offset suggestions.',
      scores: {
        innovation: 92,
        feasibility: 88,
        judgeAppeal: 94,
        complexity: 85,
        marketPotential: 89
      },
      winningProbability: {
        strengths: ['Automated financial transaction parsing via LLM OCR', 'Hyper-personalized recommendation engine', 'Interactive gamified progress badges'],
        weaknesses: ['API dependency latency', 'Offline calculations fallback'],
        risks: ['Strict user financial data privacy requirements', 'Supabase transaction volume caps during live demos'],
        improvements: ['Implement zero-knowledge proofs for transactional inputs', 'Pre-seed mockup financial profiles to bypass banking API consent steps']
      },
      coreFeatures: [
        { title: 'AI Receipt Ledger', description: 'OCR parsing of commercial transaction files to calculate fuel, food, and energy emissions values.' },
        { title: 'Daily Eco Sprints', description: 'Micro-incentive challenges matching offset habits (e.g. transit routing suggestions) with progress indicators.' },
        { title: 'Visual Offset Grid', description: 'Graphical representation of offset achievements integrated with climate-action funds.' }
      ],
      techStack: [
        { name: 'React & Vite', category: 'Frontend', reason: 'Lightning-fast client builds and HMR transitions essential for 24h sprints.' },
        { name: 'Tailwind CSS v4', category: 'Frontend', reason: 'High-end styling and native CSS-first glassmorphism compilation.' },
        { name: 'Gemini Engine API', category: 'AI/ML', reason: 'Performs transactional text classification and offsets advice generation.' },
        { name: 'Supabase Serverless', category: 'Database', reason: 'Real-time database, auth, and secure storage initialized in minutes.' }
      ],
      architecture: {
        nodes: [
          { id: 'user', label: 'User Client', type: 'user' },
          { id: 'web', label: 'Web UI (Vite)', type: 'frontend' },
          { id: 'gemini', label: 'Gemini AI OCR', type: 'ai' },
          { id: 'db', label: 'Emissions DB', type: 'database' }
        ],
        edges: [
          { from: 'user', to: 'web', label: 'Uploads receipt' },
          { from: 'web', to: 'gemini', label: 'Extracts line items' },
          { from: 'gemini', to: 'db', label: 'Logs carbon value' },
          { from: 'db', to: 'web', label: 'Renders eco chart' }
        ]
      },
      folderStructure: 'src/\n├── components/\n│   ├── EcoDashboard.tsx\n│   └── ReceiptScanner.tsx\n├── services/\n│   └── gemini.ts\n└── index.css',
      timeline: [
        { stage: 'Hours 1–4', title: 'Setup & OCR Prototypes', tasks: ['Initialize React + Supabase', 'Configure Gemini receipt-parsing endpoint'] },
        { stage: 'Hours 5–12', title: 'Core Calculations Engine', tasks: ['Build carbon conversion models', 'Create offset dashboard widgets'] },
        { stage: 'Hours 13–20', title: 'UI Refinements & Charts', tasks: ['Style glass charts', 'Integrate Lucide indicators'] },
        { stage: 'Hours 21–24', title: 'Demo Sandbox & Pitching', tasks: ['Generate dummy receipts', 'Record presentation slides'] }
      ],
      deployment: {
        provider: 'Vercel',
        steps: ['Create Vercel project linked to GitHub repository', 'Configure VITE_GEMINI_API_KEY environment variable', 'Deploy dist build folder']
      },
      judgePerspective: {
        standoutReason: 'Automated receipt-to-carbon translation removes manual input friction.',
        innovationPoints: ['One-click camera audits', 'LLM classification filters'],
        businessValue: 'Can scale as a corporate carbon audit SaaS utility.',
        technicalDepth: 'Demonstrates deep OCR capabilities and real-time dashboard calculations.',
        demoImpact: 'Demonstrate by uploading a sample Uber and flight receipt, showing how carbon values populate dynamically.'
      },
      winningHighlights: ['Automated financial transaction parsing', 'Gamified footprint goals', 'Zero-knowledge client design']
    }
  },
  {
    id: 'medi-mate',
    timestamp: '1 week ago',
    inputs: {
      theme: 'AI Patient Triage Assistant',
      timeLimit: '48 Hours',
      teamSize: 4,
      skills: 'React, Node.js, Express, Python, MongoDB, Gemini API',
      goal: 'MVP'
    },
    blueprint: {
      projectName: 'MediMate',
      tagline: 'Virtual health assistant for remote patient monitoring.',
      elevatorPitch: 'MediMate bridges the gap between remote patient symptom logs and clinical triage. Using Gemini clinical text analysis, the platform highlights symptom trajectories, flags potential diagnostic red flags, and streamlines communication between home-care and medical supervisors.',
      problemStatement: 'Patients recovering at home struggle to log symptoms accurately, leading to clinician alerts fatigue and delayed emergency responses.',
      solutionOverview: 'An interactive patient check-in app combined with a clinical telemetry dashboard that sorts alerts by severity using AI.',
      scores: {
        innovation: 89,
        feasibility: 91,
        judgeAppeal: 93,
        complexity: 88,
        marketPotential: 92
      },
      winningProbability: {
        strengths: ['Highly scalable clinic telemetry framework', 'Symptom timeline visualization', 'Safe diagnostic guardrails'],
        weaknesses: ['HIPAA compliance configurations', 'Medical terminology parsing accuracy'],
        risks: ['Strict security protocols required', 'Network failures offline logs sync'],
        improvements: ['Ensure data is encrypted locally', 'Provide disclaimer that the tool is an assistant, not a doctor']
      },
      coreFeatures: [
        { title: 'Symptom Triage Check', description: 'Patient chat dialog assessing pain levels, duration, and vitals inputs.' },
        { title: 'Telemetry Board', description: 'Real-time sorting of check-ins by clinical urgency.' }
      ],
      techStack: [
        { name: 'React', category: 'Frontend', reason: 'Modular interfaces for clinic and patient dashboards.' },
        { name: 'Express API', category: 'Backend', reason: 'Scalable routing to route logs and sync clinic telemetry.' },
        { name: 'MongoDB', category: 'Database', reason: 'Document storage optimized for semi-structured health files.' },
        { name: 'Gemini 2.5 Flash', category: 'AI/ML', reason: 'High-speed clinical check-in transcription and semantic severity classification.' }
      ],
      architecture: {
        nodes: [
          { id: 'patient', label: 'Patient Client', type: 'user' },
          { id: 'doctor', label: 'Doctor Board', type: 'user' },
          { id: 'api', label: 'Express Server', type: 'backend' },
          { id: 'gemini', label: 'Gemini Urgent Triage', type: 'ai' },
          { id: 'db', label: 'Mongo database', type: 'database' }
        ],
        edges: [
          { from: 'patient', to: 'api', label: 'Logs vitals symptoms' },
          { from: 'api', to: 'gemini', label: 'Audits urgency index' },
          { from: 'gemini', to: 'db', label: 'Saves severity flag' },
          { from: 'db', to: 'doctor', label: 'Updates medical board' }
        ]
      },
      folderStructure: 'src/\n├── components/\n│   ├── TriageBoard.tsx\n│   └── DoctorFeed.tsx\n└── index.css',
      timeline: [
        { stage: 'Hours 1–8', title: 'Setup & Clinic Dashboards', tasks: ['Configure Express API', 'Set up clinic monitoring wireframes'] },
        { stage: 'Hours 9–24', title: 'Triage classification', tasks: ['Build symptom query templates', 'Integrate Gemini classification endpoints'] },
        { stage: 'Hours 25–40', title: 'Doctor Feed & Notifications', tasks: ['Implement clinic board filters', 'Style critical warnings notifications'] },
        { stage: 'Hours 41–48', title: 'Validation & Pitch Prep', tasks: ['Seed patient history logs', 'Verify clinicial alerts dashboard'] }
      ],
      deployment: {
        provider: 'Render & Vercel',
        steps: ['Host React app on Vercel', 'Deploy Express server to Render', 'Provision MongoDB Atlas server']
      },
      judgePerspective: {
        standoutReason: 'Speeds up remote clinical oversight by flagging triage urgencies.',
        innovationPoints: ['Urgency telemetry algorithms', 'Interactive voice check-ins'],
        businessValue: 'Strong B2B telemedicine SaaS integration capability.',
        technicalDepth: 'Exhibits robust server routes and prompt logic pipelines.',
        demoImpact: 'Demonstrate by entering symptoms for a stomach ache versus a severe allergic reaction, showing the clinical panel shift ranking immediately.'
      },
      winningHighlights: ['Clinical telemetric dashboard', 'Urgency priority classification', 'Symptom trajectory tracking']
    }
  },
  {
    id: 'edu-forge',
    timestamp: '2 weeks ago',
    inputs: {
      theme: 'AI Adaptive Learning Platform',
      timeLimit: '36 Hours',
      teamSize: 2,
      skills: 'React, Tailwind CSS, Firebase, Gemini Vision, TypeScript',
      goal: 'Learning'
    },
    blueprint: {
      projectName: 'EduForge',
      tagline: 'Adaptive learning platform for personalized education.',
      elevatorPitch: 'EduForge redefines student study paths by turning static documents into interactive micro-lessons. Using Gemini Vision, students upload diagrams or hand-written notes, which the AI translates into personalized quiz models and code exercises that adjust difficulty in real-time.',
      problemStatement: 'One-size-fits-all education content fails to support students at varying learning paces, leading to dropouts.',
      solutionOverview: 'An adaptive web dashboard that accepts file uploads, parses study concepts, and presents structured learning modules.',
      scores: {
        innovation: 85,
        feasibility: 93,
        judgeAppeal: 87,
        complexity: 82,
        marketPotential: 86
      },
      winningProbability: {
        strengths: ['Zero manual syllabus creation required', 'Dynamic concept breakdown models', 'Firebase real-time synchronization'],
        weaknesses: ['Requires camera/file upload capability', 'Text extraction of complex equations requires fine-tuning'],
        risks: ['File format limits during live demos', 'Slow image parsing queues'],
        improvements: ['Seed standard mock textbooks in workspace', 'Optimize image files pre-upload to bypass latency']
      },
      coreFeatures: [
        { title: 'Vision Parser', description: 'Upload handwritten sketches or diagrams to generate study chapters.' },
        { title: 'Adaptive Quiz Engine', description: 'Quizzes that adjust questions based on past answers.' }
      ],
      techStack: [
        { name: 'React & TS', category: 'Frontend', reason: 'Enables type-safe interactive test screens.' },
        { name: 'Firebase Base', category: 'Database', reason: 'Easy auth, file storage, and real-time score logging.' },
        { name: 'Gemini Vision API', category: 'AI/ML', reason: 'Translates uploads into structured educational guides.' }
      ],
      architecture: {
        nodes: [
          { id: 'student', label: 'Student Client', type: 'user' },
          { id: 'web', label: 'Web app', type: 'frontend' },
          { id: 'gemini', label: 'Gemini Vision Engine', type: 'ai' },
          { id: 'db', label: 'Firebase Store', type: 'database' }
        ],
        edges: [
          { from: 'student', to: 'web', label: 'Uploads textbook chapter' },
          { from: 'web', to: 'gemini', label: 'Parses images & diagrams' },
          { from: 'gemini', to: 'db', label: 'Saves curriculum questions' },
          { from: 'db', to: 'web', label: 'Renders dynamic study guide' }
        ]
      },
      folderStructure: 'src/\n├── components/\n│   ├── QuizScreen.tsx\n│   └── NotebookUpload.tsx\n└── index.css',
      timeline: [
        { stage: 'Hours 1–6', title: 'Boilerplate & File Stores', tasks: ['Set up Firebase storage buckets', 'Initialize layout files'] },
        { stage: 'Hours 7–18', title: 'Vision integration', tasks: ['Configure Gemini vision prompts', 'Create parser hooks'] },
        { stage: 'Hours 19–30', title: 'Adaptive Engine & Quizzes', tasks: ['Write scoring state models', 'Build interactive quiz layout'] },
        { stage: 'Hours 31–36', title: 'Polish & Demos', tasks: ['Polish glass card screens', 'Record walk-through video'] }
      ],
      deployment: {
        provider: 'Firebase Hosting',
        steps: ['Build production package', 'Run firebase deploy cli', 'Verify environment api key variables']
      },
      judgePerspective: {
        standoutReason: 'Converts handwriting directly into interactive curricula.',
        innovationPoints: ['Diagram parsing algorithms', 'Personalized adaptive difficulty'],
        businessValue: 'Potential integration with public school LMS systems.',
        technicalDepth: 'Exhibits robust visual processing pipelines and score trackers.',
        demoImpact: 'Demonstrate by uploading a sample biology sketch of a cell, showing the AI instantly build a 3-question quiz about mitochondria.'
      },
      winningHighlights: ['Adaptive quiz mechanics', 'Interactive handwriting visual parser', 'Instant syllabus breakdown']
    }
  },
  {
    id: 'fin-vision',
    timestamp: '3 weeks ago',
    inputs: {
      theme: 'AI Micro-Lending Risk Analysis',
      timeLimit: '24 Hours',
      teamSize: 1,
      skills: 'React, Express, Tailwind, PostgreSQL, Stripe API',
      goal: 'Winning'
    },
    blueprint: {
      projectName: 'FinVision',
      tagline: 'AI insights for smarter investment and risk prediction.',
      elevatorPitch: 'FinVision assesses creditworthiness for micro-merchants in emerging markets using mobile wallets and transaction histories. By analyzing cashflows and sales records through Gemini AI, it generates a credit reliability score, allowing peer-to-peer lenders to disburse funds safely.',
      problemStatement: 'Micro-merchants lack formal credit reports, blocking them from commercial loans and business expansion.',
      solutionOverview: 'An analytical dashboard showing wallet cashflows, client transaction data, and credit ratings generated by AI.',
      scores: {
        innovation: 90,
        feasibility: 85,
        judgeAppeal: 92,
        complexity: 83,
        marketPotential: 94
      },
      winningProbability: {
        strengths: ['Fills a huge credit reporting gap', 'Real-time sales assessment models', 'Seamless Stripe ledger integrations'],
        weaknesses: ['Transactional data formatting consistency', 'Multi-currency conversion requirements'],
        risks: ['Strict data security guardrails', 'API downtime during transactions audits'],
        improvements: ['Include sample cashflow datasets in sandbox', 'Create credit rating simulator widget']
      },
      coreFeatures: [
        { title: 'Ledger Audit Engine', description: 'Upload wallet CSV ledgers to parse credit ratings.' },
        { title: 'Loan Marketplace', description: 'P2P platform matching credit-worthy merchants with micro-lenders.' }
      ],
      techStack: [
        { name: 'React', category: 'Frontend', reason: 'Fast construction of responsive tables and analytics grids.' },
        { name: 'Stripe API', category: 'APIs/Other', reason: 'Enables mock disbursements and repayments processing.' },
        { name: 'PostgreSQL', category: 'Database', reason: 'Structured, ACID-compliant ledger storage.' },
        { name: 'Gemini Pro', category: 'AI/ML', reason: 'Processes financial cashflow rows to calculate credit risk indices.' }
      ],
      architecture: {
        nodes: [
          { id: 'merchant', label: 'Merchant Client', type: 'user' },
          { id: 'web', label: 'FinVision Portal', type: 'frontend' },
          { id: 'gemini', label: 'Gemini Risk Evaluator', type: 'ai' },
          { id: 'pg', label: 'Postgres DB', type: 'database' }
        ],
        edges: [
          { from: 'merchant', to: 'web', label: 'Uploads sales log' },
          { from: 'web', to: 'gemini', label: 'Audits transaction sheets' },
          { from: 'gemini', to: 'pg', label: 'Saves credit score' },
          { from: 'pg', to: 'web', label: 'Renders credit index card' }
        ]
      },
      folderStructure: 'src/\n├── components/\n│   ├── CreditScoreCard.tsx\n│   └── CashflowTable.tsx\n└── index.css',
      timeline: [
        { stage: 'Hours 1–4', title: 'Database setup', tasks: ['Spin up PostgreSQL database schema', 'Initialize frontend wireframes'] },
        { stage: 'Hours 5–12', title: 'Evaluation API', tasks: ['Build cashflow parser backend', 'Connect risk estimation logic'] },
        { stage: 'Hours 13–18', title: 'Stripe payments', tasks: ['Integrate Stripe API checkpoints', 'Wire payout simulation cards'] },
        { stage: 'Hours 19–24', title: 'Polish & Pitch', tasks: ['Refine glass tables layout', 'Polish elevator pitch deck'] }
      ],
      deployment: {
        provider: 'Railway & Vercel',
        steps: ['Deploy frontend client to Vercel', 'Host Express + Postgres on Railway', 'Configure Stripe Webhook endpoints']
      },
      judgePerspective: {
        standoutReason: 'Unlocks micro-lending capabilities for underserved markets.',
        innovationPoints: ['Alternative cashflow credit scores', 'Serverless transaction auditing'],
        businessValue: 'High market potential in emerging B2B microfinance sectors.',
        technicalDepth: 'Exhibits robust financial database queries and risk assessments.',
        demoImpact: 'Demonstrate by uploading a sample mobile wallet statement showing high sales but high debt, and inspect how the risk level adjusts.'
      },
      winningHighlights: ['Alternative cashflow credit rating', 'Stripe disbursement sandbox', 'ACID-compliant sales database']
    }
  },
  {
    id: 'smart-city',
    timestamp: '1 month ago',
    inputs: {
      theme: 'IoT Traffic and Energy Optimization',
      timeLimit: '48 Hours',
      teamSize: 4,
      skills: 'React, Node.js, Express, Socket.io, AWS, MongoDB',
      goal: 'Social Impact'
    },
    blueprint: {
      projectName: 'SmartCity Mesh',
      tagline: 'IoT + AI solution for efficient urban management.',
      elevatorPitch: 'SmartCity Mesh orchestrates municipal traffic grids and energy grids. By aggregating simulated IoT telemetry (from roadside cameras and substation reports) through Gemini AI, it dynamically re-routes emergency vehicles, optimizes traffic lights, and manages substation loads in real-time.',
      problemStatement: 'Cities suffer from siloed grid telemetry, causing traffic gridlocks for emergency vehicles and inefficient power distributions.',
      solutionOverview: 'A centralized municipality command dashboard displaying maps, load charts, and real-time dynamic re-routings.',
      scores: {
        innovation: 87,
        feasibility: 82,
        judgeAppeal: 90,
        complexity: 92,
        marketPotential: 84
      },
      winningProbability: {
        strengths: ['Real-time telemetry rendering via WebSockets', 'Emergency vehicle auto-prioritizations', 'Multi-grid system coordinates'],
        weaknesses: ['High hardware mock requirements', 'WebSocket latency risks during live demos'],
        risks: ['Demo concurrency connection spikes', 'Offline data processing delays'],
        improvements: ['Seed standard traffic coordinates in map', 'Add manual event triggers (e.g. fire event) to bypass physical hardware logs']
      },
      coreFeatures: [
        { title: 'Municipality Dashboard', description: 'Central map rendering traffic load levels and power grid states.' },
        { title: 'Dynamic Re-Router', description: 'WebSocket communication lines directing emergency vehicles through optimal grid lanes.' }
      ],
      techStack: [
        { name: 'React', category: 'Frontend', reason: 'Constructs complex maps and real-time dashboard layout panels.' },
        { name: 'Socket.io', category: 'APIs/Other', reason: 'Enables bidirectional, low-latency live telemetry streams.' },
        { name: 'Express API', category: 'Backend', reason: 'Processes municipal data models and coordinates grid inputs.' },
        { name: 'MongoDB', category: 'Database', reason: 'Stores telemetry history logs efficiently without schema lockups.' }
      ],
      architecture: {
        nodes: [
          { id: 'sensor', label: 'IoT Camera Sensor', type: 'external' },
          { id: 'api', label: 'Express WebSocket', type: 'backend' },
          { id: 'gemini', label: 'Gemini Grid Analyst', type: 'ai' },
          { id: 'db', label: 'Telemetry DB', type: 'database' },
          { id: 'dash', label: 'Command Portal', type: 'frontend' }
        ],
        edges: [
          { from: 'sensor', to: 'api', label: 'Simulated vehicle logs' },
          { from: 'api', to: 'gemini', label: 'Checks congestion level' },
          { from: 'gemini', to: 'db', label: 'Stores traffic loads' },
          { from: 'api', to: 'dash', label: 'Streams coordinates' }
        ]
      },
      folderStructure: 'src/\n├── components/\n│   ├── CityMap.tsx\n│   └── SubstationGrid.tsx\n└── index.css',
      timeline: [
        { stage: 'Hours 1–8', title: 'Telemetry Mocks', tasks: ['Configure Socket.io endpoints', 'Build grid dashboard wireframes'] },
        { stage: 'Hours 9–24', title: 'Map UI & Coordinates', tasks: ['Integrate canvas map layouts', 'Wire sensor coordinate plots'] },
        { stage: 'Hours 25–40', title: 'Gemini load analytics', tasks: ['Build congestion estimation logic', 'Optimize dynamic routing parameters'] },
        { stage: 'Hours 41–48', title: 'Polish & Pitch Prep', tasks: ['Polish glass command tables', 'Verify real-time alerts stream'] }
      ],
      deployment: {
        provider: 'AWS & Vercel',
        steps: ['Host React app on Vercel', 'Deploy Node server on AWS EC2', 'Provision MongoDB Atlas database']
      },
      judgePerspective: {
        standoutReason: 'Aggregates municipal grid streams to speed up emergency routing.',
        innovationPoints: ['Unified telemetry models', 'Real-time WebSocket grids coordination'],
        businessValue: 'Municipal software integration potential.',
        technicalDepth: 'Exhibits robust WebSocket connections and coordinate mapping algorithms.',
        demoImpact: 'Demonstrate by triggering a simulated "fire alarm" in Zone 4, showing the traffic routing shift automatically in under 1 second.'
      },
      winningHighlights: ['Real-time WebSocket grid telemetry', 'Dynamic emergency routing coordinates', 'Unified municipality command panel']
    }
  }
];
