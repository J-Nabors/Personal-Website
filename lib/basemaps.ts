import type { BasemapKey } from "@/types/templates";
import type { StyleSpecification } from "maplibre-gl";

export type BasemapDefinition = {
  key: BasemapKey;
  label: string;
  style: string | StyleSpecification;
};

export const BASEMAPS: Record<BasemapKey, BasemapDefinition> = {
  osm: {
    key: "osm",
    label: "OpenStreetMap",
    style: "https://demotiles.maplibre.org/style.json",
  },
  positron: {
    key: "positron",
    label: "Carto Positron",
    style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  },
  satellite: {
    key: "satellite",
    label: "Satellite",
    style: {
      version: 8,
      sources: {
        satellite: {
          type: "raster",
          tiles: [
            "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution: "Esri World Imagery",
        },
      },
      layers: [
        {
          id: "satellite",
          type: "raster",
          source: "satellite",
        },
      ],
    },
  },
};

export const TRANSIT_PLACEHOLDER_LAYER_ID = "transit-placeholder";
