import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom ocean-themed marker icons
const createOceanIcon = (color = '#00ffff', type = 'float') => {
  const iconSvg = type === 'float' 
    ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
         <circle cx="12" cy="12" r="8" fill="${color}" stroke="#0066cc" stroke-width="2"/>
         <circle cx="12" cy="12" r="4" fill="#ffffff" opacity="0.8"/>
         <text x="12" y="16" text-anchor="middle" fill="#0066cc" font-size="8" font-weight="bold">F</text>
       </svg>`
    : `<svg width="24" height="24" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
         <rect x="8" y="8" width="8" height="8" fill="${color}" stroke="#0066cc" stroke-width="2"/>
         <circle cx="12" cy="12" r="3" fill="#ffffff" opacity="0.8"/>
       </svg>`

  return L.divIcon({
    html: iconSvg,
    className: 'ocean-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  })
}

const OceanMap = ({ locationData, className = '', style = {} }) => {
  const mapRef = useRef(null)

  // Default center (World view - center of Earth) and zoom for full world view
  const defaultCenter = [20, 0] // Slightly north to better show continents
  const defaultZoom = 2 // Lower zoom to show entire world

  // Process location data to extract coordinates and info
  const processLocationData = (data) => {
    if (!data || !Array.isArray(data)) return { markers: [], center: defaultCenter, zoom: defaultZoom }

    const markers = []
    let bounds = []

    data.forEach((item, index) => {
      let lat, lng, info = {}

      // Try to extract coordinates from various possible formats
      if (item.latitude && item.longitude) {
        lat = parseFloat(item.latitude.toString().replace(/[°NS]/g, ''))
        lng = parseFloat(item.longitude.toString().replace(/[°EW]/g, ''))
        if (item.latitude.toString().includes('S')) lat = -lat
        if (item.longitude.toString().includes('W')) lng = -lng
      } else if (item.lat && item.lng) {
        lat = parseFloat(item.lat)
        lng = parseFloat(item.lng)
      } else if (item.coords) {
        lat = parseFloat(item.coords.lat || item.coords.latitude)
        lng = parseFloat(item.coords.lng || item.coords.longitude)
      }

      // Extract additional info
      info = {
        id: item.float_id || item.id || `location-${index}`,
        name: item.name || item.location || item.float_id || `Location ${index + 1}`,
        depth: item.depth || item.max_depth || 'Unknown',
        temperature: item.temperature || 'Unknown',
        salinity: item.salinity || 'Unknown',
        status: item.status || 'Unknown',
        type: item.type || 'float'
      }

      if (!isNaN(lat) && !isNaN(lng)) {
        markers.push({ lat, lng, info })
        bounds.push([lat, lng])
      }
    })

    // Calculate map center and zoom based on markers
    let center = defaultCenter
    let zoom = defaultZoom

    if (bounds.length > 0) {
      if (bounds.length === 1) {
        center = bounds[0]
        zoom = 5 // Moderate zoom for single location
      } else {
        // Calculate bounds center
        const avgLat = bounds.reduce((sum, coord) => sum + coord[0], 0) / bounds.length
        const avgLng = bounds.reduce((sum, coord) => sum + coord[1], 0) / bounds.length
        center = [avgLat, avgLng]
        
        // Calculate appropriate zoom based on data spread
        const latRange = Math.max(...bounds.map(b => b[0])) - Math.min(...bounds.map(b => b[0]))
        const lngRange = Math.max(...bounds.map(b => b[1])) - Math.min(...bounds.map(b => b[1]))
        const maxRange = Math.max(latRange, lngRange)
        
        // Adjust zoom based on geographic spread
        if (maxRange > 100) zoom = 2  // Global spread
        else if (maxRange > 50) zoom = 3  // Continental spread
        else if (maxRange > 20) zoom = 4  // Regional spread
        else if (maxRange > 5) zoom = 5   // Local spread
        else zoom = 6  // Very local spread
      }
    }

    return { markers, center, zoom }
  }

  const { markers, center, zoom } = processLocationData(locationData)

  // Fit map to markers when they change
  useEffect(() => {
    if (mapRef.current && markers.length > 1) {
      const bounds = markers.map(marker => [marker.lat, marker.lng])
      // Add padding and max zoom constraint to ensure good visibility
      mapRef.current.fitBounds(bounds, { 
        padding: [20, 20],
        maxZoom: 6 // Prevent over-zooming
      })
    }
  }, [markers])

  const defaultStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '12px',
    border: '1px solid rgba(0, 255, 255, 0.3)',
    overflow: 'hidden',
    ...style
  }

  return (
    <div className={`ocean-map-container ${className}`} style={defaultStyle}>
      <MapContainer
        center={center}
        zoom={zoom}
        ref={mapRef}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        minZoom={1}
        maxZoom={10}
        worldCopyJump={true}
        maxBounds={[[-90, -180], [90, 180]]}
      >
        {/* Ocean-themed tile layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {/* Alternative ocean-focused tile layer */}
        {/* <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
        /> */}

        {/* Render markers */}
        {markers.map((marker, index) => (
          <Marker
            key={`${marker.info.id}-${index}`}
            position={[marker.lat, marker.lng]}
            icon={createOceanIcon('#00ffff', marker.info.type)}
          >
            <Popup>
              <div className="ocean-popup">
                <h4 style={{ margin: '0 0 8px 0', color: '#0066cc' }}>
                  {marker.info.name}
                </h4>
                <div style={{ fontSize: '12px', color: '#333' }}>
                  <p style={{ margin: '4px 0' }}>
                    <strong>Coordinates:</strong> {marker.lat.toFixed(4)}°, {marker.lng.toFixed(4)}°
                  </p>
                  {marker.info.depth !== 'Unknown' && (
                    <p style={{ margin: '4px 0' }}>
                      <strong>Depth:</strong> {marker.info.depth}
                    </p>
                  )}
                  {marker.info.temperature !== 'Unknown' && (
                    <p style={{ margin: '4px 0' }}>
                      <strong>Temperature:</strong> {marker.info.temperature}
                    </p>
                  )}
                  {marker.info.salinity !== 'Unknown' && (
                    <p style={{ margin: '4px 0' }}>
                      <strong>Salinity:</strong> {marker.info.salinity}
                    </p>
                  )}
                  {marker.info.status !== 'Unknown' && (
                    <p style={{ margin: '4px 0' }}>
                      <strong>Status:</strong> {marker.info.status}
                    </p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Add circles for depth visualization if applicable */}
        {markers.map((marker, index) => {
          const depth = parseFloat(marker.info.depth)
          if (!isNaN(depth) && depth > 0) {
            const radius = Math.min(Math.max(depth * 10, 1000), 50000) // Scale radius based on depth
            return (
              <Circle
                key={`circle-${marker.info.id}-${index}`}
                center={[marker.lat, marker.lng]}
                radius={radius}
                fillColor="#00ffff"
                fillOpacity={0.1}
                stroke={true}
                color="#00ffff"
                weight={1}
                opacity={0.3}
              />
            )
          }
          return null
        })}
      </MapContainer>
    </div>
  )
}

export default OceanMap