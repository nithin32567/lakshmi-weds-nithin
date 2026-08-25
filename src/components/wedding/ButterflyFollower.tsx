import { useEffect, useRef } from "react";

export default function ButterflyFollower() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let tx = cx, ty = cy, px = cx, py = cy, raf = 0;
    const LERP = 0.05;
    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    const tick = () => {
      cx += (tx - cx) * LERP;
      cy += (ty - cy) * LERP;
      const dx = cx - px, dy = cy - py;
      const speed = Math.sqrt(dx * dx + dy * dy);
      const angle = (dx || dy) ? Math.atan2(dy, dx) * (180 / Math.PI) : 0;
      const sy = 1 + Math.min(speed * 0.003, 0.1);
      const flip = dx < -0.4 ? -1 : 1;
      el.style.transform = `translate(${cx}px,${cy}px) rotate(${angle * 0.28}deg) scaleX(${flip}) scaleY(${sy})`;
      px = cx; py = cy;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  /* Wing paths — body spine at x=100 */
  const UL = "M100,45 C90,18 62,5 36,12 C14,18 5,38 8,55 C11,70 28,80 50,77 C72,74 92,62 100,45Z";
  const UR = "M100,45 C110,18 138,5 164,12 C186,18 195,38 192,55 C189,70 172,80 150,77 C128,74 108,62 100,45Z";
  const LL = "M100,65 C86,68 55,72 32,88 C14,100 16,118 32,122 C50,126 72,112 86,94 C95,80 100,68 100,65Z";
  const LR = "M100,65 C114,68 145,72 168,88 C186,100 184,118 168,122 C150,126 128,112 114,94 C105,80 100,68 100,65Z";

  return (
    <div ref={wrapRef} style={{ position:"fixed", top:0, left:0, width:0, height:0, pointerEvents:"none", zIndex:9999, willChange:"transform" }}>
      <div style={{ position:"absolute", transform:"translate(-46px,-36px)", width:92, height:72 }}>
        <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", overflow:"visible",
            filter:"drop-shadow(0 0 8px rgba(255,200,0,0.7)) drop-shadow(0 0 20px rgba(255,140,0,0.35))" }}>
          <defs>
            <radialGradient id="bul" cx="35%" cy="35%" r="65%">
              <stop offset="0%"   stopColor="#fff9c4"/>
              <stop offset="25%"  stopColor="#ffe033"/>
              <stop offset="60%"  stopColor="#f5a800"/>
              <stop offset="85%"  stopColor="#c46e00"/>
              <stop offset="100%" stopColor="#7a3800" stopOpacity="0.9"/>
            </radialGradient>
            <radialGradient id="bur" cx="65%" cy="35%" r="65%">
              <stop offset="0%"   stopColor="#fff9c4"/>
              <stop offset="25%"  stopColor="#ffe033"/>
              <stop offset="60%"  stopColor="#f5a800"/>
              <stop offset="85%"  stopColor="#c46e00"/>
              <stop offset="100%" stopColor="#7a3800" stopOpacity="0.9"/>
            </radialGradient>
            <radialGradient id="bll" cx="40%" cy="30%" r="70%">
              <stop offset="0%"   stopColor="#fff59d"/>
              <stop offset="35%"  stopColor="#ffd600"/>
              <stop offset="70%"  stopColor="#e69000"/>
              <stop offset="100%" stopColor="#7a3800" stopOpacity="0.85"/>
            </radialGradient>
            <radialGradient id="blr" cx="60%" cy="30%" r="70%">
              <stop offset="0%"   stopColor="#fff59d"/>
              <stop offset="35%"  stopColor="#ffd600"/>
              <stop offset="70%"  stopColor="#e69000"/>
              <stop offset="100%" stopColor="#7a3800" stopOpacity="0.85"/>
            </radialGradient>

            <style>{`
              /* Each wing is ONE <g> with ONE animation — no double layers */
              .w-ul {
                transform-box: fill-box;
                transform-origin: right center;
                animation: wFlapL 2.1s cubic-bezier(0.45,0.05,0.55,0.95) infinite;
              }
              .w-ur {
                transform-box: fill-box;
                transform-origin: left center;
                animation: wFlapR 2.1s cubic-bezier(0.45,0.05,0.55,0.95) infinite;
              }
              .w-ll {
                transform-box: fill-box;
                transform-origin: right center;
                animation: wFlapL 2.1s cubic-bezier(0.45,0.05,0.55,0.95) infinite 0.1s;
              }
              .w-lr {
                transform-box: fill-box;
                transform-origin: left center;
                animation: wFlapR 2.1s cubic-bezier(0.45,0.05,0.55,0.95) infinite 0.1s;
              }
              @keyframes wFlapL {
                0%,100% { transform: scaleX(1); }
                50%     { transform: scaleX(0.1); }
              }
              @keyframes wFlapR {
                0%,100% { transform: scaleX(1); }
                50%     { transform: scaleX(0.1); }
              }
              .bf-fly {
                animation: bfFloat 3.6s ease-in-out infinite;
              }
              @keyframes bfFloat {
                0%,100% { transform: translateY(0); }
                50%     { transform: translateY(-4px); }
              }
              .bf-ant {
                transform-box: fill-box;
                transform-origin: center bottom;
                animation: antSway 2.1s ease-in-out infinite;
              }
              @keyframes antSway {
                0%,100% { transform: rotate(0deg); }
                50%     { transform: rotate(4deg); }
              }
            `}</style>
          </defs>

          <g className="bf-fly">

            {/* ══ UPPER-LEFT WING — single group, single transform ══ */}
            <g className="w-ul">
              {/* base fill */}
              <path d={UL} fill="url(#bul)" />
              {/* black outer border */}
              <path d={UL} fill="none" stroke="#1a0800" strokeWidth="5" strokeOpacity="0.5" />
              {/* inner fine outline */}
              <path d={UL} fill="none" stroke="#8b4500" strokeWidth="0.8" strokeOpacity="0.6" />
              {/* veins */}
              <g stroke="#7a3200" strokeWidth="0.6" strokeOpacity="0.5" fill="none">
                <line x1="100" y1="45" x2="38"  y2="14"/>
                <line x1="100" y1="45" x2="14"  y2="36"/>
                <line x1="100" y1="45" x2="10"  y2="55"/>
                <line x1="100" y1="45" x2="22"  y2="70"/>
                <line x1="100" y1="45" x2="50"  y2="77"/>
                <path d="M45,14 Q30,40 22,66" strokeOpacity="0.3"/>
                <path d="M62,9  Q48,35 40,72" strokeOpacity="0.25"/>
              </g>
              {/* white border spots */}
              <ellipse cx="20" cy="17" rx="3.5" ry="2" transform="rotate(-40 20 17)" fill="#fffde7" fillOpacity="0.8"/>
              <ellipse cx="9"  cy="38" rx="3"   ry="2" transform="rotate(-70 9 38)"  fill="#fffde7" fillOpacity="0.75"/>
              <ellipse cx="12" cy="58" rx="2.5" ry="1.8"                              fill="#fffde7" fillOpacity="0.7"/>
              {/* eyespot */}
              <circle cx="46" cy="26" r="7.5" fill="#1a0800" fillOpacity="0.55"/>
              <circle cx="46" cy="26" r="4.8" fill="#ff8f00" fillOpacity="0.75"/>
              <circle cx="46" cy="26" r="2.4" fill="#100500" fillOpacity="0.95"/>
              <circle cx="44.5" cy="24.5" r="1.1" fill="#fff" fillOpacity="0.7"/>
            </g>

            {/* ══ UPPER-RIGHT WING ══ */}
            <g className="w-ur">
              <path d={UR} fill="url(#bur)" />
              <path d={UR} fill="none" stroke="#1a0800" strokeWidth="5" strokeOpacity="0.5" />
              <path d={UR} fill="none" stroke="#8b4500" strokeWidth="0.8" strokeOpacity="0.6" />
              <g stroke="#7a3200" strokeWidth="0.6" strokeOpacity="0.5" fill="none">
                <line x1="100" y1="45" x2="162" y2="14"/>
                <line x1="100" y1="45" x2="186" y2="36"/>
                <line x1="100" y1="45" x2="190" y2="55"/>
                <line x1="100" y1="45" x2="178" y2="70"/>
                <line x1="100" y1="45" x2="150" y2="77"/>
                <path d="M155,14 Q170,40 178,66" strokeOpacity="0.3"/>
                <path d="M138,9  Q152,35 160,72" strokeOpacity="0.25"/>
              </g>
              <ellipse cx="180" cy="17" rx="3.5" ry="2" transform="rotate(40 180 17)"  fill="#fffde7" fillOpacity="0.8"/>
              <ellipse cx="191" cy="38" rx="3"   ry="2" transform="rotate(70 191 38)"  fill="#fffde7" fillOpacity="0.75"/>
              <ellipse cx="188" cy="58" rx="2.5" ry="1.8"                               fill="#fffde7" fillOpacity="0.7"/>
              <circle cx="154" cy="26" r="7.5" fill="#1a0800" fillOpacity="0.55"/>
              <circle cx="154" cy="26" r="4.8" fill="#ff8f00" fillOpacity="0.75"/>
              <circle cx="154" cy="26" r="2.4" fill="#100500" fillOpacity="0.95"/>
              <circle cx="152.5" cy="24.5" r="1.1" fill="#fff" fillOpacity="0.7"/>
            </g>

            {/* ══ LOWER-LEFT WING ══ */}
            <g className="w-ll">
              <path d={LL} fill="url(#bll)" />
              <path d={LL} fill="none" stroke="#1a0800" strokeWidth="4.5" strokeOpacity="0.45" />
              <path d={LL} fill="none" stroke="#8b4500" strokeWidth="0.7" strokeOpacity="0.55" />
              <g stroke="#7a3200" strokeWidth="0.55" strokeOpacity="0.45" fill="none">
                <line x1="100" y1="65" x2="34"  y2="86"/>
                <line x1="100" y1="65" x2="20"  y2="104"/>
                <line x1="100" y1="65" x2="36"  y2="120"/>
                <line x1="100" y1="65" x2="66"  y2="118"/>
              </g>
              {/* orange patch */}
              <ellipse cx="50" cy="98" rx="10" ry="7" transform="rotate(-20 50 98)" fill="#ff6d00" fillOpacity="0.4"/>
              {/* white border spots */}
              <ellipse cx="20" cy="88" rx="2.8" ry="1.8" transform="rotate(-50 20 88)" fill="#fffde7" fillOpacity="0.7"/>
              <ellipse cx="26" cy="114" rx="2.5" ry="1.6" fill="#fffde7" fillOpacity="0.65"/>
            </g>

            {/* ══ LOWER-RIGHT WING ══ */}
            <g className="w-lr">
              <path d={LR} fill="url(#blr)" />
              <path d={LR} fill="none" stroke="#1a0800" strokeWidth="4.5" strokeOpacity="0.45" />
              <path d={LR} fill="none" stroke="#8b4500" strokeWidth="0.7" strokeOpacity="0.55" />
              <g stroke="#7a3200" strokeWidth="0.55" strokeOpacity="0.45" fill="none">
                <line x1="100" y1="65" x2="166" y2="86"/>
                <line x1="100" y1="65" x2="180" y2="104"/>
                <line x1="100" y1="65" x2="164" y2="120"/>
                <line x1="100" y1="65" x2="134" y2="118"/>
              </g>
              <ellipse cx="150" cy="98" rx="10" ry="7" transform="rotate(20 150 98)" fill="#ff6d00" fillOpacity="0.4"/>
              <ellipse cx="180" cy="88" rx="2.8" ry="1.8" transform="rotate(50 180 88)" fill="#fffde7" fillOpacity="0.7"/>
              <ellipse cx="174" cy="114" rx="2.5" ry="1.6" fill="#fffde7" fillOpacity="0.65"/>
            </g>

            {/* ══ BODY — drawn last so it sits on top of all wings ══ */}
            {/* Abdomen */}
            <ellipse cx="100" cy="82" rx="3.8" ry="24" fill="#1a0800" stroke="#f5a800" strokeWidth="0.6"/>
            {/* Abdomen segments */}
            {[66,72,78,84,90,96,102].map((y, i) => (
              <line key={i} x1="96.4" y1={y} x2="103.6" y2={y}
                stroke="#f5a800" strokeWidth="0.45" strokeOpacity="0.45"/>
            ))}
            {/* Thorax */}
            <ellipse cx="100" cy="52" rx="4.5" ry="9" fill="#2a1000" stroke="#f5a800" strokeWidth="0.7"/>
            {/* Thorax highlight */}
            <ellipse cx="98.5" cy="49" rx="1.4" ry="2.5" fill="#ffe082" fillOpacity="0.25"/>
            {/* Head */}
            <circle cx="100" cy="40" r="5" fill="#1a0800" stroke="#f5a800" strokeWidth="0.7"/>
            <circle cx="98.5" cy="38.5" r="1.6" fill="#fff9c4" fillOpacity="0.35"/>

            {/* ══ ANTENNAE ══ */}
            <g className="bf-ant">
              <path d="M98,36 C93,25 82,14 76,9" stroke="#3e1a00" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
              <circle cx="76" cy="9" r="2.6" fill="#f5a800" stroke="#3e1a00" strokeWidth="0.5"/>
              <circle cx="76" cy="9" r="1"   fill="#fffde7"/>

              <path d="M102,36 C107,25 118,14 124,9" stroke="#3e1a00" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
              <circle cx="124" cy="9" r="2.6" fill="#f5a800" stroke="#3e1a00" strokeWidth="0.5"/>
              <circle cx="124" cy="9" r="1"   fill="#fffde7"/>
            </g>

          </g>
        </svg>
      </div>
    </div>
  );
}
