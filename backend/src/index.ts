export interface Env {
  DB: D1Database;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

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
      const o = await request.json();
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
      const [, id, action] = actionMatch;
      await env.DB.prepare(
        `UPDATE offerings SET ${actionColumns[action]} = ${actionColumns[action]} + 1 WHERE id = ?`
      ).bind(id).run();
      const { results } = await env.DB.prepare("SELECT * FROM offerings WHERE id = ?").bind(id).all();
      if (results.length === 0) return new Response("Not found", { status: 404, headers: corsHeaders });
      return json(rowToOffering(results[0]));
    }

    return new Response("Not found", { status: 404, headers: corsHeaders });
  },

  async scheduled(_controller: ScheduledController, env: Env): Promise<void> {
    await env.DB.prepare("DELETE FROM offerings WHERE expires_at < datetime('now')").run();
  },
};
