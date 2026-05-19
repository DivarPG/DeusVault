import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export const resolveUploadsDir = (): string => {
  const candidates = [
    join(process.cwd(), 'uploads'),
    join(process.cwd(), 'server', 'uploads'),
    join(__dirname, '..', 'uploads'),
  ];

  const existing = candidates.find((dir) => existsSync(dir));
  if (existing) return existing;

  const fallback = candidates[0];
  mkdirSync(fallback, { recursive: true });
  return fallback;
};
