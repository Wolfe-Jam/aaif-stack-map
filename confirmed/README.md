# Confirmed

One file per project: the project's details as the map showed them when someone from that project confirmed them. Git records who confirmed and when.

A file is named after the project's id in [`data/projects.json`](../data/projects.json) (`goose.md`, `mcp.md`, `agw.md`, …). Each project's "Check your details" issue has a link that opens its file already filled in, ending with `Verified by: @`. Add your GitHub handle after the `@` and press "Propose new file"; once it's merged, you're listed as a contributor.

A file is kept as it was confirmed. If the map's data changes later, the file still shows what was agreed then. The verify script checks only that each file is named after a project.
