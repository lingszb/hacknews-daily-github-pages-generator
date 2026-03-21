# HN Daily Digest Generator

A static-site generator for Hacker News daily digests, designed for GitHub Pages.

## Commands

- `npm run build` — fetch candidate stories, curate sections, and generate `dist/`
- `npm run verify` — validate the generated digest structure and archive output

## GitHub Pages

For project pages, set `SITE_BASE_PATH` to the repository name or path prefix during build.
Example: `SITE_BASE_PATH=hacknews-daily-github-pages-generator npm run build`
The build also tolerates `/repo-name/` form and Git Bash path rewriting.
The included GitHub Actions workflow sets this automatically.

## Optional data

Create `data/summaries.json` to provide optional one-line Chinese summaries for `headline` and `deepread` entries.
Refer to `data/summaries.example.json` for the expected shape.
