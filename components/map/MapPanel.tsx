"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import maplibregl, { type ExpressionSpecification, type LngLatBoundsLike, type Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { BASEMAPS, TRANSIT_PLACEHOLDER_LAYER_ID } from "@/lib/basemaps";
import { demoCollections } from "@/lib/demo-data";
import type { AnalysisRow, BasemapKey, DemoFeatureCollection, FilterState, TemplateConfig } from "@/types/templates";

type MapPanelProps = {
  config: TemplateConfig;
  secondary?: boolean;
  label?: string;
  externalView?: { center: [number, number]; zoom: number } | null;
  syncEnabled?: boolean;
  compareSplit?: number;
  activeYear?: number | null;
  filters?: FilterState;
  onViewChange?: (view: { center: [number, number]; zoom: number }) => void;
  onInspect?: (properties: Record<string, string | number>) => void;
  onAnalyzeExtent?: (summary: AnalysisRow[]) => void;
};

const defaultCenter: [number, number] = [139.7671, 35.6812];
const defaultBounds: LngLatBoundsLike = [
  [139.5, 35.5],
  [140.0, 35.85],
];

function createColorExpression(metric: string): ExpressionSpecification {
  return [
    "interpolate",
    ["linear"],
    ["coalesce", ["to-number", ["get", metric]], 0],
    0,
    "#ecfdf5",
    20,
    "#a7f3d0",
    40,
    "#6ee7b7",
    60,
    "#34d399",
    80,
    "#059669",
    100,
    "#064e3b",
  ];
}

function addTransitPlaceholder(map: Map) {
  if (map.getSource(TRANSIT_PLACEHOLDER_LAYER_ID)) return;

  map.addSource(TRANSIT_PLACEHOLDER_LAYER_ID, {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  });

  map.addLayer({
    id: TRANSIT_PLACEHOLDER_LAYER_ID,
    type: "line",
    source: TRANSIT_PLACEHOLDER_LAYER_ID,
    paint: {
      "line-color": "#111827",
      "line-width": 2,
      "line-dasharray": [2, 2],
      "line-opacity": 0.65,
    },
    layout: {
      visibility: "none",
    },
  });
}

function setTransitVisibility(map: Map, showTransit: boolean) {
  const layer = map.getLayer(TRANSIT_PLACEHOLDER_LAYER_ID);
  if (!layer) return;

  map.setLayoutProperty(
    TRANSIT_PLACEHOLDER_LAYER_ID,
    "visibility",
    showTransit ? "visible" : "none",
  );
}

function ensureMapLayers(map: Map, config: TemplateConfig, sourceId: string, collection: DemoFeatureCollection) {
  addTransitPlaceholder(map);
  if (!map.getSource(sourceId)) {
    addPrimaryLayer(map, config, sourceId, collection);
  }
}

function addPrimaryLayer(map: Map, config: TemplateConfig, sourceId: string, collection: DemoFeatureCollection) {
  map.addSource(sourceId, { type: "geojson", data: collection as any });

  const commonVisibility = compareModeLayerVisibility(config);

  if (config.styleType === "circle") {
    map.addLayer({
      id: `${sourceId}-layer`,
      type: "circle",
      source: sourceId,
      paint: {
        "circle-radius": 6,
        "circle-color": config.accent,
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 1.5,
      },
      layout: commonVisibility,
    });
    return;
  }

  if (config.styleType === "heatmap") {
    map.addLayer({
      id: `${sourceId}-layer`,
      type: "heatmap",
      source: sourceId,
      paint: {
        "heatmap-intensity": 0.9,
        "heatmap-radius": 20,
        "heatmap-opacity": 0.85,
      },
      layout: commonVisibility,
    });
    return;
  }

  if (config.styleType === "raster") {
    map.addLayer({
      id: `${sourceId}-layer`,
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": createColorExpression("intensity"),
        "fill-opacity": 0.8,
      },
      layout: commonVisibility,
    });
    return;
  }

  if (config.styleType === "hex") {
    map.addLayer({
      id: `${sourceId}-layer`,
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": createColorExpression("intensity"),
        "fill-opacity": 0.76,
        "fill-outline-color": "rgba(255,255,255,0.35)",
      },
      layout: commonVisibility,
    });
    return;
  }

  map.addLayer({
    id: `${sourceId}-layer`,
    type: "fill",
    source: sourceId,
    paint: {
      "fill-color": createColorExpression("value"),
      "fill-opacity": 0.78,
      "fill-outline-color": "rgba(255,255,255,0.5)",
    },
    layout: commonVisibility,
  });
}

function compareModeLayerVisibility(config: TemplateConfig) {
  return {
    visibility: config.hasCompareSlider ? "visible" : "visible",
  } as const;
}

