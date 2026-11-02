# AGENTS.md

This is the public documentation site for Kitewell and Kitewell Pro, built from a copy of
open-source Kitewell. **Read [`CLAUDE.md`](CLAUDE.md) before any change**: it holds this
repository's rules for every coding agent, not only Claude. Above all:

- Never copy Kitewell Pro's source code, or anything from its `maintainers/` folder, into this
  repository. Pro pages explain features and setup; they don't reproduce Pro.
- Check every command, variable, default and label against the product's current code and
  CHANGELOG before writing it. The products are the source of truth, never this site.
- Document the latest release tag, not the products' `main`, and run `pnpm check:products` after
  changing a reference page or a page's `checked` version.
- Every page exists in English and Simplified Chinese, published together.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
