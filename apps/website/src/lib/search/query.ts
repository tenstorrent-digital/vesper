/**
 * the search engine
 *
 * deliberately dependency-free and isomorphic: the same ranking runs in the
 * command palette (against an index shipped to the browser) and in
 * `/api/search` (against the same index, on the server), so an agent and a
 * person searching the same words get the same answers in the same order
 */

export interface SearchHeading {
  id: string;
  text: string;
}

/**
 * where the full-text index is served from
 *
 * lives here rather than in `src/lib/search/index.ts` so client components can
 * import it without pulling a filesystem-reading module into the browser
 * bundle
 */
export const SEARCH_INDEX_PATH = "/api/search/index.json";

/** one heading's worth of prose, the unit a content match is reported at */
export interface SearchSection {
  /** the anchor of the heading that opens the section, if it has one */
  id?: string;
  /** the heading's text, used as a result's subtitle */
  heading?: string;
  /** the section's body, flattened to plain text */
  text: string;
}

export interface SearchEntry {
  href: string;
  title: string;
  description?: string;
  /** the sidebar section this page belongs to, shown as a result's eyebrow */
  section: string;
  headings: SearchHeading[];
  /**
   * the page's prose, split by heading
   *
   * absent in the index that ships with the HTML — full text is loaded
   * separately, see `src/lib/search/index.ts`
   */
  sections?: SearchSection[];
}

export type SearchResultKind = "page" | "heading" | "content";

export interface SearchResult {
  /** the route, including a `#fragment` for heading and content matches */
  href: string;
  title: string;
  /** the page a result belongs to, or the page's own description */
  sub?: string;
  section: string;
  kind: SearchResultKind;
  score: number;
  /** the sentence a content match was found in, for `kind: "content"` */
  snippet?: string;
}

/**
 * how much each field contributes to a result's score
 *
 * body text is worth roughly half a heading, so a page that merely *mentions*
 * the query can never bury the page that is *about* it — but an exact phrase
 * in the prose still beats a fuzzy, letters-in-order title match
 */
export const WEIGHTS = {
  title: 1,
  description: 0.35,
  heading: 0.8,
  content: 0.45,
} as const;

/** a page result outranks any single heading inside that same page */
const PAGE_BONUS = 10;

/** below this, a heading match is a fuzzy guess rather than a real hit */
const HEADING_FLOOR = 60;

/**
 * descriptions are matched, but not *fuzzily* matched
 *
 * a letters-in-order match against a whole sentence is true of almost every
 * sentence, so a description has to actually contain the query
 */
const DESCRIPTION_FLOOR = 60;

/** one- and two-letter queries match far too much prose to be useful */
const MIN_CONTENT_QUERY = 3;

/** at most this many body matches from any one page */
const MAX_CONTENT_PER_PAGE = 2;

/**
 * words that are in every document and therefore identify none of them
 *
 * only used to split up multi-word queries — a query that is *entirely*
 * stopwords still gets the phrase treatment
 */
const STOPWORDS = new Set([
  "and",
  "any",
  "are",
  "can",
  "did",
  "does",
  "for",
  "from",
  "has",
  "how",
  "into",
  "its",
  "not",
  "that",
  "the",
  "their",
  "them",
  "then",
  "there",
  "these",
  "this",
  "use",
  "used",
  "using",
  "was",
  "what",
  "when",
  "where",
  "which",
  "why",
  "with",
  "you",
  "your",
]);

/** a multi-word match is a weaker signal than the phrase itself */
const TOKEN_PENALTY = 0.6;

/** how many of a query's words have to land for it to count at all */
const MIN_COVERAGE = 0.5;

/**
 * the weakest body match worth showing
 *
 * a page can afford to answer half a question — its title and description are
 * short, so half of them matching is a real signal. a paragraph cannot: half
 * the words of "how do I change the theme" appear in most of this site
 */
const CONTENT_FLOOR = 10;

/**
 * the smallest stemmer that earns its keep
 *
 * drops a plural or tense suffix, then a trailing "e", so "props" finds
 * "Prop", "disable" finds "disabling", and "change" finds "changed" — without
 * pulling a real stemming library into the browser for a 43-document site.
 * short words are left alone, because "theme" -> "them" helps nobody
 */
const stem = (token: string): string => {
  let word = token;

  if (word.length >= 6 && word.endsWith("ing")) word = word.slice(0, -3);
  else if (word.length >= 5 && word.endsWith("ed")) word = word.slice(0, -2);
  else if (word.length >= 5 && word.endsWith("es")) word = word.slice(0, -2);
  else if (word.length >= 4 && word.endsWith("s")) word = word.slice(0, -1);

  return word.length >= 6 && word.endsWith("e") ? word.slice(0, -1) : word;
};

/** characters of context to show on either side of a content match */
const SNIPPET_PADDING = 90;

/** `value`, or `0` if it did not clear `floor` */
const atLeast = (floor: number, value: number): number =>
  value >= floor ? value : 0;

const isWordBoundary = (character: string | undefined): boolean =>
  character === undefined || /[^\p{L}\p{N}]/u.test(character);

