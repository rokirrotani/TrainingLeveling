interface LevellinoGuideProps {
  text: string;
}

export function LevellinoGuide({ text }: LevellinoGuideProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-aura/40 bg-ink/80 p-6 shadow-aura backdrop-blur-sm">
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-aura/20 blur-2xl" />
      <div className="absolute -left-10 -bottom-12 h-36 w-36 rounded-full bg-flame/20 blur-2xl" />

      <div className="relative flex items-center gap-4">
        <div className="animate-floaty">
          <div className="h-20 w-20 animate-pulseAura rounded-full bg-gradient-to-br from-gold via-flame to-aura p-1">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-ink text-3xl">\u2728</div>
          </div>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-aura">Levellino</p>
          <h2 className="text-xl font-semibold text-sky">Guida Chibi del Tuo Percorso</h2>
          <p className="mt-2 max-w-xl text-sm text-sky/85">{text}</p>
        </div>
      </div>
    </section>
  );
}
