export interface Env {
  DB: D1Database;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const VALID_MOODS = ["grief", "rage", "fear", "shame", "loneliness"] as const;
const VALID_STATUSES = ["active", "hidden", "expired"] as const;

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: corsHeaders });
}

const actionColumns: Record<string, string> = {
  witness: "witness_count",
  candle: "candle_count",
  report: "report_count",
};

function rowToOffering(row: any) {
  return {
    id: row.id,
    body: row.body,
    mood: row.mood,
    generatedName: row.generated_name,
    status: row.status,
    witnessCount: row.witness_count,
    candleCount: row.candle_count,
    releaseCount: row.release_count,
    reportCount: row.report_count,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    position: { x: row.position_x, y: row.position_y },
  };
}

function validateOffering(o: any): string | null {
  if (!o || typeof o !== "object") return "Invalid JSON body";
  if (typeof o.id !== "string" || !o.id) return "id required";
  if (typeof o.body !== "string" || o.body.length < 1 || o.body.length > 500) return "body must be 1-500 characters";
  if (!VALID_MOODS.includes(o.mood)) return "invalid mood";
  if (typeof o.generatedName !== "string" || !o.generatedName) return "generatedName required";
  if (!VALID_STATUSES.includes(o.status)) return "invalid status";
  if (typeof o.createdAt !== "string" || !o.createdAt) return "createdAt required";
  if (typeof o.expiresAt !== "string" || !o.expiresAt) return "expiresAt required";
  if (!o.position || typeof o.position.x !== "number" || typeof o.position.y !== "number") return "invalid position";
  return null;
}

// In-memory rate limiter (per-worker, best-effort)
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

function getClientIP(request: Request): string {
  return request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for") || "unknown";
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    const url = new URL(request.url);
    const { pathname } = url;

    if (request.method === "GET" && pathname === "/api/offerings") {
      const { results } = await env.DB.prepare(
        "SELECT * FROM offerings WHERE expires_at > datetime('now') AND status = 'active' ORDER BY created_at DESC"
      ).all();
      return json(results.map(rowToOffering));
    }

    if (request.method === "POST" && pathname === "/api/offerings") {
      const ip = getClientIP(request);
      if (!checkRateLimit(ip)) return json({ error: "rate limit exceeded" }, 429);

      const o = await request.json();
      const validationError = validateOffering(o);
      if (validationError) return json({ error: validationError }, 400);

      await env.DB.prepare(
        "INSERT INTO offerings (id, body, mood, generated_name, status, witness_count, candle_count, release_count, report_count, created_at, expires_at, position_x, position_y) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(
        o.id, o.body, o.mood, o.generatedName,
        o.status, o.witnessCount, o.candleCount,
        o.releaseCount, o.reportCount, o.createdAt,
        o.expiresAt, o.position.x, o.position.y,
      ).run();
      return json(o, 201);
    }

    const actionMatch = pathname.match(/^\/api\/offerings\/([^/]+)\/(witness|candle|report)$/);
    if (request.method === "POST" && actionMatch) {
      const ip = getClientIP(request);
      if (!checkRateLimit(ip)) return json({ error: "rate limit exceeded" }, 429);

      const [, id, action] = actionMatch;
      const { results } = await env.DB.prepare("SELECT * FROM offerings WHERE id = ?").bind(id).all();
      if (results.length === 0) return json({ error: "not found" }, 404);
      await env.DB.prepare(
        `UPDATE offerings SET ${actionColumns[action]} = ${actionColumns[action]} + 1 WHERE id = ?`
      ).bind(id).run();
      const { results: updated } = await env.DB.prepare("SELECT * FROM offerings WHERE id = ?").bind(id).all();
      return json(rowToOffering(updated[0]));
    }

    return new Response("Not found", { status: 404, headers: corsHeaders });
  },

  async scheduled(_controller: ScheduledController, env: Env): Promise<void> {
    await env.DB.prepare("DELETE FROM offerings WHERE expires_at < datetime('now')").run();
  },
};
