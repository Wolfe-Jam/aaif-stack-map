---
name: add-aaif-link
description: Add or update a link between two AAIF projects on the stack map, backed by a quote from one project's own documentation. Use when asked to add, fix, or remove a link, or when verify reports a missing quote.
---

# Add an AAIF link

A link on the map is a claim that one project's documentation states a relationship to another. This skill adds one that the verify script can prove.

## Steps

1. **Find the statement.** Search the source project's repository on its default branch. Prefer docs pages and the README over blog posts, issues or release notes. The statement must name the other project or its protocol directly.
2. **Copy the quote.** Take one sentence, or two parts of one passage joined with `…`. Copy it as a reader sees it; link syntax and formatting do not matter to the check.
3. **Add the link** to `data/links.json`:

   ```json
   {
     "id": "e-<from>-<to>",
     "from": "<project id>",
     "to": "<project id>",
     "kind": "documented",
     "title": "<short plain sentence: what the link is>",
     "quote": "<the quote>",
     "source": { "repo": "<owner/name>", "path": "<file path in that repo>" },
     "added": "<today, YYYY-MM-DD>"
   }
   ```

   Use `"kind": "example"` when the source only names the other project as an example. Project ids are in `data/projects.json`.

4. **Check the drawing.** Open the page (`bunx serve .`) and confirm the new line does not pass through another project's box. If it does, add `"bend"` (a vertical offset in map units, positive bends down) or ask before moving a node.
5. **Add it to a flow** only if it extends a flow's story. Each step in `data/flows.json` names a link id and gives a one-sentence caption.
6. **Verify.** Run `bun scripts/verify.ts`. Every test must pass. Report the full output.

## Removing a link

If verify reports that a quote is gone, search the same repository for the current wording first. Remove the link only when the project no longer states it anywhere, and remove every flow step that used it.
