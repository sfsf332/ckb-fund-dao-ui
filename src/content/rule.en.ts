export type RuleSection = { id: string; title: string };

export const ruleSectionsEn: RuleSection[] = [
  { id: "background", title: "Background" },
  { id: "dao-vision", title: "Architecture" },
  { id: "roles", title: "Roles" },
  { id: "process", title: "Process" },
  { id: "budget", title: "Budget" },
  { id: "security", title: "Security" },
  { id: "amend", title: "Amendment" },
];

export const ruleContentEn: Record<string, string> = {
  background: `
    <h4>Objectives</h4>
    <p>Build an open, transparent and trustworthy treasury governance to ensure fund security and efficiency.</p>
    <h4>Challenges</h4>
    <p>As proposals and budgets grow, we need standardized processes and tooling to improve transparency and traceability.</p>
    <h4>Improvements</h4>
    <ul>
      <li>Standardized workflow</li>
      <li>Open data</li>
      <li>Clear responsibilities</li>
    </ul>
  `,
  "dao-vision": `
    <h4>Architecture</h4>
    <p>Community, proposers, execution teams, auditors and multisig signers collaborate via governance rules.</p>
  `,
  roles: `
    <h4>Roles & Responsibilities</h4>
    <ul>
      <li>Proposer: deliver milestones</li>
      <li>Multisig: execute payments</li>
      <li>Auditor: record and disclose key data</li>
    </ul>
  `,
  process: `
    <h4>Workflow</h4>
    <p>Proposal → Review/Vote → Execute & Pay by milestones → Acceptance & Retrospective</p>
  `,
  budget: `
    <h4>Budget & Payment</h4>
    <p>Milestone-based payment with clear cost categories and unified metrics.</p>
  `,
  security: `
    <h4>Security & Audit</h4>
    <p>2/3 multisig, emergency procedures, periodic audit reports.</p>
  `,
  amend: `
    <h4>Amendment</h4>
    <p>Versioned rules; any change must be approved by community voting.</p>
  `,
};


