'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { 
  Code, Globe, Layers, Cpu, Terminal, Mail, 
  Github, Linkedin, Instagram, ArrowRight,
  MoveRight, Maximize2, Minimize2,
  ArrowUpRight,
  Box,
  LayoutTemplate
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* 1. GLOBAL STYLES (Azure Theme)                                             */
/* -------------------------------------------------------------------------- */

const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --bg-deep: #000510;
      --text-main: #e0f2fe;
      --accent-cyan: #06b6d4;
      --accent-glow: rgba(6, 182, 212, 0.4);
    }

    html, body, *, a, button {
      cursor: none !important;
    }

    body {
      background-color: var(--bg-deep);
      color: var(--text-main);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow-x: hidden;
      margin: 0;
    }

    ::selection {
      background: var(--accent-cyan);
      color: #000;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #000205; }
    ::-webkit-scrollbar-thumb { background: #0e7490; border-radius: 2px; }

    .glass-card {
      background: rgba(6, 182, 212, 0.03);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(6, 182, 212, 0.1);
      box-shadow: 0 0 30px rgba(6, 182, 212, 0.05);
    }
  `}</style>
);

/* -------------------------------------------------------------------------- */
/* 2. CUSTOM CURSOR (Glowing Orb)                                             */
/* -------------------------------------------------------------------------- */

const AzureCursor = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [hovered, setHovered] = useState(false);

  const springConfig = { damping: 25, stiffness: 400 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      const target = e.target as HTMLElement;
      setHovered(!!target.closest('a') || !!target.closest('button') || !!target.closest('.interactive'));
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Light Trail */}
      <motion.div
        className="fixed top-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none z-0"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
      />
      {/* Core Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-cyan-400 rounded-full pointer-events-none z-[9999] mix-blend-screen shadow-[0_0_20px_#06b6d4]"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: hovered ? 3 : 1 }}
      />
      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-cyan-500/30 rounded-full pointer-events-none z-[9998]"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
        animate={{ 
          scale: hovered ? 1.5 : 1,
          opacity: hovered ? 0.8 : 0.3
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. 3D SCENE: WARP SPEED TUNNEL                                             */
/* -------------------------------------------------------------------------- */

const WarpScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000510, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // --- STARS ---
    const starCount = 6000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const velocities = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4000; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4000; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4000; // z
      velocities[i] = Math.random() * 2 + 0.5; // individual speed
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));

    const material = new THREE.PointsMaterial({
      color: 0x22d3ee, // Cyan
      size: 2,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    const starField = new THREE.Points(geometry, material);
    scene.add(starField);

    // --- INTERACTION ---
    let mouseX = 0;
    let mouseY = 0;
    const handleMouse = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.5;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.5;
    };
    window.addEventListener('mousemove', handleMouse);

    // --- ANIMATION ---
    const animate = () => {
      requestAnimationFrame(animate);

      const positions = geometry.attributes.position.array as Float32Array;

      // Move stars towards camera
      for (let i = 0; i < starCount; i++) {
        // Z movement
        positions[i * 3 + 2] += 5; // Speed

        // Reset if passed camera
        if (positions[i * 3 + 2] > 1000) {
          positions[i * 3 + 2] = -3000;
          positions[i * 3] = (Math.random() - 0.5) * 4000;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 4000;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      // Camera parallax
      camera.position.x += (mouseX * 0.1 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.1 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 1500); // Look ahead

      // Slight rotation of the tunnel
      starField.rotation.z += 0.0005;

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
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 opacity-70" />;
};

/* -------------------------------------------------------------------------- */
/* 4. UI COMPONENTS                                                           */
/* -------------------------------------------------------------------------- */

const NavBar = () => (
  <nav className="fixed top-0 w-full z-50 p-8 flex justify-between items-center mix-blend-difference text-white pointer-events-none">
    <div className="pointer-events-auto flex items-center gap-3">
      {/* Profile Image Container - NOW INTERACTIVE */}
      <motion.div 
        className="w-10 h-10 border border-cyan-500 rounded-full flex items-center justify-center overflow-hidden cursor-none relative z-50 bg-black"
        whileHover={{ scale: 3.5, borderColor: '#22d3ee' }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <img 
          src="/profile2.png" 
          alt="Ahmed Elshazli" 
          className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
        />
      </motion.div>
      
      <div className="flex flex-col">
        <span className="text-sm font-bold tracking-wider">AHMED.DEV</span>
        <span className="text-[9px] text-cyan-400 tracking-[0.2em]">FRONTEND ARCHITECT</span>
      </div>
    </div>
    
    <div className="hidden md:flex gap-8 pointer-events-auto">
      {['Overview', 'Expertise', 'Projects', 'Connect'].map((item, i) => (
        <a key={i} href={`#${item.toLowerCase()}`} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-cyan-400 transition-colors relative group">
          {item}
          <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-cyan-400 group-hover:w-full transition-all duration-300" />
        </a>
      ))}
    </div>
  </nav>
);

