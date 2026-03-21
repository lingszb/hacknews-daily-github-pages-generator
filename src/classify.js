import { DIGEST_LIMITS } from './config.js';

function sortByRank(items) {
  return [...items].sort((a, b) => b.rankScore - a.rankScore || b.commentsCount - a.commentsCount);
}

export function classifyStories(stories, summariesForDate = {}) {
  const ask = sortByRank(stories.filter((story) => story.kind === 'ask')).slice(0, DIGEST_LIMITS.ask.max);
  const show = sortByRank(stories.filter((story) => story.kind === 'show')).slice(0, DIGEST_LIMITS.show.max);
  const links = sortByRank(stories.filter((story) => story.kind === 'link'));

  const headline = links.slice(0, DIGEST_LIMITS.headline.max).map((story) => ({
    ...story,
    sectionCandidate: 'headline',
    summary: summariesForDate.headline?.[story.id] || null
  }));

  const remainingLinks = links.filter((story) => !headline.some((entry) => entry.id === story.id));

  const discussion = sortByRank(remainingLinks)
    .sort((a, b) => b.commentsCount - a.commentsCount || b.rankScore - a.rankScore)
    .slice(0, DIGEST_LIMITS.discussion.max)
    .map((story) => ({ ...story, sectionCandidate: 'discussion' }));

  const deepread = remainingLinks
    .filter((story) => !discussion.some((entry) => entry.id === story.id))
    .slice(0, DIGEST_LIMITS.deepread.max)
    .map((story) => ({
      ...story,
      sectionCandidate: 'deepread',
      summary: summariesForDate.deepread?.[story.id] || null
    }));

  return {
    headline,
    discussion,
    deepread,
    ask: ask.map((story) => ({ ...story, sectionCandidate: 'ask' })),
    show: show.map((story) => ({ ...story, sectionCandidate: 'show' }))
  };
}

export function createDigest({ date, sections, buildMeta }) {
  const totalEntries = Object.values(sections).reduce((sum, items) => sum + items.length, 0);
  if (totalEntries < 1) {
    throw new Error('Unable to create a minimally publishable digest');
  }

  return {
    id: `digest-${date}`,
    date,
    title: `HN Daily Digest · ${date}`,
    sections,
    buildMeta: {
      generatedAt: new Date().toISOString(),
      ...buildMeta
    }
  };
}
