import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css' // Required for the map to display correctly
import { StarFilledIcon } from '@radix-ui/react-icons'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

// Custom icon (optional)
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1365/1365700.png',
  iconSize: [41, 41],
  iconAnchor: [12, 41],
  popupAnchor: [-10, -34],
  shadowSize: [41, 41],
})

const Map = ({
  markers,
  center,
  enablePopups = false,
  userPosition,
}: {
  markers: {
    id: string
    lat: number
    lng: number
    gymName: string
    averageRating?: number
  }[]
  center: [number, number]
  enablePopups?: boolean
  userPosition?: { lat: number; lon: number }
}) => {
  const navigate = useNavigate()

  return (
    <div className="flex h-96 w-full border rounded p-2 relative mt-2 z-0">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={customIcon}
          >
            {enablePopups && (
              <Popup className="">
                <div className="flex gap-2 items-center">
                  <div>{marker.gymName}</div>
                  <div className="flex gap-1 items-center">
                    <StarFilledIcon />
                    {(marker.averageRating ?? 5.0).toFixed(1)}
                  </div>
                </div>
                <Button
                  size={'sm'}
                  className="w-full mt-2"
                  onClick={() => navigate(`/gyms/${marker.id}`)}
                >
                  Show details
                </Button>
              </Popup>
            )}
          </Marker>
        ))}
        {userPosition && (
          <Marker
            position={[userPosition.lat, userPosition.lon]}
            icon={userIcon}
          >
            <Popup className="">
              <div className="flex gap-2 items-center">
                <div>Your location</div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}

export default Map
