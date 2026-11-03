#!/usr/bin/env bun
// Verifies every claim the map makes against the projects' own repositories.
// Tier 1 SOURCES: every quote still appears in its source file; every source file exists.
// Tier 2 STAGES: every stage matches the AAIF technical committee table; the project count matches.
// Tier 3 DATA: the data files are internally consistent.
// Usage: bun scripts/verify.ts [--repos-dir <dir>] [--json <file>]

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

type Kind = "documented" | "example" | "seam";
interface Source { repo?: string; path?: string; label?: string; note?: string }
interface Link { id: string; from: string; to: string; kind: Kind; title: string; quote: string; source: Source; added?: string; bend?: number }
interface Node {
  id: string; name: string; kind: string; layer: string; x: number; y: number; outside?: boolean; hub?: boolean;
  origin?: string; joined?: string; stage?: string; role: string; repo?: string; docs?: string; committeeName?: string;
}
interface Flow { name: string; steps: { link: string; caption: string }[] }
type Tier = 1 | 2 | 3;
interface Result { tier: Tier; name: string; pass: boolean; detail: string }

const ROOT = resolve(import.meta.dir, "..");
const COMMITTEE = "aaif/technical-committee";
const STAGES = ["Sandbox", "Growth", "Impact", "Emeritus"] as const;

const args = process.argv.slice(2);
const argValue = (flag: string): string | undefined => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const reposDir = resolve(argValue("--repos-dir") ?? join(ROOT, ".cache", "repos"));
const jsonOut = argValue("--json");

const readJson = <T>(file: string): T => JSON.parse(readFileSync(join(ROOT, "data", file), "utf8")) as T;
const { nodes } = readJson<{ nodes: Node[] }>("projects.json");
const { links } = readJson<{ links: Link[] }>("links.json");
const { flows } = readJson<{ flows: Record<string, Flow> }>("flows.json");

const results: Result[] = [];
const record = (tier: Tier, name: string, pass: boolean, detail = ""): void => { results.push({ tier, name, pass, detail }); };

// --- Repository access ------------------------------------------------------

const run = (cmd: string[], cwd?: string): { ok: boolean; out: string } => {
  const p = Bun.spawnSync(cmd, { cwd, stdout: "pipe", stderr: "pipe" });
  return { ok: p.exitCode === 0, out: p.stdout.toString() + p.stderr.toString() };
};
const dirFor = (repo: string): string => join(reposDir, repo.replace("/", "_"));

function ensureRepo(repo: string): boolean {
  const dir = dirFor(repo);
  if (existsSync(join(dir, ".git"))) {
    const fetched = run(["git", "fetch", "-q", "--depth", "1", "origin", "HEAD"], dir);
    if (fetched.ok) run(["git", "update-ref", "HEAD", "FETCH_HEAD"], dir);
    return run(["git", "rev-parse", "HEAD"], dir).ok;
  }
  mkdirSync(reposDir, { recursive: true });
  return run(["git", "clone", "-q", "--depth", "1", "--no-checkout", "--filter=blob:limit=2m", `https://github.com/${repo}`, dir]).ok;
}

const fileCache = new Map<string, string | null>();
function readFromRepo(repo: string, path: string): string | null {
  const key = `${repo}:${path}`;
  if (!fileCache.has(key)) {
    const r = run(["git", "show", `HEAD:${path}`], dirFor(repo));
    fileCache.set(key, r.ok ? r.out : null);
  }
  return fileCache.get(key) ?? null;
}

// Compares text the way a reader sees it: markdown links reduced to their text,
// tags and punctuation dropped, case and whitespace ignored.
const normalize = (s: string): string =>
  s.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
const quoteSegments = (quote: string): string[] => quote.split("…").map(normalize).filter(s => s.length > 0);

// --- Tier 3: data integrity (runs first, needs no network) -------------------

const nodeIds = new Set(nodes.map(n => n.id));
const linkIds = new Set(links.map(l => l.id));
const projects = nodes.filter(n => !n.outside);

