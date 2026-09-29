import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const languageAliases = {
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  html: "html",
  xml: "html",
  vue: "vue",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  py: "python",
  rb: "ruby",
  rs: "rust",
  yml: "yaml",
  md: "markdown",
  csharp: "csharp",
  cs: "csharp",
};

const languageLoaders = {
  javascript: () => import("@shikijs/langs/javascript"),
  jsx: () => import("@shikijs/langs/jsx"),
  typescript: () => import("@shikijs/langs/typescript"),
  tsx: () => import("@shikijs/langs/tsx"),
  html: () => import("@shikijs/langs/html"),
  vue: () => import("@shikijs/langs/vue"),
  css: () => import("@shikijs/langs/css"),
  scss: () => import("@shikijs/langs/scss"),
  json: () => import("@shikijs/langs/json"),
  bash: () => import("@shikijs/langs/bash"),
  python: () => import("@shikijs/langs/python"),
  ruby: () => import("@shikijs/langs/ruby"),
  java: () => import("@shikijs/langs/java"),
  kotlin: () => import("@shikijs/langs/kotlin"),
  go: () => import("@shikijs/langs/go"),
  rust: () => import("@shikijs/langs/rust"),
  c: () => import("@shikijs/langs/c"),
  cpp: () => import("@shikijs/langs/cpp"),
  csharp: () => import("@shikijs/langs/csharp"),
  sql: () => import("@shikijs/langs/sql"),
  markdown: () => import("@shikijs/langs/markdown"),
  yaml: () => import("@shikijs/langs/yaml"),
  dockerfile: () => import("@shikijs/langs/dockerfile"),
  diff: () => import("@shikijs/langs/diff"),
};

const highlighterPromise = createHighlighterCore({
  themes: [
    import("@shikijs/themes/catppuccin-latte"),
    import("@shikijs/themes/github-dark"),
  ],
  langs: [],
  engine: createJavaScriptRegexEngine(),
});

const loadingLanguages = new Map();

export function resolveCodeLanguage(language = "text") {
  const normalized = language.toLowerCase();
  return languageAliases[normalized] || normalized;
}

async function ensureLanguage(highlighter, language) {
  const loader = languageLoaders[language];
  if (!loader || highlighter.getLoadedLanguages().includes(language)) return;

  if (!loadingLanguages.has(language)) {
    loadingLanguages.set(
      language,
      loader().then((module) => highlighter.loadLanguage(module.default)),
    );
  }

  await loadingLanguages.get(language);
}

export async function highlightCode(code, language) {
  const highlighter = await highlighterPromise;
  const resolvedLanguage = resolveCodeLanguage(language);
  const supportedLanguage = languageLoaders[resolvedLanguage]
    ? resolvedLanguage
    : "text";

  await ensureLanguage(highlighter, supportedLanguage);
  return highlighter.codeToHtml(code, {
    lang: supportedLanguage,
    themes: {
      light: "catppuccin-latte",
      dark: "github-dark",
    },
  });
}
