window.RW_CANDIDATES = [
  { id: "c1", name: "Mara Okafor",        role: "Senior backend",       phase: "screen",   score: null, owner: "Jin Park",      when: "12-MAY-2026", source: "Referral · Adaeze", years: 7 },
  { id: "c2", name: "Yara Mendes",        role: "Senior backend",       phase: "screen",   score: null, owner: "Jin Park",      when: "11-MAY-2026", source: "LinkedIn",          years: 6 },
  { id: "c3", name: "Adaeze Iyenoma",     role: "Staff product designer", phase: "allocate", score: null, owner: "Mara Okafor",   when: "10-MAY-2026", source: "Inbound",           years: 9 },
  { id: "c4", name: "Polar B. Wenders",   role: "Senior backend",       phase: "allocate", score: null, owner: "Jin Park",      when: "08-MAY-2026", source: "Referral · Yara",   years: 5 },
  { id: "c5", name: "Quanta Nedelcu",     role: "Staff product designer", phase: "score",    score: 8.2, owner: "Mara Okafor",   when: "06-MAY-2026", source: "Conference",        years: 8 },
  { id: "c6", name: "Riverside Patel",    role: "Engineering manager",  phase: "score",    score: 7.4, owner: "Adaeze Iyenoma", when: "04-MAY-2026", source: "LinkedIn",          years: 11 },
  { id: "c7", name: "Northstar Yu",       role: "Engineering manager",  phase: "approve",  score: 9.1, owner: "Adaeze Iyenoma", when: "02-MAY-2026", source: "Referral · Jin",    years: 10 },
  { id: "c8", name: "Oakshield Park",     role: "Senior backend",       phase: "approve",  score: 8.6, owner: "Jin Park",      when: "29-APR-2026", source: "Inbound",           years: 6 },
  { id: "c9", name: "Heliograph Yusuf",   role: "Staff product designer", phase: "complete", score: 8.9, owner: "Mara Okafor",   when: "22-APR-2026", source: "Referral · Mara",   years: 12 },
];

window.RW_PHASES = [
  { id: "screen",   label: "Screen",   description: "New applications awaiting first review." },
  { id: "allocate", label: "Allocate", description: "Assigned to a hiring panel — interviews scheduled." },
  { id: "score",    label: "Score",    description: "Loop complete; awaiting structured score from panel." },
  { id: "approve",  label: "Approve",  description: "Hiring committee review · offer in motion." },
  { id: "complete", label: "Complete", description: "Hired or closed." },
];

window.RW_ROLES = [
  { id: "all", label: "All roles", count: 9 },
];

window.RW_DEPARTMENTS = [
  {
    id: "engineering",
    label: "Engineering",
    count: 6,
    specialisations: [
      {
        id: "eng-backend",
        label: "Backend",
        count: 4,
        roles: [
          { id: "senior-backend", label: "Senior backend", count: 4 },
        ],
      },
      {
        id: "eng-management",
        label: "Engineering management",
        count: 2,
        roles: [
          { id: "engineering-manager", label: "Engineering manager", count: 2 },
        ],
      },
    ],
  },
  {
    id: "design",
    label: "Design",
    count: 3,
    specialisations: [
      {
        id: "design-product",
        label: "Product design",
        count: 3,
        roles: [
          { id: "product-designer", label: "Staff product designer", count: 3 },
        ],
      },
    ],
  },
  {
    id: "ops",
    label: "Operations",
    count: 0,
    specialisations: [
      {
        id: "ops-leadership",
        label: "Operations leadership",
        count: 0,
        roles: [
          { id: "ops-lead", label: "Operations lead", count: 0 },
        ],
      },
    ],
  },
];
