import {useState, useEffect} from 'react';
import {Map} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import {PolygonLayer} from '@deck.gl/layers';
import {TripsLayer} from '@deck.gl/geo-layers';
import viewState from '../../public/points.json'

// const INITIAL_VIEW_STATE = {
//     latitude: 19.397044,
//     longitude: -99.096850,
//     zoom: 14,
//     maxZoom: 16,
//     pitch: 45,
//     bearing: 0
//   };

// const INITIAL_VIEW_STATE = {
//     latitude: -37.853926,
//     longitude: 144.96213,
//     zoom: 14,
//     maxZoom: 16,
//     pitch: 45,
//     bearing: 0
//   };

const {latitude, longitude, zoom, maxZoom, pitch, bearing} = viewState.Melbourne

const INITIAL_VIEW_STATE = {
    latitude,
    longitude,
    zoom,
    maxZoom,
    pitch,
    bearing
  }


  
  const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';
  
  const ambientLight = new AmbientLight({
    color: [255, 255, 255],
    intensity: 1.0
  });
  
  const pointLight = new PointLight({
    color: [255, 255, 255],
    intensity: 2.0,
    position: [-74.05, 40.7, 8000]
  });
  
  const lightingEffect = new LightingEffect({ambientLight, pointLight});
  
  const material = {
    ambient: 0.1,
    diffuse: 0.6,
    shininess: 32,
    specularColor: [60, 64, 70]
  };
  
  const DEFAULT_THEME = {
    buildingColor: [74, 80, 87],
    trailColor0: [232, 209, 91],
    trailColor1: [235, 24, 0],
    material,
    effects: [lightingEffect]
  };
  
  const landCover = [
    [
      [-123.0, 49.196],
      [-123.0, 49.324],
      [-123.306, 49.324],
      [-123.306, 49.196]
    ]
  ];
const Race = (props) => {
    const trips = props.data
    const trailLength = 3000
    const initialViewState = INITIAL_VIEW_STATE
    const mapStyle = MAP_STYLE
    const theme = DEFAULT_THEME
    const loopLength = 2550
    const animationSpeed = 1
  
    const [time, setTime] = useState(0);
    const [animation] = useState({});
   
     const animate = () => {
       setTime(t => (t + animationSpeed) % loopLength);
       animation.id = window.requestAnimationFrame(animate);
     };
  
    useEffect(() => {
      animation.id = window.requestAnimationFrame(animate);
      return () => window.cancelAnimationFrame(animation.id);
    }, [animation]);
  
    const layers = [
      new PolygonLayer({
        id: 'ground',
        data: landCover,
        getPolygon: f => f,
        stroked: true,
        getFillColor: [0, 0, 0, 0]
      }),
      new TripsLayer({
        id: 'trips',
        data: trips,
        getPath: d => d.path,
        getTimestamps: d => d.timestamps,
        getColor: d => (d.vendor === 0 ? theme.trailColor0 : theme.trailColor1),
        opacity: 0.8,
        widthMinPixels: 6,
        rounded: true,
        trailLength,
        currentTime: time,
        shadowEnabled: false
      })
    ];


  return (
    <DeckGL
    layers={layers}
    effects={theme.effects}
    initialViewState={initialViewState}
    controller={true}
  >
    <Map reuseMaps mapLib={maplibregl} mapStyle={mapStyle} preventStyleDiffing={true} />
  </DeckGL>
  )
}

export default Race