# CLAUDE.md

Standing rules for coding and writing sessions in this repository.

## What this repo is

`bravokit/docs` is the public documentation site for **Kitewell** and **Kitewell Pro**. It helps
people choose, set up, customize, deploy and update them, and get the most out of every feature.
Kitewell and Pro are SaaS starter kits: Next.js with sign-in, organizations (teams),
subscription billing, email, background jobs and a marketing site.

The site itself is built from a copy of open-source Kitewell. It keeps Kitewell's stack and
conventions and only what a docs site needs (see "The site's code").

| Repository                         | What it is   | Code                                   |
| ---------------------------------- | ------------ | -------------------------------------- |
| `github.com/xieqingfu/kitewell`    | Kitewell     | public, MIT                            |
| `github.com/bravokit/kitewell-pro` | Kitewell Pro | private, commercial (buyers only)      |
| `github.com/bravokit/docs`         | this site    | the site's code; its content is public |

Pro is Kitewell plus optional modules. Everything in Kitewell is also in Pro.

@AGENTS.md

AGENTS.md's Next.js block matters here: the site runs Next.js 16 with Cache Components, which
differs from older Next.js in ways that are easy to get wrong from memory. Read the bundled guide
in `node_modules/next/dist/docs/` before writing routing, caching or data-fetching code.

## The edition boundary (non-negotiable)

This site is public, and Pro's code is not. Pro pages explain what a feature does and how to set
it up, so readers can judge it and buyers can use it. Pages never become a way to get Pro
without buying it.

- **Never copy Pro source code** into this repository: no files, functions or components, and
  no large excerpts. A Pro page may show what a buyer types themselves: commands
  (`pnpm module:remove api`), environment variable names and example values, short config
  entries, and the shape of an HTTP request or webhook payload.
- **Never use anything from Pro's `maintainers/` folder**: seller notes, pricing drafts, license
  drafts, briefs, the bug log. Prices and license terms appear only as the owner publishes them;
  ask for the wording and link to the official page instead of restating terms.
- Kitewell is MIT, so its code and text may be quoted and copied. Code copied from Kitewell keeps
  Kitewell's copyright notice (`THIRD_PARTY_NOTICES.md`), and so do shadcn/ui components.
- No secrets, private URLs, customer names or license IDs anywhere: not in pages, examples,
  screenshots or commits. Use `example.com` addresses and obvious placeholder keys
  (`sk_test_...`, `kw_...`).
- Pro's repository is private, so never link to its files. Link to the Pro page on this site, or
  to a Kitewell file on GitHub when the code is the same in both.

## Sources of truth

Docs follow the products, never the other way round. When they disagree, in this order:

1. **The product's code** at its latest release: what the code does is what the page says.
2. **The product's `CHANGELOG.md`**: versions, what changed, upgrade notes.
3. **The product's own `docs/*.md`** (they ship inside each repository) and `README.md`.
4. **This site.**

Before writing or changing a page, read the code and the in-repo doc it covers in the current
Kitewell or Pro checkout (machine paths go in `CLAUDE.local.md`, which is gitignored). Don't
write from memory or from an older page: names, defaults, limits and commands change between
versions. If a product's in-repo doc is wrong, tell the user so it's fixed in that repository;
don't change other repositories from here unless asked.

Things that are easy to get wrong, and where to check them:

| Fact                                    | Check it in (both editions unless noted)                         |
| --------------------------------------- | ---------------------------------------------------------------- |
| Commands and scripts                    | `package.json` `scripts`                                         |
| Environment variables, defaults         | `src/lib/env-schema.ts` and `.env.example`                       |
| Plans, limits, trials, prices           | `src/lib/billing/plans.ts` (Pro's values differ from Kitewell's) |
| Roles and who may do what               | `src/lib/auth/roles.ts`, the feature's `actions.ts`              |
| Where a visitor ends up                 | the "User journeys" table in the product's `CLAUDE.md`           |
| Pro modules and what removing one takes | Pro's `docs/modules.md` and `scripts/modules/catalog.mjs`        |
| Supported versions (Node, Next.js)      | `package.json` `engines` and dependencies                        |
| Interface labels                        | `src/i18n/messages/<locale>/*.json` (quote labels exactly)       |

## What the site covers

Organize by what a reader is trying to do, not by folder:

- **Start**: what Kitewell and Pro are, choosing an edition, requirements, local setup in
  minutes (`pnpm dev:setup`, `pnpm db:up`, `pnpm dev`), the project's layout.
