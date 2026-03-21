import fs from 'node:fs/promises';
import path from 'node:path';
import { DATA_DIR_PATH, OUTPUT_DIR_PATH } from './config.js';
import { fetchCandidateStories } from './fetch-hn.js';
import { normalizeStory, curateStories } from './normalize.js';
import { classifyStories, createDigest } from './classify.js';
import { renderSite } from './render.js';
import { ensureDir, isoDate, readOptionalJson, writeJsonFile } from './utils.js';

async function readArchive() {
  try {
    const content = await fs.readFile(path.join(DATA_DIR_PATH, 'digests', 'archive.json'), 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

function mergeArchive(previous, digest) {
  const others = previous.filter((item) => item.date !== digest.date);
  return [digest, ...others].sort((a, b) => b.date.localeCompare(a.date));
}

async function persistDigestData(digest, archive) {
  const digestsDir = path.join(DATA_DIR_PATH, 'digests');
  await ensureDir(digestsDir);
  await writeJsonFile(path.join(digestsDir, `${digest.date}.json`), digest);
  await writeJsonFile(path.join(digestsDir, 'archive.json'), archive);
}

async function main() {
  await ensureDir(path.resolve(OUTPUT_DIR_PATH));
  const summaries = await readOptionalJson(path.join(DATA_DIR_PATH, 'summaries.json'));

  const rawItems = await fetchCandidateStories();
  const digestDate = process.env.DIGEST_DATE || isoDate(Math.floor(Date.now() / 1000));
  const normalized = rawItems.map((item) => normalizeStory(item, digestDate));
  const { curated, excluded } = curateStories(normalized);
  const sections = classifyStories(curated, summaries[digestDate] || {});

  const digest = createDigest({
    date: digestDate,
    sections,
    buildMeta: {
      candidateCount: rawItems.length,
      curatedCount: curated.length,
      excludedCount: excluded.length
    }
  });

  const previousArchive = await readArchive();
  const fullArchive = mergeArchive(previousArchive, digest);
  const archive = fullArchive.map((entry) => ({
    id: entry.id,
    date: entry.date,
    title: entry.title,
    sectionCounts: Object.fromEntries(Object.entries(entry.sections).map(([key, value]) => [key, value.length])),
    buildMeta: entry.buildMeta
  }));

  await persistDigestData(digest, fullArchive);
  await renderSite({ digest, digestHistory: archive });
  await writeJsonFile(path.join(OUTPUT_DIR_PATH, 'build-meta.json'), {
    digestDate,
    candidateCount: rawItems.length,
    curatedCount: curated.length,
    excludedCount: excluded.length
  });

  console.log(`Built digest for ${digestDate} with ${curated.length} curated stories.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
