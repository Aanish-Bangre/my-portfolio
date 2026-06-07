"use client";

import { LimelightNav } from "@/components/ui/limelight-nav";
import { Home, User, FolderKanban, Sparkles, Mail, Terminal, X, Github, Linkedin, Phone, MapPin, ExternalLink, Download, ChevronRight } from 'lucide-react';
import PortfolioTerminal from "@/components/ui/interactive-portfolio-terminal-component";
import Image from "next/image";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── Nav Items ────────────────────────────────────────────────────────────────
const navItems = [
  { id: '1', icon: <Home />, label: 'Home' },
  { id: '2', icon: <User />, label: 'About' },
  { id: '3', icon: <FolderKanban />, label: 'Projects' },
  { id: '4', icon: <Sparkles />, label: 'Skills' },
  { id: '5', icon: <Mail />, label: 'Contact' },
];

// ─── Logo ─────────────────────────────────────────────────────────────────────
function TechLogo() {
  return (
    <div className="flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95">
      <Image
        src="/image.png"
        alt="Aanish Bangre Logo"
        width={100}
        height={32}
        className="h-8 w-auto object-contain"
        priority
      />
    </div>
  );
}

// ─── BlurText ─────────────────────────────────────────────────────────────────
interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  className?: string;
  style?: React.CSSProperties;
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 50,
  animateBy = "words",
  direction = "top",
  className = "",
  style,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  const segments = useMemo(() =>
    animateBy === "words" ? text.split(" ") : text.split(""),
    [text, animateBy]
  );

  return (
    <p ref={ref} className={`inline-flex flex-wrap items-center justify-center ${className}`} style={style}>
      {segments.map((segment, i) => (
        <span key={i} style={{
          display: "inline-block",
          filter: inView ? "blur(0px)" : "blur(10px)",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : `translateY(${direction === "top" ? "-20px" : "20px"})`,
          transition: `all 0.5s ease-out ${i * delay}ms`,
        }}>
          {segment}{animateBy === "words" && i < segments.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </p>
  );
};

// ─── FadeIn wrapper ───────────────────────────────────────────────────────────
const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = ""
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(30px)",
      transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
    }}>
      {children}
    </div>
  );
};

// ─── Section Label ────────────────────────────────────────────────────────────
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-3 mb-12">
    <span className="text-green-400 font-mono text-sm tracking-widest uppercase">{children}</span>
    <div className="flex-1 h-px bg-gradient-to-r from-green-400/30 to-transparent" />
  </div>
);

// ─── Chip ────────────────────────────────────────────────────────────────────
const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/60 text-xs font-mono tracking-wide">
    {children}
  </span>
);

// ─── Data ────────────────────────────────────────────────────────────────────
const EXPERIENCE = [
  {
    role: "Research Intern",
    org: "Indian Institute of Technology Bombay",
    dept: "Civil Engineering Dept — under Prof. Gopal R. Patil",
    period: "Jan 2026 – Present",
    bullets: [
      "Fine-tuned YOLOv11 for vehicle and license plate detection in tunnel CCTV footage.",
      "Applied Laplacian sharpening and Black-Hat transforms to enhance blurred frames and isolate plate text.",
      "Implemented OCR-ready preprocessing pipeline converting plate crops into high-contrast binary images.",
      "Built efficient video-processing pipeline with intelligent frame-skipping for high-definition surveillance data.",
    ],
    tags: ["YOLOv11", "OpenCV", "OCR", "CUDA", "Python"],
  },
  {
    role: "Core Member — UI/UX Lead",
    org: "Computer Society of India, SPIT Chapter",
    dept: "",
    period: "Aug 2024 – Dec 2024",
    bullets: [
      "Led UI/UX design initiatives for student-driven technical projects using user-centered design principles.",
      "Collaborated with development teams to create engaging, accessible interfaces for college events.",
    ],
    tags: ["Figma", "UI/UX", "Prototyping"],
  },
  {
    role: "Subcommittee Member",
    org: "Oculus — Annual Technical Festival, SPIT",
    dept: "",
    period: "Sept 2023 – May 2024",
    bullets: [
      "Optimized workflow and managed operational execution for large-scale technical events with 1000+ participants.",
      "Assisted in project planning and cross-team coordination for seamless event delivery.",
    ],
    tags: ["Event Management", "Coordination", "Leadership"],
  },
];

