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

const manufacturerDomains: Record<
  string,
  string[]
> = {
  lg: ["lg.com"],
  sony: ["sony.com"],
  samsung: ["samsung.com"],
  panasonic: ["panasonic.com"],
  denon: ["denon.com"],
  marantz: ["marantz.com"],
  yamaha: ["yamaha.com"],
  bose: ["bose.com"],
  sonos: ["sonos.com"],
  jbl: ["jbl.com"],
  arcam: ["arcam.co.uk"],
  anthem: ["anthemav.com"],

  ubiquiti: ["ui.com"],
  unifi: ["ui.com"],

  netgear: ["netgear.com"],
  linksys: ["linksys.com"],
  tplink: ["tp-link.com"],

  lutron: ["lutron.com"],
  control4: ["control4.com"],
  crestron: ["crestron.com"],
  savant: ["savant.com"],

  ring: ["ring.com"],
  eufy: ["eufy.com"],
  reolink: ["reolink.com"],
  hikvision: ["hikvision.com"],
  dahua: ["dahuasecurity.com"],

  ecobee: ["ecobee.com"],
  nest: ["google.com"],
  honeywell: ["honeywellhome.com"],

  apple: ["apple.com"],
  google: ["google.com"],
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
    return new URL(value)
      .hostname
      .toLowerCase()
      .replace(/^www\./, "");
  } catch {
    return "web";
  }
}

function cleanDescription(
  value: string,
): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSearchValue(
  value: string,
): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function getManufacturerDomainKey(
  manufacturer: string,
): string {
  const normalized =
    normalizeSearchValue(
      manufacturer,
    );

  const aliases: Record<
    string,
    string
  > = {
    lgelectronics: "lg",
    sonycorporation: "sony",
    samsungelectronics: "samsung",
    ubiquitiinc: "ubiquiti",
    ui: "ubiquiti",
    tplink: "tplink",
    googlenest: "nest",
    honeywellhome: "honeywell",
  };

  return (
    aliases[normalized] ??
    normalized
  );
}

function isOfficialManufacturerResult(
  candidate: ManualDocumentCandidate,
  manufacturer: string,
): boolean {
  const key =
    getManufacturerDomainKey(
      manufacturer,
    );

  const domains =
    manufacturerDomains[key];

  if (!domains) {
    return false;
  }

  const hostname =
    getHostname(
      candidate.url,
    );

  return domains.some(
    (domain) =>
      hostname === domain ||
      hostname.endsWith(
        `.${domain}`,
      ),
  );
}

function matchesModel(
  candidate: ManualDocumentCandidate,
  model: string,
): boolean {
  const normalizedModel =
    normalizeSearchValue(
      model,
    );

  if (!normalizedModel) {
    return false;
  }

  const searchable =
    normalizeSearchValue(
      `${candidate.title} ${candidate.url} ${candidate.description ?? ""}`,
    );

  return searchable.includes(
    normalizedModel,
  );
}

function classifyResult(
  title: string,
  url: string,
  description: string,
): ManualDocumentType {
  const searchable =
    `${title} ${url} ${description}`
      .toLowerCase();

  // Installation/setup documentation first.
  if (
    searchable.includes(
      "installation guide",
    ) ||
    searchable.includes(
      "installation manual",
    ) ||
    searchable.includes(
      "install guide",
    ) ||
    searchable.includes(
      "setup guide",
    ) ||
    searchable.includes(
      "quick start",
    ) ||
    searchable.includes(
      "quick setup",
    )
  ) {
    return "installation-guide";
  }

  // Warranty-specific documentation.
  if (
    searchable.includes(
      "warranty",
    )
  ) {
    return "warranty";
  }

  // Manual terminology gets priority over generic
  // support terminology because manufacturer manual
  // pages often live under /support/.
  if (
    searchable.includes(
      "operating instructions",
    ) ||
    searchable.includes(
      "instruction manual",
    ) ||
    searchable.includes(
      "manuals for",
    ) ||
    searchable.includes(
      "user manual",
    ) ||
    searchable.includes(
      "owner's manual",
    ) ||
    searchable.includes(
      "owners manual",
    ) ||
    searchable.includes(
      "user guide",
    ) ||
    searchable.includes(
      "owner's guide",
    ) ||
    searchable.includes(
      "owners guide",
    ) ||
    searchable.includes(
      "help guide",
    ) ||
    searchable.includes(
      "manual",
    )
  ) {
    return "manual";
  }

  // Generic support comes after manual detection.
  if (
    searchable.includes(
      "support",
    ) ||
    searchable.includes(
      "help center",
    ) ||
    searchable.includes(
      "help centre",
    ) ||
    searchable.includes(
      "product support",
    )
  ) {
    return "support";
  }

  return "manufacturer";
}

