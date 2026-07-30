import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Elegant gold cursor: a crisp dot with a lagging luminous ring on
 * pointer-fine devices, and gentle gold ripple blooms on touch screens.
 */
export function CustomCursor() {
  const [fine, setFine] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    setFine(isFine);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setHovering(Boolean(target.closest("a, button, [role='button'], input, textarea, select")));
    };

    // Touch ripple for mobile
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      const ripple = document.createElement("div");
      const size = 56;
      ripple.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px;margin-left:${-size / 2}px;margin-top:${-size / 2}px;border-radius:9999px;border:2px solid rgba(197,160,89,0.7);background:radial-gradient(circle, rgba(197,160,89,0.35), transparent 70%);pointer-events:none;z-index:90;`;
      document.body.appendChild(ripple);
      const anim = ripple.animate(
        [
          { transform: "scale(0.2)", opacity: 0.9 },
          { transform: "scale(1.6)", opacity: 0 },
        ],
        { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
      anim.onfinish = () => ripple.remove();
    };

    if (isFine) {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseover", onOver, { passive: true });
    }
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [x, y]);

  return (
    <>
      {fine && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[100] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f00000]"
            style={{ x, y }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/70"
            style={{ x: ringX, y: ringY }}
            animate={{
              width: hovering ? 52 : 34,
              height: hovering ? 52 : 34,
              opacity: hovering ? 0.95 : 0.6,
              backgroundColor: hovering ? "rgba(197,160,89,0.12)" : "rgba(197,160,89,0)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          />
        </>
      )}
    </>
  );
}
