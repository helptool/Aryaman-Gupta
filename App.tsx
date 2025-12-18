import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, Variants } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, ArrowUpRight, Globe } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import ReflectiveText from './components/ReflectiveText';
import CustomCursor from './components/CustomCursor';
import { PORTFOLIO_DATA } from './constants';

const EASE_HEAVY = [0.22, 1, 0.36, 1];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 }, 
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1.4, ease: EASE_HEAVY } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

// Component: Futuristic Fragmented Text
const CyberImpossible: React.FC = () => {
  const letters = "IMPOSSIBLE".split("");
  return (
    <span className="cyber-text font-futuristic font-bold inline-flex items-center">
      {letters.map((char, i) => (
        <span 
          key={i} 
          className="impossible-fragment mx-[0.5px] md:mx-[1px]"
          style={{ 
            opacity: char === ' ' ? 0 : 1,
            fontSize: i % 3 === 0 ? '1.02em' : '1em',
            borderBottom: i % 5 === 0 ? '1px solid rgba(231, 226, 217, 0.4)' : 'none',
            transform: i % 4 === 0 ? 'translateY(-1px)' : 'none'
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

// Component: Real-time System Clock
const SystemClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="flex flex-col items-center gap-1 font-mono text-[9px] text-accent/40 tracking-[0.2em]">
      <span>{time.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
      <span className="opacity-50">UTC+5:30</span>
    </div>
  );
};

const Sidebar: React.FC<{ side: 'left' | 'right'; children: React.ReactNode }> = ({ side, children }) => {
  return (
    <div className={`fixed top-4 bottom-4 ${side === 'left' ? 'left-4' : 'right-4'} w-12 md:w-20 z-40 bg-background/20 backdrop-blur-sm border border-white/10 hidden md:flex flex-col items-center justify-between py-10 overflow-hidden`}>
        {/* HUD Border Accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/40" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent/40" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent/40" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/40" />
        
        {/* Scanning Line Aesthetic */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(231,226,217,0.03)_50%,transparent)] bg-[size:100%_400%] animate-scan pointer-events-none" />
        
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-between">
          {children}
        </div>
    </div>
  )
}

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const smoothScrollY = useSpring(scrollYProgress, { stiffness: 40, damping: 20, restDelta: 0.001 });
  
  const heroOpacity = useTransform(smoothScrollY, [0, 0.2], [1, 0]);
  const heroScale = useTransform(smoothScrollY, [0, 0.2], [1, 0.95]);

  const dotY = useTransform(smoothScrollY, [0, 1], ['0%', '100%']);

  const nameParts = PORTFOLIO_DATA.name.split(' ');
  const firstLine = nameParts.slice(0, -1).join(' '); 
  const secondLine = nameParts[nameParts.length - 1];

  return (
    <div className="relative min-h-screen font-sans text-accent overflow-hidden selection:bg-accent selection:text-background">
      <FluidBackground />
      <CustomCursor />

      {/* MOBILE HEADER */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="fixed top-6 left-6 z-50 md:hidden mix-blend-difference pointer-events-none">
        <span className="text-sm font-display font-bold tracking-widest uppercase text-accent">Vaish</span>
      </motion.div>

      {/* LEFT HUD SIDEBAR */}
      <Sidebar side="left">
        <div className="flex flex-col items-center gap-6">
          <div className="text-[10px] font-mono text-accent/30 tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 mb-2 uppercase">Core_System</div>
          <span className="text-sm font-futuristic font-bold tracking-[0.3em] uppercase [writing-mode:vertical-rl] rotate-180">Vaish</span>
        </div>
        
        <div className="flex flex-col items-center gap-4 h-full max-h-[300px] justify-end pb-4 w-full px-4">
            <div className="relative w-[1px] h-48 bg-white/5 overflow-visible">
                {/* Scroll Indicator Dot */}
                <motion.div 
                  className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(231,226,217,0.8)]" 
                  style={{ top: dotY }}
                />
                {/* Background Progress Fill */}
                <motion.div 
                  className="absolute top-0 left-0 w-full bg-accent/20" 
                  style={{ height: dotY }} 
                />
            </div>
            <div className="text-[8px] font-mono text-accent/40 uppercase tracking-widest mt-2">Prgrs_Log</div>
        </div>
      </Sidebar>

      {/* RIGHT HUD SIDEBAR */}
      <Sidebar side="right">
         <div className="flex flex-col items-center gap-8">
             <motion.a 
               href={`mailto:${PORTFOLIO_DATA.contact.email}`} 
               className="group relative flex flex-col items-center gap-6 interactive"
               whileHover={{ scale: 1.1 }}
             >
                 <Mail size={18} className="text-secondary group-hover:text-accent transition-colors" />
                 <span className="text-[10px] font-mono text-secondary/60 [writing-mode:vertical-rl] tracking-[0.3em] group-hover:text-accent transition-colors uppercase">{PORTFOLIO_DATA.contact.email}</span>
                 {/* Decorative Pulse Ring */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-8 h-8 rounded-full border border-accent/0 group-hover:border-accent/20 group-hover:scale-150 transition-all duration-700" />
             </motion.a>
         </div>

         <div className="flex flex-col items-center gap-6 w-full">
            <div className="w-[1px] h-16 bg-white/10" />
            <SystemClock />
            <div className="flex flex-col items-center opacity-30">
               <Globe size={14} className="animate-spin-slow mb-2" />
               <span className="text-[7px] font-mono tracking-[0.4em] uppercase">SF_O7.GD</span>
            </div>
         </div>
      </Sidebar>

      <main className="relative z-10 w-full px-4 sm:px-6 md:pl-32 md:pr-32 max-w-[1920px] mx-auto overflow-x-hidden">
        
        {/* HERO SECTION */}
        <motion.section className="min-h-screen flex flex-col justify-center items-start pt-20 md:pt-0" style={{ opacity: heroOpacity, scale: heroScale }} initial="hidden" animate="visible" variants={staggerContainer}>
          <div className="w-full max-w-7xl mx-auto">
            <motion.div variants={fadeInUp} className="w-full text-left pl-2 md:pl-0">
              <p className="text-secondary text-sm md:text-xl mb-6 md:mb-8 font-medium tracking-wide">{PORTFOLIO_DATA.title}</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="relative z-20 mb-12 md:mb-16 w-full">
              <h1 className="flex flex-col font-display font-black uppercase w-full">
                <span className="text-chromium leading-[0.9] tracking-tighter w-full text-left text-[clamp(2.2rem,8.5vw,6.5rem)]">{firstLine}</span>
                <span className="text-chromium leading-[0.9] tracking-tighter w-full text-left text-[clamp(2.2rem,8.5vw,6.5rem)]">{secondLine}</span>
              </h1>
              <span className="absolute top-1/2 left-1/2 w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-white/5 blur-[80px] rounded-full opacity-20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 -z-10" />
            </motion.div>

            <motion.div variants={fadeInUp} className="max-w-xl text-base md:text-2xl text-secondary/80 leading-relaxed pl-4 md:pl-6 border-l-2 border-accent/20 ml-2 md:ml-0">{PORTFOLIO_DATA.bio}</motion.div>
          </div>
        </motion.section>

        {/* ABOUT SECTION */}
        <section className="py-24 md:py-32 border-t border-white/5">
          <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE_HEAVY }} className="relative">
                <div className="aspect-[3/4] md:aspect-[4/5] overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700 bg-surface border border-white/5">
                     <img src={PORTFOLIO_DATA.about.image} alt="Portrait" className="w-full h-full object-cover opacity-80" />
                     <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-50" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 md:w-24 md:h-24 border-r border-b border-white/10" />
            </motion.div>
            <div>
                <RevealTitle className="mb-8 md:mb-12"><ReflectiveText as="h2" className="text-3xl md:text-5xl font-display font-bold">{PORTFOLIO_DATA.about.heading}</ReflectiveText></RevealTitle>
                <div className="space-y-6 md:space-y-8">
                    {PORTFOLIO_DATA.about.paragraphs.map((para, idx) => (
                        <motion.p key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: idx * 0.1, ease: EASE_HEAVY }} className="text-base md:text-lg text-secondary/80 leading-relaxed font-light">{para}</motion.p>
                    ))}
                </div>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 1 }} className="mt-12 pt-8 border-t border-white/5 flex gap-8">
                     <div className="flex flex-col"><span className="text-[10px] md:text-xs font-mono uppercase text-accent/50 tracking-widest mb-1">Status</span><span className="text-sm text-accent">Available for new ventures</span></div>
                     <div className="flex flex-col"><span className="text-[10px] md:text-xs font-mono uppercase text-accent/50 tracking-widest mb-1">Location</span><span className="text-sm text-accent">San Francisco, CA</span></div>
                </motion.div>
            </div>
          </div>
        </section>

        {/* WORK SECTION */}
        <section className="py-32 md:py-48 border-t border-white/5">
          <div className="mb-24 flex items-end justify-between">
            <RevealTitle><ReflectiveText as="h2" className="text-4xl md:text-6xl font-display font-bold mb-4">Selected Works</ReflectiveText></RevealTitle>
             <span className="hidden md:block text-xs font-mono text-secondary/40 mb-2 uppercase tracking-widest">Sys_Scan: Discovery</span>
          </div>
          <div className="flex flex-col gap-40">
            {PORTFOLIO_DATA.projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-24 md:py-32 flex flex-col items-center text-center relative border-t border-white/5 overflow-hidden">
          <motion.div
             initial={{ opacity: 0, scale: 0.98 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 1.4, ease: EASE_HEAVY }}
             className="relative z-10 w-full px-4"
          >
            <div className="flex flex-col items-center space-y-1 md:space-y-2">
              <div className="font-futuristic font-bold text-accent text-xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[0.25em] whitespace-nowrap opacity-70">
                LET'S BUILD
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center">
                <div className="text-accent text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter whitespace-nowrap cyber-scan relative px-2 flex items-center">
                   <span className="font-futuristic font-bold opacity-50 mr-3 md:mr-5">THE</span>
                   <CyberImpossible />
                </div>
              </div>

              <div className="flex items-center gap-4 opacity-20">
                <div className="h-[1px] w-8 md:w-16 bg-accent" />
                <span className="text-[8px] md:text-[10px] font-mono tracking-[0.3em] uppercase">SYSTEM.ONLINE_v2.5</span>
                <div className="h-[1px] w-8 md:w-16 bg-accent" />
              </div>
            </div>
          </motion.div>
          
          <motion.a 
            href={`mailto:${PORTFOLIO_DATA.contact.email}`}
            className="mt-16 relative inline-block px-10 py-5 md:px-14 md:py-7 border border-accent/10 rounded-sm text-xs md:text-sm overflow-hidden group interactive mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: EASE_HEAVY }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 group-hover:text-background transition-colors duration-300 font-futuristic tracking-[0.3em]">INITIATE_CONTACT</span>
            <div className="absolute inset-0 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out" />
          </motion.a>

          <motion.div className="flex gap-8 md:gap-10 mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.4 }}>
            <SocialLink icon={<Github size={20} />} label="Github" />
            <SocialLink icon={<Twitter size={20} />} label="Twitter" />
            <SocialLink icon={<Linkedin size={20} />} label="LinkedIn" />
          </motion.div>

          <p className="text-secondary/40 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.4em] px-4">
            // ARYAMAN_V_GUPTA // BUILT_WITH_PRECISION // ©2025
          </p>
        </footer>
      </main>
    </div>
  );
};