function summarizeCollection(datasetKey: string) {
  const collection = demoCollections[datasetKey];
  const features = collection.features;
  const values = features.map((feature) => Number(feature.properties?.value ?? feature.properties?.intensity ?? 0));
  const total = values.reduce((sum, value) => sum + value, 0);
  const avg = values.length ? total / values.length : 0;

  return [
    { label: "Features", value: features.length },
    { label: "Average metric", value: Number(avg.toFixed(1)) },
    { label: "Total metric", value: Number(total.toFixed(1)) },
  ];
}

function getFeatureNumericValue(
  properties: Record<string, string | number>,
  keys: string[],
) {
  for (const key of keys) {
    const value = Number(properties[key]);
    if (!Number.isNaN(value)) return value;
  }
  return 0;
}

function filterCollection(
  collection: DemoFeatureCollection,
  filters: FilterState,
  activeYear: number | null,
) {
  const entries = Object.entries(filters);

  return {
    ...collection,
    features: collection.features.filter((feature) => {
      const props = feature.properties;

      if (activeYear !== null) {
        const year = Number(props.year);
        if (!Number.isNaN(year) && year > activeYear) return false;
      }

      return entries.every(([key, value]) => {
        if (value === "" || value === false) return true;
        const propValue = props[key];

        if (propValue === undefined) return true;

        if (typeof value === "number") {
          return Number(propValue) <= value;
        }

        if (typeof value === "boolean") {
          return Boolean(propValue) === value;
        }

        return String(propValue) === String(value);
      });
    }),
  };
}

function pointInBounds(coordinates: unknown, bounds: maplibregl.LngLatBounds) {
  if (!Array.isArray(coordinates) || coordinates.length < 2) return false;
  const [lng, lat] = coordinates as [number, number];
  return bounds.contains([lng, lat]);
}

function polygonTouchesBounds(coordinates: unknown, bounds: maplibregl.LngLatBounds) {
  if (!Array.isArray(coordinates)) return false;

  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  for (const ring of coordinates) {
    if (!Array.isArray(ring)) continue;
    for (const coord of ring) {
      if (!Array.isArray(coord) || coord.length < 2) continue;
      const [lng, lat] = coord as [number, number];
      minLng = Math.min(minLng, lng);
      minLat = Math.min(minLat, lat);
      maxLng = Math.max(maxLng, lng);
      maxLat = Math.max(maxLat, lat);
      if (pointInBounds(coord, bounds)) return true;
    }
  }

  if (!Number.isFinite(minLng)) return false;

  return !(
    maxLng < bounds.getWest() ||
    minLng > bounds.getEast() ||
    maxLat < bounds.getSouth() ||
    minLat > bounds.getNorth()
  );
}

function buildSummaryRows(collection: DemoFeatureCollection, config: TemplateConfig) {
  if (config.chartSeries?.length) {
    return collection.features.map((feature) => {
      const row: AnalysisRow = { name: String(feature.properties.name ?? "Feature") };
      config.chartSeries?.forEach((series) => {
        row[series.key] = getFeatureNumericValue(feature.properties, [
          series.key,
          series.key === "value" ? "landValue" : series.key,
          series.key === "zoning" ? "value" : series.key,
        ]);
      });
      return row;
    });
  }

  return collection.features.map((feature) => ({
    name: String(feature.properties.name ?? "Feature"),
    value: getFeatureNumericValue(feature.properties, ["value", "intensity", "capacity", "boardings"]),
  }));
}

function collectExtentRows(
  collection: DemoFeatureCollection,
  bounds: maplibregl.LngLatBounds,
  config: TemplateConfig,
) {
  const visibleFeatures = collection.features.filter((feature) => {
    if (feature.geometry.type === "Point") {
      return pointInBounds(feature.geometry.coordinates, bounds);
    }

    if (feature.geometry.type === "Polygon") {
      return polygonTouchesBounds(feature.geometry.coordinates, bounds);
    }

    return true;
  });

  if (config.chartSeries?.length) {
    return visibleFeatures.map((feature) => {
      const row: AnalysisRow = { name: String(feature.properties.name ?? "Feature") };
      config.chartSeries?.forEach((series) => {
        row[series.key] = getFeatureNumericValue(feature.properties, [
          series.key,
          series.key === "value" ? "landValue" : series.key,
          series.key === "zoning" ? "value" : series.key,
        ]);
      });
      return row;
    });
  }

  return visibleFeatures.map((feature) => ({
    name: String(feature.properties.name ?? "Feature"),
    value: getFeatureNumericValue(feature.properties, ["value", "intensity", "capacity", "boardings"]),
  }));
}

