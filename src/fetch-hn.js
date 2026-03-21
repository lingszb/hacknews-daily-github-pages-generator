import { FETCH_LIMITS, HN_BASE_URL } from './config.js';

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json();
}

async function fetchStoryIds(listName, limit) {
  const ids = await fetchJson(`${HN_BASE_URL}/${listName}stories.json`);
  return ids.slice(0, limit);
}

async function fetchItem(id) {
  return fetchJson(`${HN_BASE_URL}/item/${id}.json`);
}

export async function fetchCandidateStories() {
  const [topIds, bestIds, newIds] = await Promise.all([
    fetchStoryIds('top', FETCH_LIMITS.top),
    fetchStoryIds('best', FETCH_LIMITS.best),
    fetchStoryIds('new', FETCH_LIMITS.new)
  ]);

  const ids = [...new Set([...topIds, ...bestIds, ...newIds])];
  const items = await Promise.all(ids.map((id) => fetchItem(id).catch(() => null)));
  return items.filter(Boolean);
}