const PROJECTS = [
  {
    slug: "just-rent-it",
    title: "Just Rent It",
    subtitle: "Full-Stack · Real-time Chat · Payment Integration",
    description:
      "P2P rental marketplace with Socket.io-powered real-time chat, Razorpay-based secure payments with automated deposit handling, and a complete authentication + notification system.",
    tags: ["Next.js 15", "TypeScript", "Appwrite", "Socket.io", "Razorpay", "Tailwind CSS"],
    color: "from-green-500/10 to-transparent",
    accent: "#22c55e",
    github: "https://github.com/Aanish-Bangre/just-rent-it",
  },
  {
    slug: "iitb-anpr",
    title: "IITB ANPR System",
    subtitle: "Computer Vision · OCR · Deep Learning · Research",
    description:
      "Professional-grade vehicle tracking and license plate recognition system for IIT Bombay with ROI filtering, Hungarian algorithm tracking, and Indian plate validation powered by YOLOv8 and EasyOCR.",
    tags: ["YOLOv8", "YOLOv11", "EasyOCR", "FastAPI", "Next.js", "PostgreSQL", "OpenCV", "CUDA"],
    color: "from-purple-500/10 to-transparent",
    accent: "#a855f7",
    github: "https://github.com/Aanish-Bangre/IITB-Incident_Project",
  },
  {
    slug: "et-money-mentor",
    title: "ET Money Mentor",
    subtitle: "AI · Personal Finance · FinTech · Hackathon",
    description:
      "AI-powered personal finance mentor targeting 95% of Indians without a financial plan. Features FIRE path planning, money health scoring across 6 dimensions, tax optimization, and couple's financial planning.",
    tags: ["Next.js", "TypeScript", "FastAPI", "AI/LLM", "Docker", "Python"],
    color: "from-yellow-500/10 to-transparent",
    accent: "#f59e0b",
    github: "https://github.com/Aanish-Bangre/et-money-mentor",
  },
  {
    slug: "google-scholar-redesign",
    title: "Google Scholar Redesign",
    subtitle: "UI/UX · Case Study · Research · Figma",
    description:
      "A full UX case study redesigning Google Scholar's interface — covering user research (22 respondents), competitive analysis against Semantic Scholar & Scite.ai, persona creation, journey mapping, wireframing, and high-fidelity design with dark mode and smart filters.",
    tags: ["Figma", "UX Research", "Wireframing", "Prototyping", "Design Systems", "User Testing"],
    color: "from-blue-500/10 to-transparent",
    accent: "#3b82f6",
    github: "https://github.com/Aanish-Bangre/my-portfolio",
  },
];

const SKILLS = [
  {
    category: "Frontend",
    items: [
      { name: "React / Next.js", pct: 100 },
      { name: "TypeScript", pct: 100 },
      { name: "Tailwind CSS", pct: 100 },
      { name: "Radix UI", pct: 80 },
    ],
  },
  {
    category: "Backend & DB",
    items: [
      { name: "FastAPI (Python)", pct: 90 },
      { name: "Node.js / Express", pct: 90 },
      { name: "PostgreSQL / MongoDB", pct: 80 },
      { name: "Redis / WebSockets", pct: 80 },
    ],
  },
  {
    category: "ML & Computer Vision",
    items: [
      { name: "YOLOv5 / YOLOv11", pct: 80 },
      { name: "OpenCV", pct: 90 },
      { name: "TensorFlow / Keras", pct: 60 },
      { name: "PyTesseract / OCR", pct: 80 },
    ],
  },
  {
    category: "Dev Tools & Design",
    items: [
      { name: "Git / GitHub", pct: 100 },
      { name: "Docker", pct: 70 },
      { name: "Figma / UI-UX", pct: 70 },
      { name: "Distributed Systems", pct: 80 },
    ],
  },
];

