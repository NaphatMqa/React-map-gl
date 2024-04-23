"use client";

import React, { useState, useRef } from 'react';
import Papa from "papaparse";
import "mapbox-gl/dist/mapbox-gl.css"
import ReactMapGl from 'react-map-gl';
//import Mark from './Mark';

export default function Home() {
  const [kwtFile, setKwtFile] = useState<File>();
  const [kwtContent, setKwtContent] = useState<string>('');
  const [csvFile, setCsvFile] = useState<File>();
  const [csvContent, setCsvContent] = useState<string>('');
  const [latitude, setLatitude] = useState<string[]>([]);
  const [longitude, setLongitude] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<string[]>([]);

  const TOKEN = process.env.REACT_APP_TOKEN



  const handleKwtChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setKwtFile(file);

      reader.onload = (e) => {
        const content = e.target?.result as string;
        setKwtContent(content);
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
        pinMap(content);
      };
      reader.readAsText(file);
    }
  };

  const pinMap = (csvString: string) => {
    let latitudeIndex = 0;
    let longitudeIndex = 0;
    const lati = [];
    const longti = [];
    let attri: any = [];
    const csvData = Papa.parse<string>(csvString);

    for (let i = 0; i < csvData.data[0].length; i++) {
      if (csvData.data[0][i] == "緯度") {
        latitudeIndex = i;
      }
      if (csvData.data[0][i] == "経度") {
        longitudeIndex = i;
      }
    }
    //csvData.data.length - 1
    for (let i = 0; i < 1; i++) {
      attri[i] = [];
      for (var j = 0; j < csvData.data[0].length; j++) {
        if (csvData.data[0][j] != "緯度" && csvData.data[0][j] != "経度") {
          /*
          if(csvData.data[0][j-1] == "緯度" || csvData.data[0][j-1] == "経度"){
            attri[i][j-1] = csvData.data[i + 1][j];
          } else{
            attri[i][j] = csvData.data[i + 1][j];
          }
*/
          attri[i][j] = csvData.data[i + 1][j];
        }
        else if (csvData.data[0][j] == "緯度") {
          lati.push(csvData.data[i + 1][j]);
        }
        else if (csvData.data[0][j] == "経度") {
          longti.push(csvData.data[i + 1][j]);
        }
      }
    }
    setLatitude(lati);
    setLongitude(longti);
    setAttributes(attri);
  };

  const Mark = () => {
    const [viewport, setViewport] = React.useState({
      latitude: 35.682839,
      longitude: 139.759455,
      zoom: 5,
      width: 600,
      height: 600
    });

    return (
      <div>
        <div className='flex justify-between items-center'>

          <div className='flex'>
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
              <div className="HeaderButton flex items-center justify-center border-2 cursor-pointer ml-5">
                <span>CSV</span>
              </div>
            </label>
          </div>
        </div>
        {kwtFile != undefined ?
          <>
            <div>{`Selected File: ${kwtFile.name} `}</div>
          </>
          : null}


        <div style={{ width: '600px', height: '600px' }}>
          <ReactMapGl
            {...viewport}
            mapboxAccessToken={TOKEN}
          //onViewportChange={setViewport}
          >

          </ReactMapGl>

        </div>

      </div>


    );
  }
}

//  <Mark />