const ProjectCard = ({ title, type, desc, tags }: any) => (
  <div className="glass-card p-8 rounded-2xl group interactive hover:-translate-y-2 transition-transform duration-500">
    <div className="flex justify-between items-start mb-8">
      <div className="p-3 bg-cyan-900/20 rounded-xl text-cyan-400">
        <Globe size={24} />
      </div>
      <ArrowUpRight className="text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
    </div>
    
    <h3 className="text-3xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed mb-8 border-l border-cyan-500/20 pl-4">{desc}</p>
    
    <div className="flex flex-wrap gap-2 mt-auto">
      {tags.map((tag: string) => (
        <span key={tag} className="text-[10px] font-mono text-cyan-200 bg-cyan-900/10 px-3 py-1 rounded-full border border-cyan-500/10">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const SkillItem = ({ label, items }: { label: string, items: string[] }) => (
  <div className="border-b border-white/10 py-6 hover:bg-white/5 transition-colors px-4 group interactive">
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <h4 className="text-lg font-bold text-gray-300 group-hover:text-white flex items-center gap-3">
        <span className="w-2 h-2 bg-cyan-500 rounded-full scale-0 group-hover:scale-100 transition-transform"></span>
        {label}
      </h4>
      <div className="flex flex-wrap gap-4 text-sm font-mono text-cyan-400/60 group-hover:text-cyan-400 transition-colors">
        {items.map(i => <span key={i}>/{i}</span>)}
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* MAIN PAGE CONTENT                                                          */
/* -------------------------------------------------------------------------- */

export default function AzurePortfolio() {
  const projects = [
    {
      title: "Neon Finance",
      type: "Fintech",
      desc: "High-frequency trading dashboard with real-time WebSockets and WebGL charting.",
      tags: ["React", "WebGL", "Socket.io"]
    },
    {
      title: "Aero Space",
      type: "E-Commerce",
      desc: "3D product configurator for drones with physics-based rendering in browser.",
      tags: ["Three.js", "R3F", "Next.js"]
    },
    {
      title: "Zenith AI",
      type: "SaaS",
      desc: "Predictive analytics platform handling massive datasets with sleek dark UI.",
      tags: ["Python", "TypeScript", "AI"]
    }
  ];

  return (
    <main className="relative min-h-screen text-white overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      <GlobalStyles />
      <AzureCursor />
      <WarpScene />
      <NavBar />

      <div className="relative z-10 px-6 md:px-12 max-w-[1400px] mx-auto pt-32 pb-20">
        
        {/* HERO */}
        <section id="overview" className="min-h-[85vh] flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
              <span className="text-xs font-mono text-cyan-400 tracking-[0.2em] uppercase">System Online</span>
            </div>

            <h1 className="text-6xl md:text-[8vw] font-bold leading-[0.9] tracking-tighter mb-10">
              <span className="block text-gray-400">ENGINEERING</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-100">
                THE DIGITAL VOID.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed mb-12 border-l-2 border-cyan-500/30 pl-6">
              I am <span className="text-white font-bold">Ahmed Elshazli</span>. A Computer Engineer specializing in modern frontend architectures and high-performance applications.
              <br/><span className="text-cyan-400 text-sm font-mono mt-2 block">// Software Engineer & UI Specialist</span>
            </p>

            <div className="flex gap-6">
              <a href="#projects" className="interactive px-8 py-4 bg-cyan-500 text-black font-bold text-sm uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2">
                View Work <MoveRight size={16} />
              </a>
              <a href="#contact" className="interactive px-8 py-4 border border-cyan-500/30 text-cyan-400 font-bold text-sm uppercase tracking-widest hover:bg-cyan-500/10 transition-colors">
                Contact Me
              </a>
            </div>
          </motion.div>
        </section>

        {/* EXPERTISE */}
        <section id="expertise" className="py-32">
          <div className="flex items-end justify-between mb-16 border-b border-cyan-500/20 pb-6">
             <h2 className="text-4xl font-bold">Technical Arsenal</h2>
             <span className="font-mono text-xs text-cyan-500/60 hidden md:block">/// STACK_V2.0</span>
          </div>
          
          <div className="flex flex-col">
            <SkillItem label="Frontend Core" items={['React 18', 'Next.js 15', 'TypeScript', 'Tailwind CSS']} />
            <SkillItem label="Visual Engineering" items={['Three.js', 'React Three Fiber', 'Framer Motion', 'WebGL']} />
            <SkillItem label="System Architecture" items={['Micro-frontends', 'State Management', 'Serverless', 'Redis']} />
            <SkillItem label="Engineering & Quality" items={['Data Structures', 'Algorithms', 'Testing (Jest)', 'Clean Code']} />
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="py-32">
          <div className="flex items-end justify-between mb-16 border-b border-cyan-500/20 pb-6">
             <h2 className="text-4xl font-bold">Selected Deployments</h2>
             <span className="font-mono text-xs text-cyan-500/60 hidden md:block">/// 2023 — 2025</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <ProjectCard key={i} {...p} />
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-32 flex flex-col items-center text-center">
          <div className="w-px h-24 bg-gradient-to-b from-transparent to-cyan-500 mb-8" />
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 text-white">
            READY TO <br/>
            <span className="text-cyan-400">SCALE UP?</span>
          </h2>
          <a 
            href="mailto:hello@ahmed.dev" 
            className="interactive group relative inline-flex items-center justify-center px-12 py-5 font-bold text-white transition-all duration-200 bg-transparent border border-cyan-500 hover:bg-cyan-500 hover:text-black"
          >
            <span className="relative flex items-center gap-3 uppercase tracking-[0.2em] text-sm">
              <Mail size={16} /> Establish Connection
            </span>
          </a>

          <div className="mt-24 flex gap-12">
            <a href="#" className="interactive text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Github</a>
            <a href="#" className="interactive text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="interactive text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Instagram</a>
          </div>
          <p className="mt-12 text-xs font-mono text-cyan-900">© 2025 Ahmed Elshazli</p>
        </section>

      </div>
    </main>
  );
}