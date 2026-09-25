import { useMemo, useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { LevellinoGuide } from "./components/LevellinoGuide";
import { OnboardingForm } from "./components/OnboardingForm";
import type { OnboardingResponse } from "./types";
import { getOnboardingResponse, getUserId, saveOnboardingResponse, saveUserId } from "./utils/storage";

const defaultLevellinoLine =
  "Ciao, io sono Levellino. Ti preparo una missione personalizzata stile level-up: allenamento, alimentazione e progressione giornaliera.";

const experienceTags = [
  "ARISE mode",
  "Quest page flow",
  "Chibi mentor",
  "XP progressione",
  "Missioni giornaliere",
  "Streak chain",
];

export default function App() {
  const [onboarding, setOnboarding] = useState<OnboardingResponse | null>(() => getOnboardingResponse());
  const [userId, setUserId] = useState<number | null>(() => getUserId());

  const title = useMemo(() => {
    if (userId && onboarding) {
      return "Command Center del tuo Levelling";
    }
    return "ARISE: attiva il tuo sistema di crescita";
  }, [onboarding, userId]);

  function handleCompleted(response: OnboardingResponse) {
    setOnboarding(response);
    setUserId(response.user_id);
    saveUserId(response.user_id);
    saveOnboardingResponse(response);
  }

  return (
    <div className="app-shell">
      <div className="ambient-layer ambient-layer--one" />
      <div className="ambient-layer ambient-layer--two" />
      <div className="ambient-layer ambient-layer--three" />
      <div className="noise-overlay" />

      <main className="relative z-10 mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:px-8 md:py-10">
        <header className="hero-panel reveal-rise">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="hero-kicker">TrainingLeveling</p>
            <span className="status-pill">Shadow Quest UI</span>
          </div>

          <h1 className="hero-title">{title}</h1>
          <p className="hero-description">
            Interfaccia cinematica, onboarding a tappe e guida chibi: ogni scelta cambia pagina, ogni missione genera
            XP, ogni giorno alza il tuo livello.
          </p>

          <div className="tag-cloud">
            {experienceTags.map((tag) => (
              <span key={tag} className="badge-pill">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="reveal-rise delay-150">
          <LevellinoGuide text={onboarding?.levellino_intro ?? defaultLevellinoLine} />
        </div>

        <div className="reveal-rise delay-300">
          {userId && onboarding ? (
            <Dashboard userId={userId} onboarding={onboarding} />
          ) : (
            <OnboardingForm onCompleted={handleCompleted} />
          )}
        </div>
      </main>
    </div>
  );
}
