"use client";

import { useParams, useRouter } from "next/navigation";
import { Github, ArrowLeft, ExternalLink, ChevronRight } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Section {
  title: string;
  bullets: string[];
}

interface ProjectData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  gradientFrom: string;
  github: string;
  status: string;
  year: string;
  role: string;
  tags: string[];
  highlights: { label: string; value: string }[];
  overview: string;
  sections: Section[];
  architecture?: string[];
}

// ─── All Project Data ─────────────────────────────────────────────────────────
const PROJECTS: Record<string, ProjectData> = {
  "just-rent-it": {
    slug: "just-rent-it",
    title: "Just Rent It",
    subtitle: "Full-Stack · Real-time Chat · Payment Integration",
    description: "A peer-to-peer rental marketplace that lets users list items, book from others, chat in real-time, and pay securely — all in one place.",
    accent: "#22c55e",
    gradientFrom: "from-green-500/10",
    github: "https://github.com/Aanish-Bangre/just-rent-it",
    status: "Completed",
    year: "2024",
    role: "Full-Stack Developer",
    tags: ["Next.js 15", "TypeScript", "Appwrite", "Socket.io", "Razorpay", "Tailwind CSS", "Shadcn/UI"],
    highlights: [
      { label: "Framework", value: "Next.js 15" },
      { label: "Backend", value: "Appwrite" },
      { label: "Real-time", value: "Socket.io" },
      { label: "Payments", value: "Razorpay" },
    ],
    overview:
      "Just Rent It is a modern, full-stack peer-to-peer rental marketplace. It solves the problem of underutilized assets by enabling people to rent out items they own and book items from others — with secure payments, real-time communication, and a polished user experience.",
    sections: [
      {
        title: "Core Features",
        bullets: [
          "Secure user authentication — sign-up, login, and session management via Appwrite.",
          "Item listing system — users can create, manage, and browse rental listings with images and availability.",
          "Booking system — date-range selection with conflict detection to prevent double-booking.",
          "Real-time chat — Socket.io-powered messaging between renters and item owners with live notifications.",
          "Razorpay payment integration — secure checkout with automated deposit handling and transparent cost breakdown.",
          "Notification system — in-app alerts for booking requests, messages, and status changes.",
          "User profiles — manage listings, bookings, and account settings in one dashboard.",
        ],
      },
      {
        title: "Technical Architecture",
        bullets: [
          "Next.js App Router with TypeScript for type-safe, server-component-ready pages.",
          "Appwrite as the BaaS layer — handling database (collections), file storage, and authentication.",
          "Dedicated Socket.io server (Node.js) running as a separate process for real-time chat.",
          "Razorpay webhook integration on the API routes for reliable payment verification.",
          "Tailwind CSS + Shadcn/UI for a consistent, accessible component system.",
          "API routes in `src/app/api/` for payment processing and server-side logic.",
        ],
      },
      {
        title: "Challenges & Solutions",
        bullets: [
          "Booking conflicts: Implemented date-range overlap detection at the API layer before confirming any booking.",
          "Real-time + SSR: Separated the Socket.io server from the Next.js process to avoid SSR conflicts, connecting on the client side only.",
          "Payment security: Used Razorpay's server-side signature verification to prevent tampered payment confirmations.",
          "File uploads: Used Appwrite Storage with bucket policies for secure image hosting linked to listing documents.",
        ],
      },
    ],
  },

  "iitb-anpr": {
    slug: "iitb-anpr",
    title: "IITB ANPR System",
    subtitle: "Computer Vision · OCR · Deep Learning · Research",
    description: "A professional-grade Automatic Number Plate Recognition system built for IIT Bombay — with ROI filtering, Hungarian algorithm tracking, and Indian plate validation.",
    accent: "#a855f7",
    gradientFrom: "from-purple-500/10",
    github: "https://github.com/Aanish-Bangre/IITB-Incident_Project",
    status: "Active Research",
    year: "2026",
    role: "Research Intern — IIT Bombay",
    tags: ["YOLOv8", "YOLOv11", "EasyOCR", "FastAPI", "Next.js", "PostgreSQL", "OpenCV", "Docker", "CUDA"],
    highlights: [
      { label: "Detection", value: "YOLOv8 / v11" },
      { label: "OCR", value: "EasyOCR + GPU" },
      { label: "Tracking", value: "Hungarian Algo" },
      { label: "Backend", value: "FastAPI + PostgreSQL" },
    ],
    overview:
      "Developed under mentorship of Prof. Gopal R. Patil at IIT Bombay's Civil Engineering Dept, this system processes tunnel CCTV footage to detect vehicles, track them across frames, and extract license plate numbers using a multi-stage AI pipeline. It supports both uploaded videos and live RTSP camera streams.",
    sections: [
      {
        title: "Detection & Tracking Pipeline",
        bullets: [
          "Multi-stage YOLOv8 detection: first pass for vehicles (car, bus, truck, motorcycle), second pass for license plates.",
          "Hungarian algorithm-based vehicle tracking — assigns persistent Track IDs across frames with 30-frame occlusion tolerance.",
          "ROI (Region of Interest) filtering — user draws a polygon on the first frame; only vehicles inside the ROI are processed.",
          "Line crossing detection using cross products — counts vehicles that cross a user-defined line, preventing double counting.",
          "Intelligent frame-skipping logic to efficiently handle high-definition surveillance footage at scale.",
        ],
      },
      {
        title: "OCR Preprocessing Pipeline",
        bullets: [
          "Plate crop upscaled 4x using cubic interpolation for detail recovery.",
          "Laplacian sharpening applied at 80% weight to recover blurred characters.",
          "Bilateral filtering for edge-preserving noise reduction.",
          "Adaptive thresholding for binarization — converts to high-contrast black/white.",
          "Contour filtering removes noise based on aspect ratio before EasyOCR inference.",
          "Indian number plate validation with regex: format `MH12AB1234` (State + District + Series + Number).",
        ],
      },
      {
        title: "System Architecture",
        bullets: [
          "FastAPI backend exposes REST endpoints for job creation, ROI config, status polling, and results retrieval.",
          "SQLAlchemy ORM with PostgreSQL (Dockerized) for persistent job and detection records.",
          "Next.js 16 frontend with interactive canvas-based ROI polygon and line selector.",
          "FFmpeg integration for H.264 video encoding — ensures browser-compatible processed video playback.",
          "Full RTSP camera support: connect a live IP camera, draw ROI, and process in real-time.",
          "Confidence-based best-image selection ensures only the clearest plate crop is stored per vehicle.",
        ],
      },
    ],
    architecture: [
      "Upload Video / RTSP Stream",
      "ROI & Line Configuration",
      "YOLOv8 Vehicle Detection",
      "Hungarian Tracker",
      "ROI + Line Crossing Filter",
      "YOLOv8 Plate Detection",
      "OCR Preprocessing + EasyOCR",
      "Indian Plate Validation",
      "PostgreSQL Storage",
      "Results Dashboard",
    ],
  },

  "et-money-mentor": {
    slug: "et-money-mentor",
    title: "ET Money Mentor",
    subtitle: "AI · Personal Finance · FinTech · Hackathon",
    description: "An AI-powered personal finance mentor that makes financial planning as accessible as checking WhatsApp — built to serve the 95% of Indians without a financial plan.",
    accent: "#f59e0b",
    gradientFrom: "from-yellow-500/10",
    github: "https://github.com/Aanish-Bangre/et-money-mentor",
    status: "Hackathon Project",
    year: "2025",
    role: "Full-Stack + AI Developer",
    tags: ["Next.js", "TypeScript", "FastAPI", "AI/LLM", "Docker", "Python", "FinTech"],
    highlights: [
      { label: "Domain", value: "FinTech / AI" },
      { label: "Backend", value: "FastAPI" },
      { label: "Frontend", value: "Next.js" },
      { label: "Type", value: "Hackathon" },
    ],
    overview:
      "95% of Indians have no financial plan. Financial advisors charge ₹25,000+/year and serve only HNIs. ET Money Mentor is an AI-powered personal finance advisor built as a hackathon project — it provides FIRE path planning, money health scoring, and tax optimization for everyday Indians through a conversational AI interface.",
    sections: [
      {
        title: "Core Features Built",
        bullets: [
          "FIRE Path Planner — user inputs age, income, expenses, and goals; AI generates a month-by-month financial roadmap with SIP amounts, asset allocation, and insurance gap analysis.",
          "Money Health Score — 5-minute onboarding flow scoring financial wellness across 6 dimensions: emergency preparedness, insurance, investment diversification, debt health, tax efficiency, and retirement readiness.",
          "Life Event Financial Advisor — AI handles bonus, inheritance, marriage, and new baby scenarios with personalized recommendations based on tax bracket and risk profile.",
          "Tax Wizard — input salary structure or Form 16; AI identifies missed deductions and models old vs. new tax regime with your exact numbers.",
          "Couple's Money Planner — joint financial planning optimizing HRA claims, NPS matching, SIP splits, and combined net worth tracking across two incomes.",
          "MF Portfolio X-Ray — upload CAMS/KFintech statement; get true XIRR, overlap analysis, expense ratio drag, and AI-generated rebalancing plan in under 10 seconds.",
        ],
      },
      {
        title: "Architecture & Tech",
        bullets: [
          "Next.js frontend with TypeScript for a responsive, chat-based financial advisor interface.",
          "FastAPI backend with async AI inference endpoints for low-latency responses.",
          "LLM integration for natural language financial advice generation with structured JSON outputs.",
          "Docker Compose for local multi-service orchestration (frontend + backend + DB).",
          "Financial calculation engine for XIRR, SIP projections, tax regime comparison, and net worth modeling.",
        ],
      },
      {
        title: "Problem & Impact",
        bullets: [
          "Targets the 500M+ Indians who are middle-class savers but have no access to professional financial advice.",
          "Replaces ₹25,000/year advisor fees with an AI that gives personalized, context-aware guidance.",
          "Designed to feel as natural as a WhatsApp conversation — not a complex financial dashboard.",
          "Built for the ET Money platform's existing user base of 7M+ investors.",
        ],
      },
    ],
  },
};

