/* tier.js – tiny store */
const KEY     = "cr-tier";
const DEFAULT = { name: "free", quota: 3 };

export function getTier()  { return JSON.parse(localStorage.getItem(KEY)) || DEFAULT; }
export function setTier(t) { localStorage.setItem(KEY, JSON.stringify(t)); }

export function decrementQuota() {
  const t = getTier();
  if (t.quota === "∞") return true;
  if (t.quota > 0) { t.quota -= 1; setTier(t); return true; }
  return false;
}

/* dev helpers */
window.__setFree    = () => setTier({ name: "free",    quota: 3   });
window.__setPremium = () => setTier({ name: "premium", quota: 300 });
window.__setPlus    = () => setTier({ name: "plus",    quota: "∞" });
