# AAIF Stack Map

An interactive map of the ten [Agentic AI Foundation](https://aaif.io/projects) projects and the links between them. Every line on the map is a link that one project's own documentation states, with the quote and the file it comes from.

A community map by James Wolfe, AAIF Ambassador, built from each project's own documentation.

## What it shows

- **10 projects** in five layers: context, agents & apps, protocols, gateways, and run & train. The list matches [aaif.io/projects](https://aaif.io/projects); stages come from the [technical committee table](https://github.com/aaif/technical-committee).
- **16 documented links, 1 example and 2 open seams.** A documented link is stated in a project's docs. An example is a mention only. An open seam is an overlap no document settles.
- **5 flows** that step through how the projects work together: a coding agent at work, through the gateway, agents talking to agents, train then serve, and an app calls a model.
- **Docs and repository** for each project, one click from its panel.

## Run it

```sh
bunx serve .
```

Then open the address it prints. The page reads `data/*.json`, so it needs to be served; opening `index.html` as a file will not load the data.

## Verify

```sh
bun install
bun scripts/verify.ts
```

The script clones each source repository (shallow, into `.cache/repos`) and runs three tiers of tests:

| Tier | Checks |
| --- | --- |
| 1 · Sources | Every source repository is reachable, every source file exists, and every quote still appears in its file. |
| 2 · Stages | Every stage matches the technical committee table, and the map has exactly the projects the table lists. |
| 3 · Data | The data files are consistent: unique ids, links between real nodes, flow steps that name real links, complete project records. |

It prints every test and exits non-zero if any fails. CI runs it on every push and pull request and once a week; when the weekly run finds drift, it opens an issue labelled `drift`.

## Contribute

- **Share a path:** these are some of the paths to discover relationships between the projects: the five flows on the map. Share yours: [open a path issue](https://github.com/Wolfe-Jam/aaif-stack-map/issues/new?template=share-a-path.yml).
- **Propose a link:** [open a link issue](https://github.com/Wolfe-Jam/aaif-stack-map/issues/new?template=propose-a-link.yml) with the quote and the source file URL, or send a pull request.

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Work on it with an agent

- [`AGENTS.md`](AGENTS.md) gives any coding agent the rules for this repository.
- [`.agents/skills/add-aaif-link`](.agents/skills/add-aaif-link/SKILL.md) is an Agent Skill for adding a link the verify script can prove.
- [`recipes/recheck.yaml`](recipes/recheck.yaml) is a goose recipe that runs the verify script and proposes fixes for any drift:

  ```sh
  goose run --recipe recipes/recheck.yaml
  ```

## Data

| File | Holds |
| --- | --- |
| `data/projects.json` | Projects: stage, docs, repository, contributor, date joined, and map position |
| `data/links.json` | Links: ends, kind, quote, source repository and path |
| `data/flows.json` | Flows: ordered link ids with one caption each |

## License

Code and data files: MIT. Quotes belong to their projects and are reproduced short, with their source file linked.
