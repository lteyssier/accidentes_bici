import { useMemo } from 'react';
import './HeatmapSidebar.css';
import { parse, isValid, format } from 'date-fns';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { Info } from 'lucide-react'
/* cabeceras */
const dias    = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const franjas = ['madrugada','mañana','tarde','noche'];

/* helper: nombre en forma “canónica” */
const canon = s =>
  (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();

/* componente ------------------------------------------------------------- */
export default function HeatmapSidebar({
  selectedAlcaldia,      // feature seleccionado en el mapa
  escala,                 // 'dia' | 'semana' | 'mes'
  setEscala,              // setter para el menú
  predicciones,           // predicciones_accidentes.json
  heatmapPoints           // heatmap_points.json  ←  nuevo prop
}) {
  /* ------ heat‑map (franja × día) -------------------------------------- */
  const { rows, max } = useMemo(() => {
    if (!selectedAlcaldia) return { rows: [], max: 0 };

    const col =
      escala === 'semana'
        ? 'pred_por_semana'
        : escala === 'mes'
        ? 'pred_por_mes'
        : 'pred_por_dia';

    const nombreAlc = canon(selectedAlcaldia.properties.NOMGEO);

    const data = predicciones.filter(
      d => canon(d.alcaldia_catalogo) === nombreAlc
    );

    const matriz = franjas.map(f =>
      dias.map(
        d =>
          data.find(
            x => x.franja_horaria === f && x.dia_semana === d
          )?.[col] ?? 0
      )
    );

    return { rows: matriz, max: Math.max(...matriz.flat(), 0.001) };
  }, [selectedAlcaldia, escala, predicciones]);

  /* ------ serie mensual de accidentes ---------------------------------- */
  const serieMensual = useMemo(() => {
    if (!selectedAlcaldia) return [];

    const nombreAlc = canon(selectedAlcaldia.properties.NOMGEO);
    const bucket = {};

    heatmapPoints.forEach(p => {
      if (canon(p.alcaldia_catalogo) !== nombreAlc) return;

      const fecha = parse(p.fecha_creacion, 'dd/MM/yy', new Date());
      if (!isValid(fecha)) return;

      const clave = format(fecha, 'yyyy-MM');        // YYYY‑MM
      bucket[clave] = (bucket[clave] || 0) + 1;
    });

    return Object.entries(bucket)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([fecha, valor]) => ({ fecha, valor }));
  }, [selectedAlcaldia, heatmapPoints]);

  /* ------------------- render ------------------------------------------ */
  if (!selectedAlcaldia)
    return (
      <div className="heatmap-box">
        <p>Selecciona una alcaldía para ver la información.</p>
      </div>
    );

  return (
    <div className="heatmap-box">
      <h2>
        Predicción de accidentes
        <span
         className="tooltip-btn"
         data-tooltip="Probabilidad estimada de ocurrencia, por franja horaria y día (basado en datos de 2022‑24). Bajo un modelo de Proceso estocástico no homogéneo"
         >
         <Info size={16} color="#38bdf8" />   {/* azul claro, ajusta a tu paleta */}
         </span>
         <br />
        <small>{selectedAlcaldia.properties.NOMGEO}</small>
      </h2>

      {/* selector Día / Semana / Mes */}
      <label htmlFor="escala-select">Probabilidad próximo accidente:</label>
      <select
        id="escala-select"
        value={escala}
        onChange={e => setEscala(e.target.value)}
      >
        <option value="dia">Por día</option>
        <option value="semana">Por semana</option>
        <option value="mes">Por mes</option>
      </select>

      {/* heat‑map */}
      <div className="heatmap-grid">
        <div className="corner" />
        {dias.map((d, j) => (
          <div key={d} className="col-header" style={{ gridColumn: j + 2 }}>
            {d.slice(0, 3)}
          </div>
        ))}
        {franjas.map((f, i) => (
          <div key={f} className="row-header" style={{ gridRow: i + 2 }}>
            {f}
          </div>
        ))}
        {rows.map((row, i) =>
          row.map((v, j) => (
            <div
              key={`${i}-${j}`}
              className="cell"
              style={{
                gridColumn: j + 2,
                gridRow: i + 2,
                background: `rgba(255,70,0,${v / max})`
              }}
            >
              {v > 0 ? v.toFixed(2) : ''}
            </div>
          ))
        )}
      </div>

      {/* serie temporal mensual */}
      <h4 className="mt">Accidentes por mes</h4>
      {serieMensual.length === 0 ? (
        <p>No hay registros para esta alcaldía.</p>
      ) : (
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <LineChart data={serieMensual}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="valor" stroke="#00eaff" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
