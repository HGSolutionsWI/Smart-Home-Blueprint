export type ManualDocumentType =
  | "manual"
  | "installation-guide"
  | "warranty"
  | "support"
  | "manufacturer";

export type ManualDocumentCandidate = {
  title: string;
  url: string;
  description?: string;

  type: ManualDocumentType;

  source: string;
};

type BraveWebResult = {
  title?: string;
  url?: string;
  description?: string;
};

type BraveSearchResponse = {
  web?: {
    results?: BraveWebResult[];
  };
};

function getApiKey(): string {
  const apiKey =
    process.env.BRAVE_SEARCH_API_KEY;

  if (!apiKey) {
    throw new Error(
      "BRAVE_SEARCH_API_KEY is not configured.",
    );
  }

  return apiKey;
}

function getHostname(
  value: string,
): string {
  try {
    return new URL(value).hostname;
  } catch {
    return "Web";
  }
}

function cleanDescription(
  value: string,
): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function normalizeSearchValue(
  value: string,
): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function matchesModel(
  candidate: ManualDocumentCandidate,
  model: string,
): boolean {
  const normalizedModel =
    normalizeSearchValue(model);

  const searchable =
    normalizeSearchValue(
      `${candidate.title} ${candidate.url} ${candidate.description ?? ""}`,
    );

  return searchable.includes(
    normalizedModel,
  );
}

function scoreCandidate(
  candidate: ManualDocumentCandidate,
  manufacturer: string,
  model: string,
): number {
  const title =
    candidate.title.toLowerCase();

  const url =
    candidate.url.toLowerCase();

  const description =
    candidate.description?.toLowerCase() ??
    "";

  const searchable =
    `${title} ${url} ${description}`;

  const normalizedManufacturer =
    manufacturer
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

  const normalizedHostname =
    getHostname(candidate.url)
      .toLowerCase()
      .replace(/^www\./, "")
      .replace(/[^a-z0-9]/g, "");

  let score = 0;

  // Exact model number is extremely important.
  if (
    searchable.includes(
      model.toLowerCase(),
    )
  ) {
    score += 50;
  }

  // Strongly favor manufacturer-owned domains.
  if (
    normalizedManufacturer &&
    normalizedHostname.includes(
      normalizedManufacturer,
    )
  ) {
    score += 40;
  }

  // Direct PDFs are particularly useful.
  if (
    url.includes(".pdf")
  ) {
    score += 30;
  }

  switch (candidate.type) {
    case "manual":
      score += 25;
      break;

    case "installation-guide":
      score += 25;
      break;

    case "support":
      score += 15;
      break;

    case "warranty":
      score += 10;
      break;

    default:
      break;
  }

  return score;
}

function classifyResult(
  title: string,
  url: string,
  description: string,
): ManualDocumentType {
  const searchable =
    `${title} ${url} ${description}`.toLowerCase();

  if (
    searchable.includes("installation") ||
    searchable.includes("install guide") ||
    searchable.includes("setup guide") ||
    searchable.includes("quick start")
  ) {
    return "installation-guide";
  }

  if (
    searchable.includes("warranty")
  ) {
    return "warranty";
  }

  if (
    searchable.includes("support") ||
    searchable.includes("help center") ||
    searchable.includes("product support")
  ) {
    return "support";
  }

  if (
    searchable.includes("manual") ||
    searchable.includes("user guide") ||
    searchable.includes("owner's guide") ||
    searchable.includes("owners guide") ||
    searchable.includes("help guide")
  ) {
    return "manual";
  }

  return "manufacturer";
}

