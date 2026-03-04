const RISK_KEYWORDS = [
  "chest pain",
  "breathing difficulty",
  "difficulty breathing",
  "can't breathe",
  "cant breathe",
  "shortness of breath",
  "heart attack",
  "stroke",
  "unconscious",
  "unresponsive",
  "severe bleeding",
  "heavy bleeding",
  "seizure",
  "choking",
  "suicidal",
  "suicide",
  "overdose",
  "allergic reaction",
  "anaphylaxis",
  "swelling throat",
  "fainting",
  "fainted",
  "collapsed",
];

export interface RiskDetectionResult {
  isRisky: boolean;
  matchedKeywords: string[];
  severity: "none" | "warning" | "urgent";
}

export function detectRisk(query: string): RiskDetectionResult {
  const normalized = query.toLowerCase().trim();
  const matched = RISK_KEYWORDS.filter((keyword) =>
    normalized.includes(keyword)
  );

  if (matched.length === 0) {
    return { isRisky: false, matchedKeywords: [], severity: "none" };
  }

  const urgentKeywords = [
    "chest pain",
    "can't breathe",
    "cant breathe",
    "heart attack",
    "stroke",
    "unconscious",
    "unresponsive",
    "seizure",
    "choking",
    "anaphylaxis",
  ];

  const isUrgent = matched.some((k) => urgentKeywords.includes(k));

  return {
    isRisky: true,
    matchedKeywords: matched,
    severity: isUrgent ? "urgent" : "warning",
  };
}
