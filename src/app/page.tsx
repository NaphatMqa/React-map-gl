"use client"

import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import Papa from "papaparse";
import wellknown from 'wellknown';
import Map, {Layer, Popup, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import ReactMapGL, { Marker } from 'react-map-gl';


const Home = () => {

  const [viewport, setViewport] = React.useState({
    latitude: 30,
    longitude: 140,
    zoom: 5.25,
  });


  const [time, settime] = useState(0);

  const [kwtFile, setKwtFile] = useState<File>();
  const [kwtContent, setKwtContent] = useState<any>(null);
  const [csvFile, setCsvFile] = useState<File>();
  const [csvContent, setCsvContent] = useState<string>('');
  const latitudeIndex = useRef<number>(0);
  const longitudeIndex = useRef<number>(0);
  const idIndex = useRef<number>(0);
  const [markData, setMarkData] = useState<{ id: string, coordinates: any, popupText: any }[]>([]);
  const [isMark, setIsMark] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(true);
  const [popupInfo, setPopupInfo] = useState<{ longitude: number, latitude: number, popupText: any } | null>(null);
  const [polygonData, setPolygonData] = useState
    <{ type: string; features: { type: string; geometry: { type: string; coordinates: number[][][]; }; properties: { fill: string; "fill-outline-color": string; } }[] }>();

  const popupRef = React.useRef<mapboxgl.Popup>();

  useEffect(() => {
    popupRef.current?.trackPointer();
  }, [popupRef.current])

  useEffect(() => {
    if (kwtContent != undefined) {
      console.log(kwtContent);
    }
  }, [kwtContent])

  const handleKwtChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setKwtFile(file);

      reader.onload = (e) => {
        const content = e.target?.result as string;

        const polygons = content.split('\n');
        polygons.forEach((polygonWKT) => {
          const coordinatesData = wellknown.parse(polygonWKT);
          setKwtContent(coordinatesData);

        });

      };
      reader.readAsText(file);
    }
  };

  const handleCsvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setCsvFile(file);

      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCsvContent(content);
        markMap(content);
      };
      reader.readAsText(file);
    }
  };

  const markMap = (csvString: string) => {
    let latiIn = 0;
    let longIn = 0;
    let idIn = 0;
    let start = performance.now();

    const csvData = Papa.parse<string>(csvString);
    const headers: any = csvData.data[0];

    for (let i = 0; i < csvData.data[0].length; i++) {
      if (csvData.data[0][i] == "緯度") {
        latiIn = i;
      }
      if (csvData.data[0][i] == "経度") {
        longIn = i;
      }
      if (csvData.data[0][i] == "id") {
        idIn = i;
      }
    }

    latitudeIndex.current = latiIn;
    longitudeIndex.current = longIn;
    idIndex.current = idIn;

    const popupData = csvData.data.slice(1, csvData.data.length - 1).map((row) => {
      const id = row[idIn];
      const coordinates = [parseFloat(row[latiIn]), parseFloat(row[longIn])];

      const popupText = (
        <div>
          {headers
            .filter((header: string, idx: number) => idx !== longIn && idx !== latiIn && idx !== idIn && row[idx] != '')
            .map((header: any, idx: number) => (
              <div key={idx}>
                <div className='font-bold'>{header} :</div> {row[headers.indexOf(header)]}
              </div>
            ))}
        </div>
      );

      return {
        id: id,
        coordinates: coordinates,
        popupText: popupText
      };
    });
    setMarkData(popupData);
    setIsMark(true);

    let timeTaken: number = parseFloat((performance.now() - start).toFixed(2));
    settime(timeTaken);
  };

  const handleMarkerClick = (marker: { id: string, coordinates: [number, number], popupText: any }) => {
    setPopupInfo({ longitude: marker.coordinates[1], latitude: marker.coordinates[0], popupText: marker.popupText });
    setShowPopup(true)
  };

  //console.log(`time taken: ${time}`);

  const line: any = {
    'id': 'maine',
    'type': 'fill',
    'source': 'maine',
    'layout': {},
    'paint': {
      'fill-color': '#83D9E4',
      'fill-opacity': 0.5
    }
  };

  const layerOutLine: any = {
    'id': 'outline',
    'type': 'line',
    'source': 'maine',
    'layout': {},
    'paint': {
      'line-color': '#0080ff',
      'line-width': 3
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vw' }}>

      <div className='flex border-2 border-black box-content h-10 w-56 p-4 m-2'>
        <label>
          <input
            type="file"
            accept=".wkt"
            hidden
            onChange={handleKwtChange}
          />
          <div className="HeaderButton flex items-center justify-center border-2 cursor-pointer">
            <span>WKT</span>
          </div>
        </label>

        <label>
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={handleCsvChange}
          />
          <div className="HeaderButton flex items-center justify-center border-2 cursor-pointer ml-7">
            <span>CSV</span>
          </div>
        </label>
      </div>

      <ReactMapGL
        {...viewport}
        onMove={(evt: { viewState: React.SetStateAction<{ latitude: number; longitude: number; zoom: number; }>; }) => setViewport(evt.viewState)}
        mapboxAccessToken={"pk.eyJ1IjoibmFwaGF0bXFhIiwiYSI6ImNsdjY4Y3Z5ajBicHkya3Jxa25tdjVxbTYifQ.bBZBuJMN49efxtIGwNbPWw"}
        //mapStyle="mapbox://styles/naphatmqa/clv6avjcq00m401pk6r7d22j0"
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >

        {isMark && markData.map(marker => (
          <Marker key={marker.id} longitude={marker.coordinates[1]} latitude={marker.coordinates[0]} onClick={() => handleMarkerClick(marker)}>
            <button
              className='hover: cursor-pointer'
              onClick={() => handleMarkerClick(marker)}>
              <img src="./location.png" width={25} height={25} />
            </button>
          </Marker>
        ))}

        {popupInfo && showPopup ? (
          <div>
            <Popup
              longitude={popupInfo.longitude}
              latitude={popupInfo.latitude}
              closeOnClick={false}
              onClose={() => setShowPopup(false)}
            >
              <div>{popupInfo.popupText}</div>
            </Popup>
          </div>


        ) : null
        }

        {kwtContent != undefined && (
          <Source
            id="my-data"
            type="geojson"
            data={{
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Polygon",
                    coordinates:kwtContent.coordinates 
                  },
                  properties: {
                    fill: "#FF5733",
                    "fill-outline-color": "#000000",
                  },
                },
              ],
            }}>
            <Layer {...line} />
            <Layer {...layerOutLine} />
          </Source>
        )}

      </ReactMapGL>
    </div >
  );
};

export default Home;