function isLikelyUsefulResult(
  candidate: ManualDocumentCandidate,
): boolean {
  const hostname =
    getHostname(
      candidate.url,
    );

  const searchable =
    `${candidate.title} ${candidate.url} ${candidate.description ?? ""}`
      .toLowerCase();

  const blockedDomains = [
    "amazon.com",
    "bestbuy.com",
    "ebay.com",
    "walmart.com",
    "target.com",
  ];

  if (
    blockedDomains.some(
      (domain) =>
        hostname === domain ||
        hostname.endsWith(
          `.${domain}`,
        ),
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
    "download",
    "setup",
    "installation",
    ".pdf",
  ];

  return usefulTerms.some(
    (term) =>
      searchable.includes(term),
  );
}

function scoreCandidate(
  candidate: ManualDocumentCandidate,
  manufacturer: string,
  model: string,
): number {
  const normalizedModel =
    normalizeSearchValue(
      model,
    );

  const searchable =
    normalizeSearchValue(
      `${candidate.title} ${candidate.url} ${candidate.description ?? ""}`,
    );

  const url =
    candidate.url.toLowerCase();

  let score = 0;

  if (
    normalizedModel &&
    searchable.includes(
      normalizedModel,
    )
  ) {
    score += 100;
  }

  if (
    isOfficialManufacturerResult(
      candidate,
      manufacturer,
    )
  ) {
    score += 100;
  }

  if (
    url.includes(".pdf")
  ) {
    score += 35;
  }

  switch (candidate.type) {
    case "manual":
      score += 35;
      break;

    case "installation-guide":
      score += 35;
      break;

    case "support":
      score += 25;
      break;

    case "warranty":
      score += 20;
      break;

    case "manufacturer":
      score += 5;
      break;
  }

  return score;
}

async function searchBrave(
  query: string,
  count = 8,
): Promise<
  ManualDocumentCandidate[]
> {
  const apiKey =
    getApiKey();

  const url =
    new URL(
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

  const response =
    await fetch(
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
    if (
      response.status === 429
    ) {
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
    .map(
      (result) => {
        const description =
          cleanDescription(
            result.description ??
              "",
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
      },
    );
}

function deduplicateCandidates(
  candidates:
    ManualDocumentCandidate[],
): ManualDocumentCandidate[] {
  const seen =
    new Set<string>();

  return candidates.filter(
    (candidate) => {
      let normalizedUrl =
        candidate.url
          .trim()
          .toLowerCase();

      try {
        const parsed =
          new URL(
            candidate.url,
          );

        parsed.hash = "";

        normalizedUrl =
          parsed.toString()
            .toLowerCase();
      } catch {
        // Keep original normalized URL.
      }

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

function rankCandidates(
  candidates:
    ManualDocumentCandidate[],
  manufacturer: string,
  model: string,
): ManualDocumentCandidate[] {
  return [...candidates].sort(
    (a, b) =>
      scoreCandidate(
        b,
        manufacturer,
        model,
      ) -
      scoreCandidate(
        a,
        manufacturer,
        model,
      ),
  );
}

export async function discoverDeviceDocumentation(
  manufacturer: string,
  model: string,
): Promise<
  ManualDocumentCandidate[]
> {
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

  console.log(
    "DOCUMENT SEARCH:",
    {
      manufacturer:
        cleanedManufacturer,

      model:
        cleanedModel,
    },
  );

  const exactModel =
    `"${cleanedModel}"`;

  const domainKey =
    getManufacturerDomainKey(
      cleanedManufacturer,
    );

  const officialDomains =
    manufacturerDomains[
      domainKey
    ] ?? [];

  const generalQueries = [
    `${exactModel} ${cleanedManufacturer} manual`,
    `${exactModel} ${cleanedManufacturer} "user manual"`,
    `${exactModel} ${cleanedManufacturer} "owner's manual"`,
    `${exactModel} ${cleanedManufacturer} "installation guide"`,
    `${exactModel} ${cleanedManufacturer} support`,
    `${exactModel} ${cleanedManufacturer} warranty`,
  ];

  const officialQueries =
    officialDomains.flatMap(
      (domain) => [
        `${exactModel} site:${domain} manual`,
        `${exactModel} site:${domain} support`,
        `${exactModel} site:${domain} installation`,
      ],
    );

  const queries = [
    ...officialQueries,
    ...generalQueries,
  ];

  const resultGroups =
    await Promise.all(
      queries.map(
        (query) =>
          searchBrave(
            query,
            8,
          ),
      ),
    );

  const combined =
    resultGroups.flat();

  const relevant =
    deduplicateCandidates(
      combined,
    )
      .filter(
        isLikelyUsefulResult,
      )
      .filter(
        (candidate) =>
          matchesModel(
            candidate,
            cleanedModel,
          ),
      );

  const official =
    relevant.filter(
      (candidate) =>
        isOfficialManufacturerResult(
          candidate,
          cleanedManufacturer,
        ),
    );

  const thirdParty =
    relevant.filter(
      (candidate) =>
        !isOfficialManufacturerResult(
          candidate,
          cleanedManufacturer,
        ),
    );

  const rankedOfficial =
    rankCandidates(
      official,
      cleanedManufacturer,
      cleanedModel,
    );

  const rankedThirdParty =
    rankCandidates(
      thirdParty,
      cleanedManufacturer,
      cleanedModel,
    );

  if (
  rankedOfficial.length >
  0
) {
  return rankedOfficial.slice(
    0,
    12,
  );
}

return rankedThirdParty.slice(
  0,
  12,
);
}