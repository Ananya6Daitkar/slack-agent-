# Security Model

CrisisOps is designed for enterprise incident response, so trust and auditability are product features.

## Workspace Isolation

Every persisted object carries a `teamId`. A production database must enforce team-level filtering in every query and use separate encryption keys or tenant boundaries for larger enterprise customers.

## Least Privilege

The Slack app should request only scopes needed for the installed surfaces. Private channels should require explicit invitation. The agent should never summarize channels the acting user cannot access.

## Human Approval

External mutations are approval-gated:

- status/customer updates
- resource reservations
- ticket creation in production
- escalation actions

The demo implements approval for external status updates and logs it.

## Audit Logging

The audit log records:

- actor
- action
- target
- metadata
- timestamp

MCP tool calls are separately logged with input and output payloads.

## Prompt Injection Awareness

Slack messages are treated as untrusted evidence, not instructions. The agent system prompt requires source citation, no fabrication, and approval before external actions.

## No Cross-Channel Leakage

Production RTS adapters must filter results by the acting user's Slack permissions and workspace policy. Generated briefings should include only evidence the user is authorized to view.

## Retention

Recommended defaults:

- Incident state: 365 days
- Audit logs: 365+ days or customer policy
- Raw Slack excerpts: minimum needed for evidence
- Demo mode: resettable and non-production

## Marketplace Trust Checklist

- OAuth install flow documented
- Data retention documented
- Admin-configurable connector allowlist
- Approval-gated external actions
- Source citations in briefings
- Clear separation between demo and production integrations
