// Load rules based on selected platform and region
async function loadRules(platform, region) {
  try {
    const res = await fetch("data/rules.json");
    const data = await res.json();

    const platformData = data.platforms?.[platform];
    if (!platformData) return showRules(["No rules found for selected platform."]);

    const globalRules = platformData.global?.rules || {};
    const regionRules = platformData.regional_exceptions?.[region]?.additional_restrictions || [];

    const ruleList = [];

    // Include global rule keys
    Object.keys(globalRules).forEach(rule => {
      const value = globalRules[rule];
      if (typeof value === "boolean" && value) {
        ruleList.push(formatRuleLabel(rule));
      }
    });

    // Include region-specific rules
    if (regionRules.length) {
      ruleList.push(...regionRules.map(r => formatRuleLabel(r)));
    }

    showRules(ruleList);
  } catch (err) {
    console.error("Failed to load rules.json:", err);
    showRules(["⚠️ Unable to load rules."]);
  }
}

// Format camelCase or snake_case to human-readable
function formatRuleLabel(key) {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, l => l.toUpperCase());
}

// Inject rules into DOM
function showRules(rules) {
  const ruleBox = document.getElementById("rule-box");
  const ruleList = document.getElementById("rule-list");

  ruleBox?.classList.remove("hidden");
  ruleList.innerHTML = "";

  rules.forEach(rule => {
    const li = document.createElement("li");
    li.textContent = rule;
    ruleList.appendChild(li);
  });
}

// Expose globally for dashboard to call
window.loadRules = loadRules;
