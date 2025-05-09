import { useState, useMemo, useCallback,useEffect } from 'react';
import { FlyToInterpolator } from '@deck.gl/core';
import proj4 from 'proj4';
import { centerOfMass } from '@turf/turf';
/* Componentes propios */
import Race from './components/Race';
import HeatmapSidebar from './components/HeatmapSidebar';
import cdmxBoundary from '../public/cdmx_boundary.json'
/* Datos estáticos (coloca las rutas según tu estructura) */
import allbcs from '../public/allbcs.json';

import predicciones from './assets/predicciones_accidentes.json';

/* — Configuración de conversión UTM ↔ WGS84 — */
proj4.defs(
  'EPSG:32614',
  '+proj=utm +zone=14 +datum=WGS84 +units=m +no_defs'
);
const fromUTM = coord => proj4('EPSG:32614', 'WGS84', coord);

/* — Componente principal — */
export default function App() {
  /* Vista controlada por React */
  const [viewState, setViewState] = useState({
    latitude: 19.4326,
    longitude: -99.1332,
    zoom: 11,
    maxZoom: 18,
    pitch: 45,
    bearing: 0
  });

  /* Estados de UI */
  const [selectedTipo, setSelectedTipo] = useState('Todos');
  const [selectedAlcaldia, setSelectedAlcaldia] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [escala, setEscala] = useState('dia'); // dia | semana | mes
  // justo junto a tus demás useState:
  const [heatmapPointsRaw, setHeatmapPointsRaw] = useState(null); 

  useEffect(() => {
    // sólo descargamos el archivo una vez
    if (!heatmapPointsRaw) {
      fetch('/heatmap_points.json')
        .then(res => res.json())
        .then(data => setHeatmapPointsRaw(data))
        .catch(err => console.error('Error cargando heatmap:', err));
    }
  }, [heatmapPointsRaw]);
  
  /* Listas únicas */
  const tiposIC = useMemo(
    () => ['Todos', ...new Set(allbcs.features.map(f => f.properties.TIPO_IC))],
    []
  );
  const alcaldias = useMemo(
    () => [...new Set(cdmxBoundary.features.map(f => f.properties.NOMGEO))],
    []
  );

  /* Heatmap del mapa */
  const heatmapPoints = useMemo(() => {
    if (!heatmapPointsRaw) return [];           // todavía no llegó
    return heatmapPointsRaw.map(d => ({
      ...d,
      position: [d.longitud, d.latitud]
    }));
  }, [heatmapPointsRaw]);
  

  /* Convertir ciclovías a TripsLayer */
  const tripsData = useMemo(() => {
    const raws =
      selectedTipo === 'Todos'
        ? allbcs.features
        : allbcs.features.filter(f => f.properties.TIPO_IC === selectedTipo);

    return raws.map(f => {
      const pathUTM =
        f.geometry?.[1]?.path?.filter(
          ([x, y]) => Number.isFinite(x) && Number.isFinite(y)
        ) ?? [];
      const pathLonLat = pathUTM.map(fromUTM);
      return {
        path: pathLonLat,
        timestamps: pathLonLat.map((_, i) => i * 10)
      };
    });
  }, [selectedTipo]);

  /* Funciones auxiliares */
  const backupCenter = feature => {
    try {
      return centerOfMass(feature).geometry.coordinates;
    } catch {
      return [-99.1332, 19.4326];
    }
  };

  const flyTo = ([lon, lat]) =>
    setViewState(v => ({
      ...v,
      longitude: lon,
      latitude: lat,
      zoom: 12,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator()
    }));

  /* Handlers */
  const handleTipoChange = e => {
    setSelectedTipo(e.target.value);
    setSelectedAlcaldia(null);
    flyTo([-99.1332, 19.4326]);
  };

  const handleAlcaldiaSelect = nombre => {
    if (!nombre) {
      setSelectedAlcaldia(null);
      flyTo([-99.1332, 19.4326]);
      return;
    }
    const feature = cdmxBoundary.features.find(
      f => f.properties.NOMGEO === nombre
    );
    if (feature) handleAlcaldiaClick(feature);
  };

  const handleAlcaldiaClick = (feature, coordinate) => {
    const center = coordinate ?? backupCenter(feature);
    console.log('Click en mapa =>', feature.properties.NOMGEO);
    setSelectedAlcaldia(feature);
    flyTo(center);
  };

  /* Render */
  return (
    <div className="dashboard">
      {/* ———————————————————SIDEBAR——————————————————— */}
      <aside className="sidebar">
        <h2>Accidentes en bicicleta</h2>

        <label htmlFor="tipo-select">Tipo de infraestructura:</label>
        <select
          id="tipo-select"
          value={selectedTipo}
          onChange={handleTipoChange}
        >
          {tiposIC.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <label htmlFor="alcaldia-select">Seleccionar alcaldía:</label>
        <select
          id="alcaldia-select"
          value={selectedAlcaldia?.properties?.NOMGEO ?? ''}
          onChange={e => handleAlcaldiaSelect(e.target.value)}
        >
          <option value="">-- Todas --</option>
          {alcaldias.map(n => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <button onClick={() => setShowHeatmap(h => !h)}>
          {showHeatmap ? 'Ocultar Heatmap' : 'Mostrar Heatmap'}
        </button>

        {/* Heatmap de predicciones en el sidebar */}
        <HeatmapSidebar
          selectedAlcaldia={selectedAlcaldia}
          escala={escala}
          setEscala={setEscala}
          predicciones={predicciones}
          heatmapPoints={heatmapPoints}
        />
         <div>
        <h3>
        Datos obtenidos del Portal de datos de la CDMX, Incidentes viales reportados por C5
        </h3>
      </div>
      </aside>

      {/* ———————————————————MAPA——————————————————— */}
      <main className="main-view">
        <Race
          tripsData={tripsData}
          viewState={viewState}
          onViewStateChange={setViewState}
          showHeatmap={showHeatmap}
          heatmapPoints={heatmapPoints}
          onAlcaldiaClick={handleAlcaldiaClick}
          selectedAlcaldia={selectedAlcaldia}
          cdmxBoundary={cdmxBoundary}
        />
      </main>

     
    </div>
  );
}
