# Confirmed

One file per project, added by someone from that project after checking its details on the map: stage, docs, repository and the links that touch it.

A file is named after the project's id in [`data/projects.json`](../data/projects.json) (`goose.md`, `mcp.md`, `agw.md`, …) and holds three lines:

```
Project: goose
Confirmed by: @your-github-name
Date: YYYY-MM-DD
```

Each project's "Check your details" issue has a link that opens this file ready to fill in. The verify script checks that every file names a project and has a GitHub name and a date.