- **Guides**, one per area, matching the products' docs: auth, organizations and roles, billing
  (Stripe, the local test provider; Paddle in Pro), email (SMTP providers, the outbox), jobs,
  notifications, languages, the public demo, deployment, updating to a new version.
- **Building your product**: adding a feature by copying the reference feature
  (`pnpm new:feature`), the extension points, rebranding (`src/config/site.ts`), plans and
  limits, pitfalls.
- **Pro modules**: one page each (account security, admin, enterprise sign-in, Paddle, trials and
  seats, uploads, API, webhooks, usage billing, single sign-on, activity log) and removing the
  ones a project doesn't need.
- **Reference**: commands, environment variables, a changelog per edition.

A new product feature or module gets its page in the same change that documents its release.
`SECTIONS` in `src/features/docs/pages.ts` is what exists today; the list above is the plan, and
most of it is still to write. Before writing a guide, check whether a reference page already
covers its settings or commands, and link to it.

### Reference pages

Reference pages are the one place each setting and command is explained, so a product change is
fixed once, not in every guide that mentions it.

- **Every item says what it's for**, not only its name: its purpose, default, when it's required
  (and by which other setting), accepted values, and what goes wrong when it's wrong. The
  environment variables page is the model.
- Guides link to the reference for the full list and show only the few values their steps set.
- `pnpm check:products` compares the environment variable and command references with each
  product's latest release tag (`.env.example`, `package.json` scripts), in both directions, and
  lists every page checked against an older release. It reads the product checkouts, so it runs
  locally, not in CI (paths in `CLAUDE.local.md`). A new reference page that lists product items
  gets a comparison there in the same change.

### When a product releases

1. Run `pnpm check:products`. It names the pages behind and the items added or removed.
2. Read the release's CHANGELOG entry and upgrade notes, then each listed page against the code
   at that tag (`git show v1.1.0:<path>`), never the working tree: the products' `main` holds
   unreleased changes, which aren't documented.
3. Update the pages in both languages and raise their `checked` versions. A page that needed no
   change still gets its version raised, since it was checked.
4. `pnpm check:products` passes, then the quality gates below.

### Every page

- Says which edition it applies to with the edition badge at the top: **Kitewell and Pro**, or
  **Pro**. On a shared page, Pro-only differences go in a clearly marked Pro note, not mixed
  into the steps.
