# Incomplete install

Only `SKILL.md` was uploaded. The `references/` folder it depends on is missing.

`SKILL.md` instructs the assistant to read every file in `references/` before
its first message, and cites these six by name:

| File | Purpose per `SKILL.md` |
| --- | --- |
| `references/prompt-laws.md` | hero-video laws, prompt templates, cost preflighting. Read before any generation. |
| `references/design-package.md` | design package template; the build's input. |
| `references/scrub-pipeline.md` | scrub-hero engineering standard and self-test checklist. Read before building. |
| `references/ffmpeg-recipes.md` | exact encode, extraction and concat commands. |
| `references/deploy.md` | Hostinger deploy flow, live verification, costs talk. |
| `references/troubleshooting.md` | symptom to cause to fix. |

Until those are added, the phases that depend on them cannot be followed as
written. Add them under `references/` in this folder.

The skill also requires two connectors that are not currently set up:
Higgsfield (image and video generation) and Hostinger (hosting). It expects to
run in Claude Code on a desktop, where connectors and local installs are
available.
