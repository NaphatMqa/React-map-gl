import React from 'react';
import ReactMapGL from 'react-map-gl';

const Mark = () => {
  const [viewport, setViewport] = React.useState({
    latitude: 35.682839,
    longitude: 139.759455,
    zoom: 5,
    width: 600,
    height: 600
  });

  return (
    <div style={{ width: '600px', height: '600px' }}>
      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={process.env.REACT_APP_TOKEN}
        //onViewportChange={setViewport}
      />
    </div>
  );
};

export default Mark;
