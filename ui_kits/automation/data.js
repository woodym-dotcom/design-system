window.AA_RUNS = [
  { id: "run-7a4f", name: "regulatory.filings · daily roll-up", state: "running",  startedAt: "14:02:11", duration: "00:01:47", progress: 64, owner: "scheduler",     node: "node-2", logs: 142, children: ["run-7a4f-1", "run-7a4f-2", "run-7a4f-3"] },
  { id: "run-7a4f-1", parent: "run-7a4f", name: "  ↳ resolve dataset",            state: "success",  startedAt: "14:02:12", duration: "00:00:06", progress: 100, owner: "scheduler", node: "node-2", logs: 12 },
  { id: "run-7a4f-2", parent: "run-7a4f", name: "  ↳ materialise roll-up",        state: "success",  startedAt: "14:02:18", duration: "00:00:44", progress: 100, owner: "scheduler", node: "node-2", logs: 86 },
  { id: "run-7a4f-3", parent: "run-7a4f", name: "  ↳ diff yesterday",             state: "running",  startedAt: "14:03:02", duration: "00:00:22", progress: 38,  owner: "scheduler", node: "node-2", logs: 44 },

  { id: "run-7a4e", name: "vendor.scoring · Q2 recompute",                         state: "queued",   startedAt: "14:01:55", duration: "—",        progress: 0,   owner: "mara.okafor", node: "—",      logs: 0 },
  { id: "run-7a4d", name: "alerts.dedup · 5m window",                              state: "success",  startedAt: "13:59:00", duration: "00:00:42", progress: 100, owner: "scheduler",   node: "node-1", logs: 88 },
  { id: "run-7a4c", name: "edge.firewall · sync rulesets",                         state: "failed",   startedAt: "13:54:32", duration: "00:00:11", progress: 18,  owner: "scheduler",   node: "node-3", logs: 31, children: ["run-7a4c-1", "run-7a4c-2"] },
  { id: "run-7a4c-1", parent: "run-7a4c", name: "  ↳ fetch upstream snapshot",     state: "success",  startedAt: "13:54:33", duration: "00:00:04", progress: 100, owner: "scheduler",   node: "node-3", logs: 8 },
  { id: "run-7a4c-2", parent: "run-7a4c", name: "  ↳ apply diff (HTTP 502)",       state: "failed",   startedAt: "13:54:38", duration: "00:00:03", progress: 100, owner: "scheduler",   node: "node-3", logs: 12 },

  { id: "run-7a4b", name: "regulatory.filings · obligations diff",                 state: "success",  startedAt: "13:48:00", duration: "00:02:09", progress: 100, owner: "jin.park",    node: "node-2", logs: 220 },
  { id: "run-7a4a", name: "vendor.attestation · reminder cohort",                  state: "paused",   startedAt: "13:30:00", duration: "00:00:00", progress: 12,  owner: "yara.mendes", node: "—",      logs: 4 },
];

window.AA_TIMELINE = [
  { t: "14:02:11", lvl: "info",  msg: "Run created — trigger: cron(@daily)" },
  { t: "14:02:11", lvl: "info",  msg: "Scheduled to node-2 · weight 0.30" },
  { t: "14:02:12", lvl: "info",  msg: "Step 1/4 · resolve dataset = regulatory.filings@2026-05-15" },
  { t: "14:02:18", lvl: "debug", msg: "  rows: 18,442 (delta: +118)" },
  { t: "14:02:18", lvl: "info",  msg: "Step 2/4 · materialise daily roll-up" },
  { t: "14:02:51", lvl: "warn",  msg: "  obligation_id=OBL-4471 missing source_url — skipping" },
  { t: "14:03:02", lvl: "info",  msg: "  duration: 44.3s" },
  { t: "14:03:02", lvl: "info",  msg: "Step 3/4 · diff against yesterday" },
  { t: "14:03:24", lvl: "info",  msg: "  +12 new · −3 retired · 7 edited" },
  { t: "14:03:24", lvl: "info",  msg: "Step 4/4 · publish to /v1/platform/filings" },
];
