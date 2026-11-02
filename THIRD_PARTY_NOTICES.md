# Third-party notices

This site is built on the open-source software below, which keeps its own licenses.

## Source code included in this repository

**Kitewell** — the site started as a copy of Kitewell (`github.com/xieqingfu/kitewell`): its
configuration, layout, languages, theme and components. This notice must stay with that code:

```
MIT License

Copyright (c) 2026 The Kitewell authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**shadcn/ui** — the components in `src/components/ui/` were generated with the shadcn CLI and
then edited. This notice must stay with them:

```
MIT License

Copyright (c) 2023 shadcn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Fonts and icons

- **Geist** and **Geist Mono** (Vercel), SIL Open Font License 1.1. Downloaded from Google Fonts
  at build time and served with the site, which the license allows.
- **Lucide** icons, ISC License, bundled into the site.

## npm packages

Installed by `pnpm install`, not included in this repository. Direct dependencies and their
licenses (from each package's `package.json`):

| Package                                                           | License    |
| ----------------------------------------------------------------- | ---------- |
| next, react, react-dom                                            | MIT        |
| @next/mdx, @mdx-js/loader, @mdx-js/react, @mdx-js/mdx, @types/mdx | MIT        |
| remark-gfm                                                        | MIT        |
| @base-ui/react, cn, tw-animate-css                                | MIT        |
| class-variance-authority                                          | Apache-2.0 |
| zod, next-themes, server-only, next-intl                          | MIT        |
| lucide-react                                                      | ISC        |
| tailwindcss, @tailwindcss/turbopack, shadcn (CLI)                 | MIT        |
| typescript, @playwright/test                                      | Apache-2.0 |
| vitest, @vitejs/plugin-react, jsdom                               | MIT        |
| eslint, eslint-config-next, prettier, prettier-plugin-tailwindcss | MIT        |

To re-check after changing dependencies: `pnpm licenses list --prod`.