// --- Sub Components ---

const RevealTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`overflow-hidden ${className}`}>
    <motion.div initial={{ y: "110%" }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
  </div>
);

const ProjectCard: React.FC<{ project: any; index: number }> = ({ project, index }) => {
  const isEven = index % 2 === 0;
  return (
    <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 1.4, ease: EASE_HEAVY }} className={`flex flex-col md:flex-row gap-12 md:gap-24 items-end ${!isEven ? 'md:flex-row-reverse' : ''} group`}>
      <div className="w-full md:w-3/5 aspect-[16/9] relative overflow-hidden rounded-sm bg-surface/50 border border-white/5 interactive transition-transform duration-700 ease-out group-hover:scale-[1.01]">
        <div className="absolute inset-0 bg-gradient-to-br from-surface to-background opacity-80 z-0" />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-32 h-32 md:w-48 md:h-48 rounded-full blur-[60px] opacity-40 transition-all duration-700 group-hover:scale-125 ${index === 0 ? 'bg-blue-900/60' : index === 1 ? 'bg-emerald-900/60' : index === 2 ? 'bg-purple-900/60' : 'bg-orange-900/60'}`} />
        </div>
        <div className="absolute bottom-6 left-6 z-10"><span className="font-mono text-[10px] uppercase tracking-widest text-white/40 border border-white/10 px-2 py-1 rounded">Archive_Log: {project.year}</span></div>
        <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0"><ArrowUpRight size={32} className="text-white mix-blend-difference" /></div>
      </div>
      <div className="w-full md:w-2/5 flex flex-col justify-end pb-4">
        <span className="text-accent/40 font-mono text-sm uppercase tracking-widest mb-4 block">0{index + 1} — {project.category}</span>
        <ReflectiveText as="h3" className="text-4xl md:text-5xl font-display font-bold mb-6 leading-none">{project.title}</ReflectiveText>
        <p className="text-secondary leading-relaxed mb-8 max-w-md">{project.description}</p>
        <div className="flex flex-wrap gap-3">{project.tech.map((t: string) => <span key={t} className="text-xs font-mono text-secondary/60 bg-white/5 px-2 py-1 rounded-sm border border-white/5">{t}</span>)}</div>
      </div>
    </motion.div>
  );
};

const SocialLink: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <motion.a href="#" className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full border border-white/10 text-secondary relative overflow-hidden group interactive" aria-label={label} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
     <div className="absolute inset-0 bg-accent transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom ease-out" />
     <div className="relative z-10 group-hover:text-background transition-colors duration-300">{icon}</div>
  </motion.a>
);

export default App;