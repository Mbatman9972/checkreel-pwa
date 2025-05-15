export function getUserPlan() {
  return localStorage.getItem("userPlan") || "free";
}

export function getPlanLimit(plan) {
  switch (plan) {
    case "plus":
      return 40;
    case "premium":
      return 20;
    case "free":
    default:
      return 3;
  }
}

export function remainingQuota(usedCount) {
  const plan = getUserPlan();
  const limit = getPlanLimit(plan);
  return limit === Infinity ? Infinity : Math.max(0, limit - usedCount);
}
