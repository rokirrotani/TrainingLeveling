import type { OnboardingInput, OnboardingResponse, ProgressResponse } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export async function createOnboardingProfile(payload: OnboardingInput): Promise<OnboardingResponse> {
  const response = await fetch(`${API_BASE_URL}/api/onboarding`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Errore onboarding: ${response.status}`);
  }

  return response.json() as Promise<OnboardingResponse>;
}

export async function fetchProgress(userId: number): Promise<ProgressResponse> {
  const response = await fetch(`${API_BASE_URL}/api/progress/${userId}`);

  if (!response.ok) {
    throw new Error(`Errore progress: ${response.status}`);
  }

  return response.json() as Promise<ProgressResponse>;
}

export async function submitDailyLog(input: {
  user_id: number;
  workout_done: boolean;
  nutrition_done: boolean;
  hydration_done: boolean;
  notes?: string;
  log_date: string;
}): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/progress/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Errore invio log giornaliero: ${response.status}`);
  }
}
