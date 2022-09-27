import React from 'react';
import AdditionalInfoWindow from './AdditionalInfoWindow'
import { compose, withProps, withHandlers, withState } from "recompose"
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps"

const mapItem = {
  data: [
    {id: '1', lat: -34.397, long:151.644},
    {id: '2', lat: -35.397, long:152.644},
    {id: '3', lat: -36.397, long:153.644},
    {id: '4', lat: -37.397, long:154.644},
    {id: '5', lat: -38.397, long:155.644}
  ]
}

export const DealerMap = compose(
  withProps({
          googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyCTbgcCPZ1bPDinDK5NCbPcjSbsDeUB5Y4",
          loadingElement: <div style={{ height: `100%` }} />,
          containerElement: <div className="map-container" style={{ height: `400px` }} />,
          mapElement: <div className="map" style={{ height: `100%` }} />,
      }),
      withScriptjs,
    withGoogleMap,
    withState('places', 'updatePlaces', ''),
    withState('selectedPlace', 'updateSelectedPlace', null),
    withHandlers(() => {
        const refs = {
            map: undefined,
        }
        return {
            onMapMounted: () => ref => {
                refs.map = ref
            },
            onToggleOpen: ({ updateSelectedPlace }) => key => {
                updateSelectedPlace(key);
            }
        }
    }),
)((props) => {
  return (
    <GoogleMap
      defaultZoom={10}
      defaultCenter={{ lat: 43.7944771, lng: -79.4363804 }}
    >
      {props.mapdata ? props.mapdata.map((data,i)=>
        <Marker key={i}
          position={{ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) }}
          onClick={() => props.onToggleOpen(i)}
          value={i}>
          {props.selectedPlace === i &&
            <InfoWindow onCloseClick={props.onToggleOpen}>
              <AdditionalInfoWindow dealer={data} />
          </InfoWindow>}
        </Marker>
      ): ''}
  </GoogleMap>
)
});