/**
 * scores `query` against a short string (a title, description, or heading)
 *
 * exact substring matches win, then matches at the start of a word, then a
 * plain subsequence match (so "tgl" still finds "Toggle"). returns `0` for no
 * match
 */
export const score = (query: string, text: string): number => {
  const haystack = text.toLowerCase();
  const index = haystack.indexOf(query);

  if (index === 0) return 100;
  if (index > 0) return isWordBoundary(haystack[index - 1]) ? 80 : 60;

  // subsequence: every character of the query appears, in order
  let cursor = 0;
  for (const character of query) {
    cursor = haystack.indexOf(character, cursor);
    if (cursor === -1) return 0;
    cursor += 1;
  }

  return 20;
};

/**
 * scores `query` against a long string (a section of body text)
 *
 * unlike {@link score} this never falls back to a subsequence match — across a
 * paragraph, "tgl" appears in almost everything. repeated mentions are worth a
 * little more, because a section that says "toast" six times is probably about
 * toasts
 */
const scoreProse = (
  query: string,
  text: string,
): { score: number; index: number } => {
  const haystack = text.toLowerCase();
  const index = haystack.indexOf(query);

  if (index === -1) return { score: 0, index: -1 };

  let occurrences = 0;
  for (let at = index; at !== -1; at = haystack.indexOf(query, at + 1)) {
    occurrences += 1;
    if (occurrences > 4) break;
  }

  const base = isWordBoundary(haystack[index - 1]) ? 80 : 60;

  return { score: base + (occurrences - 1) * 3, index };
};

/**
 * the meaningful words in a query
 *
 * "how do I change the theme" -> ["change", "theme"]
 */
export const tokenize = (query: string): string[] => {
  const tokens = query
    .split(/[^\p{L}\p{N}-]+/u)
    .filter((token) => token.length >= 3 && !STOPWORDS.has(token));

  return [...new Set(tokens)];
};

/**
 * every string worth highlighting in a result for `raw`
 *
 * the phrase itself, the words in it, and the stems those words matched on —
 * so a result found by searching "disable" still shows you the "disabl" of
 * "disabling"
 *
 * @param {string} raw - the query as typed
 */
export const terms = (raw: string): string[] => {
  const query = raw.trim().toLowerCase();
  if (!query) return [];

  const tokens = tokenize(query);
  if (tokens.length === 0) return [query];

  return [
    ...new Set([
      ...(tokens.length > 1 ? [query] : []),
      ...tokens,
      ...tokens.map(stem),
    ]),
  ];
};

/**
 * how much each word of a query narrows things down
 *
 * "prop" is in every component page and says nothing about which one you
 * want; "minstepsbetweenthumbs" is in exactly one and says everything. this is
 * inverse document frequency, counted over the sections of the index actually
 * being searched, normalised to 0..1
 *
 * with the lite index (no body text) every word weighs the same, and the
 * ranking degrades gracefully to plain word coverage
 */
const CORPUS = new WeakMap<SearchEntry[], string[]>();

/** every section of the index, lowercased once and kept */
const corpusOf = (entries: SearchEntry[]): string[] => {
  const cached = CORPUS.get(entries);
  if (cached) return cached;

  const corpus = entries.flatMap((entry) =>
    (entry.sections ?? []).map((section) => section.text.toLowerCase()),
  );

  CORPUS.set(entries, corpus);

  return corpus;
};

const weighTokens = (
  tokens: string[],
  entries: SearchEntry[],
): Map<string, number> => {
  const corpus = corpusOf(entries);

  const total = corpus.length;

  return new Map(
    tokens.map((token) => {
      if (total === 0) return [token, 1];

      const needle = stem(token);
      const hits = corpus.filter((text) => text.includes(needle)).length;

      // a word that appears nowhere is unmatchable, so it should not weigh on
      // the query at all — least of all, as the rarest word, the most
      if (hits === 0) return [token, 0];

      return [token, Math.log((total + 1) / (hits + 1)) / Math.log(total + 1)];
    }),
  );
};

/**
 * scores a query's individual words against `text`
 *
 * this is what answers a question rather than matches a keyword: "how do I
 * change the theme" appears verbatim nowhere, but "change" and "theme" both
 * appear in the section that answers it. rare words carry the result, common
 * ones barely move it, and the whole thing always scores below a real phrase
 * match
 */
const scoreTokens = (
  tokens: string[],
  text: string,
  weights: Map<string, number>,
): { score: number; index: number } => {
  if (tokens.length < 2) return { score: 0, index: -1 };

  const haystack = text.toLowerCase();
  const hits = tokens.filter((token) => haystack.includes(stem(token)));

  const weigh = (words: string[]) =>
    words.reduce((sum, word) => sum + (weights.get(word) ?? 1), 0);

  const coverage = weigh(hits) / (weigh(tokens) || 1);
  if (coverage < MIN_COVERAGE) return { score: 0, index: -1 };

  // the rarest matched word is the most specific: anchor the snippet there
  const anchor = [...hits].sort(
    (a, b) => (weights.get(b) ?? 1) - (weights.get(a) ?? 1),
  )[0]!;

  return {
    /*
      the exponent is what separates "answered most of the question" from
      "mentioned one of its words": squaring it turned out to be too harsh on
      long questions, where landing two words out of three is a good result
    */
    score: 100 * coverage ** 1.5 * TOKEN_PENALTY,
    index: haystack.indexOf(stem(anchor)),
  };
};

