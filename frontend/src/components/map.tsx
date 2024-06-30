import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css' // Required for the map to display correctly

// Custom icon (optional)
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const Map = ({ lat, lng }: { lat: number; lng: number }) => {
  return (
    <div className="flex h-96 w-full border rounded p-2 relative m-2">
      <MapContainer center={[lat, lng]} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[lat, lng]} icon={customIcon}>
          <Popup>Popup tst</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default Map
