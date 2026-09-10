# AI-Group Software and Networks Algorithms LLC — public website

Static, multilingual (EN / FR / PT / ES) company website with the AI-Global Educational Network (AI-GEN) section. Serves clients in every country; no regional restriction. No build step, no dependencies. Deployable to GitHub Pages in minutes.

## Go live today (GitHub Pages)

1. Create a new repository named `ai-group` under the `Alongiti2` account (public).
2. Upload every file and folder in this package to the root of that repository (keep the `.nojekyll` file).
3. Repository → Settings → Pages → Source: "Deploy from a branch" → Branch `main`, folder `/ (root)` → Save.
4. In one or two minutes the site is live at **https://alongiti2.github.io/ai-group/**

Command-line alternative:

    cd ai-group
    git init && git add -A && git commit -m "AI-Group website"
    git branch -M main
    git remote add origin https://github.com/Alongiti2/ai-group.git
    git push -u origin main

Then enable Pages as in step 3.

## Three things to change before or right after launch

All in `site.config.js`:

| Setting | What to do |
|---|---|
| `email` | Replace `info@example.com` with the company email. It appears in the footer, contact page, security page, and as the form fallback. |
| `logo` | Replace `assets/logo.svg` with your logo (SVG preferred; PNG works). Keep it roughly square. |
| `formEndpoint` | Forms need a server. Free option: create a form at https://formspree.io, paste the endpoint URL (`https://formspree.io/f/xxxx`). Until then, every submission opens the visitor's email app pre-filled with the request and its ID, so nothing is lost. |

Optional: `phone`, `linkedin`, `baseUrl` (if you later use a custom domain, update `baseUrl`, `robots.txt`, and `sitemap.xml`).

## Custom domain later

Add a `CNAME` file containing your domain, point DNS at GitHub Pages, and update `baseUrl` in `site.config.js`.

## How the site works

- `i18n/en.json`, `fr.json`, `pt.json`, `es.json` — every word on the site. Edit copy here; the HTML contains no text.
- Language is detected from the browser on first visit, overridable with EN | FR | PT | ES, remembered in the browser, and carried in the URL (`?lang=fr`) so links can be shared in a specific language. `hreflang` links and a multilingual sitemap are generated for SEO.
- To add a fifth language: copy `en.json` to e.g. `sw.json`, translate, add `"sw"` to `LANGS` and `LANG_NAMES` in `js/main.js`, and add the language to `sitemap.xml`. Nothing else changes.
- Pages: home, services, process (18 steps), industries, global services, **departments** (`departments.html`: AI Cloud Security Solutions, Digital Business Hub, Principal Cybersecurity, Software Engineering, AI-GEN), **AI-GEN education** (`education.html`: career pathways, learning model, audiences, waiting list), security, about, contact, start-project, privacy, terms. All render from the dictionaries.
- Project requests generate an ID like `AIG-20260903-7F3K` in the browser.
- No cookies, no trackers. Only the language preference is stored locally.

## What this is not (yet)

This is Phase 5 of the platform plan (public multilingual website). Customer portal, admin dashboard, CRM, quotations, scheduling, AI assistant, and the AI phone receptionist require a backend (NestJS + PostgreSQL) on real hosting, and are the next phases. The site is written so those features can be added behind it without redesigning it: the design system, dictionaries, and page structure carry over.
