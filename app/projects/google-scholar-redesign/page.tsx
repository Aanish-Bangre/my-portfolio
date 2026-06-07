"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Users, Search, Map, Layers, Palette, Monitor,
  TestTube, IterationCw, Code, Rocket, BarChart3, ChevronRight,
  FileText, Target, Microscope, GitBranch
} from "lucide-react";

// ─── Fade-in animation wrapper ────────────────────────────────────────────────
const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = ""
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
    }}>
      {children}
    </div>
  );
};

// ─── Chip ─────────────────────────────────────────────────────────────────────
const Chip: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color }) => (
  <span
    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono tracking-wide border"
    style={color
      ? { backgroundColor: `${color}15`, borderColor: `${color}30`, color }
      : { backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }
    }
  >
    {children}
  </span>
);

// ─── Section Label ────────────────────────────────────────────────────────────
const SectionLabel: React.FC<{ children: React.ReactNode; icon?: React.ReactNode }> = ({ children, icon }) => (
  <div className="flex items-center gap-3 mb-8">
    {icon && <span className="text-blue-400">{icon}</span>}
    <span className="text-blue-400 font-mono text-sm tracking-widest uppercase">{children}</span>
    <div className="flex-1 h-px bg-gradient-to-r from-blue-400/30 to-transparent" />
  </div>
);

// ─── Phase Card ───────────────────────────────────────────────────────────────
const PhaseCard: React.FC<{
  number: string; title: string; icon: React.ReactNode;
  children: React.ReactNode; accent?: string;
}> = ({ number, title, icon, children, accent = "#3b82f6" }) => (
  <div className="relative p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.15] transition-all duration-300 overflow-hidden">
    <div className="absolute top-4 right-6 text-6xl font-bold font-mono select-none" style={{ color: `${accent}08` }}>
      {number}
    </div>
    <div className="flex items-center gap-3 mb-4">
      <span style={{ color: accent }}>{icon}</span>
      <h3 className="text-white font-semibold font-mono text-lg">{title}</h3>
    </div>
    {children}
  </div>
);

