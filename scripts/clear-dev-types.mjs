// Deletes the route types `next dev` writes to .next/dev/types; runs before `typecheck` and `build`.
//
// Next.js includes that folder in tsconfig.json (and re-adds it if removed), and both `tsc` and
// `next build` check it. Nothing refreshes it except `next dev` itself, so after pages move or are
// deleted (for example when updating to a new version) its stale types reference files that no
// longer exist, and type checking fails although the code is fine. `next typegen` and
// `next build` write fresh types to .next/types, so nothing is lost; a running `pnpm dev`
// regenerates its own the next time it starts or a route changes.
import { rmSync } from "node:fs";

rmSync(".next/dev/types", { recursive: true, force: true });
