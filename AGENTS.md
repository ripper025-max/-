# EMBERFALL · 잿불의 성역

This is the existing Korean action RPG requested by the user. Continue this implementation; do not recreate it from the public game URL or replace it with a framework scaffold. Read CODEX_START_HERE.md, README.md and HANDOFF.md first.

## Source and runtime

- `dist/` contains the authored, editable game source. No build or external game dependency is required.
- Use Node.js 22+ and `npm start` for a local server at http://127.0.0.1:4173. There is no mandatory npm install step.
- `npm test` runs the core combat, legacy-save, arsenal and open-world checks. `npm run test:full` runs eleven input-driven combat simulations. `npm run test:render` requires optional @napi-rs/canvas; skip with an explanation if unavailable.
- Preserve localStorage key `emberfall.save.v1`, saved inventory, growth, currencies, runes and build presets. Never reset player data without authorization.

## User-approved direction

- Open field centered on a safe village for maintenance; sparse scenery, open sightlines and no encounter gates or mandatory area order.
- Player dash and Spacebar skill were explicitly removed. Do not restore them.
- Eight distinct classes. Exactly ONE dedicated weapon type per class; never restore unrestricted weapon swapping. Five skills per class with three equipped slots, chosen in town. Rune interactions and boss-specific legendary rewards.
- Individual loot rolls for every player, including ordinary monsters. No round-robin allocation. Class-eligible gear, protected overflow, and no automatic sale of full-bag rewards.
- One continuous meadow rift: kill progress, guardian at 100%, timed tier unlock, town preparation.
- Improve action motions/effects and readable Korean UI. Preserve local same-screen co-op and solo play.
- Equipment locks, bulk salvage, comparisons and build presets are approved.
- Random reward events and special co-op combo attacks were rejected.

## Continue from the same repository

The user explicitly wants ongoing repository-based collaboration between this environment and their home Codex, not repeated ZIP transfers.

- At the start of a task, inspect `git status` and the configured remotes. Fetch the shared GitHub remote when available and compare local changes with its latest branch before editing. Preserve unrelated or uncommitted work.
- Treat the shared GitHub repository as the source exchanged between devices. Do not overwrite newer remote work or force-push shared branches.
- After an authorized implementation task, validate relevant behavior, update HANDOFF.md when the working state changes, commit the requested changes, and push them to the shared repository when credentials and branch policy allow. Resolve ordinary conflicts while preserving both sides; report blocked authentication or policy honestly. Do not claim synchronization before the remote confirms the change.
- If a pull request is required, create the branch/PR and identify which branch contains the work. Do not silently bypass review or merge requirements.
- GitHub push shares source; it does not automatically update the published Sites game. Deployments remain separate and require authorization for the current audience.
- A different ChatGPT account must connect a GitHub identity with access to this repository. Public game access does not grant source-edit or Sites deployment permissions.

## Existing hosting

The `.openai/hosting.json` binding belongs to the original Site. Preserve it; never invent an ID or create a replacement merely because another account cannot deploy there. It does not prevent local development. Verify active-account permissions before any requested publication. Keep tokens and credentials out of files and Git history.