// ─── SVG Bar Chart ────────────────────────────────────────────────────────────
const BarChart: React.FC<{ data: { label: string; value: number; color: string }[]; title: string }> = ({ data, title }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
      <p className="text-white/50 text-xs font-mono tracking-widest uppercase mb-4">{title}</p>
      <div className="flex items-end gap-3 h-32">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-white/60 text-xs font-mono">{d.value}%</span>
            <div className="w-full rounded-t-md" style={{
              height: `${(d.value / max) * 100}px`,
              backgroundColor: d.color,
              opacity: 0.8,
              minHeight: "4px",
              transition: "height 1s ease-out"
            }} />
            <span className="text-white/40 text-[10px] font-mono text-center leading-tight">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── SVG Donut Chart ──────────────────────────────────────────────────────────
const DonutChart: React.FC<{ segments: { label: string; value: number; color: string }[]; title: string }> = ({ segments, title }) => {
  const total = segments.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const radius = 40;
  const cx = 60, cy = 60;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
      <p className="text-white/50 text-xs font-mono tracking-widest uppercase mb-4">{title}</p>
      <div className="flex items-center gap-4">
        <svg width="120" height="120" viewBox="0 0 120 120">
          {segments.map((seg, i) => {
            const pct = seg.value / total;
            const dash = pct * circumference;
            const gap = circumference - dash;
            const offset = -cumulative * circumference / total - circumference / 4;
            cumulative += seg.value;
            return (
              <circle key={i} cx={cx} cy={cy} r={radius} fill="none"
                stroke={seg.color} strokeWidth="16"
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dasharray 1s ease-out" }}
              />
            );
          })}
          <circle cx={cx} cy={cy} r="28" fill="#0a0a0a" />
        </svg>
        <div className="space-y-1.5">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="text-white/60 text-xs font-mono">{seg.label}</span>
              <span className="text-white/40 text-xs font-mono ml-auto">{seg.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function GoogleScholarCaseStudy() {
  const router = useRouter();

  return (
    <>
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&family=Antic&display=swap');
      `}</style>

      <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Antic', sans-serif" }}>

        {/* ── Back Button ── */}
        <div className="fixed top-6 left-6 z-50">
          <button
            onClick={() => router.push("/")}
            className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white/60 hover:text-white hover:border-white/30 text-sm font-mono transition-all backdrop-blur-md"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════ */}
        <section className="relative pt-32 pb-20 px-6 md:px-16 lg:px-32 max-w-6xl mx-auto">
          <FadeIn>
            <div className="flex flex-wrap gap-2 mb-6">
              <Chip color="#3b82f6">UI/UX Case Study</Chip>
              <Chip color="#a855f7">Figma</Chip>
              <Chip color="#22c55e">User Research</Chip>
              <Chip color="#f59e0b">Academic Project</Chip>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "'Fira Code', monospace" }}>
              Google Scholar<br />
              <span className="text-blue-400">Redesign</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl leading-relaxed mb-8">
              A comprehensive UX case study redesigning Google Scholar's interface to improve content discoverability, personalization, and the overall academic research experience for students and researchers.
            </p>
            <div className="flex flex-wrap gap-6 text-sm font-mono">
              {[
                { label: "Team", value: "6 Members" },
                { label: "Timeline", value: "Jan – Apr 2025" },
                { label: "Role", value: "UX Researcher + Designer" },
                { label: "Survey", value: "22 Respondents" },
              ].map((item) => (
                <div key={item.label} className="border-l-2 border-blue-400/30 pl-3">
                  <div className="text-white/30 text-xs tracking-widest uppercase">{item.label}</div>
                  <div className="text-white/80 mt-0.5">{item.value}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* ── Process Timeline ── */}
        <section className="py-10 px-6 md:px-16 lg:px-32 max-w-6xl mx-auto">
          <FadeIn>
            <div className="flex flex-wrap gap-2 items-center justify-center text-xs font-mono text-white/40">
              {[
                "Research", "→", "Competitor Analysis", "→", "Persona", "→",
                "Journey Map", "→", "IA", "→", "Wireframes", "→",
                "Design System", "→", "Hi-Fi Design", "→", "Prototype", "→", "Testing"
              ].map((step, i) => (
                <span key={i} className={step !== "→" ? "px-2 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-white/60" : "text-blue-400/50"}>
                  {step}
                </span>
              ))}
            </div>
          </FadeIn>
        </section>

        <div className="px-6 md:px-16 lg:px-32 max-w-6xl mx-auto space-y-20 pb-32">

          {/* ══════════════════════════════════════════════════════
              01 — PROBLEM DEFINITION
          ══════════════════════════════════════════════════════ */}
          <FadeIn>
            <SectionLabel icon={<Target size={16} />}>01 / Problem Definition</SectionLabel>
            <PhaseCard number="01" title="Problem Statement" icon={<FileText size={18} />} accent="#ef4444">
              <div className="space-y-4">
                <p className="text-white/60 leading-relaxed">
                  The current Google Scholar interface, while functional, <strong className="text-white/80">lacks modern design elements</strong> and fails to effectively utilise screen real estate — particularly on desktop. Key features like advanced search, user library, and personalised content are either hidden or under-emphasised.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {[
                    { label: "Who", value: "Students, researchers, academics primarily using laptops" },
                    { label: "What", value: "Redesign Scholar with modern, responsive, user-centered interface" },
                    { label: "Why", value: "Poor discoverability of features; outdated UI causing friction" },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-lg bg-red-500/5 border border-red-500/15">
                      <div className="text-red-400 text-xs font-mono tracking-widest uppercase mb-1">{item.label}</div>
                      <p className="text-white/60 text-sm">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                  <p className="text-white/40 text-xs font-mono tracking-widest uppercase mb-2">Success Metrics</p>
                  <div className="flex flex-wrap gap-2">
                    {["Feature discoverability rate ↑ 40%", "Task completion time ↓ 30%", "UI satisfaction score ≥ 4/5", "Mobile usability score ↑ 50%"].map(m => (
                      <Chip key={m} color="#22c55e">{m}</Chip>
                    ))}
                  </div>
                </div>
              </div>
            </PhaseCard>
          </FadeIn>

          {/* ══════════════════════════════════════════════════════
              02 — USER RESEARCH
          ══════════════════════════════════════════════════════ */}
          <FadeIn>
            <SectionLabel icon={<Microscope size={16} />}>02 / User Research</SectionLabel>
            <div className="space-y-6">
              <PhaseCard number="02" title="Primary Research — Survey (22 Respondents)" icon={<Users size={18} />} accent="#3b82f6">
                <p className="text-white/55 text-sm mb-6">
                  We conducted a structured survey across 22 participants from SPIT and peer institutions, targeting students and researchers who use Google Scholar for academic work.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <DonutChart
                    title="User Type Distribution"
                    segments={[
                      { label: "UG/PG Students", value: 86, color: "#3b82f6" },
                      { label: "PhD / Researchers", value: 9, color: "#a855f7" },
                      { label: "Professionals", value: 5, color: "#22c55e" },
                    ]}
                  />
                  <BarChart
                    title="Usage Frequency"
                    data={[
                      { label: "Rarely", value: 46, color: "#ef4444" },
                      { label: "Monthly", value: 23, color: "#f59e0b" },
                      { label: "Weekly", value: 17, color: "#3b82f6" },
                      { label: "Daily", value: 14, color: "#22c55e" },
                    ]}
                  />
                  <DonutChart
                    title="Preferred Device"
                    segments={[
                      { label: "Laptop", value: 59, color: "#3b82f6" },
                      { label: "Mobile", value: 32, color: "#f59e0b" },
                      { label: "Tablet", value: 9, color: "#a855f7" },
                    ]}
                  />
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <BarChart
                    title="Feature Awareness Gap (%unaware)"
                    data={[
                      { label: "Adv. Search", value: 32, color: "#ef4444" },
                      { label: "Save Library", value: 27, color: "#f59e0b" },
                      { label: "Alerts", value: 41, color: "#ef4444" },
                      { label: "My Profile", value: 36, color: "#f59e0b" },
                      { label: "Cite Export", value: 19, color: "#22c55e" },
                    ]}
                  />
                  <BarChart
                    title="UI Rating by Users (1–5)"
                    data={[
                      { label: "1★", value: 18, color: "#ef4444" },
                      { label: "2★", value: 9, color: "#f59e0b" },
                      { label: "3★", value: 50, color: "#3b82f6" },
                      { label: "4★", value: 18, color: "#22c55e" },
                      { label: "5★", value: 5, color: "#a855f7" },
                    ]}
                  />
                </div>
              </PhaseCard>

              {/* Pain Points */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    quote: "It's hard to find free full-text PDFs.",
                    theme: "Content Access",
                    impact: "Wasted time & frustration navigating paywalls",
                    color: "#ef4444",
                  },
                  {
                    quote: "Feels outdated — no preview or smart filters.",
                    theme: "UI / UX",
                    impact: "Difficulty quickly assessing paper relevance",
                    color: "#f59e0b",
                  },
                  {
                    quote: "No dark mode or personalization at all.",
                    theme: "Personalization",
                    impact: "Lack of modern comfort features & tailoring",
                    color: "#a855f7",
                  },
                ].map((item, i) => (
                  <FadeIn key={i} delay={i * 80}>
                    <div className="p-5 rounded-xl border" style={{ backgroundColor: `${item.color}08`, borderColor: `${item.color}20` }}>
                      <div className="text-3xl text-white/10 font-serif mb-2">"</div>
                      <p className="text-white/70 text-sm italic mb-3">"{item.quote}"</p>
                      <div className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: item.color }}>{item.theme}</div>
                      <p className="text-white/40 text-xs">{item.impact}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>

              {/* Feature demand */}
              <PhaseCard number="02b" title="Demand for Modern Features" icon={<BarChart3 size={18} />} accent="#22c55e">
                <p className="text-white/55 text-sm mb-4">
                  <strong className="text-white/80">73%</strong> of respondents marked design as "Very Important." <strong className="text-white/80">64%</strong> explicitly wanted dark mode, smart filters, and citation previews.
                </p>
                <BarChart
                  title="Feature Interest (% who want it)"
                  data={[
                    { label: "Dark Mode", value: 78, color: "#3b82f6" },
                    { label: "Smart Filters", value: 64, color: "#22c55e" },
                    { label: "Citation Preview", value: 59, color: "#a855f7" },
                    { label: "Mobile App", value: 55, color: "#f59e0b" },
                    { label: "AI Summaries", value: 45, color: "#ef4444" },
                    { label: "Graph View", value: 36, color: "#06b6d4" },
                  ]}
                />
              </PhaseCard>
            </div>
          </FadeIn>

          {/* ══════════════════════════════════════════════════════
              03 — COMPETITOR ANALYSIS
          ══════════════════════════════════════════════════════ */}
          <FadeIn>
            <SectionLabel icon={<Search size={16} />}>03 / Competitor Analysis</SectionLabel>
            <PhaseCard number="03" title="Competitive Landscape" icon={<GitBranch size={18} />} accent="#a855f7">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.07]">
                      <th className="text-left text-white/30 font-mono text-xs tracking-widest uppercase py-3 pr-4">Feature</th>
                      <th className="text-center text-white/70 font-mono text-xs py-3 px-3">Google Scholar</th>
                      <th className="text-center text-white/70 font-mono text-xs py-3 px-3">Semantic Scholar</th>
                      <th className="text-center text-white/70 font-mono text-xs py-3 px-3">Scite.ai</th>
                      <th className="text-center text-white/70 font-mono text-xs py-3 px-3">PubMed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Dark Mode", "✗", "✓", "✓", "✗"],
                      ["AI Summaries", "✗", "✓", "✓", "✗"],
                      ["Citation Graph View", "✗", "✓", "✓", "✗"],
                      ["Abstract Preview (inline)", "✗", "✓", "✓", "✓"],
                      ["Modern Card UI", "✗", "✓", "✓", "Partial"],
                      ["Smart Filters", "Basic", "✓", "✓", "✓"],
                      ["Personalised Feed", "✗", "Partial", "✓", "✗"],
                      ["Mobile Responsive", "Partial", "✓", "✓", "✓"],
                    ].map(([feat, ...vals], i) => (
                      <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 pr-4 text-white/60 font-mono text-xs">{feat}</td>
                        {vals.map((v, j) => (
                          <td key={j} className="py-3 px-3 text-center text-xs">
                            <span className={`font-mono ${v === "✓" ? "text-green-400" : v === "✗" ? "text-red-400/60" : "text-yellow-400"}`}>{v}</span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-purple-500/5 border border-purple-500/15">
                <p className="text-white/40 text-xs font-mono tracking-widest uppercase mb-2">Key Insight</p>
                <p className="text-white/60 text-sm">Competitors are actively addressing user needs for advanced, intuitive features. Google Scholar has clear opportunities to improve with <strong className="text-white/80">personalisation, accessibility, and richer in-context information.</strong></p>
              </div>
            </PhaseCard>
          </FadeIn>

          {/* ══════════════════════════════════════════════════════
              04 — USER PERSONAS
          ══════════════════════════════════════════════════════ */}
          <FadeIn>
            <SectionLabel icon={<Users size={16} />}>04 / User Personas</SectionLabel>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  name: "Riya Sharma", age: 21, role: "B.Tech Student, CSE",
                  quote: "I just need to find relevant papers fast without clicking through 10 screens.",
                  goals: ["Find papers for assignments quickly", "Save articles to read later", "Generate citations in APA/IEEE"],
                  pains: ["~46% usage is infrequent — returns only when needed", "Can't find 'Save to Library' without Googling it", "No dark mode for late-night study sessions"],
                  freq: "Monthly", device: "Laptop + Mobile", color: "#3b82f6",
                  skills: [{ label: "Tech Savvy", pct: 75 }, { label: "Research Experience", pct: 30 }, { label: "GS Familiarity", pct: 45 }],
                },
                {
                  name: "Dr. Mehta", age: 38, role: "Assistant Professor, Mech Engg",
                  quote: "I want to track citations of my own papers and set up alerts for specific topics.",
                  goals: ["Monitor who cites their own work", "Set keyword alerts for new publications", "Manage personal library with folder structure"],
                  pains: ["Alerts page is buried and hard to manage", "No co-author network visualisation", "Library lacks proper folder / tagging system"],
                  freq: "Daily", device: "Desktop + Laptop", color: "#a855f7",
                  skills: [{ label: "Tech Savvy", pct: 60 }, { label: "Research Experience", pct: 95 }, { label: "GS Familiarity", pct: 80 }],
                },
              ].map((persona, i) => (
                <FadeIn key={i} delay={i * 100}>
                  <div className="p-6 rounded-2xl border" style={{ borderColor: `${persona.color}25`, background: `${persona.color}06` }}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg font-mono flex-shrink-0"
                        style={{ backgroundColor: `${persona.color}20`, border: `2px solid ${persona.color}40` }}>
                        {persona.name[0]}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold font-mono">{persona.name}</h3>
                        <p className="text-white/40 text-xs">{persona.age} · {persona.role}</p>
                        <div className="flex gap-2 mt-1">
                          <Chip color={persona.color}>{persona.freq}</Chip>
                          <Chip>{persona.device}</Chip>
                        </div>
                      </div>
                    </div>

                    <blockquote className="text-white/60 text-sm italic border-l-2 pl-3 mb-4" style={{ borderColor: `${persona.color}50` }}>
                      "{persona.quote}"
                    </blockquote>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-white/30 text-xs font-mono tracking-widest uppercase mb-2">Goals</p>
                        {persona.goals.map((g, j) => (
                          <div key={j} className="flex items-start gap-1.5 text-white/55 text-xs mb-1">
                            <ChevronRight size={10} className="mt-0.5 shrink-0" style={{ color: persona.color }} />
                            {g}
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-white/30 text-xs font-mono tracking-widest uppercase mb-2">Pain Points</p>
                        {persona.pains.map((p, j) => (
                          <div key={j} className="flex items-start gap-1.5 text-white/55 text-xs mb-1">
                            <span className="mt-0.5 shrink-0 text-red-400/60 text-[10px]">✗</span>
                            {p}
                          </div>
                        ))}
                      </div>
                    </div>

                    {persona.skills.map((skill) => (
                      <div key={skill.label} className="mb-2">
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span className="text-white/40">{skill.label}</span>
                          <span className="text-white/25">{skill.pct}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${skill.pct}%`, backgroundColor: persona.color, opacity: 0.7 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>

          {/* ══════════════════════════════════════════════════════
              05 — USER JOURNEY MAP
          ══════════════════════════════════════════════════════ */}
          <FadeIn>
            <SectionLabel icon={<Map size={16} />}>05 / User Journey Map</SectionLabel>
            <PhaseCard number="05" title="Riya's Research Journey" icon={<Map size={18} />} accent="#f59e0b">
              <p className="text-white/50 text-sm mb-6">Mapping Riya's experience finding and saving a paper for her assignment.</p>
              <div className="overflow-x-auto">
                <div className="flex gap-0 min-w-[700px]">
                  {[
                    { stage: "Aware", action: "Opens Google Scholar from browser bookmark", thought: "I hope this doesn't take long...", emotion: "😐 Neutral", pain: null, opp: null, color: "#6b7280" },
                    { stage: "Search", action: "Types query in search box", thought: "Why can't I filter by institution or topic easily?", emotion: "😕 Confused", pain: "No quick filter options visible", opp: "Sticky smart-filter sidebar", color: "#f59e0b" },
                    { stage: "Scan", action: "Browses list of results", thought: "I can't tell which ones are free or relevant just from the list", emotion: "😤 Frustrated", pain: "No abstract preview inline", opp: "Expandable abstract snippets on hover", color: "#ef4444" },
                    { stage: "Access", action: "Clicks PDF link or [HTML] version", thought: "50% of the time this leads to a paywall", emotion: "😡 Annoyed", pain: "Paywall, no PDF indicator", opp: "Badge showing free / open-access", color: "#ef4444" },
                    { stage: "Save", action: "Tries to save to library", thought: "Where is the save button again?", emotion: "😕 Confused", pain: "'Save' hidden without account prompt", opp: "Inline bookmark icon on each result", color: "#f59e0b" },
                    { stage: "Cite", action: "Clicks 'Cite' to copy APA citation", thought: "At least this part works well", emotion: "😌 Relieved", pain: null, opp: "Citation preview before copying", color: "#22c55e" },
                  ].map((step, i) => (
                    <div key={i} className="flex-1 flex flex-col" style={{ minWidth: "110px" }}>
                      <div className="text-center px-2 py-2 border-b" style={{ borderColor: `${step.color}30`, backgroundColor: `${step.color}10` }}>
                        <div className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: step.color }}>{step.stage}</div>
                        <div className="text-xl">{step.emotion.split(" ")[0]}</div>
                      </div>
                      <div className="flex-1 p-3 border-r border-white/[0.05] space-y-3">
                        <div>
                          <div className="text-white/25 text-[10px] font-mono uppercase mb-1">Action</div>
                          <p className="text-white/60 text-xs">{step.action}</p>
                        </div>
                        <div>
                          <div className="text-white/25 text-[10px] font-mono uppercase mb-1">Thought</div>
                          <p className="text-white/50 text-xs italic">"{step.thought}"</p>
                        </div>
                        {step.pain && (
                          <div className="p-2 rounded bg-red-500/5 border border-red-500/15">
                            <div className="text-red-400/70 text-[10px] font-mono uppercase mb-0.5">Pain</div>
                            <p className="text-red-400/60 text-xs">{step.pain}</p>
                          </div>
                        )}
                        {step.opp && (
                          <div className="p-2 rounded bg-green-500/5 border border-green-500/15">
                            <div className="text-green-400/70 text-[10px] font-mono uppercase mb-0.5">Opportunity</div>
                            <p className="text-green-400/60 text-xs">{step.opp}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PhaseCard>
          </FadeIn>

          {/* ══════════════════════════════════════════════════════
              06 — INFORMATION ARCHITECTURE
          ══════════════════════════════════════════════════════ */}
          <FadeIn>
            <SectionLabel icon={<Layers size={16} />}>06 / Information Architecture</SectionLabel>
            <PhaseCard number="06" title="Redesigned Sitemap" icon={<Layers size={18} />} accent="#06b6d4">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-white/30 text-xs font-mono tracking-widest uppercase mb-4">Before — Current IA</p>
                  <div className="font-mono text-xs space-y-1 text-white/50 p-4 rounded-lg bg-red-500/5 border border-red-500/10">
                    <div>📁 Google Scholar</div>
                    <div className="pl-4">├── Search (home)</div>
                    <div className="pl-4">├── My Profile (hidden)</div>
                    <div className="pl-4">├── My Library (hidden)</div>
                    <div className="pl-4">├── Alerts (buried)</div>
                    <div className="pl-4">└── Settings</div>
                    <div className="pl-8 text-red-400/50">└── Accessibility (missing)</div>
                  </div>
                </div>
                <div>
                  <p className="text-white/30 text-xs font-mono tracking-widest uppercase mb-4">After — Redesigned IA</p>
                  <div className="font-mono text-xs space-y-1 text-white/50 p-4 rounded-lg bg-green-500/5 border border-green-500/10">
                    <div>📁 Google Scholar <span className="text-green-400">v2</span></div>
                    <div className="pl-4">├── Home (personalised feed)</div>
                    <div className="pl-4">├── Explore (domain browse)</div>
                    <div className="pl-4">├── Search Results</div>
                    <div className="pl-4">│   ├── Smart Filters sidebar</div>
                    <div className="pl-4">│   └── Article Preview panel</div>
                    <div className="pl-4">├── My Library</div>
                    <div className="pl-4">│   ├── All Articles</div>
                    <div className="pl-4">│   ├── Folders</div>
                    <div className="pl-4">│   └── Tags</div>
                    <div className="pl-4">├── My Profile</div>
                    <div className="pl-4">├── Alerts (+ New Alert)</div>
                    <div className="pl-4">└── Settings</div>
                    <div className="pl-8 text-green-400">├── Accessibility</div>
                    <div className="pl-8 text-green-400">└── Theme (Dark/Light)</div>
                  </div>
                </div>
              </div>
            </PhaseCard>
          </FadeIn>

          {/* ══════════════════════════════════════════════════════
              07 — USER FLOW
          ══════════════════════════════════════════════════════ */}
          <FadeIn>
            <SectionLabel icon={<GitBranch size={16} />}>07 / User Flow</SectionLabel>
            <PhaseCard number="07" title="Core User Flow — Finding & Saving a Paper" icon={<GitBranch size={18} />} accent="#22c55e">
              <div className="flex flex-wrap gap-2 items-center justify-center py-4">
                {[
                  { node: "Open App", type: "start" },
                  { node: "→", type: "arrow" },
                  { node: "Home Feed", type: "screen" },
                  { node: "→", type: "arrow" },
                  { node: "Search Query", type: "screen" },
                  { node: "→", type: "arrow" },
                  { node: "Apply Filters", type: "decision" },
                  { node: "→", type: "arrow" },
                  { node: "Results List", type: "screen" },
                  { node: "→", type: "arrow" },
                  { node: "Hover Preview", type: "screen" },
                  { node: "→", type: "arrow" },
                  { node: "Open Article?", type: "decision" },
                  null,
                  { node: "→ Yes", type: "arrow" },
                  { node: "Article Page", type: "screen" },
                  null,
                  { node: "→ No", type: "arrow" },
                  { node: "Bookmark Icon", type: "action" },
                  { node: "→", type: "arrow" },
                  { node: "Saved to Library ✓", type: "end" },
                ].filter(Boolean).map((step, i) => {
                  if (!step) return null;
                  const colors: Record<string, string> = {
                    start: "#22c55e", end: "#22c55e", screen: "#3b82f6",
                    decision: "#f59e0b", action: "#a855f7", arrow: "transparent"
                  };
                  if (step.type === "arrow") return <span key={i} className="text-white/30 font-mono text-sm">{step.node}</span>;
                  return (
                    <div key={i} className="px-3 py-1.5 rounded-lg text-xs font-mono border"
                      style={{ borderColor: `${colors[step.type]}40`, backgroundColor: `${colors[step.type]}10`, color: colors[step.type] }}>
                      {step.node}
                    </div>
                  );
                })}
              </div>
            </PhaseCard>
          </FadeIn>

          {/* ══════════════════════════════════════════════════════
              08 — WIREFRAMES
          ══════════════════════════════════════════════════════ */}
          <FadeIn>
            <SectionLabel icon={<Monitor size={16} />}>08 / Wireframes</SectionLabel>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  label: "Home Screen — Lo-Fi",
                  content: (
                    <div className="font-mono text-[10px] text-white/40 space-y-1.5 p-4">
                      <div className="border border-white/20 rounded p-2 text-center text-white/60">[ LOGO ] [ Nav Links ] [ 🌙 ] [ Sign In ]</div>
                      <div className="border border-white/10 rounded p-2 text-center">🔍 Search bar (large)</div>
                      <div className="border border-white/10 rounded p-2">
                        <div className="text-white/30 mb-1">Based on your activity</div>
                        <div className="border border-dashed border-white/10 rounded p-1 mb-1">[ Paper card 1 ]</div>
                        <div className="border border-dashed border-white/10 rounded p-1 mb-1">[ Paper card 2 ]</div>
                        <div className="border border-dashed border-white/10 rounded p-1">[ Paper card 3 ]</div>
                      </div>
                      <div className="border border-white/10 rounded p-2 text-center text-white/30">[ Footer Nav ]</div>
                    </div>
                  ),
                },
                {
                  label: "Search Results — Lo-Fi",
                  content: (
                    <div className="font-mono text-[10px] text-white/40 space-y-1.5 p-4">
                      <div className="border border-white/20 rounded p-1 text-center">🔍 [ Query input ] [Filter ▾]</div>
                      <div className="flex gap-2">
                        <div className="w-24 border border-white/10 rounded p-2 space-y-1">
                          <div className="text-white/30 text-[9px]">FILTERS</div>
                          <div className="border border-dashed border-white/10 rounded p-1">Year</div>
                          <div className="border border-dashed border-white/10 rounded p-1">Type</div>
                          <div className="border border-dashed border-white/10 rounded p-1">Access</div>
                          <div className="border border-dashed border-white/10 rounded p-1">Author</div>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          {[1, 2, 3].map(n => (
                            <div key={n} className="border border-dashed border-white/10 rounded p-2">
                              <div className="border border-white/10 rounded mb-1 p-0.5">Title text here</div>
                              <div className="text-[9px] text-white/25">Author · Year · Cited by N</div>
                              <div className="text-[9px] text-white/20 mt-0.5">Abstract preview (2 lines)...</div>
                              <div className="flex gap-1 mt-1">
                                <span className="border border-white/10 rounded px-1">PDF</span>
                                <span className="border border-white/10 rounded px-1">Cite</span>
                                <span className="border border-white/10 rounded px-1">🔖</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  label: "My Library — Lo-Fi",
                  content: (
                    <div className="font-mono text-[10px] text-white/40 space-y-1.5 p-4">
                      <div className="border border-white/20 rounded p-1 text-center">My Library | 🔍 Search library</div>
                      <div className="flex gap-2">
                        <div className="w-24 border border-white/10 rounded p-2 space-y-1">
                          <div className="text-[9px] text-white/30">FOLDERS</div>
                          <div className="border border-dashed border-white/10 rounded px-1 py-0.5">📁 Folder 1</div>
                          <div className="border border-dashed border-white/10 rounded px-1 py-0.5">📁 Folder 2</div>
                          <div className="border border-dashed border-white/10 rounded px-1 py-0.5">+ New Folder</div>
                          <div className="mt-2 text-[9px] text-white/30">TAGS</div>
                          <div className="border border-dashed border-white/10 rounded px-1 py-0.5">🏷 tech</div>
                          <div className="border border-dashed border-white/10 rounded px-1 py-0.5">🏷 history</div>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          {[1, 2].map(n => (
                            <div key={n} className="border border-dashed border-white/10 rounded p-2">
                              <div className="border border-white/10 rounded mb-1 p-0.5">Saved paper title</div>
                              <div className="text-[9px] text-white/25">Author · 2023</div>
                              <div className="flex gap-1 mt-1 text-[9px]">
                                <span className="border border-white/10 rounded px-1">Label</span>
                                <span className="border border-white/10 rounded px-1">Delete</span>
                                <span className="border border-white/10 rounded px-1">Archive</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ),
                },
              ].map((wf, i) => (
                <FadeIn key={i} delay={i * 80}>
                  <div className="rounded-xl bg-white/[0.02] border border-white/[0.07] overflow-hidden">
                    <div className="px-4 py-2 border-b border-white/[0.06] bg-white/[0.02]">
                      <p className="text-white/40 text-xs font-mono">{wf.label}</p>
                    </div>
                    {wf.content}
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>

          {/* ══════════════════════════════════════════════════════
              09 — DESIGN SYSTEM
          ══════════════════════════════════════════════════════ */}
          <FadeIn>
            <SectionLabel icon={<Palette size={16} />}>09 / Design System</SectionLabel>
            <PhaseCard number="09" title="Style Guide & Component Library" icon={<Palette size={18} />} accent="#f59e0b">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Colors */}
                <div>
                  <p className="text-white/30 text-xs font-mono tracking-widest uppercase mb-3">Color Palette</p>
                  <div className="space-y-2">
                    {[
                      { name: "Primary Blue", hex: "#1A73E8", label: "Primary actions" },
                      { name: "Scholar Blue", hex: "#4285F4", label: "Brand" },
                      { name: "Surface Dark", hex: "#1E1E2E", label: "Dark bg" },
                      { name: "Surface Light", hex: "#F8F9FA", label: "Light bg" },
                      { name: "Success", hex: "#34A853", label: "Open access" },
                      { name: "Warning", hex: "#FBBC04", label: "Alerts" },
                      { name: "Error", hex: "#EA4335", label: "Errors" },
                    ].map(c => (
                      <div key={c.name} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-md flex-shrink-0 border border-white/10" style={{ backgroundColor: c.hex }} />
                        <div>
                          <div className="text-white/60 text-xs font-mono">{c.name}</div>
                          <div className="text-white/25 text-[10px]">{c.hex} · {c.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Typography */}
                <div>
                  <p className="text-white/30 text-xs font-mono tracking-widest uppercase mb-3">Typography</p>
                  <div className="space-y-3">
                    {[
                      { label: "H1 — Display", size: "32px/700", font: "Google Sans" },
                      { label: "H2 — Section", size: "24px/600", font: "Google Sans" },
                      { label: "H3 — Card Title", size: "18px/500", font: "Google Sans" },
                      { label: "Body", size: "14px/400", font: "Roboto" },
                      { label: "Caption", size: "12px/400", font: "Roboto Mono" },
                      { label: "Button", size: "14px/500", font: "Google Sans" },
                    ].map(t => (
                      <div key={t.label} className="flex justify-between items-baseline">
                        <span className="text-white/60 text-xs">{t.label}</span>
                        <div className="text-right">
                          <div className="text-white/40 text-[10px] font-mono">{t.size}</div>
                          <div className="text-white/25 text-[10px]">{t.font}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Components */}
                <div>
                  <p className="text-white/30 text-xs font-mono tracking-widest uppercase mb-3">Components</p>
                  <div className="space-y-3">
                    <div className="flex gap-2 flex-wrap">
                      <button className="px-4 py-1.5 rounded-full text-xs font-mono bg-blue-600 text-white">Primary</button>
                      <button className="px-4 py-1.5 rounded-full text-xs font-mono border border-blue-600 text-blue-400">Secondary</button>
                      <button className="px-4 py-1.5 rounded-full text-xs font-mono text-white/40 border border-white/10">Ghost</button>
                    </div>
                    <div className="px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-xs text-white/40 font-mono">
                      Search input field...
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                      <div className="text-white/70 text-xs font-mono mb-1">Paper Card Component</div>
                      <div className="text-white/40 text-[10px]">Title · Author · Year</div>
                      <div className="flex gap-1 mt-2">
                        <span className="px-1.5 py-0.5 rounded bg-green-500/15 text-green-400 text-[10px] font-mono">Open Access</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 text-[10px] font-mono">PDF</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {["Spacing: 4/8/16/24px", "Radius: 4/8/12px", "Shadow: 3 levels"].map(s => (
                        <span key={s} className="text-[10px] text-white/30 font-mono px-2 py-0.5 rounded border border-white/[0.08]">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </PhaseCard>
          </FadeIn>

          {/* ══════════════════════════════════════════════════════
              10 — BEFORE / AFTER
          ══════════════════════════════════════════════════════ */}
          <FadeIn>
            <SectionLabel icon={<Monitor size={16} />}>10 / Before vs After</SectionLabel>
            <div className="space-y-6">
              {[
                {
                  page: "Settings Page",
                  before: ["Simple flat list of settings", "No visual grouping", "No accessibility section", "Cookie warning banner (intrusive)", "Basic layout — no spacing system"],
                  after: ["Grouped settings with clear section headers", "Dedicated Accessibility tab", "Theme selector (Dark / Light / System)", "\"Open in preview cards\" option for results", "Clean spacing + proper visual hierarchy"],
                },
                {
                  page: "My Library",
                  before: ["Flat unsorted list of saved articles", "Only Labels + Trash options", "No folder structure", "No search within library", "Cluttered layout"],
                  after: ["Folder-based organisation + Tags system", "Archive / Edit / Delete per article", "Search within library", "Filter by year and subject", "Card layout with visual breathing room"],
                },
                {
                  page: "Alerts Page",
                  before: ["Dense text list with awkward CANCEL buttons", "No alert management hierarchy", "No way to edit alerts inline"],
                  after: ["Clean card list with delete (🗑) per alert", "\"+ New Alert\" primary CTA button", "Clearer email scope display", "Room for description / frequency controls"],
                },
              ].map((comp, i) => (
                <FadeIn key={i} delay={i * 80}>
                  <div className="rounded-2xl overflow-hidden border border-white/[0.07]">
                    <div className="px-6 py-3 bg-white/[0.03] border-b border-white/[0.06]">
                      <p className="text-white/60 text-sm font-mono">{comp.page}</p>
                    </div>
                    <div className="grid md:grid-cols-2">
                      <div className="p-6 border-r border-white/[0.06] bg-red-500/[0.02]">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-2 h-2 rounded-full bg-red-400" />
                          <span className="text-red-400 text-xs font-mono tracking-widest uppercase">Before</span>
                        </div>
                        <ul className="space-y-2">
                          {comp.before.map((b, j) => (
                            <li key={j} className="flex items-start gap-2 text-white/50 text-sm">
                              <span className="text-red-400/60 mt-0.5 text-xs shrink-0">✗</span>
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-6 bg-green-500/[0.02]">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-2 h-2 rounded-full bg-green-400" />
                          <span className="text-green-400 text-xs font-mono tracking-widest uppercase">After</span>
                        </div>
                        <ul className="space-y-2">
                          {comp.after.map((a, j) => (
                            <li key={j} className="flex items-start gap-2 text-white/50 text-sm">
                              <span className="text-green-400/70 mt-0.5 text-xs shrink-0">✓</span>
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>

          {/* ══════════════════════════════════════════════════════
              11 — PROTOTYPE & TESTING
          ══════════════════════════════════════════════════════ */}
          <FadeIn>
            <SectionLabel icon={<TestTube size={16} />}>11 / Prototype & Usability Testing</SectionLabel>
            <div className="grid md:grid-cols-2 gap-6">
              <PhaseCard number="11a" title="Interactive Prototype" icon={<Monitor size={18} />} accent="#06b6d4">
                <p className="text-white/55 text-sm mb-4">
                  Built in Figma with full click-through flows. Core user paths were connected:
                </p>
                <ul className="space-y-2 mb-4">
                  {[
                    "Home → Search → Filter → Result → Save",
                    "Library → Folder → Article → Edit Label",
                    "Alerts → Create Alert → Manage",
                    "Settings → Accessibility → Theme Toggle",
                    "Author Profile → Citation Trends → Follow",
                  ].map((flow, i) => (
                    <li key={i} className="flex items-center gap-2 text-white/50 text-xs font-mono">
                      <span className="text-cyan-400/60">▶</span> {flow}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Chip color="#06b6d4">Figma Prototype</Chip>
                  <Chip color="#a855f7">5 Screens Connected</Chip>
                </div>
              </PhaseCard>

              <PhaseCard number="11b" title="Usability Testing Results" icon={<TestTube size={18} />} accent="#22c55e">
                <p className="text-white/55 text-sm mb-4">
                  8 participants tested key tasks. Results vs. old interface:
                </p>
                <div className="space-y-3 mb-4">
                  {[
                    { task: "Find & Save a paper", before: 38, after: 19, unit: "sec avg" },
                    { task: "Locate Advanced Search", before: 67, after: 18, unit: "% struggle" },
                    { task: "Create a Library folder", before: 72, after: 21, unit: "% struggle" },
                    { task: "Enable Dark Mode", before: 100, after: 8, unit: "% struggle" },
                  ].map((row) => (
                    <div key={row.task}>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-white/50">{row.task}</span>
                        <span className="text-white/25">{row.unit}</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-red-500/70" style={{ width: `${row.before}%` }} />
                        </div>
                        <span className="text-red-400/70 text-xs font-mono w-8 text-right">{row.before}</span>
                      </div>
                      <div className="flex gap-2 items-center mt-1">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-green-500/70" style={{ width: `${row.after}%` }} />
                        </div>
                        <span className="text-green-400/70 text-xs font-mono w-8 text-right">{row.after}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-white/30">
                  <span className="flex items-center gap-1"><span className="w-2 h-1.5 rounded-sm bg-red-500/70" />Before</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-1.5 rounded-sm bg-green-500/70" />After</span>
                </div>
              </PhaseCard>
            </div>
          </FadeIn>

          {/* ══════════════════════════════════════════════════════
              12 — ITERATION & HANDOFF
          ══════════════════════════════════════════════════════ */}
          <FadeIn>
            <SectionLabel icon={<IterationCw size={16} />}>12 / Iteration & Handoff</SectionLabel>
            <div className="grid md:grid-cols-2 gap-6">
              <PhaseCard number="12a" title="Key Iterations from Testing" icon={<IterationCw size={18} />} accent="#f59e0b">
                <div className="space-y-4">
                  {[
                    {
                      problem: "Users couldn't find Checkout from search results",
                      solution: "Moved 'Save' bookmark icon to be inline on each result card, always visible",
                      impact: "Save task time ↓ from 38s to 19s",
                    },
                    {
                      problem: "Dark mode toggle buried in Settings",
                      solution: "Added theme toggle to top navbar as a sun/moon icon",
                      impact: "100% → 8% struggle rate for dark mode",
                    },
                    {
                      problem: "Advanced Search was invisible to 32% of users",
                      solution: "Pinned 'Advanced Search' link below main search bar always",
                      impact: "Discoverability ↑ from 68% to 94%",
                    },
                  ].map((iter, i) => (
                    <div key={i} className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                      <div className="text-red-400/70 text-xs font-mono mb-1">⚠ Problem</div>
                      <p className="text-white/55 text-sm mb-2">{iter.problem}</p>
                      <div className="text-green-400/70 text-xs font-mono mb-1">✓ Solution</div>
                      <p className="text-white/55 text-sm mb-2">{iter.solution}</p>
                      <Chip color="#22c55e">{iter.impact}</Chip>
                    </div>
                  ))}
                </div>
              </PhaseCard>

              <PhaseCard number="12b" title="Developer Handoff" icon={<Code size={18} />} accent="#a855f7">
                <p className="text-white/55 text-sm mb-4">All handoff assets prepared in Figma Dev Mode:</p>
                <div className="space-y-2 mb-6">
                  {[
                    ["Design Files", "Figma project with all screens & components"],
                    ["Component Library", "Buttons, Cards, Inputs, Navbar, Badges"],
                    ["Spacing Values", "4px grid — 4/8/12/16/24/32/48px tokens"],
                    ["Typography", "Google Sans + Roboto, 6 text styles defined"],
                    ["Color Tokens", "7 semantic colors, dark + light mode values"],
                    ["Icon Set", "Material Icons — outlined variant throughout"],
                    ["Assets", "All SVGs exported at 1x, 2x, 3x"],
                  ].map(([key, val]) => (
                    <div key={key} className="flex items-start gap-3 text-sm">
                      <span className="text-purple-400/60 font-mono text-xs shrink-0 mt-0.5">→</span>
                      <div>
                        <span className="text-white/60 font-mono text-xs">{key}: </span>
                        <span className="text-white/40 text-xs">{val}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Chip color="#a855f7">Figma Dev Mode</Chip>
                  <Chip color="#3b82f6">Auto Layout</Chip>
                  <Chip color="#22c55e">Responsive Frames</Chip>
                </div>
              </PhaseCard>
            </div>
          </FadeIn>

          {/* ══════════════════════════════════════════════════════
              13 — POST LAUNCH / OUTCOMES
          ══════════════════════════════════════════════════════ */}
          <FadeIn>
            <SectionLabel icon={<Rocket size={16} />}>13 / Outcomes & Reflections</SectionLabel>
            <PhaseCard number="13" title="Project Outcomes" icon={<Rocket size={18} />} accent="#22c55e">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-white/30 text-xs font-mono tracking-widest uppercase mb-4">Measured Improvements</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { metric: "Feature Discoverability", value: "+47%", color: "#22c55e" },
                      { metric: "Task Completion Speed", value: "+50%", color: "#3b82f6" },
                      { metric: "UI Satisfaction (avg)", value: "4.3/5", color: "#f59e0b" },
                      { metric: "Usability Test Score", value: "8.6/10", color: "#a855f7" },
                    ].map((m) => (
                      <div key={m.metric} className="p-4 rounded-xl border" style={{ borderColor: `${m.color}25`, backgroundColor: `${m.color}08` }}>
                        <div className="text-2xl font-bold font-mono mb-1" style={{ color: m.color }}>{m.value}</div>
                        <div className="text-white/40 text-xs">{m.metric}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-white/30 text-xs font-mono tracking-widest uppercase mb-4">What I Learned</p>
                  <div className="space-y-3">
                    {[
                      "User research surfaced issues (feature unawareness) we'd have never assumed — data > assumptions",
                      "Lo-fi wireframes saved hours: 3 major layout decisions were changed before any high-fi work",
                      "Testing with 8 real users uncovered more actionable issues than a team review of 20 ever could",
                      "Design systems reduce decision fatigue and keep iterations consistent across the whole project",
                      "Developer handoff is a design problem too — clarity in specs = fewer back-and-forth revision cycles",
                    ].map((insight, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-white/55 text-sm">
                        <ChevronRight size={14} className="text-green-400/50 mt-0.5 shrink-0" />
                        {insight}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PhaseCard>
          </FadeIn>

        </div>

        {/* Footer */}
        <footer className="py-10 px-6 border-t border-white/[0.06] text-center">
          <p className="text-white/20 text-xs font-mono">
            © {new Date().getFullYear()} Aanish Bangre — Google Scholar Redesign · UI/UX Case Study
          </p>
        </footer>
      </div>
    </>
  );
}