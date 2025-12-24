'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { 
  Code, 
  Cpu, 
  Globe, 
  Terminal, 
  Wifi, 
  ArrowUpRight, 
  Github, 
  Linkedin, 
  Mail, 
  Activity,
  Server,
  Zap,
  Box,
  Layers,
  Settings,
  Database
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* 1. GLOBAL STYLES (Industrial Theme)                                        */
/* -------------------------------------------------------------------------- */

const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --bg-core: #0a0a0a;
      --text-main: #e5e5e5;
      --accent-amber: #ffae00; /* Industrial Amber */
      --grid-line: rgba(255, 174, 0, 0.15);
    }

    /* FORCE HIDE CURSOR */
    html, body, *, a, button, input {
      cursor: none !important;
    }

    body {
      background-color: var(--bg-core);
      color: var(--text-main);
      font-family: 'JetBrains Mono', monospace; /* Monospace for technical feel */
      overflow-x: hidden;
      background-image: 
        linear-gradient(var(--grid-line) 1px, transparent 1px),
        linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
      background-size: 40px 40px;
      background-position: center top;
    }

    /* Vignette for focus */
    .vignette {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 9997;
      background: radial-gradient(circle, transparent 30%, rgba(10,10,10,0.95) 100%);
    }

    ::selection {
      background: var(--accent-amber);
      color: #000;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #000; }
    ::-webkit-scrollbar-thumb { background: var(--accent-amber); }
  `}</style>
);

/* -------------------------------------------------------------------------- */
/* 2. GLITCH TEXT DECODER                                                     */
/* -------------------------------------------------------------------------- */

const TechText = ({ text, className, speed = 40 }: { text: string, className?: string, speed?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_[]#";

  useEffect(() => {
    let iteration = 0;
    let interval: NodeJS.Timeout;

    const startDecoding = () => {
      interval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 1 / 2; 
      }, speed);
    };

    const timeout = setTimeout(startDecoding, 200);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [text, speed]);

  return <span className={className}>{displayText}</span>;
};

/* -------------------------------------------------------------------------- */
/* 3. ENGINEERING CURSOR (Square Reticle)                                     */
/* -------------------------------------------------------------------------- */

const EngineeringCursor = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [hovered, setHovered] = useState(false);
  
  const springConfig = { damping: 25, stiffness: 500 }; // Tighter spring
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      const target = e.target as HTMLElement;
      setHovered(!!target.closest('a') || !!target.closest('button'));
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Center Cross */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
      >
        <div className="relative flex items-center justify-center">
          <div className="w-[1px] h-4 bg-[#ffae00] absolute" />
          <div className="w-4 h-[1px] bg-[#ffae00] absolute" />
        </div>
      </motion.div>

      {/* Outer Bracket Box */}
      <motion.div
        className="fixed top-0 left-0 border border-[#ffae00] pointer-events-none z-[9998]"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
        animate={{ 
          width: hovered ? 60 : 30,
          height: hovered ? 60 : 30,
          opacity: hovered ? 1 : 0.5,
          rotate: hovered ? 45 : 0
        }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Data Label */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] ml-8 mt-8"
        style={{ x: cursorX, y: cursorY }}
        animate={{ opacity: hovered ? 1 : 0 }}
      >
        <span className="bg-[#ffae00] text-black text-[10px] font-bold px-1">TARGET_LOCKED</span>
      </motion.div>
    </>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. 3D STRUCTURAL SCENE (Wireframe Core)                                    */
/* -------------------------------------------------------------------------- */

const StructuralScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    // No fog for sharp industrial look, or very slight
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 40);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // --- OBJECTS ---
    const group = new THREE.Group();
    scene.add(group);

    // 1. Central Core (Torus Knot)
    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const wireframe = new THREE.WireframeGeometry(geometry);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffae00, transparent: true, opacity: 0.3 });
    const line = new THREE.LineSegments(wireframe, lineMat);
    group.add(line);

    // 2. Inner Solid Core
    const coreGeo = new THREE.IcosahedronGeometry(4, 1);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x222222, wireframe: true });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // 3. Floating Debris
    const debrisCount = 400;
    const debrisGeo = new THREE.BufferGeometry();
    const debrisPos = new Float32Array(debrisCount * 3);
    for(let i=0; i<debrisCount*3; i++) {
      debrisPos[i] = (Math.random() - 0.5) * 100;
    }
    debrisGeo.setAttribute('position', new THREE.BufferAttribute(debrisPos, 3));
    const debrisMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.5 });
    const debris = new THREE.Points(debrisGeo, debrisMat);
    scene.add(debris);

    // --- ANIMATION ---
    let mouseX = 0;
    let mouseY = 0;
    const handleMouse = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
    };
    window.addEventListener('mousemove', handleMouse);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // Mechanical Rotation
      group.rotation.x += 0.002;
      group.rotation.y += 0.005;
      
      core.rotation.x -= 0.01;
      core.rotation.y -= 0.01;

      // Mouse Parallax
      group.rotation.x += mouseY * 0.05;
      group.rotation.y += mouseX * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(animationId);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // FIX: Clean up specifically defined resources
      geometry.dispose();
      wireframe.dispose();
      lineMat.dispose();
      
      coreGeo.dispose();
      coreMat.dispose();
      
      debrisGeo.dispose();
      debrisMat.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 opacity-40 pointer-events-none" />;
};

/* -------------------------------------------------------------------------- */
/* 5. UI: SYSTEM STATUS HUD                                                   */
/* -------------------------------------------------------------------------- */

const SystemHUD = () => {
  return (
    <div className="fixed bottom-8 left-8 z-50 hidden md:flex flex-col gap-1 font-mono text-[10px] text-gray-500 pointer-events-none">
      <div className="flex items-center gap-2 border-l-2 border-[#ffae00] pl-3 bg-black/80 p-2">
        <Activity size={12} className="text-[#ffae00] animate-pulse" />
        <span className="tracking-widest text-[#ffae00]">SYSTEM_DIAGNOSTICS</span>
      </div>
      <div className="pl-3 space-y-1 bg-black/80 p-2 border-l border-white/10">
        <div className="flex justify-between w-32"><span>CORE_TEMP:</span> <span className="text-white">42°C</span></div>
        <div className="flex justify-between w-32"><span>MEMORY:</span> <span className="text-white">16GB</span></div>
        <div className="flex justify-between w-32"><span>UPTIME:</span> <span className="text-white">99.9%</span></div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 6. CONTENT COMPONENTS                                                      */
/* -------------------------------------------------------------------------- */

const SectionWrapper = ({ children, id, className }: { children: React.ReactNode, id?: string, className?: string }) => (
  <motion.section 
    id={id}
    className={`py-32 ${className}`}
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6 }}
  >
    {children}
  </motion.section>
);

const NavBar = () => (
  <nav className="fixed top-0 w-full z-50 p-8 flex justify-between items-center pointer-events-none bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px]">
    <div className="pointer-events-auto flex items-center gap-3">
      <div className="w-8 h-8 bg-[#ffae00] flex items-center justify-center text-black font-black text-xs">AE</div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-white tracking-wider">AHMED.DEV</span>
        <span className="text-[9px] text-[#ffae00] tracking-[0.2em]">ENG_ID: 8492</span>
      </div>
    </div>
    
    <div className="hidden md:flex gap-1 pointer-events-auto">
      {['[ CORE ]', '[ STACK ]', '[ PROTOCOLS ]', '[ LINK ]'].map((item, i) => (
        <a key={i} href={`#${item.replace(/\[|\]|\s/g, '').toLowerCase()}`} className="px-4 py-2 text-[10px] font-bold text-gray-400 hover:text-[#ffae00] hover:bg-white/5 transition-all border border-transparent hover:border-[#ffae00]/30">
          {item}
        </a>
      ))}
    </div>
  </nav>
);

