import type { OnboardingResponse } from "../types";

const USER_ID_KEY = "training_leveling_user_id";
const ONBOARDING_KEY = "training_leveling_onboarding";

let inMemoryUserId: number | null = null;
let inMemoryOnboarding: OnboardingResponse | null = null;

export function saveUserId(userId: number): void {
  inMemoryUserId = userId;
  try {
    window.localStorage.setItem(USER_ID_KEY, String(userId));
  } catch {
    // localStorage can fail in private mode or with strict browser extensions.
  }
}

export function saveOnboardingResponse(onboarding: OnboardingResponse): void {
  inMemoryOnboarding = onboarding;
  try {
    window.localStorage.setItem(ONBOARDING_KEY, JSON.stringify(onboarding));
  } catch {
    // localStorage can fail in private mode or with strict browser extensions.
  }
}

export function getUserId(): number | null {
  if (inMemoryUserId !== null) {
    return inMemoryUserId;
  }

  try {
    const raw = window.localStorage.getItem(USER_ID_KEY);
    if (!raw) {
      return null;
    }
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? null : parsed;
  } catch {
    return inMemoryUserId;
  }
}

export function getOnboardingResponse(): OnboardingResponse | null {
  if (inMemoryOnboarding) {
    return inMemoryOnboarding;
  }

  try {
    const raw = window.localStorage.getItem(ONBOARDING_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as OnboardingResponse;
    inMemoryOnboarding = parsed;
    return parsed;
  } catch {
    return inMemoryOnboarding;
  }
}
