# Contributing

The map makes one kind of claim: a project's own documentation states a link to another AAIF project. Every contribution keeps that claim checkable.

## Share a path

A path is a route through the map that shows how projects work together. [Open a path issue](https://github.com/Wolfe-Jam/aaif-stack-map/issues/new?template=share-a-path.yml) with the steps in order. A path can use only links the map has; if it needs a new one, propose that link too.

To add a path yourself, add a flow to `data/flows.json`. Each step names a link id and gives one sentence of caption. The page adds its button.

## Propose a link

[Open a link issue](https://github.com/Wolfe-Jam/aaif-stack-map/issues/new?template=propose-a-link.yml), or add it to `data/links.json` in a pull request. A link needs:

- **A quote** from the source project's docs, copied as a reader sees it.
- **A source file** in that project's own repository, on its default branch. Docs pages and READMEs are preferred over blog posts, issues and release notes.
- **A kind:** `documented` when the docs state the link, `example` when they only name the other project as an example.

The [add-aaif-link skill](.agents/skills/add-aaif-link/SKILL.md) walks through the steps.

## Confirm your project

If you work on one of the projects, open its "Check your details" issue. Its confirm link opens `confirmed/<project id>.md` with the project's details as the map shows them; if they're right, add your name after `Verified by:` and press "Propose new file". If something's wrong, say so in the issue or fix it in a pull request. [confirmed/README.md](confirmed/README.md) has more.

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

Every test must pass. Paste the full verify output in the pull request.

## Commits

`<type>: <what changed>`, then a blank line and `- <specific detail>` lines. Plain wording, no exclamation marks.
