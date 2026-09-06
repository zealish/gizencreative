import { createSign } from "node:crypto";
import {
  getAnalyticsSettings,
  getGaServiceAccountCredentials,
} from "@/lib/settings";

export type GaDailyPoint = {
  date: string;
  activeUsers: number;
  pageViews: number;
};

export type GaTopPage = {
  path: string;
  views: number;
};

export type GaDashboardStats = {
  totals: {
    activeUsers: number;
    pageViews: number;
    sessions: number;
  };
  daily: GaDailyPoint[];
  topPages: GaTopPage[];
};

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

function base64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
}

async function getAccessToken(
  clientEmail: string,
  privateKey: string,
): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({
      iss: clientEmail,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const signature = base64url(signer.sign(privateKey));
  const assertion = `${header}.${claims}.${signature}`;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { access_token?: string };
  return data.access_token ?? null;
}

type RunReportRow = {
  dimensionValues?: { value?: string }[];
  metricValues?: { value?: string }[];
};

type RunReportResponse = {
  rows?: RunReportRow[];
};

async function runReport(
  propertyId: string,
  token: string,
  body: Record<string, unknown>,
): Promise<RunReportRow[]> {
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(propertyId)}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      next: { revalidate: 3600 },
    },
  );
  if (!response.ok) return [];
  const data = (await response.json()) as RunReportResponse;
  return data.rows ?? [];
}

function metricNumber(row: RunReportRow, index: number): number {
  return Number(row.metricValues?.[index]?.value ?? 0);
}

export async function getGaDashboardStats(): Promise<GaDashboardStats | null> {
  const { gaPropertyId } = await getAnalyticsSettings();
  const creds = await getGaServiceAccountCredentials();
  if (!gaPropertyId || !creds) return null;

  try {
    const token = await getAccessToken(creds.clientEmail, creds.privateKey);
    if (!token) return null;

    const dateRanges = [{ startDate: "28daysAgo", endDate: "today" }];
    const [dailyRows, totalRows, pageRows] = await Promise.all([
      runReport(gaPropertyId, token, {
        dateRanges,
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      runReport(gaPropertyId, token, {
        dateRanges,
        metrics: [
          { name: "activeUsers" },
          { name: "screenPageViews" },
          { name: "sessions" },
        ],
      }),
      runReport(gaPropertyId, token, {
        dateRanges,
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 5,
      }),
    ]);

    const totalRow = totalRows[0];
    return {
      totals: {
        activeUsers: totalRow ? metricNumber(totalRow, 0) : 0,
        pageViews: totalRow ? metricNumber(totalRow, 1) : 0,
        sessions: totalRow ? metricNumber(totalRow, 2) : 0,
      },
      daily: dailyRows.map((row) => ({
        date: row.dimensionValues?.[0]?.value ?? "",
        activeUsers: metricNumber(row, 0),
        pageViews: metricNumber(row, 1),
      })),
      topPages: pageRows.map((row) => ({
        path: row.dimensionValues?.[0]?.value ?? "",
        views: metricNumber(row, 0),
      })),
    };
  } catch {
    return null;
  }
}
