import { useMemo, useState, type FormEvent } from "react";
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
    <section className="grid gap-6">
      <div className="rounded-3xl border border-aura/30 bg-ink p-6 text-sky shadow-aura">
        <p className="text-xs uppercase tracking-[0.18em] text-aura">Levellino Report</p>
        <h3 className="mt-2 text-2xl font-semibold">{onboarding.levellino_intro}</h3>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-sky/20 bg-white/5 p-4">
            <p className="text-xs text-sky/70">Livello attuale</p>
            <p className="mt-1 text-3xl font-bold">{progress?.level ?? "-"}</p>
          </article>
          <article className="rounded-2xl border border-sky/20 bg-white/5 p-4">
            <p className="text-xs text-sky/70">XP totale</p>
            <p className="mt-1 text-3xl font-bold">{progress?.total_xp ?? 0}</p>
          </article>
          <article className="rounded-2xl border border-sky/20 bg-white/5 p-4">
            <p className="text-xs text-sky/70">Streak settimanale</p>
            <p className="mt-1 text-3xl font-bold">{progress?.streak_days ?? 0}/7</p>
          </article>
        </div>

        <div className="mt-5 rounded-xl bg-white/10 p-3">
          <div className="flex items-center justify-between text-xs text-sky/80">
            <span>Progressione livello</span>
            <span>{levelPercent}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-sky/20">
            <div className="h-2 rounded-full bg-gradient-to-r from-aura to-gold" style={{ width: `${levelPercent}%` }} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-sky/20 bg-white p-6">
          <h4 className="text-lg font-semibold text-ink">Piano Personalizzato</h4>

          <div className="mt-4 grid gap-4">
            <article>
              <p className="text-xs uppercase tracking-[0.16em] text-ink/70">Allenamento</p>
              <ul className="mt-2 grid gap-2 text-sm text-ink/90">
                {onboarding.plan_summary.training.map((item) => (
                  <li key={item} className="rounded-lg bg-sky/30 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article>
              <p className="text-xs uppercase tracking-[0.16em] text-ink/70">Nutrizione</p>
              <ul className="mt-2 grid gap-2 text-sm text-ink/90">
                {onboarding.plan_summary.nutrition.map((item) => (
                  <li key={item} className="rounded-lg bg-sky/30 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article>
              <p className="text-xs uppercase tracking-[0.16em] text-ink/70">Focus Giornaliero</p>
              <ul className="mt-2 grid gap-2 text-sm text-ink/90">
                {onboarding.plan_summary.daily_focus.map((item) => (
                  <li key={item} className="rounded-lg bg-sky/30 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>

        <div className="rounded-3xl border border-sky/20 bg-white p-6">
          <h4 className="text-lg font-semibold text-ink">Check Giornaliero</h4>
          <p className="mt-1 text-sm text-ink/70">
            Segna le missioni completate per ottenere XP e salire di livello.
          </p>

          <form onSubmit={handleDailyCheckin} className="mt-4 grid gap-3">
            <label className="flex items-center gap-3 rounded-xl border border-sky/20 px-3 py-2">
              <input type="checkbox" checked={workoutDone} onChange={(event) => setWorkoutDone(event.target.checked)} />
              <span className="text-sm text-ink">Allenamento completato (+50 XP)</span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-sky/20 px-3 py-2">
              <input
                type="checkbox"
                checked={nutritionDone}
                onChange={(event) => setNutritionDone(event.target.checked)}
              />
              <span className="text-sm text-ink">Piano alimentare rispettato (+30 XP)</span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-sky/20 px-3 py-2">
              <input
                type="checkbox"
                checked={hydrationDone}
                onChange={(event) => setHydrationDone(event.target.checked)}
              />
              <span className="text-sm text-ink">Idratazione target raggiunta (+20 XP)</span>
            </label>

            <textarea
              className="min-h-24 rounded-xl border border-sky/25 p-3 text-sm text-ink"
              placeholder="Nota giornaliera (energia, sonno, difficolta...)"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />

            {saveError ? <p className="text-sm text-red-600">{saveError}</p> : null}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-sky transition hover:bg-[#1b3150] disabled:opacity-70"
            >
              {saving ? "Salvataggio missione..." : "Conferma missione giornaliera"}
            </button>
          </form>

          <div className="mt-4 rounded-xl bg-sky/25 p-3 text-sm text-ink">
            Stato: {loading ? "aggiornamento..." : progress?.todays_mission_status ?? "nessun dato"}
          </div>
        </div>
      </div>
    </section>
  );
}
