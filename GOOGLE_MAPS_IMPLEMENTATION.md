# Google Maps Implementation for Fire Department Management System

## Overview

This implementation replaces the previous Leaflet-based map with Google Maps, providing advanced features for fire department operations including live tracking, custom emoji markers, heat maps, and real-time updates.

## Features Implemented

### 🗺️ Google Maps Integration
- **Google Maps API**: Integrated with provided API key `AIzaSyDtRGLKsg4LZ0d13kBUHYysoFxDn_cGy5E`
- **Custom Styling**: Clean map appearance with reduced POI labels
- **Responsive Design**: Full-screen map with sidebar controls

### 🚒 Custom Emoji Markers
- **Fire Stations**: 🏢 (Blue markers)
- **Fire Engines**: 🚒 (Red markers)
- **Ladder Trucks**: 🪜 (Orange markers)
- **Ambulances**: 🚑 (Green markers)
- **Hydrants**: 💧 (Cyan markers)
- **Incidents**: 🔥 (Dark red markers)
- **Personnel**: 👨‍🚒 (Purple markers)

### 📍 Live Tracking System
- **Real-time Vehicle Tracking**: Live position updates every 5 seconds
- **Vehicle Status Monitoring**: Online/offline status indicators
- **Speed and Heading**: Real-time vehicle movement data
- **Interactive Vehicle Selection**: Click to track specific vehicles

### 🔥 Advanced Map Features
- **Heat Maps**: Visual representation of incident density
- **Traffic Layer**: Real-time traffic information
- **Transit Layer**: Public transportation routes
- **Marker Clustering**: Groups nearby markers for better performance
- **Incident Statistics**: Real-time incident tracking and statistics

### 📊 Real-time Data Simulation
- **Vehicle Movement**: Simulated realistic vehicle movement patterns
- **New Incident Generation**: Automatic incident creation for testing
- **Status Updates**: Dynamic vehicle status changes
- **Online/Offline Simulation**: Vehicle connectivity simulation

## File Structure

```
src/
├── components/map/
│   ├── fire-map.tsx                 # Main map component with controls
│   ├── google-map-content.tsx       # Google Maps implementation
│   ├── live-tracking.tsx            # Live tracking controls
│   ├── advanced-map-features.tsx    # Advanced features panel
│   └── map-content.tsx              # Legacy Leaflet implementation
├── hooks/
│   └── use-realtime-data.ts         # Real-time data simulation
└── app/map/
    └── page.tsx                     # Map page route
```

## Key Components

### GoogleMapContent
- Main Google Maps wrapper component
- Handles map initialization and marker management
- Integrates with Google Maps API
- Provides custom emoji markers for different vehicle types

### LiveTracking
- Real-time vehicle tracking interface
- Vehicle selection and status monitoring
- Online/offline status indicators
- Speed and heading display

### AdvancedMapFeatures
- Heat map visualization
- Traffic and transit layers
- Marker clustering controls
- Map statistics and analytics

### useRealtimeData Hook
- Simulates real-time vehicle movement
- Generates new incidents automatically
- Manages vehicle status updates
- Provides tracking controls

## Usage

### Accessing the Map
Navigate to `http://localhost:3001/map` to view the Google Maps implementation.

### Controls Available
1. **Layer Toggles**: Show/hide different marker types
2. **Live Tracking**: Start/stop real-time vehicle tracking
3. **Advanced Features**: Toggle heat maps, traffic, and transit layers
4. **Vehicle Selection**: Click on vehicles to track them individually

### Real-time Features
- Vehicles move realistically when tracking is active
- New incidents are generated automatically
- Vehicle statuses update dynamically
- Online/offline status is simulated

## API Configuration

The Google Maps API key is configured in `.env.local`:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyDtRGLKsg4LZ0d13kBUHYysoFxDn_cGy5E
```

## Dependencies Added

```json
{
  "@googlemaps/react-wrapper": "^1.2.0",
  "@googlemaps/js-api-loader": "^1.16.10"
}
```

## Performance Optimizations

- **Dynamic Imports**: Map components are loaded dynamically to avoid SSR issues
- **Marker Clustering**: Groups nearby markers for better performance
- **Efficient Updates**: Only updates changed markers
- **Memory Management**: Proper cleanup of map instances and event listeners

## Future Enhancements

- **Real GPS Integration**: Connect to actual vehicle GPS systems
- **WebSocket Integration**: Real-time data from fire department systems
- **Route Planning**: Optimal route calculation for emergency responses
- **Geofencing**: Automatic alerts when vehicles enter/exit zones
- **Historical Tracking**: Vehicle movement history and analytics
- **Mobile Optimization**: Touch-friendly controls for mobile devices

## Testing

The implementation includes mock data for testing:
- 3 Fire stations
- 3 Emergency vehicles with different types
- 3 Hydrants with various statuses
- 2 Active incidents with different severities

All features can be tested without external data sources.

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

Requires modern browser with JavaScript enabled and Google Maps API access.
