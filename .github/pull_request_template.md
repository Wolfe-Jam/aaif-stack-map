<!-- Confirming a project (a file in confirmed/)? Nothing else is needed: you can leave the rest of this template as it is. -->

## What changed

<!-- One or two lines. For a new link: the two projects, and the kind (documented or example). -->

## Source

<!-- For a link or stage change: the quote and the source file URL on the project's default branch. -->

## Verify

<!-- Paste the full output of `bun scripts/verify.ts`. Every test must pass. -->

```
```

- [ ] `bun scripts/verify.ts` passes
- [ ] `bun.lock` is unchanged, unless you changed a dependency (Bun 1.3 rewrites it: `git checkout bun.lock`)
- [ ] `bunx tsc --noEmit` passes
