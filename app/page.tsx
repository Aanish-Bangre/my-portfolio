"use client";

import { LimelightNav } from "@/components/ui/limelight-nav";
import { Home, User, FolderKanban, Sparkles, Mail, Terminal, X } from 'lucide-react';
import PortfolioTerminal from "@/components/ui/interactive-portfolio-terminal-component";
import Image from "next/image";
import React, { useState, useEffect, useRef, useMemo } from "react";

const navItems = [
  { id: '1', icon: <Home />, label: 'Home' },
  { id: '2', icon: <User />, label: 'About' },
  { id: '3', icon: <FolderKanban />, label: 'Projects' },
  { id: '4', icon: <Sparkles />, label: 'Skills' },
  { id: '5', icon: <Mail />, label: 'Contact' },
];

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

// BlurText animation component
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
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const segments = useMemo(() => {
    return animateBy === "words" ? text.split(" ") : text.split("");
  }, [text, animateBy]);

  return (
    <p ref={ref} className={`inline-flex flex-wrap items-center justify-center ${className}`} style={style}>
      {segments.map((segment, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            filter: inView ? "blur(0px)" : "blur(10px)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : `translateY(${direction === "top" ? "-20px" : "20px"})`,
            transition: `all 0.5s ease-out ${i * delay}ms`,
          }}
        >
          {segment}
          {animateBy === "words" && i < segments.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </p>
  );
};

export default function LandingPage() {
  const [terminalOpen, setTerminalOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTerminalOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = terminalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [terminalOpen]);

  return (
    <>
      <style suppressHydrationWarning>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@700&family=Antic&display=swap');
        `}
      </style>
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
        {/* Floating Navigation */}
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[75vw]">
          <LimelightNav
            logo={<TechLogo />}
            items={navItems}
            className="w-full bg-background/80 backdrop-blur-md shadow-lg border-white/10 dark:border-white/5 pl-2"
            limelightClassName="bg-primary/90"
            iconClassName="text-foreground/80 hover:text-foreground transition-colors"
          />
        </div>

        {/* Hero Section */}
        <section className="relative h-screen flex items-center overflow-hidden">
          {/* Background Image with Overlay */}
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

          {/* Two-column hero layout */}
          <div className="relative z-10 w-full h-full flex items-center justify-center gap-16 md:gap-24 lg:gap-32 px-6 md:px-12 lg:px-20">

            {/* LEFT — Name Block */}
            <div className="relative flex items-center justify-start h-full pointer-events-none select-none overflow-hidden">
              <div className="relative text-left">
                <div>
                  <BlurText
                    text="AANISH"
                    delay={100}
                    animateBy="letters"
                    direction="top"
                    className="font-bold text-[60px] sm:text-[80px] md:text-[105px] lg:text-[130px] xl:text-[155px] leading-[0.85] tracking-tighter uppercase whitespace-nowrap justify-start"
                    style={{ color: "#ffffff", fontFamily: "'Fira Code', monospace" }}
                  />
                </div>
                <div>
                  <BlurText
                    text="BANGRE"
                    delay={100}
                    animateBy="letters"
                    direction="top"
                    className="font-bold text-[60px] sm:text-[80px] md:text-[105px] lg:text-[130px] xl:text-[155px] leading-[0.85] tracking-tighter uppercase whitespace-nowrap justify-start"
                    style={{ color: "#ffffff", fontFamily: "'Fira Code', monospace" }}
                  />
                </div>

                {/* Profile Picture — centered over the name block */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
                  <div className="w-[70px] h-[115px] sm:w-[90px] sm:h-[145px] md:w-[110px] md:h-[175px] lg:w-[130px] lg:h-[210px] rounded-full overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-110 cursor-pointer border-2 border-white/20">
                    <img
                      src="/profile.jpg"
                      alt="Aanish Bangre"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=256&auto=format&fit=crop";
                      }}
                      className="w-full h-full object-cover scale-[2.8] origin-[50%_40%]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — Description Panel */}
            <div className="w-[240px] sm:w-[270px] md:w-[300px] lg:w-[340px] flex-shrink-0 flex items-center justify-center">
              <div className="space-y-6">
                {/* Role badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-medium tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Fullstack Developer
                </div>

                {/* Description */}
                <p className="text-white/70 text-sm md:text-base leading-relaxed" style={{ fontFamily: "'Antic', sans-serif" }}>
                  Passionate developer & B.Tech student at SPIT Mumbai, building efficient, user-centric software with a focus on modern web, mobile, and AI/ML solutions.
                </p>

                {/* Subtle divider */}
                <div className="h-px bg-gradient-to-r from-white/20 to-transparent" />

                {/* Education */}
                <p className="text-white/40 text-xs" style={{ fontFamily: "'Antic', sans-serif" }}>
                  B.Tech · SPIT Mumbai · Class of 2027
                </p>
                {/* Terminal CTA Button */}
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
        {/* Terminal Modal */}
        {terminalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setTerminalOpen(false);
            }}
          >
            <div
              className="w-full max-w-4xl relative"
              style={{ animation: 'terminalSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
            >
              <button
                onClick={() => setTerminalOpen(false)}
                className="absolute -top-10 right-0 flex items-center gap-1.5 text-gray-400 hover:text-white text-xs font-mono transition-colors"
              >
                <X size={14} />
                <span>ESC to close</span>
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
      </div>
    </>
  );
}
