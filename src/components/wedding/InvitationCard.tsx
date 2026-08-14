import { motion } from "motion/react";
import watercolorBg from "@/assets/watercolor-invitation-bg.png";

export function InvitationCard() {
  return (
    <section
      id="invitation"
      className="relative flex justify-center items-center py-16 md:py-28 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #e8e4f0 0%, #f0ede8 50%, #e4eae4 100%)" }}
    >
      {/* Soft ambient blobs behind the card */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 20% 30%, rgba(180,150,210,0.25) 0%, transparent 70%), radial-gradient(ellipse 50% 35% at 80% 70%, rgba(150,190,160,0.2) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-[92%] max-w-[560px] @container"
        style={{ filter: "drop-shadow(0 40px 80px rgba(100,80,140,0.22))" }}
      >
        {/* Card Shell */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.92)",
            boxShadow:
              "0 0 0 1px rgba(180,150,210,0.35), 0 50px 120px -30px rgba(100,80,140,0.3), inset 0 0 80px rgba(220,210,240,0.2)",
          }}
        >
          {/* Watercolor Background Image */}
          <img
            src={watercolorBg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            style={{ opacity: 0.82, mixBlendMode: "multiply" }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-[8cqw] pt-[9cqw] pb-[9cqw] font-malayalam">

            {/* "Save the Date" label */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-[2.4cqw] font-bold tracking-[0.35em] uppercase mb-[2cqw]"
              style={{ color: "#6b5b8e", fontFamily: "'Outfit', system-ui, sans-serif", letterSpacing: "0.3em" }}
            >
              ✦ &nbsp; Save the Date &nbsp; ✦
            </motion.p>

            {/* Decorative top divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-[55%] h-px mb-[3.5cqw]"
              style={{ background: "linear-gradient(90deg, transparent, #9b7fc0, transparent)" }}
            />

            {/* Sub heading */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-[2.8cqw] font-bold mb-[0.8cqw]"
              style={{ color: "#5a4a7a", fontFamily: "'Chilanka', cursive" }}
            >
              ചിങ്ങത്തിൽ
            </motion.p>

            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-[4cqw] font-black mb-[4.5cqw]"
              style={{ color: "#5a4a7a", fontFamily: "'Chilanka', cursive", letterSpacing: "0.05em" }}
            >
              താലികെട്ട്
            </motion.h2>

            {/* Bride Name */}
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="leading-none mb-[1.5cqw]"
              style={{
                fontFamily: "'Chilanka', cursive",
                fontSize: "clamp(2.4rem, 13cqw, 5rem)",
                background: "linear-gradient(135deg, #7b4fa6 20%, #b06bcc 60%, #8b5ab3 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 2px 8px rgba(130,90,180,0.3))",
              }}
            >
              ലക്ഷ്മി
            </motion.h1>

            {/* Ampersand */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.58, type: "spring", stiffness: 200 }}
              className="my-[2cqw] flex items-center gap-[2cqw] w-[70%]"
            >
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(155,127,192,0.5))" }} />
              <span
                className="text-[5cqw]"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: "#9b7fc0",
                  lineHeight: 1,
                }}
              >
                &amp;
              </span>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(155,127,192,0.5), transparent)" }} />
            </motion.div>

            {/* Groom Name */}
            <motion.h1
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="leading-none mb-[5cqw]"
              style={{
                fontFamily: "'Chilanka', cursive",
                fontSize: "clamp(2.4rem, 13cqw, 5rem)",
                background: "linear-gradient(135deg, #7b4fa6 20%, #b06bcc 60%, #8b5ab3 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 2px 8px rgba(130,90,180,0.3))",
              }}
            >
              നിതിൻ
            </motion.h1>

            {/* Decorative divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="w-[60%] h-px mb-[3.5cqw]"
              style={{ background: "linear-gradient(90deg, transparent, #9b7fc0, transparent)" }}
            />

            {/* Invite line */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.75 }}
              className="text-[2.1cqw] mb-[0.5cqw] tracking-wide"
              style={{ color: "#6b5b8e", fontFamily: "'Outfit', system-ui, sans-serif", textTransform: "uppercase", letterSpacing: "0.2em" }}
            >
              INVITE YOU TO JOIN THEM
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.78 }}
              className="text-[1.9cqw] mb-[4cqw]"
              style={{ color: "#8878a8", fontFamily: "'Outfit', system-ui, sans-serif", textTransform: "uppercase", letterSpacing: "0.18em" }}
            >
              AT THE CELEBRATION OF THEIR MARRIAGE
            </motion.p>

            {/* Date block */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.82 }}
              className="flex items-stretch gap-0 mb-[3cqw]"
              style={{
                border: "1.5px solid rgba(155,127,192,0.55)",
                borderRadius: "8px",
                overflow: "hidden",
                background: "rgba(255,255,255,0.5)",
              }}
            >
              <div className="flex flex-col items-center justify-center px-[3cqw] py-[1.5cqw]">
                <span className="text-[1.8cqw] font-bold tracking-widest uppercase" style={{ color: "#6b5b8e", fontFamily: "'Outfit', sans-serif" }}>
                  Saturday
                </span>
                <span className="text-[1.6cqw]" style={{ color: "#8878a8", fontFamily: "'Outfit', sans-serif" }}>
                  10:00 – 11:00 AM
                </span>
              </div>
              <div className="w-px self-stretch" style={{ background: "rgba(155,127,192,0.45)" }} />
              <div
                className="flex items-center justify-center px-[3cqw]"
                style={{
                  background: "linear-gradient(135deg, rgba(155,127,192,0.18), rgba(180,150,220,0.25))",
                }}
              >
                <span
                  className="font-black"
                  style={{
                    fontSize: "clamp(1.8rem, 7cqw, 3rem)",
                    color: "#7b4fa6",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    lineHeight: 1,
                  }}
                >
                  12
                </span>
              </div>
              <div className="w-px self-stretch" style={{ background: "rgba(155,127,192,0.45)" }} />
              <div className="flex flex-col items-center justify-center px-[3cqw] py-[1.5cqw]">
                <span className="text-[1.8cqw] font-bold tracking-widest uppercase" style={{ color: "#6b5b8e", fontFamily: "'Outfit', sans-serif" }}>
                  September
                </span>
                <span className="text-[1.6cqw]" style={{ color: "#8878a8", fontFamily: "'Outfit', sans-serif" }}>
                  2026
                </span>
              </div>
            </motion.div>

            {/* Malayalam date info */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.88 }}
              className="text-[2.1cqw] space-y-[0.6cqw] mb-[3cqw]"
              style={{ color: "#5a4a7a", fontFamily: "'Chilanka', cursive" }}
            >
              <p>1202 ചിങ്ങം 27</p>
              <p>ശുഭമുഹൂർത്തത്തിൽ വിവാഹിതരാകുന്നു</p>
            </motion.div>

            {/* Bottom divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="w-[55%] h-px mb-[3cqw]"
              style={{ background: "linear-gradient(90deg, transparent, #9b7fc0, transparent)" }}
            />

            {/* Venue */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.95 }}
              className="text-[2.1cqw] space-y-[0.4cqw]"
              style={{ color: "#6b5b8e", fontFamily: "'Chilanka', cursive" }}
            >
              <p className="font-bold text-[2cqw] uppercase tracking-widest" style={{ fontFamily: "'Outfit', sans-serif", color: "#8878a8", letterSpacing: "0.2em" }}>
                Venue
              </p>
              <p>കല്യാണമണ്ഡപം, കൊച്ചി</p>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}
