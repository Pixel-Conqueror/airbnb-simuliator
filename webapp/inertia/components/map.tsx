import { Row } from '#types/index'
import { LatLngExpression } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
const MAP_TILES_URL = 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}'
const SUBDOMAINS = ['mt0', 'mt1', 'mt2', 'mt3']

const positions = [50, 50] as LatLngExpression

interface MapProps {
  data: Row[]
}
export function Map({ data }: MapProps) {
  return (
    <MapContainer
      zoom={13}
      center={positions}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={MAP_TILES_URL}
        subdomains={SUBDOMAINS}
      />
      {data.slice(0, 1_000).map((row) => (
        <Marker key={row.listing_url} position={[Number(row.latitude), Number(row.longitude)]}>
          <Popup>{parseFloat(row.price.toString()).toFixed(0)}€</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
