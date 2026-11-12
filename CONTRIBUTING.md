# Contributing

The map makes one kind of claim: a project's own documentation states a link to another AAIF project. Every contribution keeps that claim checkable.

## Share a path

A path is a route through the map that shows how projects work together. [Open a path issue](https://github.com/Wolfe-Jam/aaif-stack-map/issues/new?template=share-a-path.yml) with the steps in order. A path can use only links the map has; if it needs a new one, propose that link too.

To add a path yourself, add a flow to `data/flows.json`. Each step names a link id and gives one sentence of caption. The page adds its button.

## Propose a link

[Open a link issue](https://github.com/Wolfe-Jam/aaif-stack-map/issues/new?template=propose-a-link.yml), or add it to `data/links.json` in a pull request. A link needs:

- **A quote** from the source project's docs, copied as a reader sees it.
- **A source file** in that project's own repository, on its default branch. Docs pages and READMEs are preferred over blog posts, issues and release notes.
- **A kind:** `documented` when the docs state the link, `example` when they only name the other project as an example. (`seam` marks an overlap no document settles; its quote is the map's own wording and it needs no source.)
- **Two ends:** `from` and `to` are the two projects the line connects. The page draws no arrow, so their order doesn't matter. The source is whichever project's docs the quote comes from.
- **Optionally a `label`** in `source`, shown next to the file name (for example `README, Key Features`).

The [add-aaif-link skill](.agents/skills/add-aaif-link/SKILL.md) walks through the steps.

## Confirm your project

If you work on one of the projects, open its "Check your details" issue. Its confirm link opens `confirmed/<project id>.md` with the project's details as the map shows them; if they're right, add your GitHub handle after `Verified by: @`, press "Propose new file", then "Create pull request". If something's wrong, say so in the issue or fix it in a pull request. [confirmed/README.md](confirmed/README.md) has more.

## Sentences that state counts and dates

A few sentences hold numbers the data can change. When your change makes one wrong, update it in the same pull request:

- README, "What it shows": the counts of projects, links, examples, seams and flows.
- `index.html`: the line under the title (project count and month), "MCP is the hub" and "MCP sits in the middle" (how many projects link to MCP), the stage lists and the committee table's date, and the overview's sentence about links added in a check.

## What the map does not take

- Links inferred from code, blog posts, talks or social posts, however reasonable.
- Projects that [aaif.io/projects](https://aaif.io/projects) does not list.
- Stages from anywhere but the [technical committee table](https://github.com/aaif/technical-committee).

## Before you open a pull request

```sh
bun install
bun scripts/verify.ts
bunx tsc --noEmit
```

CI uses Bun 1.4.4. Bun 1.3 can't read `bun.lock` and rewrites it on `bun install`; if `bun.lock` shows as changed, run `git checkout bun.lock` before you commit.

Every test must pass. Paste the full verify output in the pull request.

## Commits

`<type>: <what changed>`, then a blank line and `- <specific detail>` lines. Plain wording, no exclamation marks.
