import { Row } from '#types/index'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { LocationMarker } from './location_marker'

const MAP_TILES_URL = 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}'
const SUBDOMAINS = ['mt0', 'mt1', 'mt2', 'mt3']
const GEOLOC_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 5000,
}

interface MapProps {
  data: Row[]
  centralPoint: {
    latitude: number
    longitude: number
  }
}
export function Map({ data, centralPoint }: MapProps) {
  const [coordinates, setCoords] = useState<GeolocationCoordinates | null>(null)
  useEffect(() => {
    navigator.geolocation.watchPosition(
      ({ coords }) => setCoords(coords),
      (error) => console.error(error),
      GEOLOC_OPTIONS
    )
  }, [])

  console.log(coordinates)
  return (
    <MapContainer
      zoom={13}
      center={[centralPoint.latitude, centralPoint.longitude]}
      style={{ minHeight: '100%', width: '100%', flex: 1, borderRadius: '5px' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={MAP_TILES_URL}
        subdomains={SUBDOMAINS}
      />
      {data.map((row) => (
        <Marker key={row.listing_url} position={[Number(row.latitude), Number(row.longitude)]}>
          <Popup>{parseFloat(row.price.toString()).toFixed(0)}€</Popup>
        </Marker>
      ))}
      {coordinates && <LocationMarker coordinates={coordinates} />}
    </MapContainer>
  )
}
