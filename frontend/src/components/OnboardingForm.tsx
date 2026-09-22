import { useState, type FormEvent } from "react";
import { createOnboardingProfile } from "../api/client";
import type { GoalType, OnboardingInput, OnboardingResponse } from "../types";

interface OnboardingFormProps {
  onCompleted: (response: OnboardingResponse) => void;
}

const goalOptions: Array<{ label: string; value: GoalType }> = [
  { label: "Perdere peso", value: "fat_loss" },
  { label: "Aumentare massa muscolare", value: "muscle_gain" },
  { label: "Ricomporsi e tonificare", value: "recomposition" },
];

const preferenceOptions = [
  { label: "Allenamento a casa", value: "home_workout" },
  { label: "Meal prep rapido", value: "quick_meals" },
  { label: "Routine mattutina", value: "morning_routine" },
  { label: "Routine serale", value: "evening_routine" },
];

export function OnboardingForm({ onCompleted }: OnboardingFormProps) {
  const [form, setForm] = useState<OnboardingInput>({
    nickname: "",
    age: 24,
    height_cm: 170,
    weight_kg: 68,
    goal: "recomposition",
    activity_level: "beginner",
    food_style: "balanced",
    preferences: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof OnboardingInput>(key: K, value: OnboardingInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function togglePreference(value: string) {
    setForm((prev) => {
      const exists = prev.preferences.includes(value);
      return {
        ...prev,
        preferences: exists
          ? prev.preferences.filter((item) => item !== value)
          : [...prev.preferences, value],
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.nickname.trim()) {
      setError("Inserisci un nickname per iniziare.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await createOnboardingProfile(form);
      onCompleted(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-3xl border border-sky/15 bg-white/90 p-6 shadow-xl">
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-ink">Come vuoi farti chiamare?</label>
        <input
          className="rounded-xl border border-sky/30 bg-white px-4 py-3 text-ink outline-none focus:border-aura"
          value={form.nickname}
          onChange={(event) => updateField("nickname", event.target.value)}
          placeholder="Es. ShadowRunner"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Eta
          <input
            type="number"
            min={13}
            max={90}
            className="rounded-xl border border-sky/30 px-3 py-2 font-normal"
            value={form.age}
            onChange={(event) => updateField("age", Number(event.target.value))}
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-ink">
          Altezza (cm)
          <input
            type="number"
            min={120}
            max={230}
            className="rounded-xl border border-sky/30 px-3 py-2 font-normal"
            value={form.height_cm}
            onChange={(event) => updateField("height_cm", Number(event.target.value))}
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-ink">
          Peso (kg)
          <input
            type="number"
            min={35}
            max={250}
            step="0.1"
            className="rounded-xl border border-sky/30 px-3 py-2 font-normal"
            value={form.weight_kg}
            onChange={(event) => updateField("weight_kg", Number(event.target.value))}
          />
        </label>
      </div>

      <div className="grid gap-3">
        <p className="text-sm font-semibold text-ink">Obiettivo principale</p>
        <div className="grid gap-3 md:grid-cols-3">
          {goalOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField("goal", option.value)}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                form.goal === option.value
                  ? "border-aura bg-aura/20 text-ink"
                  : "border-sky/30 bg-white text-ink/80 hover:border-aura/50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Livello attuale
          <select
            className="rounded-xl border border-sky/30 px-3 py-3 font-normal"
            value={form.activity_level}
            onChange={(event) => updateField("activity_level", event.target.value as OnboardingInput["activity_level"])}
          >
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzato</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-semibold text-ink">
          Stile alimentare
          <select
            className="rounded-xl border border-sky/30 px-3 py-3 font-normal"
            value={form.food_style}
            onChange={(event) => updateField("food_style", event.target.value as OnboardingInput["food_style"])}
          >
            <option value="balanced">Bilanciato</option>
            <option value="vegetarian">Vegetariano</option>
            <option value="vegan">Vegano</option>
          </select>
        </label>
      </div>

      <div className="grid gap-3">
        <p className="text-sm font-semibold text-ink">Preferenze extra</p>
        <div className="grid gap-2 md:grid-cols-2">
          {preferenceOptions.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-sky/25 bg-white px-3 py-2"
            >
              <input
                type="checkbox"
                checked={form.preferences.includes(option.value)}
                onChange={() => togglePreference(option.value)}
                className="h-4 w-4"
              />
              <span className="text-sm text-ink">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-sky transition hover:scale-[1.01] hover:bg-[#16263f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Levellino sta creando il tuo percorso..." : "Inizia la missione"}
      </button>
    </form>
  );
}
