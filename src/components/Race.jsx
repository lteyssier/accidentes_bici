import { useMemo, useState, useEffect } from 'react';
import { Map } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { TripsLayer } from '@deck.gl/geo-layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import {
  AmbientLight,
  PointLight,
  LightingEffect
} from '@deck.gl/core';

const MAP_STYLE =
  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

/* Efectos de iluminación */
const effects = [
  new LightingEffect({
    ambientLight: new AmbientLight({ intensity: 1 }),
    pointLight1: new PointLight({
      position: [-99.13, 19.43, 8000],
      intensity: 2
    })
  })
];

export default function Race({
  tripsData,
  viewState,
  onViewStateChange,
  showHeatmap,
  heatmapPoints,
  onAlcaldiaClick,
  selectedAlcaldia,
  cdmxBoundary
}) {
  /* Animación para TripsLayer */
  const loopLength = 2550;
  const animationSpeed = 1;
  const [time, setTime] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(function animate() {
      setTime(t => (t + animationSpeed) % loopLength);
      requestAnimationFrame(animate);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  /* Capas estáticas */
  const staticLayers = useMemo(() => {
    return [
      new GeoJsonLayer({
        id: 'cdmx',
        data: cdmxBoundary,
        stroked: true,
        filled: false,
        getLineColor: [255, 255, 255],
        getLineWidth: 2,
        pickable: true,
        onClick: info =>
          info.object &&
          onAlcaldiaClick(info.object, info.coordinate) 
      }),
      selectedAlcaldia &&
        new GeoJsonLayer({
          id: 'highlight',
          data: selectedAlcaldia,
          stroked: true,
          filled: false,
          getLineColor: [255, 255, 255],
          lineWidthMinPixels: 4
        }),
      showHeatmap &&
        new HeatmapLayer({
          id: 'heat',
          data: heatmapPoints,
          getPosition: d => d.position,
          radiusPixels: 15,
          threshold: 0.07
        })
    ].filter(Boolean);
  }, [
    cdmxBoundary,
    selectedAlcaldia,
    showHeatmap,
    heatmapPoints,
    onAlcaldiaClick,
    viewState.zoom
  ]);

  /* Capa animada */
  const tripsLayer = useMemo(
    () =>
      new TripsLayer({
        id: 'trips',
        data: tripsData,
        getPath: d => d.path,
        getTimestamps: d => d.timestamps,
        getColor: [0, 255, 255],
        widthMinPixels: 2,
        rounded: true,
        trailLength: 3000,
        currentTime: time
      }),
    [tripsData, time]
  );

  return (
    <DeckGL
      layers={[...staticLayers, tripsLayer]}
      effects={effects}
      viewState={viewState}
      onViewStateChange={({ viewState: vs }) => onViewStateChange(vs)}
      controller
    >
      <Map
        reuseMaps
        mapLib={maplibregl}
        mapStyle={MAP_STYLE}
      />
    </DeckGL>
  );
}
