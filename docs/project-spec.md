# Project Specification

## Purpose

This repository is a personal website and portfolio focused on interactive geospatial projects. It should stay readable in code, simple enough to extend, and built around static deployment.

## Core stack

- Next.js
- React
- TypeScript
- MapLibre for maps
- Recharts for analytical charts
- Static files as the backend data model

## Site goals

- The homepage should be clean and portfolio-oriented.
- It should introduce who the site owner is, what kind of work they do, and how to enter the projects.
- Content that is more internal, structural, or exploratory should live one click deeper rather than crowding the homepage.

## Project themes

- City-level transportation
- Land use
- Urban science
- Japanese zoning and land value
- Chicago zoning capacity
- Passenger flow and building volume relationships in major Chinese cities
- Urban mirror / current-window analytics
- Historical OSM and renewable energy growth in China

## Template goals

The site should provide many reusable templates, with multiple templates for each of the following:

- Choropleth maps
- Time sliders
- Before/after comparison
- Filter panels
- Active-extent summary charts
- Click-to-inspect features
- Side-by-side synchronized maps
- Hexbin or density views

## Flagship project

- The Japanese zoning and land value project is the flagship example.
- Analytics around rings within distances of railway stations are especially important.
- Extent or view-based analytics should use a manual trigger button rather than recomputing continuously.

## Data expectations

- Most source datasets will arrive as GeoPackages for vector data.
- Raster datasets may represent land cover, population, land-use intensity, or similar surfaces.
- Time-series data should be organized by year.
- The repo should provide an ingestion point at `data/inputs/`.

## Data workflow expectations

- Build a workflow that accepts provided GeoPackages and converts them into web-ready outputs.
- Prefer GeoJSON for smaller/simpler vector datasets.
- Prefer PMTiles for larger/more complex vector datasets when the toolchain supports writing them.
- Provide an equivalent ingestion path for rasters.
- The workflow should produce manifests and metadata so the website can understand processed outputs.

## Basemap expectations

Every map should support switching basemaps, including:

- OpenStreetMap
- CartoDB Positron
- Satellite

Google Maps should be ignored for now.

## Transit expectations

- Every map should have a transit layer option.
- If a known transit overlay is not ready, keep the toggle and leave the implementation placeholder cleanly isolated.

## UX expectations

- Desktop-first, but mobile-safe.
- Good code readability is more important than overengineering.
- The site should feel like a working prototype, not a brittle mockup.
- Performance matters, especially for homepage scrolling and general navigation.

## Deployment expectations

- The site should be compatible with Vercel or GitHub Pages.
- Static export support is important.

## Internal maintenance expectations

- The repository should include documentation pages that capture the project requirements and decisions.
- Another agent should be able to read those docs and continue work with minimal extra context.
