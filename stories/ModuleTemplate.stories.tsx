/**
 * ModuleTemplate stories — one canonical baseline per variant + a tabs story.
 *
 * Snapshot story ids:
 *   primitives-moduletemplate--list
 *   primitives-moduletemplate--config
 *   primitives-moduletemplate--monitor
 *   primitives-moduletemplate--review
 *   primitives-moduletemplate--detail
 *   primitives-moduletemplate--auth
 *   primitives-moduletemplate--home
 *   primitives-moduletemplate--tabs
 */
import * as React from "react";
import { ModuleTemplate } from "../react/ModuleTemplate";
import type { ColumnDef, KpiDef, ChartCardDef } from "../react/ModuleTemplate.types";

export default {
  title: "Primitives/ModuleTemplate",
  component: ModuleTemplate,
  parameters: { layout: "fullscreen" },
};

interface PersonRow {
  id: string;
  name: string;
  email: string;
  role: string;
}

const personColumns: ColumnDef<PersonRow>[] = [
  { key: "name", label: "Name", sortable: true, render: (r) => r.name },
  { key: "email", label: "Email", render: (r) => r.email },
  { key: "role", label: "Role", render: (r) => r.role },
];

const people: PersonRow[] = [
  { id: "1", name: "Alpha Adams", email: "alpha@example.com", role: "Admin" },
  { id: "2", name: "Bo Beam", email: "bo@example.com", role: "Operator" },
  { id: "3", name: "Cal Chen", email: "cal@example.com", role: "Viewer" },
];

const breadcrumbs = [
  { label: "Workspace", href: "/" },
  { label: "Directory", href: "/dir" },
  { label: "People" },
];

const headerActions = (
  <>
    <button type="button" className="cc-btn cc-btn--ghost cc-btn--sm">Import</button>
    <button type="button" className="cc-btn cc-btn--primary cc-btn--sm">New person</button>
  </>
);

// ── list ──────────────────────────────────────────────────────────────────────

export const List = () => (
  <ModuleTemplate
    variant="list"
    header={{
      title: "People",
      subtitle: "Everyone with access to this workspace.",
      breadcrumbs,
      actions: headerActions,
    }}
    rows={people}
    columns={personColumns}
  />
);

// ── config ────────────────────────────────────────────────────────────────────

export const Config = () => (
  <ModuleTemplate
    variant="config"
    header={{
      title: "Workspace settings",
      subtitle: "Configure billing, integrations and branding.",
      breadcrumbs,
    }}
    sections={[
      {
        id: "general",
        label: "General",
        render: () => (
          <div style={{ padding: 16 }}>
            <h3>General</h3>
            <p>Workspace name, slug, default time zone.</p>
          </div>
        ),
      },
      {
        id: "billing",
        label: "Billing",
        render: () => (
          <div style={{ padding: 16 }}>
            <h3>Billing</h3>
            <p>Plan, seats, invoices.</p>
          </div>
        ),
      },
      {
        id: "integrations",
        label: "Integrations",
        render: () => (
          <div style={{ padding: 16 }}>
            <h3>Integrations</h3>
            <p>Slack, Webhooks, SAML.</p>
          </div>
        ),
      },
    ]}
  />
);

// ── monitor ───────────────────────────────────────────────────────────────────

const kpis: KpiDef[] = [
  { id: "active", label: "Active users", value: "1,234", delta: "+12% vs last week" },
  { id: "errors", label: "Error rate", value: "0.42%", delta: "-0.08%" },
  { id: "uptime", label: "Uptime (30d)", value: "99.97%" },
  { id: "latency", label: "p95 latency", value: "182ms", delta: "+4ms" },
];

