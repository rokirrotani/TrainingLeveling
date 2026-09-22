import { useMemo, useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { LevellinoGuide } from "./components/LevellinoGuide";
import { OnboardingForm } from "./components/OnboardingForm";
import type { OnboardingResponse } from "./types";
import { getOnboardingResponse, getUserId, saveOnboardingResponse, saveUserId } from "./utils/storage";

const defaultLevellinoLine =
  "Ciao, io sono Levellino. Ti preparo una missione personalizzata stile level-up: allenamento, alimentazione e progressione giornaliera.";

export default function App() {
  const [onboarding, setOnboarding] = useState<OnboardingResponse | null>(() => getOnboardingResponse());
  const [userId, setUserId] = useState<number | null>(() => getUserId());

  const title = useMemo(() => {
    if (userId && onboarding) {
      return "La tua dashboard di crescita";
    }
    return "Inizia la tua trasformazione con Levellino";
  }, [onboarding, userId]);

  function handleCompleted(response: OnboardingResponse) {
    setOnboarding(response);
    setUserId(response.user_id);
    saveUserId(response.user_id);
    saveOnboardingResponse(response);
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1b385b_0%,_#0f1a2b_45%,_#070b14_100%)] p-4 text-ink md:p-8">
      <div className="mx-auto grid w-full max-w-6xl gap-6">
        <header className="rounded-3xl border border-sky/20 bg-white/95 px-6 py-7 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">TrainingLeveling</p>
          <h1 className="mt-2 text-3xl font-black leading-tight text-ink md:text-4xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm text-ink/75 md:text-base">
            Crea un percorso completo e personalizzabile: obiettivi fitness, alimentazione, missioni giornaliere,
            avanzamento a livelli e monitoraggio costante.
          </p>
        </header>

        <LevellinoGuide text={onboarding?.levellino_intro ?? defaultLevellinoLine} />

        {userId && onboarding ? <Dashboard userId={userId} onboarding={onboarding} /> : <OnboardingForm onCompleted={handleCompleted} />}
      </div>
    </div>
  );
}
