import React from 'react';
import { GoogleMap, withScriptjs, withGoogleMap } from 'react-google-maps';

const Map = (props) => {
  return (
    <GoogleMap
      defaultZoom={10}
      defaultCenter={{ lat: Number(props.lat), lng: Number(props.lng) }}
    />
  );
};

export default withScriptjs( withGoogleMap (Map) );