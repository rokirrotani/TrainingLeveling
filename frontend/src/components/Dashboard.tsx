import { useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { submitDailyLog } from "../api/client";
import { useProgress } from "../hooks/useProgress";
import type { OnboardingResponse } from "../types";

interface DashboardProps {
  userId: number;
  onboarding: OnboardingResponse;
}

function todayIsoDate(): string {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatShortDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "short" }).format(date);
}

export function Dashboard({ userId, onboarding }: DashboardProps) {
  const { progress, loading, error, refresh } = useProgress(userId);
  const [workoutDone, setWorkoutDone] = useState(false);
  const [nutritionDone, setNutritionDone] = useState(false);
  const [hydrationDone, setHydrationDone] = useState(false);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const levelPercent = useMemo(() => {
    if (!progress) {
      return 0;
    }
    const base = Math.max(1, progress.level - 1);
    const currentLevelMinXp = Math.pow(base, 2) * 120;
    const nextLevelXp = Math.pow(base + 1, 2) * 120;
    const fraction = (progress.total_xp - currentLevelMinXp) / (nextLevelXp - currentLevelMinXp);
    return Math.min(100, Math.max(0, Math.round(fraction * 100)));
  }, [progress]);

  const missionXpPotential = (workoutDone ? 50 : 0) + (nutritionDone ? 30 : 0) + (hydrationDone ? 20 : 0);

  const levelArcStyle = useMemo<CSSProperties>(() => {
    const sweep = Math.round(levelPercent * 3.6);
    return {
      background: `conic-gradient(var(--accent-cyan) 0deg ${sweep}deg, rgba(14, 37, 59, 0.16) ${sweep}deg 360deg)`,
    };
  }, [levelPercent]);

  async function handleDailyCheckin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      await submitDailyLog({
        user_id: userId,
        workout_done: workoutDone,
        nutrition_done: nutritionDone,
        hydration_done: hydrationDone,
        notes,
        log_date: todayIsoDate(),
      });

      setNotes("");
      await refresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Errore durante il check giornaliero");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="dashboard-stack">
      <div className="glass-card dashboard-overview">
        <div className="grid gap-1">
          <p className="hero-kicker">Levellino report</p>
          <h3 className="section-title">{onboarding.levellino_intro}</h3>
          <p className="muted-copy">Traccia i tuoi progressi in tempo reale e trasforma ogni giorno in XP utile.</p>
        </div>

        <div className="stats-grid">
          <article className="stat-card">
            <p className="stat-label">Livello attuale</p>
            <p className="stat-value">{progress?.level ?? "-"}</p>
          </article>

          <article className="stat-card">
            <p className="stat-label">XP totale</p>
            <p className="stat-value">{progress?.total_xp ?? 0}</p>
          </article>

          <article className="stat-card">
            <p className="stat-label">Streak</p>
            <p className="stat-value">{progress?.streak_days ?? 0}/7</p>
          </article>

          <article className="stat-card">
            <p className="stat-label">Mission status</p>
            <p className="stat-value stat-value--small">{progress?.todays_mission_status ?? "nessun dato"}</p>
          </article>
        </div>

        <div className="xp-showcase">
          <div className="xp-ring-wrap">
            <div className="xp-ring" style={levelArcStyle}>
              <div className="xp-ring-center">
                <strong>{levelPercent}%</strong>
                <span>livello</span>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <p className="section-mini-title">Progressione livello</p>
            <p className="muted-copy">Mantieni una streak costante per aumentare la velocita di crescita e sbloccare livelli.</p>

            <div className="progress-bar-shell">
              <div className="progress-bar-value" style={{ width: `${levelPercent}%` }} />
            </div>

            <p className="micro-copy">Aggiornamento live dal tuo ultimo check giornaliero.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="glass-card grid gap-5">
          <h4 className="section-title">Piano personalizzato</h4>

          <div className="grid gap-4">
            <article className="grid gap-2">
              <p className="section-mini-title">Allenamento</p>
              <ul className="grid gap-2">
                {onboarding.plan_summary.training.map((item, index) => (
                  <li key={`${item}-${index}`} className="plan-list-item">
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="grid gap-2">
              <p className="section-mini-title">Nutrizione</p>
              <ul className="grid gap-2">
                {onboarding.plan_summary.nutrition.map((item, index) => (
                  <li key={`${item}-${index}`} className="plan-list-item">
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="grid gap-2">
              <p className="section-mini-title">Focus giornaliero</p>
              <ul className="grid gap-2">
                {onboarding.plan_summary.daily_focus.map((item, index) => (
                  <li key={`${item}-${index}`} className="plan-list-item">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>

        <div className="glass-card check-card">
          <h4 className="section-title">Check giornaliero</h4>
          <p className="muted-copy">Segna le missioni completate: oggi puoi guadagnare fino a 100 XP.</p>

          <form onSubmit={handleDailyCheckin} className="grid gap-3">
            <label className={`mission-toggle ${workoutDone ? "mission-toggle--active" : ""}`}>
              <input type="checkbox" checked={workoutDone} onChange={(event) => setWorkoutDone(event.target.checked)} />
              <div>
                <p className="mission-label">Allenamento completato</p>
                <p className="micro-copy">+50 XP</p>
              </div>
            </label>

            <label className={`mission-toggle ${nutritionDone ? "mission-toggle--active" : ""}`}>
              <input
                type="checkbox"
                checked={nutritionDone}
                onChange={(event) => setNutritionDone(event.target.checked)}
              />
              <div>
                <p className="mission-label">Piano alimentare rispettato</p>
                <p className="micro-copy">+30 XP</p>
              </div>
            </label>

            <label className={`mission-toggle ${hydrationDone ? "mission-toggle--active" : ""}`}>
              <input
                type="checkbox"
                checked={hydrationDone}
                onChange={(event) => setHydrationDone(event.target.checked)}
              />
              <div>
                <p className="mission-label">Idratazione target raggiunta</p>
                <p className="micro-copy">+20 XP</p>
              </div>
            </label>

            <textarea
              className="mission-note"
              placeholder="Nota giornaliera (energia, sonno, difficolta...)"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="status-pill">XP selezionato: {missionXpPotential}</span>
              <span className="micro-copy">{loading ? "Aggiornamento dati..." : "Dati sincronizzati"}</span>
            </div>

            {saveError ? <p className="error-text">{saveError}</p> : null}
            {error ? <p className="error-text">{error}</p> : null}

            <button type="submit" disabled={saving} className="submit-cta">
              {saving ? "Salvataggio missione..." : "Conferma missione giornaliera"}
            </button>
          </form>
        </div>
      </div>

      <div className="glass-card grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="section-title">Timeline ultimi log</h4>
          <span className="status-pill">ultimi 6</span>
        </div>

        {progress?.recent_logs.length ? (
          <ul className="recent-log-list">
            {progress.recent_logs.slice(0, 6).map((log) => (
              <li key={log.id} className="recent-log-item">
                <div>
                  <p className="mission-label">{formatShortDate(log.log_date)}</p>
                  <p className="micro-copy">{log.notes || "Nessuna nota"}</p>
                </div>
                <div className="text-right">
                  <p className="mission-label">+{log.xp_gained} XP</p>
                  <p className="micro-copy">{log.workout_done || log.nutrition_done || log.hydration_done ? "missione fatta" : "missione saltata"}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted-copy">Ancora nessun log disponibile: completa il primo check per popolare la timeline.</p>
        )}
      </div>
    </section>
  );
}
