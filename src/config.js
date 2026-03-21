import { fileURLToPath } from 'node:url';

export const HN_BASE_URL = 'https://hacker-news.firebaseio.com/v0';
export const OUTPUT_DIR = new URL('../dist/', import.meta.url);
export const DATA_DIR = new URL('../data/', import.meta.url);
export const OUTPUT_DIR_PATH = fileURLToPath(OUTPUT_DIR);
export const DATA_DIR_PATH = fileURLToPath(DATA_DIR);

function normalizeSiteBasePath(value) {
  if (!value || value === '/') {
    return '';
  }

  let normalized = String(value).trim().replaceAll('\\', '/');

  if (/^[A-Za-z]:\//.test(normalized)) {
    normalized = normalized.split('/').filter(Boolean).at(-1) || '';
  }

  normalized = normalized.replace(/^\/+|\/+$/g, '');
  return normalized ? `/${normalized}` : '';
}

export const SITE_BASE_PATH = normalizeSiteBasePath(process.env.SITE_BASE_PATH);

export const DIGEST_LIMITS = {
  headline: { min: 1, max: 2 },
  discussion: { min: 0, max: 5 },
  deepread: { min: 0, max: 4 },
  ask: { min: 0, max: 3 },
  show: { min: 0, max: 3 }
};

export const FETCH_LIMITS = {
  top: 40,
  best: 30,
  new: 30
};

export const MIN_POINTS = 20;
export const MIN_COMMENTS = 5;