record(3, "node ids are unique", nodeIds.size === nodes.length, `${nodes.length} nodes`);
record(3, "link ids are unique", linkIds.size === links.length, `${links.length} links`);
for (const l of links) {
  const missing = [l.from, l.to].filter(id => !nodeIds.has(id));
  record(3, `link ${l.id}: both ends exist`, missing.length === 0, missing.length ? `unknown: ${missing.join(", ")}` : `${l.from} ↔ ${l.to}`);
}
for (const [key, f] of Object.entries(flows)) {
  const missing = f.steps.map(s => s.link).filter(id => !linkIds.has(id));
  record(3, `flow ${key}: every step names a link`, missing.length === 0, missing.length ? `unknown: ${missing.join(", ")}` : `${f.steps.length} steps`);
}
for (const p of projects) {
  const gaps = (["repo", "docs", "stage", "committeeName", "origin", "joined"] as const).filter(k => !p[k]);
  record(3, `project ${p.id}: required fields present`, gaps.length === 0, gaps.length ? `missing: ${gaps.join(", ")}` : "repo, docs, stage, committee name");
  if (p.docs) record(3, `project ${p.id}: docs link is https`, p.docs.startsWith("https://"), p.docs);
  if (p.stage) record(3, `project ${p.id}: stage is a known stage`, (STAGES as readonly string[]).includes(p.stage), p.stage);
}
for (const l of links.filter(l => l.kind !== "seam")) {
  record(3, `link ${l.id}: has a repository source`, Boolean(l.source.repo && l.source.path), l.source.repo ? `${l.source.repo}/${l.source.path}` : "no source");
}

// --- Fetch repositories ---------------------------------------------------

const repos = [...new Set([COMMITTEE, ...links.map(l => l.source.repo).filter((r): r is string => Boolean(r))])];
const reachable = new Set<string>();
for (const repo of repos) {
  const ok = ensureRepo(repo);
  if (ok) reachable.add(repo);
  record(1, `repository ${repo} is reachable`, ok, ok ? run(["git", "rev-parse", "--short", "HEAD"], dirFor(repo)).out.trim() : "clone or fetch failed");
}

// --- Tier 1: sources and quotes --------------------------------------------

for (const l of links) {
  const { repo, path } = l.source;
  if (!repo || !path) continue;
  if (!reachable.has(repo)) { record(1, `link ${l.id}: source file exists`, false, `${repo} unreachable`); continue; }
  const text = readFromRepo(repo, path);
  record(1, `link ${l.id}: source file exists`, text !== null, `${repo}/${path}`);
  if (text === null || l.kind === "seam") continue;
  const body = normalize(text);
  const missing = quoteSegments(l.quote).filter(seg => !body.includes(seg));
  record(1, `link ${l.id}: quote appears in source`, missing.length === 0, missing[0] !== undefined ? `not found: "${missing[0].slice(0, 80)}"` : l.title);
}

// --- Tier 2: stages ---------------------------------------------------------

const readme = reachable.has(COMMITTEE) ? readFromRepo(COMMITTEE, "README.md") : null;
record(2, "technical committee project table is readable", readme !== null, `${COMMITTEE}/README.md`);
if (readme) {
  const table = new Map<string, string>();
  const row = /<strong>([^<]+)<\/strong>[\s\S]*?<td>\s*(\w+) Stage\s*<\/td>/g;
  for (const m of readme.matchAll(row)) { const [, name, stage] = m; if (name && stage) table.set(name.trim(), stage); }
  record(2, "project count matches the committee table", table.size === projects.length, `map ${projects.length}, table ${table.size}`);
  const named = new Set(projects.map(p => p.committeeName));
  for (const name of table.keys()) {
    if (!named.has(name)) record(2, `committee project "${name}" is on the map`, false, "listed by the committee, missing from the map");
  }
  for (const p of projects) {
    const listed = p.committeeName ? table.get(p.committeeName) : undefined;
    record(2, `project ${p.id}: stage matches committee`, listed === p.stage, `map ${p.stage ?? "none"}, committee ${listed ?? "not listed"}`);
  }
}

// --- Report -----------------------------------------------------------------

const TIER_NAME: Record<Tier, string> = { 1: "SOURCES", 2: "STAGES", 3: "DATA" };
let failed = 0;
for (const tier of [1, 2, 3] as const) {
  const rows = results.filter(r => r.tier === tier);
  const passed = rows.filter(r => r.pass).length;
  console.log(`\nTier ${tier}: ${TIER_NAME[tier]} (${passed}/${rows.length})`);
  for (const r of rows) {
    console.log(`  ${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `  [${r.detail}]` : ""}`);
    if (!r.pass) failed++;
  }
}
console.log(`\n${results.length - failed}/${results.length} passed${failed ? `, ${failed} failed` : ""}`);
if (jsonOut) writeFileSync(jsonOut, JSON.stringify({ checked: new Date().toISOString(), passed: results.length - failed, failed, results }, null, 2) + "\n");
process.exit(failed ? 1 : 0);
