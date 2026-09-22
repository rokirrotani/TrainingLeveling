const USER_ID_KEY = "training_leveling_user_id";

let inMemoryUserId: number | null = null;

export function saveUserId(userId: number): void {
  inMemoryUserId = userId;
  try {
    window.localStorage.setItem(USER_ID_KEY, String(userId));
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
