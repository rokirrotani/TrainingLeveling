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
    <form onSubmit={handleSubmit} className="onboarding-panel glass-card">
      <div className="grid gap-1">
        <p className="hero-kicker">Avatar setup</p>
        <h3 className="section-title">Configura il tuo profilo atleta</h3>
        <p className="muted-copy">
          Imposta i tuoi dati base: Levellino costruira una missione giornaliera piu precisa, chiara e motivante.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.3fr_1fr]">
        <label className="field-label">
          Come vuoi farti chiamare?
          <input
            className="field-input"
            value={form.nickname}
            onChange={(event) => updateField("nickname", event.target.value)}
            placeholder="Es. ShadowRunner"
          />
        </label>

        <div className="grid grid-cols-3 gap-3">
          <label className="field-label">
            Eta
            <input
              type="number"
              min={13}
              max={90}
              className="field-input"
              value={form.age}
              onChange={(event) => updateField("age", Number(event.target.value))}
            />
          </label>

          <label className="field-label">
            Altezza
            <input
              type="number"
              min={120}
              max={230}
              className="field-input"
              value={form.height_cm}
              onChange={(event) => updateField("height_cm", Number(event.target.value))}
            />
          </label>

          <label className="field-label">
            Peso
            <input
              type="number"
              min={35}
              max={250}
              step="0.1"
              className="field-input"
              value={form.weight_kg}
              onChange={(event) => updateField("weight_kg", Number(event.target.value))}
            />
          </label>
        </div>
      </div>

      <div className="grid gap-3">
        <p className="section-mini-title">Obiettivo principale</p>
        <div className="grid gap-3 md:grid-cols-3">
          {goalOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField("goal", option.value)}
              className={`chip-choice ${form.goal === option.value ? "chip-choice--active" : ""}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="field-label">
          Livello attuale
          <select
            className="field-select"
            value={form.activity_level}
            onChange={(event) => updateField("activity_level", event.target.value as OnboardingInput["activity_level"])}
          >
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzato</option>
          </select>
        </label>

        <label className="field-label">
          Stile alimentare
          <select
            className="field-select"
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
        <p className="section-mini-title">Preferenze extra</p>
        <div className="grid gap-3 md:grid-cols-2">
          {preferenceOptions.map((option) => {
            const isActive = form.preferences.includes(option.value);

            return (
              <label key={option.value} className={`toggle-card ${isActive ? "toggle-card--active" : ""}`}>
                <input type="checkbox" checked={isActive} onChange={() => togglePreference(option.value)} className="h-4 w-4" />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <button type="submit" disabled={loading} className="submit-cta">
        {loading ? "Levellino sta creando il tuo percorso..." : "Inizia la missione"}
      </button>
    </form>
  );
}
