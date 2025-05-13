export default async (request, context) => {
  const FREE_LIMIT = 3;
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const url = new URL(request.url);
  const isScan = url.pathname.includes("/scan");

  if (!isScan) return;

  const userPlan = request.headers.get("x-user-plan");
  if (userPlan === "premium" || userPlan === "plus") return;

  const scanCookie = context.cookies.get("checkreel-scan")?.value;
  let scanCount = scanCookie ? parseInt(scanCookie) : 0;

  if (scanCount >= FREE_LIMIT) {
    return new Response(
      JSON.stringify({ error: "Free scan limit reached. Please upgrade." }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  context.cookies.set("checkreel-scan", (scanCount + 1).toString(), {
    path: "/",
    httpOnly: true,
    sameSite: "Strict",
    secure: true,
  });

  return;
};