export function MapPanel({
  config,
  secondary = false,
  label,
  externalView,
  syncEnabled = false,
  compareSplit = 50,
  activeYear = null,
  filters = {},
  onViewChange,
  onInspect,
  onAnalyzeExtent,
}: MapPanelProps) {
  const mapId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const filteredCollectionRef = useRef<DemoFeatureCollection>(demoCollections[config.datasetKey]);
  const showTransitRef = useRef(false);
  const [basemap, setBasemap] = useState<BasemapKey>(config.basemaps[0]);
  const [showTransit, setShowTransit] = useState(false);

  const mapStyle = useMemo(() => BASEMAPS[basemap].style, [basemap]);
  const featureLayerId = `${mapId}-${config.datasetKey}-layer`;
  const sourceId = `${mapId}-${config.datasetKey}`;
  const filteredCollection = useMemo(
    () => filterCollection(demoCollections[config.datasetKey], filters, activeYear),
    [activeYear, config.datasetKey, filters],
  );

  useEffect(() => {
    filteredCollectionRef.current = filteredCollection;
  }, [filteredCollection]);

  useEffect(() => {
    showTransitRef.current = showTransit;
  }, [showTransit]);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: mapStyle,
      center: defaultCenter,
      zoom: secondary ? 10.2 : 10.8,
      maxPitch: 0,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.on("load", () => {
      ensureMapLayers(map, config, sourceId, filteredCollectionRef.current);
      map.fitBounds(defaultBounds, { padding: 30, duration: 0 });
    });

    map.on("style.load", () => {
      ensureMapLayers(map, config, sourceId, filteredCollectionRef.current);
      setTransitVisibility(map, showTransitRef.current);
    });

    map.on("moveend", () => {
      const center = map.getCenter();
      onViewChange?.({ center: [center.lng, center.lat], zoom: map.getZoom() });
    });

    map.on("click", (event) => {
      const feature = map.queryRenderedFeatures(event.point, { layers: [featureLayerId] })[0];
      if (feature?.properties) {
        onInspect?.(feature.properties as Record<string, string | number>);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [config, featureLayerId, mapId, mapStyle, onInspect, onViewChange, secondary, sourceId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.setStyle(mapStyle);
  }, [mapStyle]);

  useEffect(() => {
    const map = mapRef.current;
    const source = map?.getSource(sourceId) as maplibregl.GeoJSONSource | undefined;
    if (!source) return;

    source.setData(filteredCollection as any);
  }, [filteredCollection, sourceId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    setTransitVisibility(map, showTransit);
  }, [showTransit]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !externalView || !syncEnabled) return;

    const currentCenter = map.getCenter();
    const lngDelta = Math.abs(currentCenter.lng - externalView.center[0]);
    const latDelta = Math.abs(currentCenter.lat - externalView.center[1]);
    const zoomDelta = Math.abs(map.getZoom() - externalView.zoom);

    if (lngDelta < 0.0001 && latDelta < 0.0001 && zoomDelta < 0.01) return;

    map.jumpTo({ center: externalView.center, zoom: externalView.zoom });
  }, [externalView, syncEnabled]);

  return (
    <div
      className="panel"
      style={{
        overflow: "hidden",
        minWidth: 0,
        ...(secondary && config.hasCompareSlider
          ? { flex: `${Math.max(15, 100 - compareSplit)} 1 0%` }
          : config.hasCompareSlider
            ? { flex: `${Math.max(15, compareSplit)} 1 0%` }
            : {}),
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          padding: "14px 16px",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div>
          <strong>{label ?? (secondary ? "Secondary map" : config.title)}</strong>
          <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{config.metric}</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <select
            aria-label="Basemap"
            value={basemap}
            onChange={(event) => setBasemap(event.target.value as BasemapKey)}
            style={{ borderRadius: 999, border: "1px solid var(--line)", padding: "8px 12px" }}
          >
            {config.basemaps.map((key) => (
              <option key={key} value={key}>
                {BASEMAPS[key].label}
              </option>
            ))}
          </select>
          {config.hasTransitToggle ? (
            <button className="button secondary" onClick={() => setShowTransit((value) => !value)}>
              {showTransit ? "Hide transit layer" : "Show transit layer"}
            </button>
          ) : null}
          {config.hasExtentAnalysis ? (
            <button
              className="button"
              onClick={() => {
                const bounds = mapRef.current?.getBounds();
                if (!bounds) {
                  onAnalyzeExtent?.(
                    config.chartSeries?.length
                      ? buildSummaryRows(filteredCollection, config)
                      : summarizeCollection(config.datasetKey).map((item) => ({
                          name: item.label,
                          value: item.value,
                        })),
                  );
                  return;
                }

                onAnalyzeExtent?.(collectExtentRows(filteredCollection, bounds, config));
              }}
            >
              Analyze current view
            </button>
          ) : null}
        </div>
      </div>
      <div ref={containerRef} style={{ minHeight: secondary ? 320 : 460, width: "100%" }} />
    </div>
  );
}
