@AGENTS.md

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. Route only to skills in the session's available-skills list; answer directly for quick questions or small scoped edits.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /autoplan
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → fix them directly: one read-only check of the cause, or a focused failing test first when the cause is unclear; then fix it and run that test
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Building UI → once it renders, invoke /design-review --build <preview url> (opt-in)
- Ship/deploy/PR → invoke /ship (merge + deploy: the user types /land-and-deploy)
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec

## Testing

- `npm run test:e2e` builds the site and runs the Playwright suite in `e2e/` against `next start -p 3100` (Chromium, reduced motion). `E2E_REUSE=1` reuses a server already on :3100 while iterating on a spec.
- `e2e/desktop-look.spec.ts-snapshots/` holds the approved 1440px look. Re-take a picture only in the commit that changes that page on purpose (`npm run test:e2e -- desktop-look --update-snapshots`) and review the diff images first.

gstack:verify: npm run lint && npm run test:e2e