const chartCards: ChartCardDef[] = [
  {
    id: "requests",
    heading: "Requests per minute",
    subtitle: "Last 24h",
    render: () => (
      <div
        style={{
          height: 160,
          background:
            "linear-gradient(180deg, var(--cc-color-surface-2, #eef) 0%, transparent 100%)",
          borderRadius: 8,
          display: "flex",
          alignItems: "end",
          gap: 4,
          padding: 8,
        }}
        aria-hidden="true"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${20 + Math.abs(Math.sin(i)) * 80}%`,
              background: "var(--cc-color-accent, #4f46e5)",
              borderRadius: 2,
            }}
          />
        ))}
      </div>
    ),
  },
];

export const Monitor = () => (
  <ModuleTemplate
    variant="monitor"
    header={{
      title: "System health",
      subtitle: "Aggregate signals across all services.",
      breadcrumbs,
    }}
    kpis={kpis}
    chartCards={chartCards}
  />
);

// ── review ────────────────────────────────────────────────────────────────────

export const Review = () => (
  <ModuleTemplate
    variant="review"
    header={{
      title: "Pending review",
      subtitle: "AI-suggested actions awaiting human approval.",
      breadcrumbs,
    }}
    items={[
      {
        id: "r1",
        title: "Promote Beam to Admin",
        meta: "Suggested by malbot · 2h ago",
      },
      {
        id: "r2",
        title: "Archive 5 stale invitations",
        meta: "Suggested by malbot · 4h ago",
      },
    ]}
    onApprove={() => {}}
    onReject={() => {}}
    onEscalate={() => {}}
    reviewActions={[{ id: "snooze", label: "Snooze 24h", onAction: () => {} }]}
  />
);

// ── detail ────────────────────────────────────────────────────────────────────

export const Detail = () => (
  <ModuleTemplate
    variant="detail"
    header={{
      title: "Invoice INV-4287",
      subtitle: "Issued 2026-05-12 · Paid",
      breadcrumbs: [
        { label: "Workspace", href: "/" },
        { label: "Invoices", href: "/inv" },
        { label: "INV-4287" },
      ],
      backHref: "/inv",
      actions: (
        <button type="button" className="cc-btn cc-btn--ghost cc-btn--sm">
          Download PDF
        </button>
      ),
    }}
  >
    <div style={{ padding: 24, maxWidth: 720 }}>
      <h2>Customer</h2>
      <p>Acme Corp · acme@example.com</p>
      <h2>Line items</h2>
      <ul>
        <li>Pro plan — $99.00</li>
        <li>Extra seats (3) — $45.00</li>
      </ul>
      <p>
        <strong>Total:</strong> $144.00
      </p>
    </div>
  </ModuleTemplate>
);

// ── auth ──────────────────────────────────────────────────────────────────────

export const Auth = () => (
  <ModuleTemplate
    variant="auth"
    header={{ title: "Sign in to CompanyCo" }}
    authBrand="companyco"
    authForm={
      <form style={{ display: "grid", gap: 12, maxWidth: 320 }}>
        <label>
          Email
          <input
            type="email"
            defaultValue=""
            placeholder="you@example.com"
            style={{ width: "100%" }}
          />
        </label>
        <label>
          Password
          <input type="password" style={{ width: "100%" }} />
        </label>
        <button type="button" className="cc-btn cc-btn--primary">
          Sign in
        </button>
      </form>
    }
    authFooter={
      <p style={{ fontSize: 12 }}>
        <a href="/forgot">Forgot password?</a> · <a href="/signup">Create account</a>
      </p>
    }
  />
);

export const AuthWithError = () => (
  <ModuleTemplate
    variant="auth"
    header={{ title: "Sign in" }}
    authBrand="recruitment"
    authError="Invalid email or password."
    authForm={
      <form style={{ display: "grid", gap: 12, maxWidth: 320 }}>
        <label>
          Email
          <input type="email" defaultValue="bad@example.com" />
        </label>
        <label>
          Password
          <input type="password" />
        </label>
        <button type="button" className="cc-btn cc-btn--primary">
          Try again
        </button>
      </form>
    }
  />
);

// ── home ──────────────────────────────────────────────────────────────────────

export const Home = () => (
  <ModuleTemplate
    variant="home"
    header={{
      title: "Welcome back, Woody",
      subtitle: "Pick up where you left off.",
    }}
    viewerRoles={["admin", "operator"]}
    columns={3}
    homepageCards={[
      {
        id: "people",
        title: "People",
        subtitle: "Manage the directory",
        roles: ["admin"],
        render: () => <p>3 pending invitations.</p>,
        href: "/people",
      },
      {
        id: "ops",
        title: "Operations",
        subtitle: "Today's work",
        roles: ["operator"],
        render: () => <p>12 tickets in queue.</p>,
        href: "/ops",
      },
      {
        id: "billing",
        title: "Billing",
        roles: ["admin"],
        render: () => <p>Next invoice on 2026-06-01.</p>,
        href: "/billing",
      },
    ]}
  />
);

// ── tabs ──────────────────────────────────────────────────────────────────────

export const Tabs = () => (
  <ModuleTemplate
    variant="list"
    header={{
      title: "Directory",
      subtitle: "All workspace surfaces in one place.",
      breadcrumbs,
      actions: headerActions,
    }}
    rows={people}
    columns={personColumns}
    tabs={[
      {
        id: "monitoring",
        label: "Monitoring",
        count: 4,
        content: (
          <div style={{ padding: 24 }}>
            <h2>Monitoring panel</h2>
            <p>Health metrics for the directory module.</p>
          </div>
        ),
      },
      {
        id: "list",
        label: "List",
        count: 3,
        content: (
          <div style={{ padding: 24 }}>
            <h2>People list</h2>
            <p>The full directory table renders here.</p>
          </div>
        ),
      },
      {
        id: "review-queue",
        label: "Review queue",
        count: 2,
        content: (
          <div style={{ padding: 24 }}>
            <h2>Pending review</h2>
            <p>Items awaiting approval.</p>
          </div>
        ),
      },
      {
        id: "configurations",
        label: "Configurations",
        content: (
          <div style={{ padding: 24 }}>
            <h2>Configurations</h2>
            <p>Module-level configuration sections.</p>
          </div>
        ),
      },
    ]}
  />
);
