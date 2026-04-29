// NOTE: ECI does not provide a public REST API for voter verification.
// API Setu has no ECI endpoints. electoralsearch.eci.gov.in is a client-side SPA.
// Options:
//   1. Deep-link users to the official ECI portal (used here — always accurate)
//   2. Eko EPIC Verification API (eko.in) — paid third-party wrapper
//   3. Swap verifyEpic() with Eko API once you have credentials

export type VoterDetails = {
  name: string;
  constituency: string;
  pollingStation: string;
  status: "registered" | "not_found" | "redirect";
  redirectUrl?: string;
};

// Builds the official ECI electoral search deep-link for a given EPIC number
export function getEciSearchUrl(epic: string): string {
  return `https://electoralsearch.eci.gov.in/?epicNo=${encodeURIComponent(epic)}`;
}

// Swap this implementation with Eko API (https://eko.in/developers/eps/voter-id-verification-api)
// when you have API credentials. Until then, redirects to official ECI portal.
export async function verifyEpic(epic: string): Promise<VoterDetails> {
  const ekoApiKey = process.env.EKO_API_KEY;
  const ekoBaseUrl = process.env.EKO_API_BASE_URL;

  // If Eko credentials are configured, use their API
  if (ekoApiKey && ekoBaseUrl) {
    const res = await fetch(`${ekoBaseUrl}/ekyc/voter-id`, {
      method: "POST",
      headers: { "developer_key": ekoApiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ voter_id: epic }),
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const data = await res.json();
      return {
        name: data.name ?? "",
        constituency: data.assembly_constituency ?? "",
        pollingStation: data.polling_station ?? "",
        status: "registered",
      };
    }
  }

  // Fallback: return the official ECI portal deep-link
  return {
    name: "",
    constituency: "",
    pollingStation: "",
    status: "redirect",
    redirectUrl: getEciSearchUrl(epic),
  };
}
