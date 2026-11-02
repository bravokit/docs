# Kitewell Docs

The documentation site for Kitewell and Kitewell Pro: guides and reference for setting up,
customizing, deploying and updating a SaaS built on them, in English and Simplified Chinese.

Built from a copy of open-source [Kitewell](https://github.com/xieqingfu/kitewell): Next.js 16,
Tailwind CSS v4, shadcn/ui and next-intl, with pages written in MDX. Every page is prerendered;
the site needs no database and no secrets.

## Run it

You need Node.js 22.12+ and pnpm (`corepack enable` installs the pinned version).

```bash
pnpm install
```

```bash
cp .env.example .env
```

```bash
pnpm dev
```

Open http://localhost:3000.

## Write a page

1. Add `content/en/<section>/<page>.mdx` and `content/zh/<section>/<page>.mdx`. Each starts with
   its `meta` (title, description, the editions it covers and the versions it was checked
   against); copy it from an existing page.
2. Add the page's name to its section in `src/features/docs/pages.ts`, which sets the navigation
   order.
3. Run `pnpm test`: it fails when a page is missing in a language, its `meta` is incomplete, the
   two languages differ in headings, code blocks or callouts, or a link points nowhere.

Pages can use `<Note>`, `<Warning>` and `<ProNote>` without importing them. `CLAUDE.md` has the
rules for what a page says, how it's written and what may be said about Kitewell Pro.

## Scripts

| Script          | What it does                                                  |
| --------------- | ------------------------------------------------------------- |
| `pnpm dev`      | Start the dev server                                          |
| `pnpm build`    | Production build (prerenders every page)                      |
| `pnpm start`    | Serve the production build                                    |
| `pnpm check`    | Typecheck, lint, format check and unit tests                  |
| `pnpm test`     | Unit tests, including the content checks                      |
| `pnpm test:e2e` | Every page in both languages, desktop and phone, in a browser |
| `pnpm format`   | Format every file with Prettier                               |

## Project structure

```
content/<locale>/       the pages, one MDX file per page and language
src/
├─ app/[locale]/(site)/ the home page and the docs route ([...slug])
├─ features/docs/       the page list (pages.ts), loading pages, navigation, callouts
├─ features/site/       header and footer
├─ mdx-components.tsx   how Markdown renders, and the components pages may use
├─ config/site.ts       the site's name and the products it documents
└─ i18n/                languages and interface text (messages/<locale>/core.json)
e2e/                    Playwright tests
```

## Licenses

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md): Kitewell's and shadcn/ui's MIT notices
stay with the code copied from them.
