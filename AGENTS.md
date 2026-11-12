# AGENTS.md

Instructions for coding agents (goose, Claude Code, Codex and others) working in this repository.

## What this repository is

An interactive map of the ten Agentic AI Foundation (AAIF) projects and the links between them. Every link on the map is backed by a quote from one project's own documentation, with the file the quote comes from.

## Commands

```sh
bun install              # dev dependencies only: TypeScript and Bun's types
bunx serve .             # serve the page, then open the address it prints (opening index.html as a file won't load the data)
bun scripts/verify.ts    # check every claim against the source repositories
bunx tsc --noEmit        # typecheck the verify script
```

## Where things live

- `data/projects.json`: the ten projects (stage, docs, repository, technical committee name) plus the two outside nodes, "Your app" and "Models".
- `data/links.json`: every line on the map. `kind` is `documented`, `example` or `seam`.
- `data/flows.json`: the guided flows. Each step names a link id.
- `index.html`: the page. It reads the three data files and holds no data of its own.
- `scripts/verify.ts`: checks every claim against the source repositories.
- `project.faf`: the repository's facts (stack, commands, data files) as structured YAML, for agents that read it.

## Rules

1. A `documented` or `example` link needs a `quote` copied from the source file and a `source` with `repo` and `path`. Copy the quote as a reader sees it; the verify script ignores markdown, punctuation and case. Use `…` to join two parts of one passage.
2. A `seam` describes an overlap no document settles. Its quote is our own wording, so keep it factual and name what is missing.
3. Stages come only from the project table in `aaif/technical-committee`. Do not infer a stage from a blog post or announcement.
4. The project list comes only from aaif.io/projects. Do not add a project that page does not list.
5. Mark new links with `"added": "YYYY-MM-DD"`, the date you verified them.
6. Do not change `index.html` to change data. Change the data files.

## Leave alone

- `.cache/`: the verify script's shallow clones of the source repositories. Never commit it.
- `bun.lock`: change it only when you change a dependency in `package.json`.
- `report.json`: verify's `--json` output, not part of the repository.

## Before you finish

Run `bun scripts/verify.ts`. Every test must pass, and report the full result, not a summary. If a quote no longer appears in its source, find the current wording in the same repository and update the quote and path; if the project no longer states the link at all, remove the link and any flow step that uses it.

## Commits

`<type>: <what changed>`, then a blank line and `- <specific detail>` lines. Plain wording, no exclamation marks.
