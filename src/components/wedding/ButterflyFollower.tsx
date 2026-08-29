import { useEffect, useRef } from "react";

export default function ButterflyFollower() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let tx = cx, ty = cy, px = cx, py = cy;
    let currentAngle = 0;
    let raf = 0;
    
    // Smoothness factors
    const POS_LERP = 0.04;
    const ROT_LERP = 0.08;

    const onMove = (e: MouseEvent) => { 
      tx = e.clientX; 
      ty = e.clientY; 
    };

    const tick = () => {
      const dxTarget = tx - cx;
      const dyTarget = ty - cy;
      const distToTarget = Math.sqrt(dxTarget * dxTarget + dyTarget * dyTarget);

      // Lerp position
      cx += dxTarget * POS_LERP;
      cy += dyTarget * POS_LERP;
      
      const dx = cx - px;
      const dy = cy - py;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Always point head towards the mouse pointer
      if (distToTarget > 1) {
        // +90 because the SVG is drawn pointing UP (head at top)
        const targetAngle = Math.atan2(dyTarget, dxTarget) * (180 / Math.PI) + 90;
        let diff = targetAngle - currentAngle;
        // Normalize angle difference to -180...180 for shortest path rotation
        diff = ((diff + 180) % 360 + 360) % 360 - 180;
        currentAngle += diff * ROT_LERP;
      }

      // Small stretch effect based on speed for a dynamic feel
      const sy = 1 + Math.min(speed * 0.002, 0.05);
      const sx = 1 - Math.min(speed * 0.001, 0.03);

      el.style.transform = `translate(${cx}px,${cy}px) rotate(${currentAngle}deg) scaleX(${sx}) scaleY(${sy})`;
      
      px = cx; 
      py = cy;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { 
      window.removeEventListener("mousemove", onMove); 
      cancelAnimationFrame(raf); 
    };
  }, []);

  const wingProps = {
    fill: "rgba(255, 120, 140, 0.5)", // semi-transparent pink
    stroke: "#e63946", // strong red
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };

  return (
    <div ref={wrapRef} style={{ position:"fixed", top:0, left:0, width:0, height:0, pointerEvents:"none", zIndex:9999, willChange:"transform" }}>
      <div style={{ position:"absolute", transform:"translate(-20px,-20px)", width:40, height:40 }}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", overflow:"visible",
            filter:"drop-shadow(0 2px 4px rgba(230, 57, 70, 0.3))" }}>
          <defs>
            <style>{`
              .wing-left {
                transform-origin: 50px 50px;
                animation: bfFlapL 1.2s ease-in-out infinite alternate;
              }
              .wing-right {
                transform-origin: 50px 50px;
                animation: bfFlapR 1.2s ease-in-out infinite alternate;
              }
              @keyframes bfFlapL {
                0%   { transform: scaleX(1) rotate(0deg); }
                100% { transform: scaleX(0.6) rotate(-5deg); }
              }
              @keyframes bfFlapR {
                0%   { transform: scaleX(1) rotate(0deg); }
                100% { transform: scaleX(0.6) rotate(5deg); }
              }
              .bf-body-float {
                animation: bfFloat 3s ease-in-out infinite alternate;
              }
              @keyframes bfFloat {
                0%   { transform: translateY(0px); }
                100% { transform: translateY(-4px); }
              }
            `}</style>
          </defs>

          <g className="bf-body-float">
            {/* Left Wings */}
            <g className="wing-left">
              {/* Main wing paths */}
              <path d="M 50 45 C 30 20, 10 10, 5 35 C 0 55, 30 60, 50 55 Z" {...wingProps} />
              {/* Doodle inner offset details */}
              <path d="M 48 47 C 32 24, 14 14, 8 37 C 3 55, 28 62, 48 57 Z" fill="none" stroke="#ff758f" strokeWidth="1" strokeDasharray="3 3" />
              
              <path d="M 50 55 C 35 60, 15 75, 25 90 C 35 100, 45 80, 50 65 Z" {...wingProps} />
              <path d="M 48 57 C 37 62, 19 75, 27 88 C 35 96, 45 82, 48 67 Z" fill="none" stroke="#ff758f" strokeWidth="1" strokeDasharray="3 3" />
            </g>

            {/* Right Wings */}
            <g className="wing-right">
              <path d="M 50 45 C 70 20, 90 10, 95 35 C 100 55, 70 60, 50 55 Z" {...wingProps} />
              <path d="M 52 47 C 68 24, 86 14, 92 37 C 97 55, 72 62, 52 57 Z" fill="none" stroke="#ff758f" strokeWidth="1" strokeDasharray="3 3" />
              
              <path d="M 50 55 C 65 60, 85 75, 75 90 C 65 100, 55 80, 50 65 Z" {...wingProps} />
              <path d="M 52 57 C 63 62, 81 75, 73 88 C 65 96, 55 82, 52 67 Z" fill="none" stroke="#ff758f" strokeWidth="1" strokeDasharray="3 3" />
            </g>

            {/* Body */}
            <g>
              {/* Thorax & Abdomen */}
              <ellipse cx="50" cy="52" rx="3" ry="12" fill="#a41623" />
              <ellipse cx="49" cy="50" rx="1" ry="5" fill="#ff758f" fillOpacity="0.5" />
              {/* Head */}
              <circle cx="50" cy="38" r="3" fill="#a41623" />
              {/* Antennae */}
              <path d="M 49 36 C 45 30, 40 25, 42 22" fill="none" stroke="#a41623" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M 51 36 C 55 30, 60 25, 58 22" fill="none" stroke="#a41623" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
