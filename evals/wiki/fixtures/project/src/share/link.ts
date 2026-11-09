const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export const expiresAt = (now: number) => new Date(now + THIRTY_DAYS);
