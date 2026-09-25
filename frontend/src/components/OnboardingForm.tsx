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

const stepNarration = [
  "Benvenuto Hunter. Attiviamo il sistema con un nome leggenda.",
  "Prima regola: scegli il tuo alias. Sara il nome mostrato in ogni missione.",
  "Perfetto. Ora calibro i parametri fisici per creare sfide bilanciate.",
  "Scegli la tua missione principale. Ogni scelta cambia la progressione.",
  "Quanto sei allenato ora? Regolo subito l'intensita giornaliera.",
  "Ultimo switch nutrizione: scelgo macro e suggerimenti su misura.",
  "Finalizza le preferenze extra e facciamo spawnare il tuo piano.",
];

const totalSteps = stepNarration.length;

function goalLabel(goal: GoalType): string {
  const found = goalOptions.find((item) => item.value === goal);
  return found ? found.label : goal;
}

function activityLabel(value: OnboardingInput["activity_level"]): string {
  if (value === "beginner") {
    return "Principiante";
  }
  if (value === "intermediate") {
    return "Intermedio";
  }
  return "Avanzato";
}

function foodLabel(value: OnboardingInput["food_style"]): string {
  if (value === "balanced") {
    return "Bilanciato";
  }
  if (value === "vegetarian") {
    return "Vegetariano";
  }
  return "Vegano";
}

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
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

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

  function validateStep(step: number): string | null {
    if (step === 1 && !form.nickname.trim()) {
      return "Inserisci un nickname per iniziare.";
    }

    if (step === 2) {
      if (form.age < 13 || form.age > 90) {
        return "Eta non valida: scegli un valore tra 13 e 90.";
      }
      if (form.height_cm < 120 || form.height_cm > 230) {
        return "Altezza non valida: scegli un valore tra 120 e 230 cm.";
      }
      if (form.weight_kg < 35 || form.weight_kg > 250) {
        return "Peso non valido: scegli un valore tra 35 e 250 kg.";
      }
    }

    return null;
  }

  function goBack() {
    setError(null);
    setDirection("back");
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }

  function goNext() {
    const validationError = validateStep(currentStep);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setDirection("forward");
    setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1));
  }

  function quickAdvanceAfterChoice() {
    setError(null);
    setDirection("forward");
    window.setTimeout(() => {
      setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1));
    }, 180);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateStep(currentStep);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (currentStep < totalSteps - 1) {
      goNext();
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

  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  const stepMotionClass = direction === "forward" ? "quest-slide-in" : "quest-slide-back";

  return (
    <form onSubmit={handleSubmit} className="quest-shell glass-card">
      <div className="quest-hud">
        <div className="flex items-center justify-between gap-3">
          <p className="hero-kicker">Hunter initialization</p>
          <span className="status-pill">step {currentStep + 1}/{totalSteps}</span>
        </div>

        <div className="progress-bar-shell">
          <div className="progress-bar-value" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <section className="mentor-panel">
        <div className="mentor-avatar-wrap">
          <div className="mentor-avatar">
            <img src="/chibi-levellino.svg" alt="Levellino chibi" onError={(event) => ((event.currentTarget.style.display = "none"), undefined)} />
            <span className="mentor-avatar-fallback">LV</span>
          </div>
        </div>
        <p className="mentor-text">{stepNarration[currentStep]}</p>
      </section>

      <section key={currentStep} className={`quest-stage ${stepMotionClass}`}>
        {currentStep === 0 ? (
          <div className="grid gap-4">
            <h3 className="section-title">Benvenuto nel Levelling Gate</h3>
            <p className="muted-copy">
              Ti guidero scelta dopo scelta. Ogni pagina imposta un pezzo del tuo sistema, proprio come una quest.
            </p>
            <button type="button" onClick={goNext} className="submit-cta">
              Attiva il sistema
            </button>
          </div>
        ) : null}

        {currentStep === 1 ? (
          <div className="grid gap-4">
            <h3 className="section-title">Come vuoi essere chiamato?</h3>
            <label className="field-label">
              Nickname hunter
              <input
                className="field-input"
                value={form.nickname}
                onChange={(event) => updateField("nickname", event.target.value)}
                placeholder="Es. ShadowRunner"
                autoFocus
              />
            </label>
          </div>
        ) : null}

        {currentStep === 2 ? (
          <div className="grid gap-4">
            <h3 className="section-title">Calibrazione fisica</h3>
            <div className="grid gap-3 sm:grid-cols-3">
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
                Altezza (cm)
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
                Peso (kg)
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
        ) : null}

        {currentStep === 3 ? (
          <div className="grid gap-3">
            <h3 className="section-title">Seleziona l'obiettivo principale</h3>
            <p className="micro-copy">La pagina cambia automaticamente appena scegli.</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {goalOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    updateField("goal", option.value);
                    quickAdvanceAfterChoice();
                  }}
                  className={`chip-choice ${form.goal === option.value ? "chip-choice--active" : ""}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {currentStep === 4 ? (
          <div className="grid gap-3">
            <h3 className="section-title">Scegli il tuo livello attuale</h3>
            <p className="micro-copy">Scelta rapida con avanzamento automatico.</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Principiante", value: "beginner" as const },
                { label: "Intermedio", value: "intermediate" as const },
                { label: "Avanzato", value: "advanced" as const },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    updateField("activity_level", option.value);
                    quickAdvanceAfterChoice();
                  }}
                  className={`chip-choice ${form.activity_level === option.value ? "chip-choice--active" : ""}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {currentStep === 5 ? (
          <div className="grid gap-3">
            <h3 className="section-title">Imposta stile alimentare</h3>
            <p className="micro-copy">Anche qui si passa alla pagina finale appena scegli.</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Bilanciato", value: "balanced" as const },
                { label: "Vegetariano", value: "vegetarian" as const },
                { label: "Vegano", value: "vegan" as const },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    updateField("food_style", option.value);
                    quickAdvanceAfterChoice();
                  }}
                  className={`chip-choice ${form.food_style === option.value ? "chip-choice--active" : ""}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {currentStep === 6 ? (
          <div className="grid gap-4">
            <h3 className="section-title">Ultimo step: extra mission setup</h3>

            <div className="grid gap-3 sm:grid-cols-2">
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

            <div className="quest-summary">
              <p>
                <strong>Alias:</strong> {form.nickname || "-"}
              </p>
              <p>
                <strong>Build:</strong> {form.age} anni, {form.height_cm} cm, {form.weight_kg} kg
              </p>
              <p>
                <strong>Goal:</strong> {goalLabel(form.goal)}
              </p>
              <p>
                <strong>Livello:</strong> {activityLabel(form.activity_level)}
              </p>
              <p>
                <strong>Nutrizione:</strong> {foodLabel(form.food_style)}
              </p>
            </div>
          </div>
        ) : null}
      </section>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="quest-footer">
        <button type="button" onClick={goBack} className="quest-ghost-btn" disabled={currentStep === 0 || loading}>
          Indietro
        </button>

        {currentStep < 3 || currentStep === 6 ? (
          <button type={currentStep === 6 ? "submit" : "button"} onClick={currentStep === 6 ? undefined : goNext} disabled={loading} className="submit-cta">
            {currentStep === 6 ? (loading ? "Creazione percorso..." : "Avvia missione") : "Continua"}
          </button>
        ) : (
          <span className="micro-copy">Seleziona una scelta per cambiare pagina.</span>
        )}
      </div>
    </form>
  );
}
