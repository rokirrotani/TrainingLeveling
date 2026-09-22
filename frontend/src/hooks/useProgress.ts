import { useCallback, useEffect, useState } from "react";
import { fetchProgress } from "../api/client";
import type { ProgressResponse } from "../types";

export function useProgress(userId: number | null) {
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) {
      setProgress(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchProgress(userId);
      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { progress, loading, error, refresh };
}
