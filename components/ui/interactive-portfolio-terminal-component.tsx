'use client'

import { useState, useRef, useEffect } from 'react'

export default function PortfolioTerminal() {
  const [history, setHistory] = useState<Array<{ command: string; output: string }>>([
    {
      command: '/welcome',
      output: `
 █████╗  █████╗ ███╗   ██╗██╗███████╗██╗  ██╗
██╔══██╗██╔══██╗████╗  ██║██║██╔════╝██║  ██║
███████║███████║██╔██╗ ██║██║███████╗███████║
██╔══██║██╔══██║██║╚██╗██║██║╚════██║██╔══██║
██║  ██║██║  ██║██║ ╚████║██║███████║██║  ██║

[SYSTEM INITIALIZED] - Terminal Portfolio v1.0

Welcome! I'm Aanish Bangre — Full-Stack Developer & B.Tech student.
Type help to see available commands.`,
    },
  ])
  const [currentCommand, setCurrentCommand] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const bottomRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands: Record<string, () => string> = {
    help: () => `
[AVAILABLE COMMANDS]

  about       Personal information & bio
  projects    View project portfolio
  skills      Technical skills matrix
  experience  Work & research history
  education   Educational background
  contact     Contact information
  clear       Clear terminal screen
  help        Show this help message
    `,
    about: () => `
[ABOUT ME]

Name    : Aanish Bangre
Role    : Full Stack Developer
Location: Andheri West, Mumbai, India
Status  : B.Tech Student @ SPIT (Class of 2027)

Bio:
Passionate developer building efficient, user-centric software
with a focus on modern web, real-time systems, and AI/ML solutions.
I enjoy solving complex problems — from distributed systems to
computer vision pipelines.
    `,
    projects: () => `
[PROJECT PORTFOLIO]

1. Appointment Management System
   • Stack  : Next.js 16, TypeScript, FastAPI, Redis, PostgreSQL
   • Feature: Race-condition-proof booking via Redis distributed locks,
              idempotency keys, and rate limiting
   • Real-time WebSockets with Redis Pub/Sub for live sync

2. Just Rent It
   • Stack  : Next.js 15, TypeScript, Socket.io, Razorpay
   • Feature: P2P rental marketplace with real-time chat,
              secure payment & automated deposit handling
   • Modern UI with Tailwind CSS + Radix UI

3. Advanced ANPR & Face Recognition System
   • Stack  : YOLOv5, PyTesseract, OpenCV, TensorFlow
   • Feature: Multi-object detection + OCR for license plate
              extraction with XML annotation handling

4. IITB Incident Detection (Research)
   • Stack  : YOLOv11, OpenCV, CUDA
   • Feature: Vehicle + plate detection in tunnel CCTV footage,
              Laplacian sharpening & Black-Hat transforms
    `,
    skills: () => `
[TECHNICAL SKILLS MATRIX]

Frontend:
  React / Next.js      ████████████████████ 100%
  TypeScript           ████████████████████ 100%
  Tailwind CSS         ████████████████████ 100%
  Radix UI             ████████████████     80%

Backend & DB:
  FastAPI (Python)     ██████████████████   90%
  Node.js / Express    ██████████████████   90%
  PostgreSQL / MongoDB ████████████████     80%
  Redis / WebSockets   ████████████████     80%

ML & Computer Vision:
  YOLOv5 / YOLOv11     ████████████████     80%
  OpenCV               ██████████████████   90%
  TensorFlow / Keras   ████████████         60%
  PyTesseract / OCR    ████████████████     80%

DevOps & Tools:
  Git / GitHub         ████████████████████ 100%
  Docker               ██████████████       70%
  Figma / UI-UX        ██████████████       70%
  Distributed Systems  ████████████████     80%
    `,
    experience: () => `
[EXPERIENCE]

2026 - Present | Research Intern
Indian Institute of Technology Bombay (IIT-B)
Civil Engineering Dept — under Prof. Gopal R. Patil
• Fine-tuned YOLOv11 for vehicle & license plate detection
  in tunnel CCTV footage
• Built OCR preprocessing pipeline with Laplacian sharpening
  and Black-Hat transforms
• Video processing pipeline with intelligent frame-skipping
  for high-definition surveillance data

2024 | Core Member — UI/UX Lead
Computer Society of India, SPIT Chapter
• Led UI/UX design for student-driven technical projects
• Collaborated across teams for accessible, engaging interfaces

2023 - 2024 | Subcommittee Member
Oculus — Annual Technical Festival, SPIT
• Managed operational execution for 1000+ participant events
• Cross-team project planning and coordination
    `,
    education: () => `
[EDUCATION]

Bachelor of Technology — Computer Engineering
Sardar Patel Institute of Technology (SPIT), Mumbai
Aug 2023 – Present | CGPA: 8.65 / 10.0

Coursework: Data Structures, Algorithms, Operating Systems,
            DBMS, Computer Networks, Machine Learning,
            Image Processing

Minor Course — UI/UX Design
Pearl Academy, Mumbai | Jan 2025 – Present
    `,
    contact: () => `
[CONTACT INFORMATION]

📧 Email   : aanish.bangre@gmail.com
🐙 GitHub  : https://github.com/Aanish-Bangre
💼 LinkedIn: https://linkedin.com/in/aanish-bangre
📱 Phone   : +91 85549 62377
📍 Location: Andheri West, Mumbai, India

Feel free to reach out for opportunities, collabs, or tech chat!
Response time: Usually within 24 hours.
    `,
    clear: () => {
      setHistory([])
      return ''
    },
  }

  const handleCommand = () => {
    const cmd = currentCommand.trim().toLowerCase()
    const commandFn = commands[cmd]
    const output = commandFn
      ? commandFn()
      : `Command not found: ${cmd}\nType help to see available commands.`

    if (cmd !== 'clear') {
      setHistory((prev) => [...prev, { command: currentCommand, output }])
    }
    setCurrentCommand('')
    setHistoryIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHistoryIndex((prev) => {
        const newIndex = Math.min(prev + 1, history.length - 1)
        if (history.length > 0) {
          setCurrentCommand(history[history.length - 1 - newIndex]?.command || '')
        }
        return newIndex
      })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHistoryIndex((prev) => {
        const newIndex = Math.max(prev - 1, -1)
        setCurrentCommand(newIndex === -1 ? '' : history[history.length - 1 - newIndex]?.command || '')
        return newIndex
      })
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  useEffect(() => {
    const handleClick = () => inputRef.current?.focus()
    if (terminalRef.current) {
      terminalRef.current.addEventListener('click', handleClick)
    }
    return () => {
      if (terminalRef.current) {
        terminalRef.current.removeEventListener('click', handleClick)
      }
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100)
    return () => clearTimeout(timer)
  }, [])

  const renderOutput = (output: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
    let parts = output.split(urlRegex)
    parts = parts.flatMap((part) => (urlRegex.test(part) ? [part] : part.split(emailRegex)))
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline hover:text-cyan-300 transition-colors"
          >
            {part}
          </a>
        )
      }
      if (emailRegex.test(part)) {
        return (
          <a
            key={index}
            href={`mailto:${part}`}
            className="text-cyan-400 hover:underline hover:text-cyan-300 transition-colors"
          >
            {part}
          </a>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden shadow-2xl border border-green-400/60 font-mono text-green-400">
      <div className="flex items-center gap-2 p-3 bg-gray-900 text-xs text-gray-400 border-b border-gray-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex-1 text-center font-semibold tracking-wide">
          aanish@portfolio:~$ | Interactive Terminal v1.0
        </div>
        <span className="text-green-400">● ONLINE</span>
      </div>

      <div
        ref={terminalRef}
        className="h-[65vh] overflow-y-auto p-4 space-y-3 bg-black cursor-text"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#10b981 #1f2937' }}
      >
        {history.map((entry, i) => (
          <div key={i} className="space-y-1">
            <div className="flex gap-2">
              <span className="text-cyan-400 font-semibold whitespace-nowrap">aanish@portfolio:~$</span>
              <span className="text-white">{entry.command}</span>
            </div>
            <div className="whitespace-pre-wrap text-gray-300 pl-6 leading-relaxed text-sm">
              {renderOutput(entry.output)}
            </div>
          </div>
        ))}
        <div className="flex gap-2 items-center">
          <span className="text-cyan-400 font-semibold whitespace-nowrap">aanish@portfolio:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-white caret-green-400 text-sm"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
          <span className="text-green-400 animate-pulse">█</span>
        </div>
        <div ref={bottomRef} />
      </div>

      <div className="bg-gray-900 px-4 py-2 text-xs text-gray-500 border-t border-gray-700 flex justify-between">
        <span>
          Type <span className="text-green-400">help</span> for commands • ↑/↓ for history
        </span>
        <span>
          <span className="text-green-400">clear</span> to reset
        </span>
      </div>
    </div>
  )
}
