export type TemplateCategory =
  | "choropleth"
  | "time-slider"
  | "before-after"
  | "filter-panel"
  | "extent-analytics"
  | "inspect"
  | "sync-maps"
  | "density";

export type TemplateLayout =
  | "focus-map"
  | "map-left"
  | "map-right"
  | "stacked"
  | "comparison"
  | "dual";

export type BasemapKey = "osm" | "positron" | "satellite";

export type LayerStyleType =
  | "fill"
  | "line"
  | "circle"
  | "heatmap"
  | "raster"
  | "hex";

export type FilterControl = {
  id: string;
  label: string;
  type: "select" | "range" | "toggle";
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: string | number | boolean;
};

export type FilterState = Record<string, string | number | boolean>;

export type ChartSeries = {
  key: string;
  label: string;
  color: string;
};

export type AnalysisRow = {
  name: string;
  value?: number;
  [key: string]: string | number | undefined;
};

export type TemplateConfig = {
  slug: string;
  title: string;
  summary: string;
  category: TemplateCategory;
  layout: TemplateLayout;
  tags: string[];
  accent: string;
  basemaps: BasemapKey[];
  hasTransitToggle: boolean;
  hasTimeSlider?: boolean;
  hasCompareSlider?: boolean;
  hasFilterPanel?: boolean;
  hasExtentAnalysis?: boolean;
  hasInspectPanel?: boolean;
  hasSyncedMaps?: boolean;
  hasDensityOverlay?: boolean;
  styleType: LayerStyleType;
  metric: string;
  location: string;
  datasetKey: string;
  chartTitle?: string;
  chartDescription?: string;
  chartSeries?: ChartSeries[];
  filters?: FilterControl[];
  notes: string[];
};

export type ProjectConfig = {
  slug: string;
  title: string;
  subtitle: string;
  intro: string;
  location: string;
  heroTemplateSlug: string;
  supportingTemplateSlugs: string[];
  callouts: string[];
};

export type DemoFeatureProperties = Record<string, string | number>;

export type DemoFeatureCollection = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: DemoFeatureProperties;
    geometry: {
      type: string;
      coordinates: unknown;
    };
  }>;
};
