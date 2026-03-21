import path from 'node:path';
import { OUTPUT_DIR_PATH, SITE_BASE_PATH } from './config.js';
import { ensureDir, escapeHtml, formatDisplayDate, hoursAgo, writeJsonFile, writeTextFile } from './utils.js';

function renderEntry(entry, primaryActionLabel, primaryActionHref, secondaryActionLabel = 'HN Discussion', secondaryActionHref = entry.hnUrl) {
  const summary = entry.summary ? `<p class="summary">${escapeHtml(entry.summary)}</p>` : '';
  return `
    <article class="card card-${escapeHtml(entry.sectionCandidate)}">
      <h3><a href="${escapeHtml(primaryActionHref)}">${escapeHtml(entry.title)}</a></h3>
      ${summary}
      <p class="meta">${escapeHtml(entry.domain)} · ${entry.points} points · ${entry.commentsCount} comments · ${escapeHtml(hoursAgo(entry.publishedAt))}</p>
      <p class="actions"><a class="button primary" href="${escapeHtml(primaryActionHref)}">${escapeHtml(primaryActionLabel)}</a> <a class="button" href="${escapeHtml(secondaryActionHref)}">${escapeHtml(secondaryActionLabel)}</a></p>
    </article>
  `;
}

function renderSection(title, entries, renderer) {
  const body = entries.length ? entries.map(renderer).join('\n') : '<p class="empty">No entries selected for this section today.</p>';
  return `<section><h2>${escapeHtml(title)}</h2>${body}</section>`;
}

function withBasePath(pathname) {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE_BASE_PATH}${normalizedPath}`;
}

function renderDigestPage(digest, latestDate) {
  const sections = digest.sections;
  const faviconHref = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 rx=%2212%22 fill=%22%23111827%22/%3E%3Ctext x=%2232%22 y=%2242%22 font-size=%2232%22 text-anchor=%22middle%22 fill=%22white%22 font-family=%22Arial,sans-serif%22%3EHN%3C/text%3E%3C/svg%3E';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(digest.title)}</title>
  <link rel="icon" href="${faviconHref}">
  <style>
    body { font-family: Arial, sans-serif; margin: 0 auto; max-width: 880px; padding: 24px; line-height: 1.5; color: #111827; }
    header, section, footer { margin-bottom: 32px; }
    nav { display: flex; gap: 12px; flex-wrap: wrap; margin: 12px 0; }
    .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
    .card-headline { background: #f9fafb; }
    .meta { color: #4b5563; font-size: 14px; }
    .summary { color: #1f2937; }
    .button { display: inline-block; border: 1px solid #d1d5db; border-radius: 999px; padding: 6px 12px; text-decoration: none; color: #111827; font-size: 14px; }
    .button.primary { background: #111827; color: white; }
    .empty { color: #6b7280; font-style: italic; }
  </style>
</head>
<body>
  <header>
    <p>HN Daily Digest</p>
    <h1>${escapeHtml(formatDisplayDate(digest.date))}</h1>
    <p>Latest digest date: ${escapeHtml(latestDate)}</p>
    <nav>
      <a href="${withBasePath('/index.html')}">Today</a>
      <a href="${withBasePath('/archive/')}">Archive</a>
    </nav>
  </header>

  ${renderSection('今日头条', sections.headline, (entry) => renderEntry(entry, 'Read Article', entry.originalUrl))}
  ${renderSection('热门讨论', sections.discussion, (entry) => renderEntry(entry, 'HN Discussion', entry.hnUrl, 'Read', entry.originalUrl))}
  ${renderSection('值得深读', sections.deepread, (entry) => renderEntry(entry, 'Read Article', entry.originalUrl))}
  ${renderSection('Ask HN', sections.ask, (entry) => renderEntry(entry, 'Open on HN', entry.hnUrl, 'Original Link', entry.originalUrl))}
  ${renderSection('Show HN', sections.show, (entry) => renderEntry(entry, 'View Project', entry.originalUrl))}

  <footer>
    <p>Generated from Hacker News at ${escapeHtml(digest.buildMeta.generatedAt)}.</p>
  </footer>
</body>
</html>`;
}

function renderArchivePage(digests) {
  const faviconHref = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 rx=%2212%22 fill=%22%23111827%22/%3E%3Ctext x=%2232%22 y=%2242%22 font-size=%2232%22 text-anchor=%22middle%22 fill=%22white%22 font-family=%22Arial,sans-serif%22%3EHN%3C/text%3E%3C/svg%3E';
  const items = digests.map((digest) => `<li><a href="${withBasePath(`/daily/${escapeHtml(digest.date)}/`)}">${escapeHtml(digest.date)}</a></li>`).join('\n');
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>HN Daily Digest Archive</title><link rel="icon" href="${faviconHref}"></head>
<body>
  <h1>HN Daily Digest Archive</h1>
  <p><a href="${withBasePath('/index.html')}">Back to latest digest</a></p>
  <ul>${items}</ul>
</body>
</html>`;
}

export async function renderSite({ digest, digestHistory }) {
  const outputRoot = path.resolve(OUTPUT_DIR_PATH);
  const dailyDir = path.join(outputRoot, 'daily', digest.date);
  const archiveDir = path.join(outputRoot, 'archive');

  await ensureDir(dailyDir);
  await ensureDir(archiveDir);

  const latestDate = digestHistory[0]?.date || digest.date;
  const digestHtml = renderDigestPage(digest, latestDate);
  await writeTextFile(path.join(outputRoot, 'index.html'), digestHtml);
  await writeTextFile(path.join(dailyDir, 'index.html'), digestHtml);
  await writeTextFile(path.join(archiveDir, 'index.html'), renderArchivePage(digestHistory));

  await writeJsonFile(path.join(outputRoot, 'latest.json'), digest);
  await writeJsonFile(path.join(dailyDir, 'digest.json'), digest);
  await writeJsonFile(path.join(archiveDir, 'archive.json'), digestHistory);
}
