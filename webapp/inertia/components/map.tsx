import { Row } from '#types/index'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

const MAP_TILES_URL = 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}'
const SUBDOMAINS = ['mt0', 'mt1', 'mt2', 'mt3']

interface MapProps {
  data: Row[]
  centralPoint: {
    latitude: number
    longitude: number
  }
}
export function Map({ data, centralPoint }: MapProps) {
  return (
    <MapContainer
      zoom={13}
      center={[centralPoint.latitude, centralPoint.longitude]}
      scrollWheelZoom={false}
      style={{ minHeight: '100%', width: '100%', flex: 1 }}
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
    </MapContainer>
  )
}
