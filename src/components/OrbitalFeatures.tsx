import { useEffect, useState, useRef } from "react";
import { CRITERIA } from "@/lib/criteria";

export const OrbitalFeatures = () => {
  const [angle, setAngle] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active !== null) return;
    const id = setInterval(() => setAngle((a) => (a + 0.25) % 360), 50);
    return () => clearInterval(id);
  }, [active]);

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="container text-center mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-semibold text-gold tracking-widest uppercase mb-6">
          Nine Pillars of Excellence
        </span>
        <h2 className="font-display text-5xl md:text-6xl font-semibold mb-4">
          <span className="text-gradient">Evaluated on </span>
          <span className="text-luxury">9 criteria</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Every paragraph orbits through nine pillars of precise, AI-driven assessment.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-[640px] flex items-center justify-center"
        onClick={() => setActive(null)}
      >
        {/* Orbital ring */}
        <div className="absolute w-[520px] h-[520px] rounded-full border border-primary/20" />
        <div className="absolute w-[420px] h-[420px] rounded-full border border-accent/15" />

        {/* Center sun */}
        <div className="absolute w-28 h-28 rounded-full bg-gradient-luxury animate-glow-pulse flex items-center justify-center z-10">
          <div className="absolute w-36 h-36 rounded-full border border-primary/30 animate-ping opacity-60" />
          <div className="absolute w-44 h-44 rounded-full border border-gold/20 animate-ping opacity-40" style={{ animationDelay: "0.7s" }} />
          <div className="font-display text-3xl font-bold text-midnight">90</div>
        </div>

        {CRITERIA.map((c, i) => {
          const total = CRITERIA.length;
          const a = ((i / total) * 360 + angle) % 360;
          const radius = 260;
          const rad = (a * Math.PI) / 180;
          const x = radius * Math.cos(rad);
          const y = radius * Math.sin(rad);
          const z = Math.round(100 + 50 * Math.cos(rad));
          const opacity = Math.max(0.5, 0.5 + 0.5 * ((1 + Math.sin(rad)) / 2));
          const isActive = active === i;
          const Icon = c.icon;

          return (
            <div
              key={c.key}
              className="absolute transition-all duration-700 cursor-pointer"
              style={{
                transform: `translate(${x}px, ${y}px)`,
                zIndex: isActive ? 200 : z,
                opacity: isActive ? 1 : opacity,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActive(isActive ? null : i);
              }}
            >
              <div className={`absolute -inset-3 rounded-full ${isActive ? "animate-pulse" : ""}`}
                style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.25) 0%, transparent 70%)" }} />

              <div className={`
                w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500
                ${isActive
                  ? "bg-gradient-gold border-gold scale-150 shadow-[0_0_40px_hsl(var(--gold)/0.6)] text-midnight"
                  : "glass-strong border-primary/40 text-foreground hover:border-primary"}
              `}>
                <Icon size={20} />
              </div>

              <div className={`absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300 ${
                isActive ? "text-gold scale-110" : "text-foreground/70"
              }`}>
                {c.label}
              </div>

              {isActive && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 w-64 glass-strong rounded-xl p-4 border border-gold/30 animate-fade-up">
                  <div className="text-xs uppercase tracking-widest text-gold mb-2">Criterion {i + 1} / 10</div>
                  <h4 className="font-display text-xl mb-2">{c.label}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c.description}</p>
                  <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-luxury w-full" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default OrbitalFeatures;
