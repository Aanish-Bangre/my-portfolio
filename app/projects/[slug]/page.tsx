"use client";

import { useParams, useRouter } from "next/navigation";
import { Github, ArrowLeft, ExternalLink, ChevronRight, Camera, Quote } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Screenshot {
  label: string;        // e.g. "Dashboard", "Chat View"
  note?: string;        // optional caption you write
  // To add a real image: set imagePath to e.g. "/screenshots/just-rent-it/dashboard.png"
  // and drop the file in public/screenshots/<slug>/
  imagePath?: string;
}

interface ProjectData {
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;        // short punchy 1-liner (human voice)
  builderNote: string;    // personal note from you about the project
  accent: string;
  gradientFrom: string;
  github: string;
  status: string;
  year: string;
  role: string;
  tags: string[];
  highlights: { label: string; value: string }[];
  overview: string;
  screenshots: Screenshot[];   // placeholders you fill with real images
  sections: { title: string; bullets: string[] }[];
  architecture?: string[];
  whatILearned: string[];      // human "lessons" section
}

// ─── Screenshot placeholder component ────────────────────────────────────────
// YOU need to do: drop real screenshots into public/screenshots/<slug>/<filename>.png
// Then set imagePath on each screenshot object to "/screenshots/<slug>/<filename>.png"
const ScreenshotSlot: React.FC<{ shot: Screenshot; accent: string; index: number }> = ({ shot, accent, index }) => (
  <div className="space-y-2">
    {shot.imagePath ? (
      <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shot.imagePath} alt={shot.label} className="w-full object-cover" />
      </div>
    ) : (
      // Placeholder — replace with real image by setting imagePath
      <div
        className="relative rounded-xl border border-dashed flex flex-col items-center justify-center gap-3 overflow-hidden"
        style={{
          borderColor: `${accent}30`,
          background: `linear-gradient(135deg, ${accent}06 0%, transparent 60%)`,
          minHeight: index === 0 ? "340px" : "220px",
        }}
      >
        <div className="p-3 rounded-full border" style={{ borderColor: `${accent}30`, background: `${accent}10` }}>
          <Camera size={20} style={{ color: accent, opacity: 0.6 }} />
        </div>
        <div className="text-center px-6">
          <p className="text-white/50 text-sm font-mono">{shot.label}</p>
          <p className="text-white/20 text-xs mt-1">Drop screenshot → <code className="text-white/30">public/screenshots/</code></p>
        </div>
        {/* subtle grid lines for visual interest */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `linear-gradient(${accent} 1px, transparent 1px), linear-gradient(90deg, ${accent} 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
      </div>
    )}
    <div className="flex items-start gap-2 px-1">
      <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: accent, opacity: 0.5 }} />
      <p className="text-white/40 text-xs font-mono">{shot.note || shot.label}</p>
    </div>
  </div>
);

// ─── Project Data ─────────────────────────────────────────────────────────────
const PROJECTS: Record<string, ProjectData> = {
  "just-rent-it": {
    slug: "just-rent-it",
    title: "Just Rent It",
    subtitle: "Full-Stack · Real-time Chat · Payment Integration",
    tagline: "Rent anything, from anyone, instantly.",
    builderNote: "This was my first time wiring a real payment gateway end-to-end. The hardest part wasn't Razorpay — it was making sure a booking couldn't be double-confirmed when two users hit 'Book' at the exact same millisecond. Getting that right taught me more about async flows than any tutorial ever did.",
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
      "Just Rent It is a peer-to-peer rental marketplace — think Airbnb, but for anything. Tools, cameras, bikes, instruments. Users list what they own, others browse and book, payments are handled securely, and both sides can chat in real-time without leaving the platform.",
    screenshots: [
      { label: "Homepage / Listings Feed", note: "Main listing browse screen" },
      { label: "Item Detail + Booking Flow", note: "Date picker + deposit summary" },
      { label: "Real-time Chat", note: "Socket.io powered inbox" },
      { label: "Payment Checkout", note: "Razorpay modal integration" },
    ],
    sections: [
      {
        title: "How the booking flow works",
        bullets: [
          "User picks dates on the item detail page — the UI blocks already-booked ranges in real time.",
          "On confirm, an API route checks for conflicts server-side before creating the Razorpay order.",
          "Payment signature is verified server-side before the booking record is written to Appwrite.",
          "Both owner and renter get instant in-app notifications via the notification collection.",
        ],
      },
      {
        title: "Real-time chat architecture",
        bullets: [
          "A dedicated Node.js Socket.io server runs alongside the Next.js app (separate process).",
          "Rooms are keyed by booking ID — only the two parties in a booking share a room.",
          "Messages are persisted to Appwrite's chat collection so history survives reconnects.",
          "Client connects only after hydration to avoid SSR/WebSocket conflicts.",
        ],
      },
      {
        title: "Tricky bits & solutions",
        bullets: [
          "Double-booking: date-range overlap query runs inside a transaction before any Razorpay call is made.",
          "Payment tampering: Razorpay's HMAC signature is re-verified on the server — frontend confirmation alone is never trusted.",
          "File uploads: Appwrite Storage bucket policies enforce that only authenticated owners can upload listing images.",
          "Auth persistence: Appwrite session cookies are HttpOnly — no localStorage token exposure.",
        ],
      },
    ],
    whatILearned: [
      "Payment webhooks are unreliable — always verify server-side before writing state.",
      "Separating real-time servers from SSR frameworks early saves a lot of headaches.",
      "Date-range conflict detection is a genuinely hard database query — overlaps aren't obvious to think through.",
      "Appwrite's collection rules can replace a lot of custom auth middleware if you model them right.",
    ],
  },

  "iitb-anpr": {
    slug: "iitb-anpr",
    title: "IITB ANPR System",
    subtitle: "Computer Vision · OCR · Deep Learning · Research",
    tagline: "Teaching a camera to read license plates in a tunnel.",
    builderNote: "Working under Prof. Patil at IIT Bombay was a different pace than personal projects — every design decision needed a reason. The OCR preprocessing pipeline went through probably 15 iterations before it was reliable on blurry tunnel footage. CUDA acceleration was the single biggest unlock for making it practical.",
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
      "Built for IIT Bombay's Civil Engineering dept to monitor vehicles in tunnel CCTV footage. The system detects and tracks vehicles across frames, extracts license plates using a multi-stage preprocessing pipeline, validates Indian plate formats, and presents results through a web dashboard. Supports both uploaded video and live RTSP camera streams.",
    screenshots: [
      { label: "Detection Dashboard — live annotated feed", note: "Bounding boxes, track IDs, confidence scores" },
      { label: "ROI Polygon Selector", note: "User draws the region of interest on first frame" },
      { label: "Results Table — plate crops + OCR text", note: "Per-vehicle extraction with confidence %" },
      { label: "RTSP Live Camera View", note: "Real-time stream with line crossing counter" },
    ],
    sections: [
      {
        title: "The detection pipeline",
        bullets: [
          "First YOLO pass detects vehicle class and bounding box (car / bus / truck / motorcycle).",
          "Hungarian algorithm tracker assigns a persistent Track ID — same vehicle keeps its ID even if it briefly leaves frame (30-frame buffer).",
          "Only vehicles that cross the user-drawn counting line get passed to the plate detector — this filters ~60% of irrelevant detections.",
          "Second YOLO pass on the cropped vehicle region finds the license plate.",
        ],
      },
      {
        title: "OCR preprocessing — why it exists",
        bullets: [
          "Tunnel cameras produce blurry, low-contrast footage. Raw plate crops fail OCR completely.",
          "Pipeline: 4x cubic upscale → Laplacian sharpening (80/20 blend) → bilateral filter → adaptive threshold → contour noise removal.",
          "EasyOCR runs on the cleaned binary image; confidence below 0.45 is discarded.",
          "Indian plate regex (^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$) filters OCR hallucinations.",
          "Best-frame selection: across all detections for a Track ID, only the highest-confidence crop is stored.",
        ],
      },
      {
        title: "Web interface & API",
        bullets: [
          "FastAPI serves REST endpoints: upload, set-roi-line, job status, results, and camera stream endpoints.",
          "Next.js frontend uses a canvas-based ROI selector — click to place polygon points on the first frame.",
          "Processed video is re-encoded to H.264 via FFmpeg so it plays natively in browser without plugins.",
          "PostgreSQL (Docker) stores all jobs, detections, and file paths persistently.",
        ],
      },
    ],
    architecture: [
      "Video Upload / RTSP",
      "ROI + Line Config",
      "YOLOv8 Vehicle Detect",
      "Hungarian Tracker",
      "Line Crossing Filter",
      "YOLOv8 Plate Detect",
      "OCR Preprocessing",
      "EasyOCR + Validation",
      "PostgreSQL + Results",
    ],
    whatILearned: [
      "Research code and production code have very different failure modes — logging everything is non-negotiable.",
      "CUDA availability changes the entire feasibility of a pipeline — always benchmark CPU vs GPU early.",
      "Hungarian algorithm for tracking is elegant — it's just an assignment problem, and scipy makes it 3 lines.",
      "Adaptive thresholding is almost always better than global thresholding for real-world OCR.",
      "ROI filtering is a simple idea that cut processing time by more than half.",
    ],
  },

  "et-money-mentor": {
    slug: "et-money-mentor",
    title: "ET Money Mentor",
    subtitle: "AI · Personal Finance · FinTech · Hackathon",
    tagline: "₹25,000/year financial advice, for free, for everyone.",
    builderNote: "Built this for a hackathon around the ET Money platform. The problem statement hit close to home — most people around me have no idea what to do with their savings beyond an FD. We tried to make the AI feel like a knowledgeable friend, not a compliance document.",
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
      "95% of Indians have no financial plan. Advisors charge ₹25,000+/year and only serve HNIs. ET Money Mentor brings personalized financial planning to everyone — FIRE path planning, health scoring across 6 financial dimensions, tax optimization, and life-event advice through a conversational AI interface that feels like texting a financial expert.",
    screenshots: [
      { label: "FIRE Path Planner — month-by-month roadmap", note: "Goal inputs → AI generates SIP + allocation plan" },
      { label: "Money Health Score dashboard", note: "6-dimension wellness scoring with visual breakdown" },
      { label: "Tax Wizard — regime comparison", note: "Old vs new regime modeled with your actual numbers" },
      { label: "Conversational AI interface", note: "Chat-first UX, not a complex form" },
    ],
    sections: [
      {
        title: "What we built",
        bullets: [
          "FIRE Path Planner: input age, income, expenses, goals → AI outputs month-by-month roadmap with SIP amounts, asset allocation shifts, and insurance gaps.",
          "Money Health Score: 5-minute onboarding → score across emergency preparedness, insurance, diversification, debt, tax efficiency, and retirement readiness.",
          "Life Event Advisor: bonus, inheritance, marriage, new baby — AI handles financial decisions triggered by life events, customized to your numbers.",
          "Tax Wizard: enter salary structure or upload Form 16 → AI identifies missed deductions and models both tax regimes side by side.",
          "Couple's Money Planner: two income streams → AI optimizes HRA claims, NPS matching, SIP splits, and combined net worth.",
          "MF Portfolio X-Ray: upload CAMS statement → true XIRR, overlap analysis, expense ratio drag, rebalancing suggestion in under 10 seconds.",
        ],
      },
      {
        title: "Technical approach",
        bullets: [
          "FastAPI backend with async LLM endpoints — structured JSON outputs keep the UI rendering deterministic.",
          "Financial calculation engine handles XIRR, SIP projection, tax regime comparison independently of the LLM.",
          "LLM is prompted with user's financial profile + calculation outputs — it writes the advice, not the numbers.",
          "Docker Compose for local dev: frontend, backend, and DB as one command.",
          "Next.js frontend designed as a chat-first interface — avoids the form-heavy UI of traditional finance apps.",
        ],
      },
    ],
    whatILearned: [
      "Separating the calculation engine from the LLM was the right call — LLMs are bad at arithmetic but great at explanation.",
      "Financial products in India are genuinely complex — spending time understanding the domain before coding made the prompts 10x better.",
      "Chat-first UX reduces the perceived complexity of financial planning significantly.",
      "Hackathon scoping is hard — we cut 3 features and the remaining ones were better for it.",
    ],
  },
};

// ─── FadeIn ───────────────────────────────────────────────────────────────────
const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = "",
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
      transform: inView ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
    }}>
      {children}
    </div>
  );
};

const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/55 text-xs font-mono tracking-wide">
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
          <p className="text-white/40 font-mono text-sm">No project found for "{slug}"</p>
          <button onClick={() => router.push("/")} className="text-green-400 font-mono text-sm hover:underline">← back home</button>
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

        {/* ── Sticky nav bar ─────────────────────────────────────────────── */}
        <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05] bg-background/90 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-5 md:px-10 h-13 flex items-center justify-between py-3">
            <button
              onClick={() => router.push("/#projects")}
              className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs font-mono transition-colors"
            >
              <ArrowLeft size={13} /> portfolio
            </button>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs font-mono transition-colors"
            >
              <Github size={13} /> source
            </a>
          </div>
        </div>

        <div className="pt-12">

          {/* ── HERO — editorial layout ────────────────────────────────────── */}
          <div className={`bg-gradient-to-b ${project.gradientFrom} to-transparent`}>
            <div className="max-w-4xl mx-auto px-5 md:px-10 pt-16 pb-10">

              {/* Meta row */}
              <FadeIn>
                <div className="flex flex-wrap items-center gap-2 mb-8 text-xs font-mono text-white/30">
                  <span className="px-2 py-0.5 rounded-full border" style={{ borderColor: `${project.accent}35`, color: project.accent }}>
                    {project.status}
                  </span>
                  <span>·</span>
                  <span>{project.year}</span>
                  <span>·</span>
                  <span>{project.role}</span>
                </div>
              </FadeIn>

              {/* Big title */}
              <FadeIn delay={60}>
                <h1
                  className="text-5xl md:text-7xl font-bold text-white leading-[0.9] tracking-tighter mb-4"
                  style={{ fontFamily: "'Fira Code', monospace" }}
                >
                  {project.title}
                </h1>
              </FadeIn>

              {/* Tagline — human voice, larger */}
              <FadeIn delay={120}>
                <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-xl mb-10" style={{ fontFamily: "'Antic', sans-serif" }}>
                  {project.tagline}
                </p>
              </FadeIn>

              {/* Stats row */}
              <FadeIn delay={160}>
                <div className="flex flex-wrap gap-3 mb-8">
                  {project.highlights.map((h) => (
                    <div key={h.label} className="px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.07] text-center min-w-[90px]">
                      <div className="text-white font-mono font-semibold text-sm">{h.value}</div>
                      <div className="text-white/25 text-xs font-mono tracking-widest uppercase mt-0.5">{h.label}</div>
                    </div>
                  ))}
                </div>
              </FadeIn>

              {/* Tech chips */}
              <FadeIn delay={200}>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((t) => <Chip key={t}>{t}</Chip>)}
                </div>
              </FadeIn>
            </div>
          </div>

          {/* ── Main content — alternating layout ──────────────────────────── */}
          <div className="max-w-4xl mx-auto px-5 md:px-10 pb-24 space-y-20 mt-4">

            {/* BUILDER'S NOTE — the most human element */}
            <FadeIn delay={50}>
              <div className="relative pl-6 border-l-2" style={{ borderColor: `${project.accent}40` }}>
                <Quote size={18} className="mb-3 opacity-30" style={{ color: project.accent }} />
                <p className="text-white/70 text-base md:text-lg leading-relaxed italic" style={{ fontFamily: "'Antic', sans-serif" }}>
                  {project.builderNote}
                </p>
                <p className="mt-3 text-white/30 text-xs font-mono">— Builder's note</p>
              </div>
            </FadeIn>

            {/* OVERVIEW — plain prose, not a card */}
            <FadeIn>
              <div>
                <p className="text-white/20 text-xs font-mono tracking-widest uppercase mb-4">Overview</p>
                <p className="text-white/65 text-base leading-[1.85]">{project.overview}</p>
              </div>
            </FadeIn>

            {/* SCREENSHOTS — 2-col grid with placeholders */}
            <FadeIn>
              <div>
                <div className="flex items-center justify-between mb-5">
                  <p className="text-white/20 text-xs font-mono tracking-widest uppercase">Screenshots</p>
                  <p className="text-white/20 text-xs font-mono">
                    {project.screenshots.filter(s => s.imagePath).length}/{project.screenshots.length} added
                  </p>
                </div>

                {/* First screenshot — full width */}
                <div className="mb-4">
                  <ScreenshotSlot shot={project.screenshots[0]} accent={project.accent} index={0} />
                </div>

                {/* Rest — 2 columns */}
                {project.screenshots.length > 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.screenshots.slice(1).map((shot, i) => (
                      <ScreenshotSlot key={i} shot={shot} accent={project.accent} index={i + 1} />
                    ))}
                  </div>
                )}

                <p className="mt-4 text-white/20 text-xs font-mono text-center">
                  📸 To add screenshots: drop images into <code className="text-white/30">public/screenshots/{project.slug}/</code> and set <code className="text-white/30">imagePath</code> in the project data
                </p>
              </div>
            </FadeIn>

            {/* ARCHITECTURE FLOW (if present) */}
            {project.architecture && (
              <FadeIn>
                <div>
                  <p className="text-white/20 text-xs font-mono tracking-widest uppercase mb-5">Pipeline</p>
                  <div className="relative">
                    {/* horizontal scrollable on mobile */}
                    <div className="flex items-center gap-0 overflow-x-auto pb-2 scrollbar-none">
                      {project.architecture.map((step, i) => (
                        <React.Fragment key={i}>
                          <div
                            className="shrink-0 px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap"
                            style={{
                              background: `${project.accent}0D`,
                              border: `1px solid ${project.accent}25`,
                              color: `${project.accent}CC`,
                            }}
                          >
                            {step}
                          </div>
                          {i < project.architecture!.length - 1 && (
                            <div className="shrink-0 w-5 h-px mx-0.5" style={{ background: `${project.accent}25` }} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* SECTIONS — varied presentation */}
            {project.sections.map((section, si) => (
              <FadeIn key={si} delay={si * 60}>
                <div>
                  {/* Section heading — left aligned with accent number */}
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-3xl font-bold font-mono opacity-10 text-white select-none">
                      {String(si + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-white text-xl font-semibold" style={{ fontFamily: "'Fira Code', monospace" }}>
                      {section.title}
                    </h2>
                  </div>

                  {/* Bullets — no card wrapper, just clean lines */}
                  <div className="space-y-0 border-l border-white/[0.05] pl-5">
                    {section.bullets.map((b, bi) => (
                      <div
                        key={bi}
                        className="py-3.5 border-b border-white/[0.04] last:border-0 flex items-start gap-3"
                      >
                        <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ background: project.accent, opacity: 0.5 }} />
                        <p className="text-white/60 text-sm leading-relaxed">{b}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}

            {/* WHAT I LEARNED — most personal section */}
            <FadeIn>
              <div className="p-6 md:p-8 rounded-2xl border border-white/[0.06]"
                style={{ background: `linear-gradient(135deg, ${project.accent}08 0%, transparent 60%)` }}>
                <p className="text-white/20 text-xs font-mono tracking-widest uppercase mb-6">What I actually learned</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {project.whatILearned.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-xs font-mono mt-0.5 shrink-0" style={{ color: project.accent, opacity: 0.6 }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-white/55 text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* FOOTER CTAs */}
            <FadeIn>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-mono transition-all hover:opacity-75"
                  style={{ borderColor: `${project.accent}50`, color: project.accent, background: `${project.accent}10` }}
                >
                  <Github size={14} /> View source
                </a>
                <button
                  onClick={() => router.push("/#projects")}
                  className="inline-flex items-center gap-2 text-white/30 hover:text-white text-sm font-mono transition-colors"
                >
                  <ArrowLeft size={14} /> all projects
                </button>
              </div>
            </FadeIn>

          </div>
        </div>
      </div>
    </>
  );
}