async function searchBrave(
  query: string,
  count = 8,
): Promise<ManualDocumentCandidate[]> {
  const apiKey = getApiKey();

  const url = new URL(
    "https://api.search.brave.com/res/v1/web/search",
  );

  url.searchParams.set(
    "q",
    query,
  );

  url.searchParams.set(
    "country",
    "US",
  );

  url.searchParams.set(
    "search_lang",
    "en",
  );

  url.searchParams.set(
    "count",
    String(count),
  );

  const response = await fetch(
    url,
    {
      method: "GET",

      headers: {
        Accept:
          "application/json",

        "X-Subscription-Token":
          apiKey,
      },

      cache: "no-store",
    },
  );

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(
        "Brave Search rate limit reached. Please try again shortly.",
      );
    }

    throw new Error(
      `Brave Search failed with status ${response.status}.`,
    );
  }

  const data =
    (await response.json()) as BraveSearchResponse;

  const results =
    data.web?.results ?? [];

  return results
    .filter(
      (
        result,
      ): result is Required<
        Pick<
          BraveWebResult,
          "title" | "url"
        >
      > &
        BraveWebResult =>
        Boolean(
          result.title &&
            result.url,
        ),
    )
    .map((result) => {
      const description =
  cleanDescription(
    result.description ?? "",
  );

      return {
        title:
          result.title,

        url:
          result.url,

        description,

        type:
          classifyResult(
            result.title,
            result.url,
            description,
          ),

        source:
          getHostname(
            result.url,
          ),
      };
    });
}

function deduplicateCandidates(
  candidates: ManualDocumentCandidate[],
): ManualDocumentCandidate[] {
  const seen =
    new Set<string>();

  return candidates.filter(
    (candidate) => {
      const normalizedUrl =
        candidate.url
          .trim()
          .toLowerCase();

      if (
        seen.has(
          normalizedUrl,
        )
      ) {
        return false;
      }

      seen.add(
        normalizedUrl,
      );

      return true;
    },
  );
}

function isLikelyUsefulResult(
  candidate: ManualDocumentCandidate,
): boolean {
  const searchable =
    `${candidate.title} ${candidate.url} ${candidate.description ?? ""}`
      .toLowerCase();

  const blockedDomains = [
    "bestbuy.com",
    "amazon.com",
    "walmart.com",
    "ebay.com",
  ];

  if (
    blockedDomains.some((domain) =>
      candidate.url
        .toLowerCase()
        .includes(domain),
    )
  ) {
    return false;
  }

  const usefulTerms = [
    "manual",
    "guide",
    "support",
    "warranty",
    "documentation",
    ".pdf",
  ];

  return usefulTerms.some((term) =>
    searchable.includes(term),
  );
}

export async function discoverDeviceDocumentation(
  manufacturer: string,
  model: string,
): Promise<ManualDocumentCandidate[]> {
  const cleanedManufacturer =
    manufacturer.trim();

  const cleanedModel =
    model.trim();

  if (
    !cleanedManufacturer ||
    !cleanedModel
  ) {
    throw new Error(
      "Manufacturer and model are required to search for documentation.",
    );
  }

  const exactModel =
  `"${cleanedModel}"`;

const queries = [
  `${exactModel} ${cleanedManufacturer} manual`,
  `${exactModel} ${cleanedManufacturer} "user manual"`,
  `${exactModel} ${cleanedManufacturer} "owner's manual"`,
  `${exactModel} ${cleanedManufacturer} "installation guide"`,
  `${exactModel} ${cleanedManufacturer} support`,
  `${exactModel} ${cleanedManufacturer} warranty`,
];

  const resultGroups =
    await Promise.all(
      queries.map(
        (query) =>
          searchBrave(
            query,
            6,
          ),
      ),
    );

  const combined =
    resultGroups.flat();

  const deduplicated =
  deduplicateCandidates(
    combined,
  )
    .filter(
      isLikelyUsefulResult,
    )
    .filter((candidate) =>
      matchesModel(
        candidate,
        cleanedModel,
      ),
    );

  const ranked =
  deduplicated.sort(
    (a, b) =>
      scoreCandidate(
        b,
        cleanedManufacturer,
        cleanedModel,
      ) -
      scoreCandidate(
        a,
        cleanedManufacturer,
        cleanedModel,
      ),
  );

return ranked.slice(
  0,
  12,
);
}