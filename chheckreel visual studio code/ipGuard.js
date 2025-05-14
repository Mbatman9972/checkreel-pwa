export default async (request, context) => {
  const planLimits = {
    free: 3,
    premium: 20,
    plus: 40
  };

  const userPlan = request.headers.get("x-user-plan") || "free";
  const limit = planLimits[userPlan] ?? 3;

  // Check current scan count from cookie
  const scanCookie = context.cookies.get("checkreel-scan")?.value;
  let scanCount = scanCookie ? parseInt(scanCookie) : 0;

  if (scanCount >= limit) {
    return new Response(JSON.stringify({
      error: "Free scan limit reached. Please upgrade."
    }), {
      status: 429,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Allow and update cookie
  context.cookies.set("checkreel-scan", (scanCount + 1).toString(), {
    path: "/",
    httpOnly: true,
    sameSite: "Strict",
    secure: true
  });

  return; // allow request to proceed
};
