export const PLANS = {
  free: { limit: 3, label: "Free Plan" },
  premium: { limit: 300, label: "Premium Plan" },
  plus: { limit: Infinity, label: "Plus Plan" }
};

export function getUserPlan() {
  const plan = localStorage.getItem("userPlan");
  return PLANS[plan] ? plan : "free";
}

export function getPlanLimit(plan) {
  return PLANS[plan]?.limit ?? PLANS.free.limit;
}

export function remainingQuota(used) {
  const plan = getUserPlan();
  const limit = getPlanLimit(plan);
  return Math.max(0, limit - used);
}

// Dev override helpers (for testing in dev tools)
window.__setFree = () => localStorage.setItem("userPlan", "free");
window.__setPremium = () => localStorage.setItem("userPlan", "premium");
window.__setPlus = () => localStorage.setItem("userPlan", "plus");
