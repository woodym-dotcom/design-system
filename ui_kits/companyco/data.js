window.VENDORS = [
  { id: "v1", name: "Aegis Suppliers Ltd",   tier: "Core",    status: "active",  risk: 18, owner: "Mara Okafor",  reviewed: "18-APR-2026", country: "GB", contract: "MSA-2024-014", spend: "£1.2m", openings: 2 },
  { id: "v2", name: "Northstar Cloud Services", tier: "Domain", status: "review",  risk: 52, owner: "Jin Park",     reviewed: "02-MAY-2026", country: "US", contract: "MSA-2023-091", spend: "$840k", openings: 5 },
  { id: "v3", name: "Heliograph Analytics",   tier: "Bespoke", status: "blocked", risk: 88, owner: "Yara Mendes",   reviewed: "28-MAR-2026", country: "PT", contract: "MSA-2024-002", spend: "€310k", openings: 0 },
  { id: "v4", name: "Marlin Print Services",  tier: "Core",    status: "active",  risk: 11, owner: "Mara Okafor",   reviewed: "05-MAY-2026", country: "GB", contract: "MSA-2022-148", spend: "£180k", openings: 0 },
  { id: "v5", name: "Oakshield Audit Co.",    tier: "Domain",  status: "active",  risk: 33, owner: "Adaeze Iyenoma", reviewed: "11-APR-2026", country: "IE", contract: "MSA-2024-027", spend: "€420k", openings: 1 },
  { id: "v6", name: "Polar Bearings GmbH",    tier: "Core",    status: "active",  risk: 22, owner: "Jin Park",       reviewed: "29-APR-2026", country: "DE", contract: "MSA-2023-119", spend: "€940k", openings: 3 },
  { id: "v7", name: "Quanta Test Labs",       tier: "Domain",  status: "review",  risk: 61, owner: "Yara Mendes",    reviewed: "12-MAR-2026", country: "FR", contract: "MSA-2024-038", spend: "€660k", openings: 1 },
  { id: "v8", name: "Riverside Legal LLP",    tier: "Bespoke", status: "active",  risk: 14, owner: "Adaeze Iyenoma", reviewed: "01-MAY-2026", country: "GB", contract: "MSA-2021-007", spend: "£240k", openings: 0 },
];

window.FILTER_CHIPS = [
  { id: "active",  label: "Active",   field: "status", value: "active",  count: 5 },
  { id: "review",  label: "Review",   field: "status", value: "review",  count: 2 },
  { id: "blocked", label: "Blocked",  field: "status", value: "blocked", count: 1 },
  { id: "core",    label: "Core",     field: "tier",   value: "Core",    count: 3 },
  { id: "domain",  label: "Domain",   field: "tier",   value: "Domain",  count: 3 },
  { id: "bespoke", label: "Bespoke",  field: "tier",   value: "Bespoke", count: 2 },
];
