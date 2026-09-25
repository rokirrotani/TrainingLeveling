import { useState } from "react";

interface LevellinoGuideProps {
  text: string;
}

const quickHints = ["Pronto in 2 minuti", "Check giornaliero", "Feedback continuo"];

export function LevellinoGuide({ text }: LevellinoGuideProps) {
  const [imageLoaded, setImageLoaded] = useState(true);

  return (
    <section className="guide-panel glass-card">
      <div className="guide-avatar-shell">
        <span className="guide-orbit guide-orbit--one" />
        <span className="guide-orbit guide-orbit--two" />

        <div className="guide-avatar">
          {imageLoaded ? (
            <img
              src="/chibi-levellino.svg"
              alt="Levellino chibi"
              className="h-full w-full rounded-full object-cover"
              onError={() => setImageLoaded(false)}
            />
          ) : (
            <div className="guide-avatar-fallback">LV</div>
          )}
        </div>
      </div>

      <div className="grid gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="hero-kicker">Levellino Companion</p>
          <span className="status-pill">online</span>
        </div>

        <h2 className="guide-title">Il tuo coach visuale, sempre in sync con il piano</h2>
        <p className="guide-text">{text}</p>

        <div className="tag-cloud">
          {quickHints.map((hint) => (
            <span key={hint} className="badge-pill">
              {hint}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
