import { LatLngExpression } from 'leaflet'
import { Circle, Popup, useMapEvents } from 'react-leaflet'
import { Fragment } from 'react/jsx-runtime'

interface LocationMarkerProps {
  coordinates: GeolocationCoordinates
}

export function LocationMarker({ coordinates }: LocationMarkerProps) {
  const { accuracy, latitude, longitude } = coordinates
  console.log('props', coordinates)
  const map = useMapEvents({
    click: () => map.locate(),
    locationfound: (e) => map.flyTo(e.latlng, map.getZoom()),
    locationerror: (error) => console.warn(error),
  })

  console.log('LocationMarker', latitude, longitude, accuracy)
  if (!latitude || !longitude) {
    return <Fragment />
  }

  const position: LatLngExpression = [latitude, longitude]
  return (
    <Circle center={position} pathOptions={{ color: 'lightblue' }} radius={accuracy}>
      {accuracy && <Popup>Précision d'environ {accuracy} mètre(s).</Popup>}
      <Circle center={position} pathOptions={{ color: 'red', stroke: true }} radius={5} />
    </Circle>
  )
}
