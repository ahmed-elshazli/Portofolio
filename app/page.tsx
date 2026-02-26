'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, useScroll, useTransform, AnimatePresence, useMotionTemplate } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft,
  Github, 
  Linkedin, 
  Mail,
  Command,
  Cpu,
  Layers,
  Globe,
  Terminal,
  Zap,
  Download
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* 0. CONFIGURATION & DATA (EASY TO EDIT)                                     */
/* -------------------------------------------------------------------------- */

const CONFIG = {
  // 📧 ضع الإيميل الخاص بك هنا
  email: "hello@ahmed.dev",
  
  // 📄 ضع مسار ملف السيرة الذاتية هنا (يجب أن يكون الملف داخل مجلد public)
  cvLink: "/Awesome_CV .pdf",
  
  // 🔗 روابط السوشيال ميديا
  socials: [
    { name: "Github", url: "https://github.com/ahmed-elshazli" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/ahmed-elshazly-3a3427305?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" }
  ],

  // 🚀 مصفوفة المشاريع (يمكنك الإضافة أو التعديل بسهولة)
  projects: [
    {
  link: "https://location-real-estate.netlify.app/", 
  image: "/Location.png", 
  tags: ["React", "Zustand", "Recharts", "Tailwind CSS"], // ضفت لك ريتشارتس وزوستاند لأنهم أساس الداشبورد
  en: { 
    title: "Location ERP", 
    category: "ENTERPRISE REAL ESTATE SYSTEM", 
    desc: "A bespoke internal management system tailored for real estate operations. Features automated lead tracking, full property inventory management, and advanced financial analytics with interactive data reporting.", 
    year: "2025" 
  },
  ar: { 
    title: "لوكيشن (Location)", 
    category: "نظام إدارة مؤسسي", 
    desc: "نظام إداري متكامل مصمم خصيصاً لشركات العقارات. يوفر أدوات تتبع العملاء، إدارة شاملة للمخزون العقاري، وتحليلات مالية متقدمة من خلال تقارير تفاعلية ذكية لتسهيل اتخاذ القرار.", 
    year: "٢٠٢٥" 
  }
},
    {
  link: "https://rowaa.netlify.app/", 
  image: "/Rowaa.png", 
  tags: ["React", "Tailwind", "WebRTC", "OpenAI API"], // ضفنا WebRTC للميتنجز و OpenAI للـ AI
  en: { 
    title: "Rawaa Platform", 
    category: "UNIFIED UNIVERSITY ECOSYSTEM", 
    desc: "A high-performance all-in-one university management system. Integrating financial/admin ERP with an AI-driven LMS, featuring real-time virtual classrooms and intelligent student tracking for a holistic educational experience.", 
    year: "2026" 
  },
  ar: { 
    title: "منصة رواء (Rawaa)", 
    category: "منظومة جامعية شاملة", 
    desc: "منصة رقمية موحدة لإدارة الجامعات مالياً وإدارياً. تجمع بين نظام الـ ERP المتطور وبيئة تعلم ذكية مدمجة بالذكاء الاصطناعي، مع دعم كامل للفصول الافتراضية والاجتماعات اللحظية لتغطية كافة جوانب العملية التعليمية.", 
    year: "٢٠٢٦" 
  }
},
    {
      link: "https://zenith-core.example.com", // رابط المشروع الثالث
      image: "/profile.jpg",
      tags: ["TypeScript", "Micro-frontends", "UI/UX"],
      en: { 
        title: "Zenith Core", 
        category: "AI ANALYTICS", 
        desc: "Predictive AI dashboard handling millions of data points flawlessly with highly scalable micro-frontend architecture.", 
        year: "2023" 
      },
      ar: { 
        title: "نواة زينيث", 
        category: "تحليلات الذكاء الاصطناعي", 
        desc: "لوحة تحكم ذكية تعالج ملايين نقاط البيانات بسلاسة تامة، مبنية على معمارية واجهات أمامية مصغرة (Micro-frontends) قابلة للتوسع.", 
        year: "٢٠٢٣" 
      }
    }
  ]
};

/* -------------------------------------------------------------------------- */
/* 1. DICTIONARY & TRANSLATIONS (The Ultimate Tone)                           */
/* -------------------------------------------------------------------------- */

const content = {
  en: {
    nav: { role: "SOFTWARE ENGINEER", lang: "العربية", available: "AVAILABLE FOR WORK" },
    hero: {
      tag: "AHMED ELSHAZLI",
      title1: "Engineering",
      title2: "The Absolute.",
      bio: "Frontend Architect & Computer Engineer. I construct digital ecosystems where extreme performance meets flawless architectural design. No compromises."
    },
    expertise: {
      title: "Core Infrastructure",
      items: [
        { id: "01", title: "Frontend Architecture", desc: "Building massive, scalable Single Page Applications and Micro-frontends with perfect state management.", tags: ["React", "Next.js", "Zustand"] },
        { id: "02", title: "System Engineering", desc: "Writing code that survives. Backed by rigorous algorithms, strict typing, and SOLID principles.", tags: ["TypeScript", "Algorithms", "System Design"] },
        { id: "03", title: "Visual & WebGL", desc: "Bridging logic and art. Creating 60fps cinematic experiences directly in the browser runtime.", tags: ["Three.js", "Framer Motion", "WebGL"] },
        { id: "04", title: "Network Ops", desc: "Understanding the full pipeline from packet to pixel. CCNA certified network specialist.", tags: ["CCNA", "CI/CD", "WebSockets"] }
      ]
    },
    work: {
      title: "Selected Shipments"
    },
    contact: {
      title: "Ready to scale?",
      bio: "Currently accepting roles that demand architectural excellence and visionary engineering.",
      btn: "Initialize Contact",
      footer: "© 2026 AHMED ELSHAZLI. ALL SYSTEMS NOMINAL."
    }
  },
  ar: {
    nav: { role: "مهندس برمجيات", lang: "ENGLISH", available: "متاح للعمل" },
    hero: {
      tag: "أحمد الشاذلي",
      title1: "هندسة",
      title2: "القمة المطلقة.",
      bio: "معمار واجهات أمامية ومهندس كمبيوتر. أبني أنظمة رقمية تلتقي فيها قوة الأداء الجبارة مع التصميم المعماري الخالي من العيوب. بدون أي تنازلات."
    },
    expertise: {
      title: "البنية التحتية",
      items: [
        { id: "01", title: "معمارية الواجهات", desc: "بناء تطبيقات ضخمة قابلة للتوسع (Micro-frontends) مع إدارة حالة (State) مثالية.", tags: ["React", "Next.js", "Zustand"] },
        { id: "02", title: "هندسة الأنظمة", desc: "كتابة كود يعيش طويلاً، مدعوم بخوارزميات دقيقة، أنواع صارمة، ومبادئ SOLID.", tags: ["TypeScript", "Algorithms", "System Design"] },
        { id: "03", title: "الرسوميات والتفاعل", desc: "سد الفجوة بين المنطق والفن. برمجة تجارب سينمائية بسرعة 60 إطار/ثانية داخل المتصفح.", tags: ["Three.js", "Framer Motion", "WebGL"] },
        { id: "04", title: "عمليات الشبكات", desc: "فهم الرحلة الكاملة للبيانات. مهندس شبكات معتمد (CCNA).", tags: ["CCNA", "CI/CD", "WebSockets"] }
      ]
    },
    work: {
      title: "الإصدارات المختارة"
    },
    contact: {
      title: "مستعد للتوسع؟",
      bio: "أستقبل حالياً العروض للأدوار التي تتطلب تميزاً معمارياً وهندسة ذات رؤية مستقبلية.",
      btn: "بدء الاتصال",
      footer: "© ٢٠٢٦ أحمد الشاذلي. جميع الأنظمة تعمل بكفاءة."
    }
  }
};

/* -------------------------------------------------------------------------- */
/* 2. GLOBAL STYLES (The Ultimate Tech Theme)                                 */
/* -------------------------------------------------------------------------- */

const GlobalStyles = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');

    :root {
      --bg-absolute: #000000;
      --text-absolute: #ffffff;
      --text-muted: #a1a1aa;
      --accent-glow: #ffffff;
      --border-subtle: rgba(255, 255, 255, 0.1);
    }

    html, body, *, a, button {
      cursor: none !important;
      scroll-behavior: smooth;
    }

    body {
      background-color: var(--bg-absolute);
      color: var(--text-absolute);
      overflow-x: hidden;
      margin: 0;
      transition: direction 0.5s ease;
    }

    .font-en { font-family: 'Inter', sans-serif; }
    .font-ar { font-family: 'Cairo', sans-serif; }
    .font-mono-tech { font-family: 'JetBrains Mono', monospace; }

    ::selection {
      background: rgba(255,255,255,0.9);
      color: #000;
    }

    ::-webkit-scrollbar { width: 0px; }

    /* Ultra-fine mesh background */
    .bg-mesh-ultimate {
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      background-image: 
        radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
      background-size: 32px 32px;
      mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
      -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
    }

    /* Vercel-like gradient text */
    .text-gradient-premium {
      background: linear-gradient(180deg, #ffffff 0%, #71717a 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Ambient Spotlight Background */
    .ambient-spotlight {
      position: fixed;
      top: 0; left: 50%; transform: translateX(-50%);
      width: 100vw; height: 500px;
      background: radial-gradient(ellipse at top, rgba(255,255,255,0.08) 0%, transparent 70%);
      pointer-events: none; z-index: -1;
    }
  `}</style>
);

/* -------------------------------------------------------------------------- */
/* 3. MAGNETIC INVERT CURSOR                                                  */
/* -------------------------------------------------------------------------- */

const AbsoluteCursor = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [hoverState, setHoverState] = useState<'default' | 'interactive'>('default');

  const springConfig = { damping: 25, stiffness: 600, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const move = (e: globalThis.MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      const target = e.target as HTMLElement;
      
      if (target.closest('a') || target.closest('button') || target.closest('.interactive')) {
        setHoverState('interactive');
      } else {
        setHoverState('default');
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 bg-white rounded-full pointer-events-none mix-blend-difference z-[9999]"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
        animate={{ 
          width: hoverState === 'interactive' ? 60 : 16,
          height: hoverState === 'interactive' ? 60 : 16,
        }}
      />
    </>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. SPOTLIGHT BENTO CARD (Vercel Style)                                     */
/* -------------------------------------------------------------------------- */

const SpotlightCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative border border-white/10 bg-[#050505] rounded-3xl overflow-hidden interactive transition-colors hover:bg-white/[0.02] ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              500px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.08),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-10 h-full w-full p-8 md:p-10 flex flex-col">
        {children}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. PREMIUM PROJECT CARD                                                    */
/* -------------------------------------------------------------------------- */

const PremiumProjectCard = ({ project, langData, isAr }: any) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLAnchorElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <a 
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      className="group relative block mb-8 last:mb-0 border border-white/10 bg-[#050505] rounded-[2.5rem] overflow-hidden interactive"
    >
      {/* Spotlight Hover Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              800px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.06),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-16 items-center">
        
        {/* Project Info Side */}
        <div className={`flex-1 flex flex-col w-full ${isAr ? 'md:order-2 text-right' : 'md:order-1 text-left'}`}>
          <div className={`flex items-center gap-4 mb-6 ${isAr ? 'justify-end' : 'justify-start'}`}>
            <span className="font-mono-tech text-xs font-bold text-white border border-white/20 bg-white/5 px-4 py-1.5 rounded-full backdrop-blur-md">
              {langData.year}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-mono-tech">
              {langData.category}
            </span>
          </div>

          <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-500 transition-all duration-500">
            {langData.title}
          </h3>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
            {langData.desc}
          </p>

          <div className={`flex flex-wrap gap-2 mt-auto ${isAr ? 'justify-end' : 'justify-start'}`} dir="ltr">
            {project.tags.map((tag: string) => (
               <span key={tag} className="text-[10px] font-mono-tech border border-white/10 px-3 py-1.5 rounded-full text-gray-300 uppercase tracking-wider bg-white/5 backdrop-blur-md">
                 {tag}
               </span>
            ))}
          </div>
        </div>

        {/* Project Image Side */}
        <div className={`w-full md:w-5/12 h-[250px] md:h-[350px] rounded-3xl overflow-hidden relative border border-white/10 shrink-0 bg-[#0a0a0a] ${isAr ? 'md:order-1' : 'md:order-2'}`}>
           <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none" />
           <img 
             src={project.image}
             alt={langData.title}
             className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
             onError={(e) => { e.currentTarget.style.display = 'none'; }}
           />
           <div className="absolute top-4 right-4 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 text-white group-hover:bg-white group-hover:text-black transition-all duration-500 z-20">
              {isAr ? <ArrowDownLeft size={20} className="rotate-90" /> : <ArrowUpRight size={20} />}
           </div>
        </div>

      </div>
    </a>
  );
};

/* -------------------------------------------------------------------------- */
/* 6. MAIN APPLICATION COMPONENT                                              */
/* -------------------------------------------------------------------------- */

export default function TheAbsoluteZenith() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const t = content[lang];
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  
  const fontClass = isAr ? 'font-ar' : 'font-en';

  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scaleProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <main className={`relative min-h-screen text-[var(--text-absolute)] ${fontClass}`} dir={dir}>
      <GlobalStyles />
      <div className="bg-mesh-ultimate" />
      <div className="ambient-spotlight" />
      <AbsoluteCursor />

      {/* Progress Line */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-white origin-left z-[100]" style={{ scaleX: scaleProgress }} />

      {/* ---------------- TOP NAV ---------------- */}
      <header className="fixed top-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center mix-blend-difference pointer-events-none">
        <div className="flex flex-col gap-1 pointer-events-auto interactive group">
          <div className="flex items-center gap-2">
            <Command size={16} className="text-white" />
            <span className="font-bold tracking-widest text-sm uppercase">AHMED.DEV</span>
          </div>
        </div>

        <div className="flex items-center gap-6 pointer-events-auto">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-white/20">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-mono-tech text-gray-300 uppercase tracking-widest">{t.nav.available}</span>
          </div>
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="interactive text-xs font-bold uppercase tracking-widest hover:opacity-50 transition-opacity"
          >
            {t.nav.lang}
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 pt-32 pb-20">

        {/* ---------------- HERO SECTION ---------------- */}
        <section id="hero" className="min-h-[85vh] flex flex-col justify-center">
          <motion.div 
            style={{ y: yHero, opacity: opacityHero }}
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-block mb-8 border border-white/20 px-4 py-2 rounded-full font-mono-tech text-[10px] text-gray-400 uppercase tracking-widest bg-white/5">
              // {t.hero.tag}
            </div>

            <h1 className="text-6xl sm:text-8xl md:text-[11vw] font-black uppercase tracking-tighter leading-[0.85] mb-10">
              <span className="block text-white">{t.hero.title1}</span>
              <span className="block text-gradient-premium">{t.hero.title2}</span>
            </h1>

            <p className="text-lg md:text-2xl font-light leading-relaxed text-gray-400 max-w-3xl">
              {t.hero.bio}
            </p>

            <div className="mt-12 flex flex-wrap gap-4">
              <a href="#work" className="interactive inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-transform">
                {isAr ? "اكتشف الأنظمة" : "Discover Systems"}
              </a>
              <a href={CONFIG.cvLink} download target="_blank" rel="noopener noreferrer" className="interactive inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white/10 hover:border-white/40 hover:scale-105 transition-all">
                <Download size={16} />
                {isAr ? "تحميل السيرة الذاتية" : "Download CV"}
              </a>
            </div>
          </motion.div>
        </section>

        {/* ---------------- EXPERTISE SECTION (Spotlight Bento) ---------------- */}
        <section id="expertise" className="py-32 border-t border-white/10">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t.expertise.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[280px]">
            {t.expertise.items.map((item: any, i: number) => (
              <SpotlightCard key={item.id} className={i === 0 || i === 3 ? "md:col-span-2 lg:col-span-2" : ""}>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-gray-300 bg-white/5">
                    {i === 0 ? <Layers size={20} /> : i === 1 ? <Terminal size={20} /> : i === 2 ? <Globe size={20} /> : <Zap size={20} />}
                  </div>
                  <span className="font-mono-tech text-gray-500 text-sm">{item.id}</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-1">{item.desc}</p>
                
                <div className="flex flex-wrap gap-2 mt-auto" dir="ltr">
                  {item.tags.map((tag: string) => (
                    <span key={tag} className="font-mono-tech text-[10px] border border-white/10 px-3 py-1 rounded-full text-gray-300 uppercase tracking-wider bg-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>

        {/* ---------------- WORK SECTION (Premium Split Cards) ---------------- */}
        <section id="work" className="py-32 border-t border-white/10">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t.work.title}</h2>
          </div>

          <div className="flex flex-col">
            {CONFIG.projects.map((proj: any, i: number) => (
               <PremiumProjectCard 
                 key={i} 
                 project={proj} 
                 langData={proj[lang]} 
                 isAr={isAr} 
               />
            ))}
          </div>
        </section>

        {/* ---------------- CONTACT SECTION ---------------- */}
        <section id="contact" className="py-40">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-10 text-black">
              <Mail size={24} />
            </div>
            
            <h2 className="text-5xl md:text-[8vw] font-black uppercase tracking-tighter leading-[0.9] mb-8">
              {t.contact.title}
            </h2>
            
            <p className="text-xl text-gray-400 mb-16 max-w-lg font-light">
              {t.contact.bio}
            </p>

            <a 
              href={`mailto:${CONFIG.email}`} 
              className="interactive inline-flex items-center justify-center px-12 py-5 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-full hover:scale-105 transition-transform"
              dir="ltr"
            >
              {t.contact.btn}
            </a>

            <div className="flex gap-12 mt-32 pt-8 w-full justify-center border-t border-white/10" dir="ltr">
              {CONFIG.socials.map((social, i) => (
                <a 
                  key={i} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="interactive text-sm font-mono-tech uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- FOOTER ---------------- */}
        <footer className="py-8 text-center text-[10px] text-gray-500 uppercase tracking-widest font-mono-tech">
          {t.contact.footer}
        </footer>

      </div>
    </main>
  );
}