const ProjectRow = ({ index, title, type, desc, tags }: any) => (
  <div className="group border-b border-white/10 hover:border-[#ffae00] transition-colors duration-300 py-12 relative cursor-none bg-black/20 hover:bg-white/[0.02]">
    {/* Hover Indicator */}
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ffae00] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom" />
    
    <div className="px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="flex items-start gap-6">
        <span className="font-mono text-xs text-[#ffae00] mt-2">0{index}</span>
        <div>
          <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white group-hover:translate-x-2 transition-transform duration-300">
            {title}
          </h3>
          <p className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-widest">
            // {type}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-4">
        <p className="text-sm text-gray-400 max-w-sm text-right leading-relaxed hidden md:block">
          {desc}
        </p>
        <div className="flex gap-2">
          {tags.map((t: string) => (
            <span key={t} className="text-[9px] border border-white/20 px-2 py-1 text-gray-400 uppercase">{t}</span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const TechGridItem = ({ icon: Icon, title, items }: any) => (
  <div className="border border-white/10 p-6 bg-black/40 hover:bg-[#ffae00]/5 hover:border-[#ffae00] transition-all group">
    <div className="flex justify-between items-start mb-6">
      <Icon className="text-gray-600 group-hover:text-[#ffae00] transition-colors" size={24} />
      <span className="text-[9px] text-gray-600 font-mono">SYS_MOD</span>
    </div>
    <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{title}</h4>
    <div className="space-y-2">
      {items.map((item: string) => (
        <div key={item} className="flex items-center gap-2 text-xs text-gray-400 font-mono">
          <div className="w-1 h-1 bg-[#ffae00] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          {item}
        </div>
      ))}
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* MAIN PAGE APP                                                              */
/* -------------------------------------------------------------------------- */

export default function IndustrialPortfolio() {
  return (
    <div className="relative min-h-screen text-white overflow-x-hidden selection:bg-[#ffae00] selection:text-black">
      <GlobalStyles />
      <div className="vignette" />
      <EngineeringCursor />
      <StructuralScene />
      <NavBar />
      <SystemHUD />

      <main className="relative z-10 px-6 md:px-12 max-w-[1400px] mx-auto pt-32 pb-20">
        
        {/* HERO SECTION */}
        <section id="core" className="min-h-[70vh] flex flex-col justify-center border-l border-white/10 pl-8 ml-4 md:ml-0">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#ffae00] text-[#ffae00] text-[10px] font-bold tracking-widest uppercase mb-6 bg-[#ffae00]/10">
              <span className="w-2 h-2 bg-[#ffae00] animate-pulse" />
              Status: Operational
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter mb-8">
              <TechText text="SYSTEM" className="block text-white" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-white block">
                ARCHITECT.
              </span>
            </h1>
            
            <p className="text-lg text-gray-400 max-w-xl leading-relaxed mb-10 font-mono">
              Ahmed Elshazli. Engineering high-performance digital infrastructures. <span className="text-[#ffae00]">CCNA Certified</span> Network Specialist & Frontend Developer.
            </p>

            <div className="flex gap-4">
              <a href="#protocols" className="bg-[#ffae00] text-black px-8 py-4 font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2">
                Init_Sequence <ArrowUpRight size={14} />
              </a>
              <a href="#stack" className="border border-white/20 text-white px-8 py-4 font-bold text-xs uppercase tracking-widest hover:border-[#ffae00] hover:text-[#ffae00] transition-colors">
                View_Specs
              </a>
            </div>
          </motion.div>
        </section>

        {/* STACK SECTION */}
        <SectionWrapper id="stack">
          <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-4">
            <span className="text-[#ffae00] font-mono text-xs">01</span>
            <h2 className="text-2xl font-bold uppercase tracking-wider">Technical Specifications</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TechGridItem icon={Code} title="Frontend Core" items={['React 18', 'Next.js 15', 'TypeScript', 'Tailwind CSS']} />
            <TechGridItem icon={Layers} title="Visual Eng" items={['Three.js', 'WebGL', 'Framer Motion', 'GSAP']} />
            <TechGridItem icon={Server} title="Architecture" items={['Micro-frontends', 'Zustand', 'Serverless', 'Redis']} />
            <TechGridItem icon={Wifi} title="Network Ops" items={['CCNA', 'DNS Protocol', 'CI/CD Pipelines', 'Docker']} />
          </div>
        </SectionWrapper>

        {/* PROJECTS SECTION */}
        <SectionWrapper id="protocols">
          <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-4 mt-32">
            <span className="text-[#ffae00] font-mono text-xs">02</span>
            <h2 className="text-2xl font-bold uppercase tracking-wider">Executed Protocols</h2>
          </div>

          <div className="flex flex-col border-t border-white/10">
            <ProjectRow 
              index="1" 
              title="Neon Finance" 
              type="FINTECH_DASHBOARD" 
              desc="Real-time trading interface utilizing WebSockets for sub-millisecond data updates and WebGL for rendering complex financial charts."
              tags={['React', 'D3.js', 'Sockets']}
            />
            <ProjectRow 
              index="2" 
              title="Aero Space" 
              type="3D_ECOMMERCE" 
              desc="Interactive 3D configurator for industrial drones. Physics-based rendering engine implemented directly in the browser."
              tags={['Three.js', 'Next.js', 'Stripe']}
            />
            <ProjectRow 
              index="3" 
              title="Zenith AI" 
              type="PREDICTIVE_SAAS" 
              desc="Machine learning dashboard featuring dark-mode industrial aesthetics and heavy data processing capabilities."
              tags={['Python', 'TypeScript', 'AI']}
            />
          </div>
        </SectionWrapper>

        {/* CONNECT SECTION */}
        <SectionWrapper id="link" className="flex flex-col items-center text-center pb-20 mt-20 bg-white/[0.02] border border-white/5 p-12">
          <Terminal size={40} className="text-[#ffae00] mb-6" />
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 text-white">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffae00] to-yellow-200">Scale?</span>
          </h2>
          <p className="text-gray-400 mb-10 max-w-md font-mono text-xs leading-relaxed">
            Available for high-impact technical consulting and full-stack development roles.
          </p>
          
          <a href="mailto:hello@ahmed.dev" className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-black transition-all duration-200 bg-[#ffae00] hover:bg-white">
            <span className="relative flex items-center gap-3 uppercase tracking-widest text-xs">
              <Mail size={14} /> Establish_Link
            </span>
          </a>

          <footer className="mt-20 w-full border-t border-white/10 pt-8 flex justify-between text-[9px] font-mono uppercase text-gray-500">
            <span>© 2025 Ahmed Elshazli</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#ffae00]">Github</a>
              <a href="#" className="hover:text-[#ffae00]">LinkedIn</a>
              <a href="#" className="hover:text-[#ffae00]">Twitter</a>
            </div>
          </footer>
        </SectionWrapper>

      </main>
    </div>
  );
}