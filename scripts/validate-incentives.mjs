// Sanity-checks the incentive data files so a guide update can't silently break the advisor.
// Runs automatically before `npm run build`.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const load = (p) => JSON.parse(readFileSync(path.join(root, p), "utf8"));

const azure = load("src/data/incentives/azure.json");
const mw = load("src/data/incentives/modern-work.json");
const creds = load("src/data/incentives/credentials.json");
const catalog = load("src/data/catalog/azure-services.json");
load("src/data/incentives/markets.json");
load("src/data/incentives/meta.json");

const errors = [];
const credIds = new Set(creds.groups.flatMap((g) => g.items.map((i) => i.id)));
const tagSet = new Set(catalog.services.flatMap((s) => s.t));
const ruleTags = new Set(["*", ...tagSet]);

function checkPartner(id, partner) {
  for (const c of [...(partner.anyOf ?? []), ...(partner.allOf ?? []), ...(partner.minOf?.of ?? [])]) {
    if (!credIds.has(c)) errors.push(`${id}: unknown credential "${c}" (add it to credentials.json)`);
  }
}

function checkSizes(id, sizes, markets) {
  let prev = -Infinity;
  for (const s of sizes) {
    if (typeof s.min !== "number") errors.push(`${id}/${s.size}: min must be a number`);
    if (s.min < prev) errors.push(`${id}/${s.size}: sizes must be in ascending order`);
    prev = s.min;
    for (const m of markets) {
      if (typeof s.payout?.[m] !== "number") errors.push(`${id}/${s.size}: missing payout for market ${m}`);
      if (s.stage2 && typeof s.stage2[m] !== "number") errors.push(`${id}/${s.size}: missing stage2 for market ${m}`);
    }
  }
}

const seen = new Set();
for (const p of azure.programmes) {
  if (seen.has(p.id)) errors.push(`duplicate programme id ${p.id}`);
  seen.add(p.id);
  checkPartner(p.id, p.partner);
  checkSizes(p.id, p.sizes, p.markets === "ABC" ? ["A", "B", "C"] : ["A", "B"]);
  for (const t of [...(p.rule.anchor ?? []), ...(p.rule.scope ?? []), ...(p.rule.workload?.tags ?? [])]) {
    if (!ruleTags.has(t)) errors.push(`${p.id}: rule tag "${t}" is not used by any service in the catalogue`);
  }
  if (p.rule.linked && !azure.programmes.some((x) => x.id === p.rule.linked)) errors.push(`${p.id}: linked programme ${p.rule.linked} not found`);
}
for (const p of mw.programmes) {
  if (seen.has(p.id)) errors.push(`duplicate programme id ${p.id}`);
  seen.add(p.id);
  checkPartner(p.id, p.partner);
  if (p.sizes) checkSizes(p.id, p.sizes, ["A", "B", "C"]);
  for (const r of p.requires ?? []) if (!mw.programmes.some((x) => x.id === r)) errors.push(`${p.id}: requires unknown programme ${r}`);
}
const svcIds = new Set();
for (const s of catalog.services) {
  if (svcIds.has(s.id)) errors.push(`duplicate service id ${s.id}`);
  svcIds.add(s.id);
  if (!catalog.categories.includes(s.c)) errors.push(`service ${s.id}: unknown category "${s.c}"`);
}

if (errors.length) {
  console.error(`Incentive data validation failed (${errors.length}):\n - ${errors.join("\n - ")}`);
  process.exit(1);
}
console.log(`Incentive data OK — ${azure.programmes.length} Azure + ${mw.programmes.length} seat-based programmes, ${catalog.services.length} Azure services.`);