/** a readable window of `text` around `index`, cut at word boundaries */
const snippetAround = (text: string, index: number, length: number): string => {
  const start = Math.max(0, index - SNIPPET_PADDING);
  const end = Math.min(text.length, index + length + SNIPPET_PADDING);

  let slice = text.slice(start, end);

  // do not start or end mid-word
  if (start > 0) slice = slice.replace(/^\S*\s/, "");
  if (end < text.length) slice = slice.replace(/\s\S*$/, "");

  return `${start > 0 ? "…" : ""}${slice.trim()}${end < text.length ? "…" : ""}`;
};

export interface SearchOptions {
  /** how many results to return @default 24 */
  limit?: number;
  /** only return results of these kinds */
  kinds?: SearchResultKind[];
}

/**
 * ranks `entries` against `query`
 *
 * an empty query returns the first few pages, which is what the command
 * palette shows before anything is typed
 *
 * @param {SearchEntry[]} entries - the index to search
 * @param {string} raw - the user's (or agent's) query
 * @param {SearchOptions} [options] - (optional) limit and kind filters
 */
export const search = (
  entries: SearchEntry[],
  raw: string,
  { limit = 24, kinds }: SearchOptions = {},
): SearchResult[] => {
  const query = raw.trim().toLowerCase();
  const wanted = (kind: SearchResultKind) => !kinds || kinds.includes(kind);
  const tokens = tokenize(query);
  const weights = weighTokens(tokens, entries);

  /**
   * what the phrase pass looks for
   *
   * a question with exactly one meaningful word in it ("how do I install
   * this") is really a search for that word, so search for that word
   */
  const phraseQuery = tokens.length === 1 ? tokens[0]! : query;

  if (!query) {
    return entries
      .filter(() => wanted("page"))
      .slice(0, Math.min(limit, 8))
      .map((entry) => ({
        href: entry.href,
        title: entry.title,
        sub: entry.description,
        section: entry.section,
        kind: "page" as const,
        score: 0,
      }));
  }

  const results: SearchResult[] = [];

  for (const entry of entries) {
    const matchedAnchors = new Set<string>();

    if (wanted("page")) {
      const best = Math.max(
        score(phraseQuery, entry.title) * WEIGHTS.title,
        atLeast(
          DESCRIPTION_FLOOR,
          entry.description ? score(phraseQuery, entry.description) : 0,
        ) * WEIGHTS.description,
        scoreTokens(
          tokens,
          `${entry.title} ${entry.description ?? ""}`,
          weights,
        ).score * WEIGHTS.title,
      );

      if (best > 0) {
        results.push({
          href: entry.href,
          title: entry.title,
          sub: entry.description,
          section: entry.section,
          kind: "page",
          score: best + PAGE_BONUS,
        });
      }
    }

    if (wanted("heading")) {
      for (const heading of entry.headings) {
        const raw = Math.max(
          score(phraseQuery, heading.text),
          scoreTokens(tokens, heading.text, weights).score,
        );

        if (raw < HEADING_FLOOR) continue;

        matchedAnchors.add(heading.id);

        results.push({
          href: `${entry.href}#${heading.id}`,
          title: heading.text,
          sub: entry.title,
          section: entry.section,
          kind: "heading",
          score: raw * WEIGHTS.heading,
        });
      }
    }

    if (wanted("content") && phraseQuery.length >= MIN_CONTENT_QUERY) {
      const content: SearchResult[] = [];

      for (const section of entry.sections ?? []) {
        // the heading itself already matched — no need to say it twice
        if (section.id && matchedAnchors.has(section.id)) continue;

        const phrase = scoreProse(phraseQuery, section.text);
        const { score: raw, index } =
          phrase.score > 0
            ? phrase
            : scoreTokens(tokens, section.text, weights);

        const weighted = raw * WEIGHTS.content;
        if (weighted < CONTENT_FLOOR) continue;

        content.push({
          href: section.id ? `${entry.href}#${section.id}` : entry.href,
          title: section.heading ?? entry.title,
          sub: section.heading ? entry.title : entry.description,
          section: entry.section,
          kind: "content",
          score: weighted,
          // a phrase match highlights the query, a token match one word
          snippet: snippetAround(
            section.text,
            index,
            phrase.score > 0 ? phraseQuery.length : 0,
          ),
        });
      }

      results.push(
        ...content
          .sort((a, b) => b.score - a.score)
          .slice(0, MAX_CONTENT_PER_PAGE),
      );
    }
  }

  // one result per destination: the same anchor can be reached more than one way
  const best = new Map<string, SearchResult>();

  for (const result of results) {
    const existing = best.get(result.href);
    if (!existing || result.score > existing.score)
      best.set(result.href, result);
  }

  return [...best.values()]
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit)
    .map((result) => ({ ...result, score: Math.round(result.score) }));
};