// ─── FadeIn ───────────────────────────────────────────────────────────────────
const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = ""
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.55s ease-out ${delay}ms, transform 0.55s ease-out ${delay}ms`,
    }}>
      {children}
    </div>
  );
};

// ─── Chip ─────────────────────────────────────────────────────────────────────
const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/60 text-xs font-mono tracking-wide">
    {children}
  </span>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const project = PROJECTS[slug];

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white/40 font-mono">Project not found</p>
          <button onClick={() => router.push("/")} className="text-green-400 font-mono text-sm hover:underline">
            ← Back to portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&family=Antic&display=swap');
      `}</style>

      <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Antic', sans-serif" }}>

        {/* ── Top bar ── */}
        <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-background/80 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
            <button
              onClick={() => router.push("/#projects")}
              className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-mono transition-colors"
            >
              <ArrowLeft size={15} /> Back to Portfolio
            </button>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/25 text-white/60 hover:text-white text-xs font-mono transition-all"
            >
              <Github size={13} /> View on GitHub
            </a>
          </div>
        </div>

        {/* ── Hero ── */}
        <div className={`pt-14 bg-gradient-to-b ${project.gradientFrom} to-transparent`}>
          <div className="max-w-5xl mx-auto px-6 md:px-12 pt-16 pb-12">
            <FadeIn>
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="text-xs font-mono tracking-widest uppercase px-2.5 py-1 rounded-full border"
                  style={{ color: project.accent, borderColor: `${project.accent}40` }}>
                  {project.status}
                </span>
                <span className="text-white/30 text-xs font-mono">{project.year}</span>
                <span className="text-white/30 text-xs font-mono">·</span>
                <span className="text-white/30 text-xs font-mono">{project.role}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                style={{ fontFamily: "'Fira Code', monospace" }}>
                {project.title}
              </h1>

              <p className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color: project.accent, opacity: 0.7 }}>
                {project.subtitle}
              </p>

              <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-2xl mb-8">
                {project.description}
              </p>

              {/* Highlight stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {project.highlights.map((h) => (
                  <div key={h.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                    <div className="text-white/30 text-xs font-mono tracking-widest uppercase mb-1">{h.label}</div>
                    <div className="text-white font-mono font-semibold text-sm">{h.value}</div>
                  </div>
                ))}
              </div>

              {/* Tech chips */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((t) => <Chip key={t}>{t}</Chip>)}
              </div>
            </FadeIn>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-14 space-y-14">

          {/* Overview */}
          <FadeIn delay={50}>
            <div className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.07]">
              <h2 className="text-white/40 text-xs font-mono tracking-widest uppercase mb-4">Overview</h2>
              <p className="text-white/70 leading-relaxed text-sm md:text-base">{project.overview}</p>
            </div>
          </FadeIn>

          {/* Architecture flow (if present) */}
          {project.architecture && (
            <FadeIn delay={100}>
              <div>
                <h2 className="text-white/40 text-xs font-mono tracking-widest uppercase mb-5">Processing Pipeline</h2>
                <div className="flex flex-wrap items-center gap-2">
                  {project.architecture.map((step, i) => (
                    <React.Fragment key={i}>
                      <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.07] text-white/70 text-xs font-mono whitespace-nowrap">
                        {step}
                      </div>
                      {i < project.architecture!.length - 1 && (
                        <ChevronRight size={14} className="text-white/20 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}

          {/* Sections */}
          {project.sections.map((section, si) => (
            <FadeIn key={si} delay={si * 80 + 100}>
              <div>
                <h2 className="text-white text-lg font-semibold font-mono mb-5 flex items-center gap-3">
                  <span className="text-xs font-mono tracking-widest" style={{ color: project.accent }}>
                    {String(si + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.bullets.map((b, bi) => (
                    <div key={bi} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.12] transition-colors">
                      <ChevronRight size={14} className="mt-0.5 shrink-0" style={{ color: project.accent, opacity: 0.6 }} />
                      <p className="text-white/65 text-sm leading-relaxed">{b}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}

          {/* Footer CTA */}
          <FadeIn>
            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/[0.06]">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-mono transition-all hover:opacity-80"
                style={{ borderColor: `${project.accent}50`, color: project.accent, background: `${project.accent}12` }}
              >
                <Github size={15} /> View Source on GitHub
              </a>
              <button
                onClick={() => router.push("/#projects")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white text-sm font-mono transition-all"
              >
                <ArrowLeft size={15} /> All Projects
              </button>
            </div>
          </FadeIn>

        </div>
      </div>
    </>
  );
}
