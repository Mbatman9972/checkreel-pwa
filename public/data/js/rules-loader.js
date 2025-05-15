export let rules = {};

export async function loadRules() {
  try {
    const res = await fetch("public/data/rules.json");
    if (!res.ok) throw new Error("Could not load rules");
    rules = await res.json();
    console.log("✅ Loaded Rules:", rules);
  } catch (err) {
    console.error("❌ Failed to load rules:", err);
  }
}
