import { Project, Experience, Skill } from './types';

export const PORTFOLIO_DATA = {
  name: "ARYAMAN V. GUPTA",
  title: "Senior Software Engineer",
  bio: "Engineering the invisible. I build digital experiences that feel physical, blending high-performance code with cinematic aesthetics. Based in Chhattisgarh (India), working globally.",
  
  about: {
    heading: "The Narrative",
    paragraphs: [
      "I believe that the best digital experiences are those that disappear. When performance meets precision, the interface dissolves, leaving only the intent. My work explores this boundary—crafting interactions that feel inevitable rather than designed.",
      "With a foundation in computer science and a passion for fine arts, I navigate the space between logic and emotion. From optimizing low-level render loops to defining motion languages for global brands, I bring a holistic perspective to every project."
    ],
    image: "https://images.unsplash.com/photo-1766423936525-2ce5c6cec5d7?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },

  projects: [
    {
      id: "p1",
      title: "VOID ENGINE",
      category: "WebGL Core",
      description: "A high-performance rendering engine for browser-based volumetric lighting. Reduced render times by 40% while increasing visual fidelity.",
      tech: ["WebGL", "GLSL", "Rust", "WASM"],
      year: "2024"
    },
    {
      id: "p2",
      title: "NEURAL SCAPE",
      category: "Generative AI",
      description: "Real-time landscape generation interface allowing users to sculpt terrain using voice commands and hand gestures via webcam.",
      tech: ["TensorFlow.js", "Three.js", "React", "WebRTC"],
      year: "2023"
    },
    {
      id: "p3",
      title: "AETHER FINANCE",
      category: "Fintech UI",
      description: "Complete design system and frontend architecture for a next-gen algorithmic trading platform. 60fps data visualization for millions of data points.",
      tech: ["D3.js", "React", "TypeScript", "WebSocket"],
      year: "2023"
    },
    {
      id: "p4",
      title: "CHRONOS",
      category: "Experimental",
      description: "An interactive exploration of non-linear time perception, awarded Site of the Day on Awwwards.",
      tech: ["React Three Fiber", "GSAP", "Next.js"],
      year: "2022"
    }
  ] as Project[],

  experience: [
    {
      id: "e1",
      role: "Lead Frontend Engineer",
      company: "Stark Industries (Tech Div)",
      period: "2022 — Present",
      description: "Leading a team of 8 engineers building the next generation of holographic interfaces. Specialized in React performance and shader optimization."
    },
    {
      id: "e2",
      role: "Creative Developer",
      company: "Massive Dynamic",
      period: "2019 — 2022",
      description: "Bridged the gap between design and engineering. Implemented complex motion systems and micro-interactions for global campaigns."
    }
  ] as Experience[],

  contact: {
    email: "aryamanvg@gmail.com",
    social: [
      { name: "GitHub", url: "https://github.com/helptool" },
      { name: "Instagram", url: "https://www.instagram.com/avgec/" },
      { name: "LinkedIn", url: "https://www.linkedin.com/in/aryaman-v-gupta/" }
    ]
  }
};