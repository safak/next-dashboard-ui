const DRAFT_KEY = "admission-draft";

export interface AdmissionDraft<T> {
  savedAt: number;
  step: number;
  data: T;
}

const DRAFT_EXPIRY = 24 * 60 * 60 * 1000; // 24 Hours

export function saveAdmissionDraft<T>(data: T, step: number) {
  if (typeof window === "undefined") return;

  const draft: AdmissionDraft<T> = {
    savedAt: Date.now(),
    step,
    data,
  };

  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function loadAdmissionDraft<T>() {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(DRAFT_KEY);

  if (!raw) return null;

  try {
    const draft = JSON.parse(raw) as AdmissionDraft<T>;

    // Expired
    if (Date.now() - draft.savedAt > DRAFT_EXPIRY) {
      localStorage.removeItem(DRAFT_KEY);
      return null;
    }

    return draft;
  } catch {
    localStorage.removeItem(DRAFT_KEY);
    return null;
  }
}

export function clearAdmissionDraft() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(DRAFT_KEY);
}