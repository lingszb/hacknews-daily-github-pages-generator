import fs from 'node:fs/promises';
import path from 'node:path';
import { OUTPUT_DIR_PATH, SITE_BASE_PATH } from './config.js';

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

function withBasePath(pathname) {
  const basePath = SITE_BASE_PATH.endsWith('/') ? SITE_BASE_PATH.slice(0, -1) : SITE_BASE_PATH;
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return basePath ? `${basePath}${normalizedPath}` : normalizedPath;
}

async function main() {
  const root = path.resolve(OUTPUT_DIR_PATH);
  const latest = await readJson(path.join(root, 'latest.json'));
  const archive = await readJson(path.join(root, 'archive', 'archive.json'));
  const homepageHtml = await fs.readFile(path.join(root, 'index.html'), 'utf8');
  const archiveHtml = await fs.readFile(path.join(root, 'archive', 'index.html'), 'utf8');

  if (!latest?.date) {
    throw new Error('latest digest is missing date');
  }

  const requiredSections = ['headline', 'discussion', 'deepread', 'ask', 'show'];
  for (const name of requiredSections) {
    if (!(name in latest.sections)) {
      throw new Error(`missing required section: ${name}`);
    }
  }

  for (const entry of [...latest.sections.headline, ...latest.sections.deepread]) {
    if (Array.isArray(entry.summary) || Array.isArray(entry.translatedTitle)) {
      throw new Error('invalid enhanced fields');
    }
  }

  for (const name of ['discussion', 'ask', 'show']) {
    for (const entry of latest.sections[name]) {
      if (entry.summary) {
        throw new Error(`summary must not appear in section ${name}`);
      }
    }
  }

  if (!archive.some((item) => item.date === latest.date)) {
    throw new Error('archive does not include latest digest');
  }

  if (!homepageHtml.includes('rel="icon"')) {
    throw new Error('homepage is missing favicon declaration');
  }

  if (!archiveHtml.includes('rel="icon"')) {
    throw new Error('archive page is missing favicon declaration');
  }

  if (!homepageHtml.includes(`href="${withBasePath('/archive/')}"`) || !homepageHtml.includes(`href="${withBasePath('/index.html')}"`)) {
    throw new Error('homepage navigation does not match configured base path');
  }

  if (!archiveHtml.includes(`href="${withBasePath(`/daily/${latest.date}/`)}"`) || !archiveHtml.includes(`href="${withBasePath('/index.html')}"`)) {
    throw new Error('archive page links do not match configured base path');
  }

  console.log('Verification passed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
