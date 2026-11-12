# Security

The map is a static page (`index.html` and `data/*.json`) and a verify script (`scripts/verify.ts`) that clones the projects' public repositories and reads their files. It stores no data and takes no input beyond the repository itself.

## Report a vulnerability

Use [GitHub's private vulnerability reporting](https://github.com/Wolfe-Jam/aaif-stack-map/security/advisories/new) for anything that could harm a visitor to the page, someone running the verify script, or the CI workflow. Please don't open a public issue for it.

A wrong or outdated link on the map is not a security issue: [open a link issue](https://github.com/Wolfe-Jam/aaif-stack-map/issues/new?template=propose-a-link.yml) instead.
