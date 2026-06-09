"use client";

import { useMemo, useState } from "react";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from "recharts";
import { demoExtentSummary, demoTimeSeries } from "@/lib/demo-data";
import type { AnalysisRow, FilterState, TemplateConfig } from "@/types/templates";
import { MapPanel } from "@/components/map/MapPanel";

type TemplateShellProps = {
  config: TemplateConfig;
};

function getDefaultFilterState(config: TemplateConfig): FilterState {
  return Object.fromEntries(
    (config.filters ?? []).map((filter) => [filter.id, filter.defaultValue ?? ""]),
  );
}

function InteractiveFiltersPanel({
  config,
  filterState,
  onFilterChange,
}: {
  config: TemplateConfig;
  filterState: FilterState;
  onFilterChange: (filterId: string, value: string | number | boolean) => void;
}) {
  if (!config.hasFilterPanel || !config.filters?.length) return null;

  return (
    <aside className="panel" style={{ padding: 18, display: "grid", gap: 14 }}>
      <div>
        <strong>Filters</strong>
        <p style={{ margin: "6px 0 0", color: "var(--muted)", lineHeight: 1.5 }}>
          These controls are placeholders wired for template structure and can be connected to real
          filtering logic when your datasets are uploaded.
        </p>
      </div>
      {config.filters.map((filter) => (
        <label key={filter.id} style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>{filter.label}</span>
          {filter.type === "select" ? (
            <select
              value={String(filterState[filter.id] ?? filter.defaultValue ?? "")}
              onChange={(event) => onFilterChange(filter.id, event.target.value)}
              style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "10px 12px" }}
            >
              {filter.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : filter.type === "range" ? (
            <input
              type="range"
              min={filter.min}
              max={filter.max}
              step={filter.step}
              value={Number(filterState[filter.id] ?? filter.defaultValue ?? filter.min ?? 0)}
              onChange={(event) => onFilterChange(filter.id, Number(event.target.value))}
            />
          ) : (
            <input
              type="checkbox"
              checked={Boolean(filterState[filter.id] ?? filter.defaultValue)}
              onChange={(event) => onFilterChange(filter.id, event.target.checked)}
            />
          )}
          {filter.type === "range" ? (
            <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{String(filterState[filter.id] ?? "")}</span>
          ) : null}
        </label>
      ))}
    </aside>
  );
}

function InspectPanel({
  config,
  inspectProperties,
}: {
  config: TemplateConfig;
  inspectProperties: Record<string, string | number> | null;
}) {
  if (!config.hasInspectPanel) return null;

  const entries = inspectProperties ? Object.entries(inspectProperties).slice(0, 6) : [];

  return (
    <aside className="panel" style={{ padding: 18, display: "grid", gap: 12 }}>
      <div>
        <strong>Feature inspection</strong>
        <p style={{ margin: "6px 0 0", color: "var(--muted)", lineHeight: 1.5 }}>
          Click a feature on the map to inspect a small set of attributes.
        </p>
      </div>
      {entries.length ? (
        <div style={{ display: "grid", gap: 8 }}>
          {entries.map(([key, value]) => (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                paddingBottom: 8,
                borderBottom: "1px solid var(--line)",
              }}
            >
              <span style={{ color: "var(--muted)" }}>{key}</span>
              <strong>{String(value)}</strong>
            </div>
          ))}
        </div>
      ) : (
        <div className="chip">No feature selected yet</div>
      )}
    </aside>
  );
}

