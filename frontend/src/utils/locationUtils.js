// Location detection utility for chat queries
export const detectLocationQuery = (query) => {
  if (!query || typeof query !== 'string') return false
  
  const lowerQuery = query.toLowerCase()
  
  // Location-related keywords
  const locationKeywords = [
    // Direct location words
    'location', 'position', 'coordinates', 'latitude', 'longitude', 'where',
    'place', 'region', 'area', 'zone', 'site', 'spot', 'point',
    
    // Geographic terms
    'map', 'mapping', 'geographic', 'geographical', 'spatial',
    'near', 'close', 'closest', 'nearest', 'around', 'vicinity',
    'north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest',
    
    // Ocean-specific geographic terms
    'ocean', 'sea', 'pacific', 'atlantic', 'indian', 'arctic', 'southern',
    'basin', 'gulf', 'bay', 'strait', 'channel', 'ridge', 'trench',
    'equator', 'equatorial', 'tropical', 'polar', 'arctic', 'antarctic',
    
    // Float/buoy location terms
    'float', 'buoy', 'station', 'deployed', 'deployment',
    'argo', 'drifter', 'mooring', 'sensor',
    
    // Distance and movement
    'distance', 'far', 'away', 'travel', 'drift', 'current',
    'route', 'path', 'track', 'trajectory'
  ]
  
  // Check for location keywords
  const hasLocationKeywords = locationKeywords.some(keyword => 
    lowerQuery.includes(keyword)
  )
  
  // Check for coordinate patterns (lat/lon)
  const coordinatePatterns = [
    /\d+\.?\d*\s*[°]?\s*[ns]/i,  // latitude pattern
    /\d+\.?\d*\s*[°]?\s*[ew]/i,  // longitude pattern
    /lat|latitude/i,
    /lon|lng|longitude/i,
    /\d+\.?\d*\s*,\s*\d+\.?\d*/,  // coordinate pair
    /coordinates?/i
  ]
  
  const hasCoordinatePattern = coordinatePatterns.some(pattern => 
    pattern.test(lowerQuery)
  )
  
  return hasLocationKeywords || hasCoordinatePattern
}

// Check if response data contains location information
export const hasLocationData = (data) => {
  if (!data || !Array.isArray(data)) return false
  
  return data.some(item => {
    if (!item || typeof item !== 'object') return false
    
    // Check for coordinate fields
    const hasCoordinates = (
      (item.latitude && item.longitude) ||
      (item.lat && item.lng) ||
      (item.coords && (item.coords.lat || item.coords.latitude)) ||
      item.location_lat || item.location_lng ||
      item.position
    )
    
    // Check for location-related fields
    const hasLocationFields = (
      item.location ||
      item.region ||
      item.area ||
      item.place ||
      item.site ||
      item.float_id ||
      item.station_id
    )
    
    // Check for geographic content in string fields
    const hasGeographicContent = Object.values(item).some(value => {
      if (typeof value === 'string') {
        const lowerValue = value.toLowerCase()
        return (
          lowerValue.includes('°') ||
          lowerValue.includes('north') ||
          lowerValue.includes('south') ||
          lowerValue.includes('east') ||
          lowerValue.includes('west') ||
          lowerValue.includes('pacific') ||
          lowerValue.includes('atlantic') ||
          lowerValue.includes('indian') ||
          lowerValue.includes('ocean') ||
          lowerValue.includes('sea')
        )
      }
      return false
    })
    
    return hasCoordinates || hasLocationFields || hasGeographicContent
  })
}

// Extract location data from response for mapping
export const extractLocationData = (data) => {
  if (!data || !Array.isArray(data)) return []
  
  return data.filter(item => {
    if (!item || typeof item !== 'object') return false
    
    // Must have some form of location data
    return (
      (item.latitude && item.longitude) ||
      (item.lat && item.lng) ||
      (item.coords) ||
      item.location_lat ||
      item.location_lng ||
      item.float_id ||
      item.station_id ||
      item.location
    )
  }).map(item => {
    // Normalize the location data
    let lat, lng
    
    if (item.latitude && item.longitude) {
      lat = item.latitude
      lng = item.longitude
    } else if (item.lat && item.lng) {
      lat = item.lat
      lng = item.lng
    } else if (item.coords) {
      lat = item.coords.lat || item.coords.latitude
      lng = item.coords.lng || item.coords.longitude
    } else if (item.location_lat && item.location_lng) {
      lat = item.location_lat
      lng = item.location_lng
    }
    
    return {
      ...item,
      lat: lat,
      lng: lng,
      latitude: lat,
      longitude: lng,
      type: item.type || (item.float_id ? 'float' : 'station')
    }
  })
}

// Generate mock location data for demo purposes
export const generateMockLocationData = (query) => {
  const lowerQuery = query.toLowerCase()
  
  // Pacific Ocean locations
  if (lowerQuery.includes('pacific')) {
    return [
      {
        float_id: 'ARGO_PAC_001',
        latitude: '15.2°N',
        longitude: '140.5°E',
        depth: '2000m',
        temperature: '24.5°C',
        salinity: '34.7 PSU',
        status: 'Active',
        location: 'North Pacific'
      },
      {
        float_id: 'ARGO_PAC_002',
        latitude: '5.8°S',
        longitude: '180.0°E',
        depth: '1500m',
        temperature: '26.1°C',
        salinity: '34.5 PSU',
        status: 'Active',
        location: 'Central Pacific'
      }
    ]
  }
  
  // Equatorial locations
  if (lowerQuery.includes('equator')) {
    return [
      {
        float_id: 'ARGO_EQ_001',
        latitude: '0.2°N',
        longitude: '180.5°E',
        depth: '2000m',
        temperature: '28.2°C',
        salinity: '34.8 PSU',
        status: 'Active',
        location: 'Equatorial Pacific'
      },
      {
        float_id: 'ARGO_EQ_002',
        latitude: '0.1°S',
        longitude: '120.3°W',
        depth: '1500m',
        temperature: '27.8°C',
        salinity: '34.6 PSU',
        status: 'Active',
        location: 'Equatorial Pacific'
      }
    ]
  }
  
  // Indian Ocean locations
  if (lowerQuery.includes('indian')) {
    return [
      {
        float_id: 'ARGO_IND_001',
        latitude: '10.5°S',
        longitude: '95.0°E',
        depth: '2200m',
        temperature: '25.3°C',
        salinity: '34.9 PSU',
        status: 'Active',
        location: 'Indian Ocean'
      }
    ]
  }
  
  // Default global locations
  return [
    {
      float_id: 'ARGO_GLOBAL_001',
      latitude: '35.2°N',
      longitude: '25.1°E',
      depth: '1800m',
      temperature: '22.1°C',
      salinity: '34.6 PSU',
      status: 'Active',
      location: 'Mediterranean Sea'
    },
    {
      float_id: 'ARGO_GLOBAL_002',
      latitude: '55.8°N',
      longitude: '12.5°E',
      depth: '1200m',
      temperature: '8.5°C',
      salinity: '34.2 PSU',
      status: 'Active',
      location: 'North Sea'
    }
  ]
}