// ─── Skill Bar ────────────────────────────────────────────────────────────────
const SkillBar: React.FC<{ name: string; pct: number; delay: number }> = ({ name, pct, delay }) => {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTimeout(() => setWidth(pct), delay); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, [pct, delay]);

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-white/70 text-sm font-mono">{name}</span>
        <span className="text-white/30 text-xs font-mono">{pct}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-300 rounded-full"
          style={{ width: `${width}%`, transition: "width 1s ease-out" }}
        />
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter();
  const [terminalOpen, setTerminalOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setTerminalOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = terminalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [terminalOpen]);

  return (
    <>
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&family=Antic&display=swap');
      `}</style>

      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">

        {/* ── Floating Nav ─────────────────────────────────────── */}
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[75vw]">
          <LimelightNav
            logo={<TechLogo />}
            items={navItems}
            className="w-full bg-background/80 backdrop-blur-md shadow-lg border-white/10 dark:border-white/5 pl-2"
            limelightClassName="bg-primary/90"
            iconClassName="text-foreground/80 hover:text-foreground transition-colors"
          />
        </div>

        {/* ══════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════ */}
        <section id="home" className="relative h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2832&auto=format&fit=crop"
              alt="Abstract dark landscape"
              fill
              className="object-cover opacity-60 mix-blend-overlay pointer-events-none"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background z-0" />
          </div>

          <div className="relative z-10 w-full flex items-center justify-center gap-16 md:gap-20 px-6">
            {/* Name block */}
            <div className="relative flex-shrink-0 pointer-events-none select-none">
              <div className="relative text-left flex flex-col">
                <BlurText text="AANISH" delay={100} animateBy="letters" direction="top"
                  className="font-bold text-[60px] sm:text-[80px] md:text-[105px] lg:text-[130px] xl:text-[155px] leading-[0.85] tracking-tighter uppercase whitespace-nowrap justify-start"
                  style={{ color: "#ffffff", fontFamily: "'Fira Code', monospace" }} />
                <BlurText text="BANGRE" delay={100} animateBy="letters" direction="top"
                  className="font-bold text-[60px] sm:text-[80px] md:text-[105px] lg:text-[130px] xl:text-[155px] leading-[0.85] tracking-tighter uppercase whitespace-nowrap justify-start"
                  style={{ color: "#ffffff", fontFamily: "'Fira Code', monospace" }} />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
                  <div className="w-[70px] h-[115px] sm:w-[90px] sm:h-[145px] md:w-[110px] md:h-[175px] lg:w-[130px] lg:h-[210px] rounded-full overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-110 cursor-pointer border-2 border-white/20">
                    <img
                      src="/profile.jpg"
                      alt="Aanish Bangre"
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=256&auto=format&fit=crop"; }}
                      className="w-full h-full object-cover scale-[2.8] origin-[50%_40%]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="w-[240px] sm:w-[270px] md:w-[300px] lg:w-[340px] flex-shrink-0 flex items-center justify-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-medium tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Fullstack Developer
                </div>
                <p className="text-white/70 text-sm md:text-base leading-relaxed" style={{ fontFamily: "'Antic', sans-serif" }}>
                  Passionate developer & B.Tech student at SPIT Mumbai, building efficient, user-centric software with a focus on modern web, mobile, and AI/ML solutions.
                </p>
                <div className="h-px bg-gradient-to-r from-white/20 to-transparent" />
                <p className="text-white/40 text-xs" style={{ fontFamily: "'Antic', sans-serif" }}>
                  B.Tech · SPIT Mumbai · Class of 2027
                </p>
                <button
                  onClick={() => setTerminalOpen(true)}
                  className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-green-400/40 hover:border-green-400/80 text-green-400 hover:text-green-300 text-sm font-mono font-medium tracking-wide transition-all duration-300 hover:shadow-[0_0_20px_rgba(74,222,128,0.2)] active:scale-95"
                >
                  <Terminal size={15} className="group-hover:animate-pulse" />
                  <span>Explore my profile via terminal</span>
                  <span className="text-green-400/50 group-hover:text-green-400 transition-colors">_</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            ABOUT
        ══════════════════════════════════════════════════════ */}
        <section id="about" className="relative py-32 px-6 md:px-16 lg:px-32 max-w-6xl mx-auto">
          <FadeIn>
            <SectionLabel>01 / About</SectionLabel>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <FadeIn delay={100}>
              <div className="space-y-5">
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug" style={{ fontFamily: "'Fira Code', monospace" }}>
                  Building at the intersection of<br />
                  <span className="text-green-400">web</span>, <span className="text-blue-400">systems</span> &amp; <span className="text-purple-400">vision</span>.
                </h2>
                <p className="text-white/60 leading-relaxed text-sm md:text-base" style={{ fontFamily: "'Antic', sans-serif" }}>
                  I'm Aanish Bangre, a Computer Engineering student at SPIT Mumbai (Class of 2027) with a CGPA of 8.65. I build full-stack applications with a strong focus on real-time systems, distributed architectures, and AI/ML pipelines.
                </p>
                <p className="text-white/60 leading-relaxed text-sm md:text-base" style={{ fontFamily: "'Antic', sans-serif" }}>
                  Currently doing research at IIT Bombay on computer vision for tunnel surveillance, while pursuing a minor in UI/UX Design at Pearl Academy. I care deeply about both the engineering and the experience.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a href="#contact" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-400/10 border border-green-400/30 text-green-400 text-sm font-mono hover:bg-green-400/20 transition-all">
                    <Mail size={14} /> Get in touch
                  </a>
                  <a
                    href="/Resume_Aanish.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm font-mono hover:bg-white/10 hover:text-white transition-all"
                  >
                    <Download size={14} /> Download Resume
                  </a>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "CGPA", value: "8.65", sub: "/ 10.0" },
                  { label: "Year", value: "2027", sub: "Graduating" },
                  { label: "Research", value: "IIT-B", sub: "Intern" },
                  { label: "Location", value: "Mumbai", sub: "India" },
                ].map((stat) => (
                  <div key={stat.label} className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-colors">
                    <div className="text-2xl font-bold text-white font-mono">{stat.value}
                      <span className="text-sm text-white/30 ml-1">{stat.sub}</span>
                    </div>
                    <div className="text-white/40 text-xs font-mono tracking-widest uppercase mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            EXPERIENCE
        ══════════════════════════════════════════════════════ */}
        <section className="py-20 px-6 md:px-16 lg:px-32 max-w-6xl mx-auto">
          <FadeIn>
            <SectionLabel>02 / Experience</SectionLabel>
          </FadeIn>
          <div className="space-y-8">
            {EXPERIENCE.map((exp, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="group relative p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.14] transition-all duration-300">
                  {/* left accent line */}
                  <div className="absolute left-0 top-6 bottom-6 w-[2px] bg-green-400/20 group-hover:bg-green-400/60 transition-colors rounded-full" />

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4 pl-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg font-mono">{exp.role}</h3>
                      <p className="text-white/50 text-sm">{exp.org}</p>
                      {exp.dept && <p className="text-white/30 text-xs mt-0.5" style={{ fontFamily: "'Antic', sans-serif" }}>{exp.dept}</p>}
                    </div>
                    <span className="shrink-0 text-green-400/70 text-xs font-mono border border-green-400/20 px-2.5 py-1 rounded-full whitespace-nowrap self-start">
                      {exp.period}
                    </span>
                  </div>

                  <ul className="pl-4 space-y-2 mb-4">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-white/55 text-sm" style={{ fontFamily: "'Antic', sans-serif" }}>
                        <ChevronRight size={14} className="text-green-400/50 mt-0.5 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="pl-4 flex flex-wrap gap-2">
                    {exp.tags.map((t) => <Chip key={t}>{t}</Chip>)}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            PROJECTS
        ══════════════════════════════════════════════════════ */}
        <section id="projects" className="py-20 px-6 md:px-16 lg:px-32 max-w-6xl mx-auto">
          <FadeIn>
            <SectionLabel>03 / Projects</SectionLabel>
          </FadeIn>
          <div className="grid md:grid-cols-1 gap-6">
            {PROJECTS.map((proj, i) => (
              <FadeIn key={i} delay={i * 120}>
                <div
                  onClick={() => router.push(`/projects/${proj.slug}`)}
                  className={`group relative p-6 md:p-8 rounded-2xl border border-white/[0.06] hover:border-white/[0.16] bg-gradient-to-br ${proj.color} transition-all duration-300 overflow-hidden cursor-pointer hover:scale-[1.01]`}
                >
                  <span className="absolute top-4 right-6 text-6xl font-bold text-white/[0.03] font-mono select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-1 space-y-3">
                      <div>
                        <span className="text-xs font-mono tracking-widest uppercase mb-1 block" style={{ color: proj.accent, opacity: 0.7 }}>
                          {proj.subtitle}
                        </span>
                        <h3 className="text-white text-xl font-bold font-mono">{proj.title}</h3>
                      </div>
                      <p className="text-white/55 text-sm leading-relaxed" style={{ fontFamily: "'Antic', sans-serif" }}>
                        {proj.description}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {proj.tags.map((t) => <Chip key={t}>{t}</Chip>)}
                      </div>
                      <div className="flex items-center gap-4 pt-2">
                        <span className="text-xs font-mono flex items-center gap-1.5 transition-colors group-hover:text-white text-white/30">
                          View Details <ExternalLink size={11} />
                        </span>
                        <a
                          href={proj.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-mono flex items-center gap-1.5 text-white/30 hover:text-white transition-colors"
                        >
                          <Github size={11} /> GitHub
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            SKILLS
        ══════════════════════════════════════════════════════ */}
        <section id="skills" className="py-20 px-6 md:px-16 lg:px-32 max-w-6xl mx-auto">
          <FadeIn>
            <SectionLabel>04 / Skills</SectionLabel>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-8">
            {SKILLS.map((group, gi) => (
              <FadeIn key={gi} delay={gi * 80}>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <h3 className="text-white/40 text-xs font-mono tracking-widest uppercase mb-5">{group.category}</h3>
                  <div className="space-y-4">
                    {group.items.map((skill, si) => (
                      <SkillBar key={si} name={skill.name} pct={skill.pct} delay={gi * 80 + si * 80} />
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            EDUCATION
        ══════════════════════════════════════════════════════ */}
        <section className="py-20 px-6 md:px-16 lg:px-32 max-w-6xl mx-auto">
          <FadeIn>
            <SectionLabel>05 / Education</SectionLabel>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                institution: "Sardar Patel Institute of Technology",
                degree: "B.Tech — Computer Engineering",
                detail: "CGPA: 8.65 / 10.0",
                period: "Aug 2023 – Present",
                courses: ["Data Structures", "Algorithms", "OS", "DBMS", "Computer Networks", "Machine Learning", "Image Processing"],
                color: "from-blue-500/10",
              },
              {
                institution: "Pearl Academy, Mumbai",
                degree: "Minor — UI/UX Design",
                detail: "",
                period: "Jan 2025 – Present",
                courses: ["User Research", "Wireframing", "Prototyping", "Visual Design", "Figma"],
                color: "from-purple-500/10",
              },
            ].map((edu, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className={`p-6 rounded-2xl bg-gradient-to-br ${edu.color} to-transparent border border-white/[0.06] hover:border-white/[0.14] transition-all h-full`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-semibold font-mono">{edu.institution}</h3>
                      <p className="text-white/50 text-sm mt-0.5">{edu.degree}</p>
                      {edu.detail && <p className="text-green-400/70 text-xs font-mono mt-1">{edu.detail}</p>}
                    </div>
                    <span className="text-white/30 text-xs font-mono shrink-0 ml-4 border border-white/10 px-2 py-1 rounded-full whitespace-nowrap">{edu.period}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {edu.courses.map((c) => <Chip key={c}>{c}</Chip>)}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            CONTACT
        ══════════════════════════════════════════════════════ */}
        <section id="contact" className="py-20 px-6 md:px-16 lg:px-32 max-w-6xl mx-auto">
          <FadeIn>
            <SectionLabel>06 / Contact</SectionLabel>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <FadeIn delay={100}>
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug" style={{ fontFamily: "'Fira Code', monospace" }}>
                  Let's build something<br />
                  <span className="text-green-400">great together.</span>
                </h2>
                <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: "'Antic', sans-serif" }}>
                  Open to internships, collaborations, and interesting conversations about tech. I usually respond within 24 hours.
                </p>
                <a
                  href="/Resume_Aanish.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-lg bg-green-400/10 border border-green-400/30 text-green-400 text-sm font-mono hover:bg-green-400/20 transition-all"
                >
                  <Download size={14} /> View Resume
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="space-y-3">
                {[
                  { icon: <Mail size={16} />, label: "Email", value: "aanish.bangre@gmail.com", href: "mailto:aanish.bangre@gmail.com" },
                  { icon: <Github size={16} />, label: "GitHub", value: "Aanish-Bangre", href: "https://github.com/Aanish-Bangre" },
                  { icon: <Linkedin size={16} />, label: "LinkedIn", value: "aanish-bangre", href: "https://linkedin.com/in/aanish-bangre" },
                  { icon: <Phone size={16} />, label: "Phone", value: "+91 85549 62377", href: "tel:+918554962377" },
                  { icon: <MapPin size={16} />, label: "Location", value: "Andheri West, Mumbai", href: null },
                ].map((item) => (
                  <div key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.16] hover:bg-white/[0.05] transition-all"
                      >
                        <span className="text-green-400/70">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-white/30 text-xs font-mono tracking-widest uppercase">{item.label}</div>
                          <div className="text-white/70 text-sm font-mono truncate group-hover:text-white transition-colors">{item.value}</div>
                        </div>
                        <ExternalLink size={12} className="text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                        <span className="text-green-400/70">{item.icon}</span>
                        <div>
                          <div className="text-white/30 text-xs font-mono tracking-widest uppercase">{item.label}</div>
                          <div className="text-white/70 text-sm font-mono">{item.value}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 px-6 border-t border-white/[0.06] text-center">
          <p className="text-white/20 text-xs font-mono">
            © {new Date().getFullYear()} Aanish Bangre — Built with Next.js &amp; Tailwind CSS
          </p>
        </footer>

      </div>

      {/* ── Terminal Modal ────────────────────────────────────── */}
      {terminalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setTerminalOpen(false); }}
        >
          <div className="w-full max-w-4xl relative" style={{ animation: 'terminalSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
            <button
              onClick={() => setTerminalOpen(false)}
              className="absolute -top-10 right-0 flex items-center gap-1.5 text-gray-400 hover:text-white text-xs font-mono transition-colors"
            >
              <X size={14} /><span>ESC to close</span>
            </button>
            <PortfolioTerminal />
          </div>
        </div>
      )}

      <style suppressHydrationWarning>{`
        @keyframes terminalSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}