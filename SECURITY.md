# Cyberdyne Security Policy

We take the security of the Cyberdyne platform seriously. This document explains how to report vulnerabilities and what to expect.

## Supported Branches / Assets
| Component | Status | Notes |
|-----------|--------|-------|
| `main` branch | Supported | Active development
| Public web assets (`/public`) | Supported | Production build artifacts
| Client‑side application (`/src`) | Supported | React + telemetry UI only
| Internal/private services | Out of scope | Not in this repository

## In Scope
- Client‑side JavaScript, routing, and build output actually served from this repo
- Configuration files affecting security headers, CSP, caching, or authentication logic (e.g. `vercel.json`, build configs)
- Data integrity mechanisms (hashes, attestation metadata surfaced in UI)

## Out of Scope
- Social engineering, phishing, physical attacks
- Denial of service (volume, resource exhaustion, fuzz w/o notice)
- Automated scanner noise lacking clear exploitability
- Vulnerabilities in third‑party libraries with no exploitable impact specific to our usage

## Reporting
Email: security@cyberdyne.example (PGP key fingerprint: `3C7F 9E12 7B9C 5521 9A44  6A01 9F2B D8E1 4C55 A2EF`)

Include (when possible):
- Summary & impact
- Affected files / routes
- Reproduction steps (minimal)
- Proof of concept (no production data exfiltration)
- Suggested remediation (optional)

## Coordinated Disclosure Timeline
| Phase | Target SLA |
|-------|------------|
| Initial acknowledgement | 2 business days |
| Triage & severity rating | 5 business days |
| Fix plan shared (High/Critical) | 10 business days |
| Patch deployment (Critical) | ≤ 30 days |
| Patch deployment (High) | ≤ 45 days |
| Patch deployment (Medium) | ≤ 90 days |
| Public disclosure | Mutually agreed after fix |

Delays (complex root cause, upstream dependency) will be communicated.

## Severity Rating (Qualitative)
- Critical: Remote code execution, auth bypass, supply chain compromise
- High: Privilege escalation, sensitive data exposure, integrity violation
- Medium: Limited data leakage, security control bypass with constraints
- Low: Hardening gap, best practice deviation, informational issue

## Safe Harbor
If you comply with this policy when reporting:
- We will not pursue legal action for good‑faith research
- Your testing must avoid privacy violations and service disruption
- Do not access or modify data that is not yours

## Prohibited Testing
- Automated scanning generating excessive traffic
- Destructive actions (data deletion, corruption)
- Attempted persistence or backdoors

## Cryptography / Integrity
- All distributed initialization capsules must include published SHA‑256 hashes
- Keys are rotated at least every 12 months or upon suspected compromise
- No custom cryptographic primitives—industry standard algorithms only

## Dependency Management
- Third‑party packages are reviewed for license & security posture
- Vulnerability alerts triaged weekly; high severity patched promptly

## Handling of Reports
1. Assign internal tracking ID
2. Reproduce and classify severity
3. Determine fix owner & timeline
4. Implement, test (regression + security)
5. Deploy & confirm remediation
6. Credit researcher (if desired) upon disclosure

## Responsible Disclosure Credits
We maintain an internal Hall of Thanks; opt‑in via your report.

## Contact Escalation
If no acknowledgement within SLA, escalate to: ciso@cyberdyne.example

## Last Updated
2025‑08‑30
