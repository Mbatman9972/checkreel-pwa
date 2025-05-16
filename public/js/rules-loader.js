// rules-loader.js – CheckReel policy rules engine
export async function fetchRules(platform, region) {
  try {
    const res = await fetch('data/rules.json');
    const allRules = await res.json();

    if (!platform || !region) return [];

    const filtered = allRules.filter(rule =>
      rule.platform === platform &&
      (rule.region === region || rule.region === 'global')
    );

    return filtered;
  } catch (err) {
    console.error('❌ Failed to load rules.json', err);
    return [];
  }
}
