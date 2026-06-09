import neighborhoodData from "@/public/data/demo/neighborhoods.json";
import stationsData from "@/public/data/demo/stations.json";
import hexData from "@/public/data/demo/hexgrid.json";
import timeSeries from "@/public/data/demo/year-series.json";
import extentSummary from "@/public/data/demo/extent-summary.json";
import type { DemoFeatureCollection } from "@/types/templates";

export const demoCollections: Record<string, DemoFeatureCollection> = {
  neighborhoods: neighborhoodData as DemoFeatureCollection,
  stations: stationsData as DemoFeatureCollection,
  hexgrid: hexData as DemoFeatureCollection,
};

export const demoTimeSeries = timeSeries;
export const demoExtentSummary = extentSummary;
