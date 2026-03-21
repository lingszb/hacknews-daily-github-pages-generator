import { MIN_COMMENTS, MIN_POINTS } from './config.js';
import { isoDate } from './utils.js';

function detectKind(item) {
  const title = (item.title || '').toLowerCase();
  if (title.startsWith('ask hn:')) return 'ask';
  if (title.startsWith('show hn:')) return 'show';
  return 'link';
}

function getDomain(item) {
  if (!item.url) return 'news.ycombinator.com';
  try {
    return new URL(item.url).hostname.replace(/^www\./, '');
  } catch {
    return 'news.ycombinator.com';
  }
}

function scoreStory(item) {
  const points = item.score || 0;
  const comments = item.descendants || 0;
  const ageHours = Math.max(1, (Date.now() - item.time * 1000) / (1000 * 60 * 60));
  const freshness = 48 / (ageHours + 2);
  return Number((points * 0.6 + comments * 1.2 + freshness).toFixed(2));
}

export function normalizeStory(item, digestDate) {
  if (!item || !item.id || !item.title || !item.time) {
    return null;
  }

  const hnUrl = `https://news.ycombinator.com/item?id=${item.id}`;
  const kind = detectKind(item);
  const originalUrl = item.url || hnUrl;

  return {
    id: String(item.id),
    hnUrl,
    originalUrl,
    title: item.title,
    domain: getDomain(item),
    author: item.by || 'unknown',
    publishedAt: item.time,
    points: item.score || 0,
    commentsCount: item.descendants || 0,
    kind,
    snapshotDate: digestDate || isoDate(item.time),
    rankScore: scoreStory(item),
    sectionCandidate: null,
    summary: null,
    whyItMatters: null,
    badges: []
  };
}

export function curateStories(stories) {
  const seen = new Set();
  const curated = [];
  const excluded = [];

  for (const story of stories) {
    if (!story) {
      excluded.push({ reason: 'invalid-item' });
      continue;
    }

    if (seen.has(story.id)) {
      excluded.push({ id: story.id, reason: 'duplicate-id' });
      continue;
    }
    seen.add(story.id);

    const eligible = story.kind !== 'link'
      ? story.commentsCount >= MIN_COMMENTS
      : story.points >= MIN_POINTS || story.commentsCount >= MIN_COMMENTS;

    if (!eligible) {
      excluded.push({ id: story.id, reason: 'below-threshold' });
      continue;
    }

    curated.push(story);
  }

  return { curated, excluded };
}
