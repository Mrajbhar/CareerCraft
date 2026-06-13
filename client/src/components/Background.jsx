import { useEffect, useMemo, useRef, useState } from "react";

export default function Background() {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const raf = useRef();

  useEffect(() => {
    let x = 0, y = 0;
    const onMove = (e) => {
      x = e.clientX; y = e.clientY;
      if (!raf.current) raf.current = requestAnimationFrame(() => { setPos({ x, y }); raf.current = null; });
    };
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf.current); };
  }, []);

 
  const particles = useMemo(
    () => Array.from({ length: 26 }, () => ({
      left: Math.random() * 100,
      size: 2 + Math.random() * 5,
      delay: Math.random() * 16,
      dur: 14 + Math.random() * 18,
      drift: Math.random() * 60 - 30,
      hue: Math.random() > 0.5 ? "21,99,79" : "198,105,47",
    })),
    []
  );

  return (
    <div className="no-print fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <style>{`
        @keyframes auroraA{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(8vw,-6vh) scale(1.15)}66%{transform:translate(-6vw,5vh) scale(.95)}}
        @keyframes auroraB{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-7vw,6vh) scale(1.1)}66%{transform:translate(6vw,-5vh) scale(1.05)}}
        @keyframes auroraC{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(5vw,7vh) scale(1.2)}}
        @keyframes rise{0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:.7}90%{opacity:.5}100%{transform:translateY(-112vh) translateX(var(--dx));opacity:0}}
        @keyframes hueShift{0%,100%{filter:hue-rotate(0deg)}50%{filter:hue-rotate(18deg)}}
      `}</style>

      {/* base wash */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% -10%, rgba(24,168,132,.12), transparent 60%)" }} />

      {/* aurora mesh */}
      <div className="absolute inset-0" style={{ animation: "hueShift 24s ease-in-out infinite" }}>
        <div className="absolute -top-40 -left-32 w-[46rem] h-[46rem] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(21,99,79,.30), transparent 62%)", filter: "blur(70px)", animation: "auroraA 26s ease-in-out infinite" }} />
        <div className="absolute top-1/4 -right-40 w-[44rem] h-[44rem] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(198,105,47,.24), transparent 62%)", filter: "blur(80px)", animation: "auroraB 30s ease-in-out infinite" }} />
        <div className="absolute -bottom-48 left-1/4 w-[42rem] h-[42rem] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(47,93,140,.24), transparent 62%)", filter: "blur(80px)", animation: "auroraC 34s ease-in-out infinite" }} />
        <div className="absolute top-1/3 left-1/3 w-[30rem] h-[30rem] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,.15), transparent 62%)", filter: "blur(70px)", animation: "auroraA 38s ease-in-out infinite reverse" }} />
      </div>

      
      <div className="absolute inset-0" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        maskImage: "radial-gradient(ellipse at center, #000 20%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, #000 20%, transparent 80%)",
      }} />

      {/* floating particles */}
      {particles.map((p, i) => (
        <span key={i} className="absolute bottom-[-10px] rounded-full"
          style={{
            left: `${p.left}%`, width: p.size, height: p.size,
            background: `rgba(${p.hue},.5)`,
            "--dx": `${p.drift}px`,
            animation: `rise ${p.dur}s linear ${p.delay}s infinite`,
          }} />
      ))}

      {/* cursor glow */}
      <div className="absolute w-[36rem] h-[36rem] rounded-full"
        style={{
          left: pos.x, top: pos.y, transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle, rgba(21,99,79,.16), transparent 60%)",
          filter: "blur(40px)", transition: "left .2s ease-out, top .2s ease-out",
        }} />
    </div>
  );
}