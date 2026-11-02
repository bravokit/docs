// Compares the site with local checkouts of Kitewell and Kitewell Pro, so a release that adds,
// removes or renames something is noticed before the pages fall behind. Run it before rechecking
// pages for a release: `pnpm check:products`.
//
// It needs the products' repositories, so CI can't run it (Pro is private). They're found at
// ../kitewell and ../kitewell-pro, or wherever KITEWELL_DIR and KITEWELL_PRO_DIR point; an
// edition with no checkout is skipped with a warning. It reads each product at its latest release
// tag, never its working tree: unreleased changes aren't documented.
//
// What it checks:
// - each page's `checked` version against the edition's latest release, so stale pages are listed;
// - the environment variables reference against every variable in each release's .env.example,
//   in both directions;
// - the command reference against each release's package.json scripts, in both directions.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const EDITIONS = {
  kitewell: process.env.KITEWELL_DIR ?? "../kitewell",
  pro: process.env.KITEWELL_PRO_DIR ?? "../kitewell-pro",
};
// Set by the tools, not in .env.example, and documented anyway.
const ENV_NOT_IN_EXAMPLE = ["NODE_ENV", "VERCEL"];
// Scripts the products use internally (hooks, CI helpers) that readers never run.
const SCRIPTS_NOT_DOCUMENTED = [/^pre/, /^post/, /^prepare$/, /^lint$/, /^typecheck$/];

const problems = [];
const warnings = [];

function git(dir, ...args) {
  return execFileSync("git", ["-C", dir, ...args], { encoding: "utf8" }).trim();
}

function latestRelease(dir) {
  const tag = git(dir, "tag", "--list", "v*", "--sort=-v:refname").split("\n")[0];
  return tag ? { tag, version: tag.slice(1) } : null;
}

function mdxFiles(dir) {
  return readdirSync(dir, { recursive: true })
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => join(dir, file));
}

// Code spans in a page's tables' first column: the names a reference page documents.
function documentedNames(file) {
  return new Set(
    [...readFileSync(file, "utf8").matchAll(/^\| `([^`]+)`/gm)].map((match) => match[1]),
  );
}

const releases = {};
for (const [edition, path] of Object.entries(EDITIONS)) {
  const dir = resolve(path);
  if (!existsSync(join(dir, ".git"))) {
    warnings.push(
      `${edition}: no checkout at ${dir} (set ${edition === "pro" ? "KITEWELL_PRO_DIR" : "KITEWELL_DIR"}); skipped`,
    );
    continue;
  }
  const release = latestRelease(dir);
  if (!release) {
    warnings.push(`${edition}: no v* release tag in ${dir}; skipped`);
    continue;
  }
  const show = (file) => git(dir, "show", `${release.tag}:${file}`);
  releases[edition] = {
    ...release,
    env: new Set([...show(".env.example").matchAll(/^([A-Z][A-Z0-9_]*)=/gm)].map((m) => m[1])),
    scripts: Object.keys(JSON.parse(show("package.json")).scripts ?? {}),
  };
}

// Pages checked against an older release than the latest.
for (const file of mdxFiles("content/en")) {
  const checked = readFileSync(file, "utf8").match(/checked:\s*\{([^}]*)\}/)?.[1] ?? "";
  for (const [, edition, version] of checked.matchAll(/(\w+):\s*"([^"]+)"/g)) {
    const release = releases[edition];
    if (release && release.version !== version) {
      problems.push(
        `${relative(".", file)}: checked against ${edition} ${version}, latest release is ${release.version}`,
      );
    }
  }
}

function compare(page, label, expected, extra = []) {
  const documented = documentedNames(page);
  for (const name of expected) {
    if (!documented.has(name)) problems.push(`${page}: ${label} ${name} isn't documented`);
  }
  for (const name of documented) {
    if (!expected.has(name) && !extra.includes(name)) {
      problems.push(`${page}: documents ${label} ${name}, which no release has`);
    }
  }
}

const loaded = Object.values(releases);
if (loaded.length > 0) {
  compare(
    "content/en/reference/environment-variables.mdx",
    "variable",
    new Set(loaded.flatMap((release) => [...release.env])),
    ENV_NOT_IN_EXAMPLE,
  );
  const commands = new Set(
    loaded
      .flatMap((release) => release.scripts)
      .filter((name) => !SCRIPTS_NOT_DOCUMENTED.some((pattern) => pattern.test(name))),
  );
  // The command reference shows arguments (`pnpm email:test <to>`); compare the script names.
  const page = "content/en/reference/commands.mdx";
  const documented = new Set(
    [...documentedNames(page)].map((name) => name.replace(/^pnpm /, "").split(" ")[0]),
  );
  for (const name of commands) {
    if (!documented.has(name)) problems.push(`${page}: command ${name} isn't documented`);
  }
  for (const name of documented) {
    if (!commands.has(name))
      problems.push(`${page}: documents command ${name}, which no release has`);
  }
}

for (const [edition, release] of Object.entries(releases)) {
  console.log(`${edition}: compared with ${release.tag}`);
}
for (const warning of warnings) console.warn(`warning: ${warning}`);
for (const problem of problems) console.error(`✖ ${problem}`);
if (problems.length > 0) process.exit(1);
console.log("The site matches the latest releases.");