function ChartPanel({
  config,
  extentResults,
}: {
  config: TemplateConfig;
  extentResults: AnalysisRow[] | null;
}) {
  const series = useMemo(() => config.chartSeries ?? [], [config.chartSeries]);
  const fallbackSeriesData = demoExtentSummary.map((item) => ({
    ...item,
    ...Object.fromEntries(series.map((entry, index) => [entry.key, item.values[index] ?? 0])),
  }));
  const chartData = series.length
    ? extentResults?.length
      ? extentResults
      : fallbackSeriesData
    : extentResults?.length
      ? extentResults
      : [];

  if (!config.hasExtentAnalysis && !config.chartSeries?.length) return null;

  return (
    <section className="panel" style={{ padding: 18 }}>
      <div style={{ marginBottom: 14 }}>
        <strong>{config.chartTitle ?? "Analytics"}</strong>
        <p style={{ margin: "6px 0 0", color: "var(--muted)", lineHeight: 1.5 }}>
          {config.chartDescription ?? "Attach charts here for current extent or selection summaries."}
        </p>
      </div>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          {series.length ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(31,42,48,0.12)" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {series.map((entry) => (
                <Line
                  key={entry.key}
                  type="monotone"
                  dataKey={entry.key}
                  stroke={entry.color}
                  strokeWidth={2.5}
                  dot={false}
                />
              ))}
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(31,42,48,0.12)" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={config.accent} radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function TimePanel({
  config,
  activeYearIndex,
  onChange,
}: {
  config: TemplateConfig;
  activeYearIndex: number;
  onChange: (value: number) => void;
}) {
  if (!config.hasTimeSlider) return null;

  const activeYear = demoTimeSeries[activeYearIndex]?.year ?? demoTimeSeries[demoTimeSeries.length - 1]?.year;

  return (
    <section className="panel" style={{ padding: 18 }}>
      <div style={{ marginBottom: 14 }}>
        <strong>Year slider</strong>
        <p style={{ margin: "6px 0 0", color: "var(--muted)", lineHeight: 1.5 }}>
          This template assumes your time-series data is organized by year and can be swapped into the
          same interface later.
        </p>
      </div>
      <div className="chip" style={{ width: "fit-content", marginBottom: 12 }}>
        Year: {activeYear}
      </div>
      <input
        type="range"
        min={0}
        max={demoTimeSeries.length - 1}
        value={activeYearIndex}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ width: "100%" }}
      />
      <div style={{ width: "100%", height: 180, marginTop: 14 }}>
        <ResponsiveContainer>
          <LineChart data={demoTimeSeries}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(31,42,48,0.12)" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={config.accent} strokeWidth={2.5} dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function NotesPanel({ config }: { config: TemplateConfig }) {
  return (
    <section className="panel" style={{ padding: 18 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {config.tags.map((tag) => (
          <span key={tag} className="chip">
            {tag}
          </span>
        ))}
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {config.notes.map((note) => (
          <div key={note} style={{ color: "var(--muted)", lineHeight: 1.55 }}>
            {note}
          </div>
        ))}
      </div>
    </section>
  );
}

function LegendPanel({ config }: { config: TemplateConfig }) {
  const ramp = [
    "#ecfdf5",
    "#a7f3d0",
    "#6ee7b7",
    "#34d399",
    "#059669",
    "#064e3b",
  ];

  const densityRamp = [
    "#eff6ff",
    "#bfdbfe",
    "#60a5fa",
    "#2563eb",
    "#1d4ed8",
    "#1e3a8a",
  ];

  const colors = config.styleType === "heatmap" ? densityRamp : ramp;
  const labels =
    config.styleType === "circle"
      ? ["Lower", "Higher"]
      : ["Low", "", "", "", "", "High"];

  return (
    <section className="panel" style={{ padding: 18 }}>
      <div style={{ marginBottom: 12 }}>
        <strong>Legend</strong>
        <p style={{ margin: "6px 0 0", color: "var(--muted)", lineHeight: 1.5 }}>
          {config.metric}
        </p>
      </div>
      {config.styleType === "circle" ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: config.accent, display: "inline-block" }} />
          <span style={{ color: "var(--muted)" }}>Point features sized and colored for emphasis</span>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${colors.length}, 1fr)`, gap: 6 }}>
            {colors.map((color) => (
              <span
                key={color}
                style={{ height: 14, borderRadius: 999, background: color, display: "block" }}
              />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${labels.length}, 1fr)`, gap: 6, fontSize: "0.85rem", color: "var(--muted)" }}>
            {labels.map((label, index) => (
              <span key={`${label}-${index}`}>{label}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export function TemplateShell({ config }: TemplateShellProps) {
  const [inspectProperties, setInspectProperties] = useState<Record<string, string | number> | null>(null);
  const [extentResults, setExtentResults] = useState<AnalysisRow[] | null>(null);
  const [syncedView, setSyncedView] = useState<{ center: [number, number]; zoom: number } | null>(null);
  const [timeIndex, setTimeIndex] = useState(demoTimeSeries.length - 1);
  const [compareSplit, setCompareSplit] = useState(50);
  const [filterState, setFilterState] = useState<FilterState>(() => getDefaultFilterState(config));
  const layoutClass =
    config.layout === "dual"
      ? "template-content dual"
      : config.layout === "comparison"
        ? "template-content comparison"
        : "template-content";
  const activeYear = config.hasTimeSlider ? demoTimeSeries[timeIndex]?.year ?? null : null;

  function handleFilterChange(filterId: string, value: string | number | boolean) {
    setFilterState((current) => ({
      ...current,
      [filterId]: value,
    }));
  }

  return (
    <article className="grid" style={{ gap: 18 }}>
      <section className="panel" style={{ padding: 20 }}>
        <div className="eyebrow">{config.category.replace("-", " ")}</div>
        <h2 style={{ margin: "12px 0 8px", fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}>{config.title}</h2>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>{config.summary}</p>
      </section>

      <section className={layoutClass}>
        <div className="grid" style={{ gap: 18 }}>
          {config.hasCompareSlider ? (
            <section className="panel" style={{ padding: 14, display: "grid", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <strong>Before / After comparison</strong>
                  <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                    Adjust the split to emphasize either side of the comparison.
                  </div>
                </div>
                <div className="chip">Split: {compareSplit}% / {100 - compareSplit}%</div>
              </div>
              <input
                type="range"
                min={20}
                max={80}
                value={compareSplit}
                onChange={(event) => setCompareSplit(Number(event.target.value))}
                style={{ width: "100%" }}
              />
              <div className="comparison-row">
                <MapPanel
                  config={config}
                  label="Before"
                  compareSplit={compareSplit}
                  activeYear={activeYear}
                  filters={filterState}
                  syncEnabled
                  externalView={syncedView}
                  onInspect={setInspectProperties}
                  onAnalyzeExtent={setExtentResults}
                  onViewChange={setSyncedView}
                />
                <MapPanel
                  config={config}
                  secondary
                  label="After"
                  compareSplit={compareSplit}
                  activeYear={activeYear}
                  filters={filterState}
                  syncEnabled
                  externalView={syncedView}
                  onInspect={setInspectProperties}
                  onViewChange={setSyncedView}
                />
              </div>
            </section>
          ) : (
            <>
              <MapPanel
                config={config}
                activeYear={activeYear}
                filters={filterState}
                syncEnabled={config.hasSyncedMaps}
                externalView={syncedView}
                onInspect={setInspectProperties}
                onAnalyzeExtent={setExtentResults}
                onViewChange={setSyncedView}
              />
              {config.hasSyncedMaps ? (
                <MapPanel
                  config={config}
                  secondary
                  label="Synchronized companion"
                  activeYear={activeYear}
                  filters={filterState}
                  syncEnabled
                  externalView={syncedView}
                  onInspect={setInspectProperties}
                  onViewChange={setSyncedView}
                />
              ) : null}
            </>
          )}
          {config.hasTimeSlider ? (
            <TimePanel config={config} activeYearIndex={timeIndex} onChange={setTimeIndex} />
          ) : null}
          {config.hasExtentAnalysis || config.chartSeries?.length ? (
            <ChartPanel config={config} extentResults={extentResults} />
          ) : null}
        </div>

        <div className="grid" style={{ gap: 18 }}>
          <NotesPanel config={config} />
          <LegendPanel config={config} />
          <InteractiveFiltersPanel
            config={config}
            filterState={filterState}
            onFilterChange={handleFilterChange}
          />
          <InspectPanel config={config} inspectProperties={inspectProperties} />
        </div>
      </section>
    </article>
  );
}
