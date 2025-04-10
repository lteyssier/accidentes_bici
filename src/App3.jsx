/* eslint-disable no-unused-vars */
import tracks from '../public/tracks.json'
import maplibregl from 'maplibre-gl';
import { useCallback, useEffect, useState } from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl';
import {PolygonLayer} from '@deck.gl/layers';
import {TripsLayer} from '@deck.gl/geo-layers';
import {AmbientLight, PointLight, LightingEffect, FlyToInterpolator} from '@deck.gl/core';


let dataf1 = tracks.Bahrain.geometry
let infoTrack = tracks.Bahrain.properties
let infoResults = tracks.Bahrain.ResultsList.Result
let infoQualyfying = tracks.Bahrain.QualifyingList.QualifyingResult
let initial_view = tracks.Bahrain.initialView

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


export default function App() {
  const trailLength = 3000
  const mapStyle = MAP_STYLE
  const theme = DEFAULT_THEME
  const loopLength = 2550
  const animationSpeed = 1
  const [time, setTime] = useState(0);
  const [animation] = useState({});
  const [initialViewState, setInitialViewState] = useState(initial_view)
  const [dataTrack, setDataTrack] = useState(dataf1)
  const [infoRace, setInfoRace] = useState(infoTrack)
  const [infoResult, setInfoResult] = useState(infoResults)
  const [infoQualy, setInfoQualy] = useState(infoQualyfying)

   const animate = () => {
     setTime(t => (t + animationSpeed) % loopLength);
     animation.id = window.requestAnimationFrame(animate);
   };

   const goToMex = useCallback((event) =>{
      switch(event.target.value){
      case "Australia":
        setInitialViewState({
          ...tracks.Australia.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Australia.geometry)
        setInfoRace(tracks.Australia.properties)
        setInfoResult(tracks.Australia.ResultsList.Result)
        setInfoQualy(tracks.Australia.QualifyingList.QualifyingResult)

        break
      case "Bahrain":
        setInitialViewState({
          ...tracks.Bahrain.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Bahrain.geometry)
        setInfoRace(tracks.Bahrain.properties)
        setInfoResult(tracks.Bahrain.ResultsList.Result)
        setInfoQualy(tracks.Bahrain.QualifyingList.QualifyingResult)
        break
      case "Shanghai":
        setInitialViewState({
          ...tracks.Shanghai.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Shanghai.geometry)
        setInfoRace(tracks.Shanghai.properties)
        break
      case "Azerbaijan":
        setInitialViewState({
          ...tracks.Azerbaijan.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Azerbaijan.geometry)
        setInfoRace(tracks.Azerbaijan.properties)
        setInfoResult(tracks.Azerbaijan.ResultsList.Result)
        setInfoQualy(tracks.Azerbaijan.QualifyingList.QualifyingResult)

        break
      case "Spain":
        setInitialViewState({
          ...tracks.Spain.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Spain.geometry)
        setInfoRace(tracks.Spain.properties)
        setInfoResult(tracks.Spain.ResultsList.Result)
        setInfoQualy(tracks.Spain.QualifyingList.QualifyingResult)

        break
      case "Monaco":
        setInitialViewState({
          ...tracks.Monaco.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Monaco.geometry)
        setInfoRace(tracks.Monaco.properties)
        setInfoResult(tracks.Monaco.ResultsList.Result)
        setInfoQualy(tracks.Monaco.QualifyingList.QualifyingResult)

        break
      case "Canada":
        setInitialViewState({
          ...tracks.Canada.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Canada.geometry)
        setInfoRace(tracks.Canada.properties)
        setInfoResult(tracks.Canada.ResultsList.Result)
        setInfoQualy(tracks.Canada.QualifyingList.QualifyingResult)

        break
      case "Castellet":
        setInitialViewState({
          ...tracks.Castellet.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Castellet.geometry)
        setInfoRace(tracks.Castellet.properties)
        break
      case "Austria":
        setInitialViewState({
          ...tracks.Austria.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Austria.geometry)
        setInfoRace(tracks.Austria.properties)
        setInfoResult(tracks.Austria.ResultsList.Result)
        setInfoQualy(tracks.Austria.QualifyingList.QualifyingResult)
        break
      case "Uk":
        setInitialViewState({
          ...tracks.Uk.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Uk.geometry)
        setInfoRace(tracks.Uk.properties)
        setInfoResult(tracks.Uk.ResultsList.Result)
        setInfoQualy(tracks.Uk.QualifyingList.QualifyingResult)
        break
      case "Hockenheim":
        setInitialViewState({
          ...tracks.Hockenheim.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Hockenheim.geometry)
        setInfoRace(tracks.Hockenheim.properties)
        break
      case "Hungary":
        setInitialViewState({
          ...tracks.Hungary.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Hungary.geometry)
        setInfoRace(tracks.Hungary.properties)
        setInfoResult(tracks.Hungary.ResultsList.Result)
        setInfoQualy(tracks.Hungary.QualifyingList.QualifyingResult)
        break
      case "Belgium":
        setInitialViewState({
          ...tracks.Belgium.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Belgium.geometry)
        setInfoRace(tracks.Belgium.properties)
        setInfoResult(tracks.Belgium.ResultsList.Result)
        setInfoQualy(tracks.Belgium.QualifyingList.QualifyingResult)
        break
      case "Italy":
        setInitialViewState({
          ...tracks.Italy.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Italy.geometry)
        setInfoRace(tracks.Italy.properties)
        setInfoResult(tracks.Italy.ResultsList.Result)
        setInfoQualy(tracks.Italy.QualifyingList.QualifyingResult)

        break
      case "Singapore":
        setInitialViewState({
          ...tracks.Singapore.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Singapore.geometry)
        setInfoRace(tracks.Singapore.properties)
        setInfoResult(tracks.Singapore.ResultsList.Result)
        setInfoQualy(tracks.Singapore.QualifyingList.QualifyingResult)

        break
      case "Sochi":
        setInitialViewState({
          ...tracks.Sochi.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Sochi.geometry)
        setInfoRace(tracks.Sochi.properties)
        break
      case "Japan":
        setInitialViewState({
          ...tracks.Japan.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Japan.geometry)
        setInfoRace(tracks.Japan.properties)
        setInfoResult(tracks.Japan.ResultsList.Result)
        setInfoQualy(tracks.Japan.QualifyingList.QualifyingResult)

        break
      case "USA_Austin":
        setInitialViewState({
          ...tracks.USA_Austin.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.USA_Austin.geometry)
        setInfoRace(tracks.USA_Austin.properties)
        setInfoResult(tracks.USA_Austin.ResultsList.Result)
        setInfoQualy(tracks.USA_Austin.QualifyingList.QualifyingResult)
        break
      case "Mexico_City":
        setInitialViewState({
          ...tracks.Mexico_City.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Mexico_City.geometry)
        setInfoRace(tracks.Mexico_City.properties)
        setInfoResult(tracks.Mexico_City.ResultsList.Result)
        setInfoQualy(tracks.Mexico_City.QualifyingList.QualifyingResult)
        break
      case "Brazil":
        setInitialViewState({
          ...tracks.Brazil.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Brazil.geometry)
        setInfoRace(tracks.Brazil.properties)
        setInfoResult(tracks.Brazil.ResultsList.Result)
        setInfoQualy(tracks.Brazil.QualifyingList.QualifyingResult)
        break
      case "Abu_Dhabi":
        setInitialViewState({
          ...tracks.Abu_Dhabi.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Abu_Dhabi.geometry)
        setInfoRace(tracks.Abu_Dhabi.properties)
        setInfoResult(tracks.Abu_Dhabi.ResultsList.Result)
        setInfoQualy(tracks.Abu_Dhabi.QualifyingList.QualifyingResult)

        break
      case "Imola":
        setInitialViewState({
          ...tracks.Imola.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Imola.geometry)
        setInfoRace(tracks.Imola.properties)
        break
      case "Nurburg":
        setInitialViewState({
          ...tracks.Nurburg.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Nurburg.geometry)
        setInfoRace(tracks.Nurburg.properties)
        break
      case "Portimao":
        setInitialViewState({
          ...tracks.Portimao.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Portimao.geometry)
        setInfoRace(tracks.Portimao.properties)
        break
      case "Scarpeira":
        setInitialViewState({
          ...tracks.Scarpeira.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Scarpeira.geometry)
        setInfoRace(tracks.Scarpeira.properties)
        break
      case "Sepang":
        setInitialViewState({
          ...tracks.Sepang.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Sepang.geometry)
        setInfoRace(tracks.Sepang.properties)
        break
      case "Istanbul":
        setInitialViewState({
          ...tracks.Istanbul.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Istanbul.geometry)
        setInfoRace(tracks.Istanbul.properties)
        break
      case "Netherlands":
        setInitialViewState({
          ...tracks.Netherlands.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Netherlands.geometry)
        setInfoRace(tracks.Netherlands.properties)
        setInfoResult(tracks.Netherlands.ResultsList.Result)
        setInfoQualy(tracks.Netherlands.QualifyingList.QualifyingResult)
        break
      case "MagnyCours":
        setInitialViewState({
          ...tracks.MagnyCours.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.MagnyCours.geometry)
        setInfoRace(tracks.MagnyCours.properties)
        break
      case "Estoril":
        setInitialViewState({
          ...tracks.Estoril.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Estoril.geometry)
        setInfoRace(tracks.Estoril.properties)
        break
      case "Jacarepagua":
        setInitialViewState({
          ...tracks.Jacarepagua.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Jacarepagua.geometry)
        setInfoRace(tracks.Jacarepagua.properties)
        break
      case "Saudi_Arabia":
        setInitialViewState({
          ...tracks.Saudi_Arabia.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Saudi_Arabia.geometry)
        setInfoRace(tracks.Saudi_Arabia.properties)
        setInfoResult(tracks.Saudi_Arabia.ResultsList.Result)
        setInfoQualy(tracks.Saudi_Arabia.QualifyingList.QualifyingResult)
        break
      case "USA_Miami":
        setInitialViewState({
          ...tracks.USA_Miami.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.USA_Miami.geometry)
        setInfoRace(tracks.USA_Miami.properties)
        setInfoResult(tracks.USA_Miami.ResultsList.Result)
        setInfoQualy(tracks.USA_Miami.QualifyingList.QualifyingResult)
        break
      case "Qatar":
        setInitialViewState({
          ...tracks.Qatar.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.Qatar.geometry)
        setInfoRace(tracks.Qatar.properties)
        setInfoResult(tracks.Qatar.ResultsList.Result)
        setInfoQualy(tracks.Qatar.QualifyingList.QualifyingResult)
        break
      case "USA_Las_Vegas":
        setInitialViewState({
          ...tracks.USA_Las_Vegas.initialView,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator()
        })
        setDataTrack(tracks.USA_Las_Vegas.geometry)
        setInfoRace(tracks.USA_Las_Vegas.properties)
        setInfoResult(tracks.USA_Las_Vegas.ResultsList.Result)
        setInfoQualy(tracks.USA_Las_Vegas.QualifyingList.QualifyingResult)
        break
   }},[])



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
      data: dataTrack,
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
    <div className='container'>
        <div className='raceblock1'>
        <DeckGL
           layers={layers}
           effects={theme.effects}
           initialViewState={initialViewState}
           controller={true}
         > 
           <Map reuseMaps mapLib={maplibregl} mapStyle={mapStyle} preventStyleDiffing={true} />
         </DeckGL>
        </div>
        <div className='raceblock2'>
        <div className='selectorT'>
        <select onChange={goToMex}>  
               {Object.keys(tracks).map((option,index)=>{
                   return (
                    <option key={index}>
                        {option}
                    </option>
                );
               })}
        </select>
        </div>
        <div className='container'>
            <div className='raceInfo'>
              <div className='title'>
              {infoRace?.Name}
              </div>
              <div className='titles'>
                Location: {infoRace?.Location}
              </div>
              <div className='titles'>
                Laps: {infoResult?.Laps}
              </div> 
              <div className='titles'>
                Time: {infoResult?.Time}
              </div>
            </div>

            <div className='raceResults'> 
             
               <div className='infoResult'>
                  <div><h2 className='titleI'>Qualy</h2></div>
                  <div><span>Pole:</span>  {infoQualy?.Driver.GivenName} {infoQualy?.Driver.FamilyName}</div>
                  <div><span>Team:</span>  {infoQualy?.Constructor.Name}</div>
                  <div><span>Q1:</span>  {infoQualy?.Q1}</div>
                  <div><span>Q2:</span>  {infoQualy?.Q2}</div>
                  <div><span>Q3:</span>  {infoQualy?.Q3}</div>
               </div>
               <div className='infoQualy'>
                  <div><h2 className='titleI'>Race</h2></div>
                  <div><span>Winner:</span> {infoResult?.Driver.GivenName} {infoResult?.Driver.FamilyName}</div>
                  <div><span>Team:</span>  {infoResult?.Constructor.Name}</div>
                  <div><span>Fastest Lap:</span>  {infoResult?.FastestLap.Time}</div>
                  <div><span>Average Speed:</span>  {infoResult?.FastestLap.AverageSpeed} </div>
               </div>
            </div>
        </div>
        </div>
    </div>
  );
}