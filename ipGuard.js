export default async (request, context) => {
  const FREE_LIMIT = 3;
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const url = new URL(request.url);
  const isScan = url.pathname.includes("/scan");

  // Bypass for non-scan endpoints
  if (!isScan) return;

  // Check plan in localStorage (only client knows it, simulate check here if passed via header)
  const userPlan = request.headers.get("x-user-plan");
  if (userPlan === "premium" || userPlan === "plus") return;

  // Basic key-value store (Netlify Edge doesn’t have native DB — use global map or external API)
  const scanStore = context.cookies.get("checkreel-scan")?.value;
  let scanCount = scanStore ? parseInt(scanStore) : 0;

  if (scanCount >= FREE_LIMIT) {
    return new Response(
      JSON.stringify({ error: "Free scan limit reached. Please upgrade." }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Increment and store in cookie
  context.cookies.set("checkreel-scan", (scanCount + 1).toString(), {
    path: "/",
    httpOnly: true,
    sameSite: "Strict",
    secure: true,
  });

  return; // continue normally
};
