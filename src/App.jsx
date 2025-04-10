import allbcs from '../public/allbcs.json';
import { useCallback, useState, useEffect } from 'react';
import { FlyToInterpolator } from '@deck.gl/core';
import Race from './components/Race';
import proj4 from 'proj4';

proj4.defs("EPSG:32614", "+proj=utm +zone=14 +datum=WGS84 +units=m +no_defs");
const fromUTM = coord => proj4("EPSG:32614", "WGS84", coord);

export default function App() {
  const [features] = useState(allbcs.features);
  const tiposIC = ['Todos', ...new Set(features.map(f => f.properties.TIPO_IC))];
  const [selectedTipo, setSelectedTipo] = useState('Todos');

  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heatmapPoints, setHeatmapPoints] = useState([]);

  // ✅ Carga del archivo CSV desde /public
  useEffect(() => {
    fetch('/ciclista_accidente.csv')
      .then(res => res.text())
      .then(text => {
        const rows = text.split('\n').slice(1); // omite encabezado
        const parsed = rows.map(row => {
          const cols = row.split(',');
          const lon = parseFloat(cols[cols.length - 2]);
          const lat = parseFloat(cols[cols.length - 1]);
          return { position: [lon, lat] };
        }).filter(d => isFinite(d.position[0]) && isFinite(d.position[1]));
        setHeatmapPoints(parsed);
      });
  }, []);

  const filteredFeatures = selectedTipo === 'Todos'
    ? features
    : features.filter(f => f.properties.TIPO_IC === selectedTipo);

  const geometries = filteredFeatures.map(f => {
    const original = f.geometry[1];
    const validPath = original.path.filter(([x, y]) => isFinite(x) && isFinite(y));
    return { ...original, path: validPath.map(fromUTM) };
  });

  const [initialViewState, setInitialViewState] = useState({
    latitude: 19.4326,
    longitude: -99.1332,
    zoom: 11,
    maxZoom: 18,
    pitch: 45,
    bearing: 0
  });

  const handleSelection = useCallback((event) => {
    const tipo = event.target.value;
    setSelectedTipo(tipo);
    if (tipo === 'Todos') {
      setInitialViewState({
        latitude: 19.4326,
        longitude: -99.1332,
        zoom: 11,
        maxZoom: 18,
        pitch: 45,
        bearing: 0,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator()
      });
    } else {
      const coincidencias = features.filter(f => f.properties.TIPO_IC === tipo);
      if (coincidencias.length > 0) {
        setInitialViewState({
          ...coincidencias[0].initialView,
          transitionDuration: 3000,
          transitionInterpolator: new FlyToInterpolator()
        });
      }
    }
  }, [features]);

  return (
    <div className='container'>
      <div className='raceblock1'>
        <Race
          data={geometries}
          initialViewState={initialViewState}
          showHeatmap={showHeatmap}
          heatmapPoints={heatmapPoints}
        />
      </div>
      <div className='raceblock2'>
        <div className='selectorT'>
          <select onChange={handleSelection} value={selectedTipo}>
            {tiposIC.map((tipo, index) => (
              <option key={index} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>
        <button onClick={() => setShowHeatmap(!showHeatmap)}>
          {showHeatmap ? 'Ocultar Heatmap' : 'Mostrar Heatmap'}
        </button>
        <div className='container'>
          <div className='raceInfo'>
            <div className='title'>
              {selectedTipo === 'Todos' ? 'Todas las ciclovías' : `Tipo: ${selectedTipo}`}
            </div>
            <div className='titles'>Tramos mostrados: {filteredFeatures.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
