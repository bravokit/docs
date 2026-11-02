// The app's languages. English keeps today's addresses (/pricing); the others live under their
// prefix (/zh/pricing). To add a language, add it here and a matching messages/<code>/ folder
// (docs/i18n.md).
//
// Plain values with no imports, so next.config.ts can read them: Node loads the config as
// CommonJS, and importing next-intl there prints an ExperimentalWarning on every start.
export const LOCALES = ["en", "zh"] as const;

export const DEFAULT_LOCALE = "en";
