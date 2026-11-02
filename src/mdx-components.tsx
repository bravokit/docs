import type { MDXComponents } from "mdx/types";
import { isValidElement } from "react";

import { Note, ProNote, Warning } from "@/features/docs/components/notes";
import { Link } from "@/i18n/navigation";

// How Markdown in content/ renders: Kitewell's design tokens instead of a typography plugin, and
// the components pages may use without importing them. Required by @next/mdx in the App Router.

/** The plain text inside rendered Markdown, for heading anchors. */
function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: React.ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

/** An anchor id that keeps letters of every language, so Chinese headings get one too. */
export function headingId(children: React.ReactNode): string {
  return textOf(children)
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

const components: MDXComponents = {
  h2: ({ children }) => (
    <h2
      id={headingId(children)}
      className="mt-12 mb-4 scroll-mt-20 font-heading text-xl font-semibold first:mt-0"
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={headingId(children)} className="mt-8 mb-3 scroll-mt-20 font-heading font-semibold">
      {children}
    </h3>
  ),
  p: (props) => <p className="my-4 leading-7" {...props} />,
  ul: (props) => <ul className="my-4 list-disc space-y-2 pl-6" {...props} />,
  ol: (props) => <ol className="my-4 list-decimal space-y-2 pl-6" {...props} />,
  li: (props) => <li className="leading-7" {...props} />,
  strong: (props) => <strong className="font-semibold" {...props} />,
  // Links within the site keep the reader's language; others open as usual.
  a: ({ href = "", children }) =>
    href.startsWith("/") ? (
      <Link href={href} className="font-medium underline underline-offset-4">
        {children}
      </Link>
    ) : (
      <a href={href} className="font-medium underline underline-offset-4">
        {children}
      </a>
    ),
  code: (props) => (
    <code
      className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em] [pre_&]:bg-transparent [pre_&]:p-0"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-lg border bg-muted/50 p-4 text-sm leading-6"
      {...props}
    />
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props) => <th className="border-b px-3 py-2 text-left font-medium" {...props} />,
  td: (props) => <td className="border-b px-3 py-2 align-top" {...props} />,
  blockquote: (props) => (
    <blockquote className="my-6 border-l-2 pl-4 text-muted-foreground" {...props} />
  ),
  hr: () => <hr className="my-10" />,
  Note,
  Warning,
  ProNote,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
