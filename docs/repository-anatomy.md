# Repository Anatomy

This repository is meant to stay simple enough to understand by opening a small number of files. This guide explains where to start when editing manually.

## First files to read

- `app/page.tsx`
  The homepage. This is the simplest personal page in the repo and the best place to start when changing the public-facing introduction.
- `components/site/Header.tsx`
  Shared navigation for the site. If you want to rename sections or simplify navigation, start here.
- `app/globals.css`
  Global typography, spacing, colors, and reusable layout classes.
- `docs/project-spec.md`
  The durable statement of what the site is supposed to be.

## App routes

- `app/page.tsx`
  Homepage.
- `app/projects/`
  Project listing page and individual project routes.
- `app/templates/`
  Reusable map template listing and detail routes.
- `app/docs/`
  Human-readable internal documentation rendered inside the site.

## Main component folders

- `components/site/`
  Small site-wide building blocks such as the header and project cards.
- `components/template/`
  The larger layout shell for map-oriented template pages.
- `components/map/`
  Map-specific logic and panels.

## Main data and configuration files

- `lib/templates.ts`
  The central registry for template definitions and project shells. If you want to add or remove a project direction, this is one of the first files to edit.
- `lib/demo-data.ts`
  Lightweight placeholder data that keeps the scaffold working before real project data is connected.
- `types/templates.ts`
  Type definitions for the template and project config objects.

## Data pipeline

- `data/inputs/`
  Canonical input area for datasets and ingestion overrides.
- `public/data/inputs/`
  Additional intake area that can also hold direct files or Windows `.lnk` shortcuts.
- `scripts/ingest_data.py`
  The ingestion script that reads source datasets, resolves supported shortcuts, and writes processed outputs.
- `public/data/processed/`
  Generated outputs that the website reads directly.
- `data/reports/`
  Machine-readable ingestion reports.

## How page rendering works

- Most pages are plain route files under `app/`.
- Project and template pages rely on configuration in `lib/templates.ts`.
- The goal is to keep content structure obvious: route files describe page sections, config files describe reusable data, and CSS defines the shared visual language.

## Manual editing advice

- Change content in route files first before introducing new abstractions.
- Prefer extending an existing section or config object over adding a new helper unless the duplication is genuinely confusing.
- Keep comments short and aimed at future manual editing.
- If a file becomes hard to understand without scrolling through many unrelated concerns, split it.

## Suggested reading order for future edits

1. `docs/project-spec.md`
2. `docs/repository-anatomy.md`
3. `app/page.tsx`
4. `components/site/Header.tsx`
5. `app/globals.css`
6. `lib/templates.ts`

## Design rule

When two implementations would both work, prefer the one that is easier for the site owner to understand and modify by hand later.
