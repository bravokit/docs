// The site's name and the products it documents, used in the header, footer, pages and search
// metadata. Change them here, never in components. The tagline and description are text in each
// language: "site" in src/i18n/messages/*/core.json.
export const site = {
  name: "Kitewell Docs",
  company: "BravoKit",
  products: {
    kitewell: {
      name: "Kitewell",
      /** Public, MIT: the docs may link to its files. */
      repository: "https://github.com/xieqingfu/kitewell",
    },
    // Pro's repository is private, so the site never links to it.
    pro: { name: "Kitewell Pro" },
  },
} as const;