- Says which version it was checked against (`Kitewell 1.0.0`, `Pro 2.0.0`) in its front
  matter, and is rechecked when a release changes what it covers. Unreleased changes (a
  CHANGELOG's "Unreleased" section) aren't documented as available.
- Starts with one or two sentences on what the reader will have at the end, then steps they can
  follow in order, then what to do when it goes wrong.
- Links to the next thing the reader will need, and to the related page in the other edition's
  section where there is one.

## Writing style

- Plain, direct, second person ("you"), present tense. Short sentences; one idea per paragraph.
  Explain _why_ when a step looks optional, never only _what_.
- Commands in fenced blocks tagged with their shell; one command per block when they're run one
  at a time. Show `pnpm`, matching the products.
- Every command, variable, path and label is checked against the source (above) before it's
  written. Interface labels are quoted exactly as the app shows them, in bold: **Start the live
  demo**.
- Code blocks are complete enough to paste, or say clearly which part goes where.
- No marketing superlatives on guide pages. Comparisons between editions are factual and fair:
  Kitewell is a complete product, not a teaser.
- Screenshots come from a running copy with sample data only, in light mode, at desktop width,
  and are replaced when the interface they show changes.

## Languages

The site is in **English and Simplified Chinese**, like the products: English at plain paths,
Chinese under `/zh` (next-intl, Kitewell's setup).

- English is written first. Every page has a Chinese version with the same slug, the same
  headings and the same code blocks, published in the same change. Only a `text` block, such as
  a folder tree with notes, is translated, line for line. Never leave a Chinese page
  behind an English one.
- Translate meaning, not word for word, in natural Simplified Chinese. Code, commands, file
  paths, variable names and product names (Kitewell, Kitewell Pro, Stripe, Better Auth) stay in
  English.
- Interface labels are quoted as the Chinese interface shows them (the product's
  `src/i18n/messages/zh/*.json`), so readers can find them on screen.
- Use the products' own terms: organization 组织, member 成员, owner 所有者, admin 管理员,
  project 项目, plan 套餐, Free 免费版, billing 计费, settings 设置, dashboard 控制台. A new term
  is decided once and reused.
- The site's interface text follows Kitewell's rule: every string a user sees is a message key in
  every language's folder, never text in code.

## The site's code

Built from a copy of Kitewell, so Kitewell's `CLAUDE.md` rules apply here wherever the code is
the same: Next.js 16 App Router with Cache Components, TypeScript strict, Tailwind CSS v4 with
shadcn/ui and design tokens (light and dark), next-intl, Prettier, ESLint, Vitest and
Playwright, pnpm, Node 22.12+.

- **Keep only what a docs site needs**: the marketing layout (header, footer), languages, theme,
  search metadata (sitemap, robots, Open Graph images), and the docs pages. Leave out sign-in,
  organizations, billing, the database, jobs and email. With them gone, the site needs no
  environment secrets and every page is prerendered.
- **Pages are MDX** in `content/<locale>/<section>/<page>.mdx` (`@next/mdx`), each exporting
  its `meta` (title, description, editions, checked versions; the type is `PageMeta` in
  `src/features/docs/pages.ts`). The title is the page's only h1, so headings start at `##`.
  A new page is its files in every language plus its name in `SECTIONS` in `pages.ts`, which sets
  the navigation order. One route renders them all: `src/app/[locale]/(site)/[...slug]/page.tsx`.
- **Unknown addresses get a real 404 from the proxy**, which rewrites any address that's not a
  page to `[locale]/page-not-found` (prerendered as a 404). Don't rely on the docs route's own
  `notFound()` for the status: it streams a prerendered shell first, which has already answered 200. Neither `instant = false`, nor turning off `partialPrefetching` (deprecated), nor setting a
  status on the proxy's response fixes that. `e2e/pages.spec.ts` checks the status.
- **`params` are read inside `<Suspense>`.** With `partialPrefetching`, every link to a route
  shares one App Shell, so awaiting `params` at the top of a page makes `next dev` report "URL
  data outside of Suspense". The docs route passes the `params` promise to a child inside
  `<Suspense>` (Next's "Stream" fix); `instant = false` would silence it by making every docs
  navigation wait. `generateMetadata` may await `params`.
- Links between pages are root paths without the language (`/start/quick-start`): they keep the
  reader's language. How Markdown renders, and the components pages use without importing, are
  in `src/mdx-components.tsx`.
- Callouts are `<Note>`, `<Warning>` and `<ProNote>` (`src/features/docs/components/notes.tsx`),
  with a blank line after the opening tag and before the closing one, so their content is
  Markdown. Without them it's JSX text, which Prettier rewraps, and a line break inside a Chinese
  sentence then renders as a space.
- Use the components that exist (Kitewell's `src/components/` and the site's own in
  `src/features/docs/components/`) before writing a new one. A new shared component is made only
  when a second page needs it.
- Kitewell's dependency rules hold for anything added (stable, secure, permissively licensed,
  extensible; check the latest stable version, don't rely on memory). Name the library, version
  and license when reporting the change.
- Never hard-code the site's name or links to the products in components: keep them in one
  config file, as Kitewell keeps `site`.
- When a newer Kitewell version changes code this site shares, bring the change over by hand and
  say which Kitewell commit it came from in the commit message.

## Quality gates (a change is done when these pass)

- `pnpm check` (typecheck, lint, format check, unit tests) and `pnpm build` pass with zero
  errors, and the build prerenders every page.
- `src/features/docs/content.test.ts` passes: every listed page exists in every language and
  nothing unlisted does, each page compiles with complete `meta`, translations match the English
  page's headings, code blocks, callouts, editions and versions, callouts hold Markdown, and
  every internal link points to a page. Extend it rather than relying on review.
- Playwright opens every page in both languages, at desktop and phone width, light and dark: no
  console errors, no horizontal scrolling, and a page found from the navigation as well as by
  URL.
- `pnpm check:products` passes when a reference page or a `checked` version changed.
- Every command and step on a changed page has been run against a current checkout of the
  edition it documents, or the report says which ones weren't.
- Report what you verified and what you didn't; quote actual output rather than "should work".

## How to work here

- If a requirement is ambiguous, ask instead of assuming, above all about what may be said about
  Pro, prices or licensing.
- Commit or push only when asked. Work on a branch, not on `main`.
- Machine-specific notes (paths to the Kitewell and Pro checkouts, tool quirks of one computer)
  go in `CLAUDE.local.md`, which is gitignored.
