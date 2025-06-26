import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { Navigation } from 'lucide-react';

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 14);
    }
  }, [center, map]);
  return null;
}

function MapComponent({ events, onEventClick, center, onLocationChange }) {
  const [userLocation, setUserLocation] = useState(center || { lat: 40.7128, lng: -74.0060 });

  const mapRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(pos);
          if (onLocationChange) onLocationChange(pos);
        },
        (error) => console.error('Geolocation error:', error)
      );
    }
  }, [onLocationChange]);

  const centerOnUserLocation = () => {
    if (mapRef.current) {
      mapRef.current.setView(userLocation, 14);
    }
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={userLocation}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full rounded-xl z-0"
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />

        <RecenterMap center={userLocation} />

        {/* Circle around user location for visual effect */}
        <Circle
          center={userLocation}
          radius={100}
          pathOptions={{
            color: '#3B82F6',
            fillColor: '#3B82F6',
            fillOpacity: 0.2,
            weight: 1
          }}
        />

        {/* Marker for user location */}
        <Marker
          position={userLocation}
          icon={L.divIcon({
            className: '',
            html: `<div style="background:#3B82F6;width:14px;height:14px;border-radius:50%;border:2px solid white;"></div>`
          })}
        >
          <Popup>You are here</Popup>
        </Marker>

        {/* Event markers */}
        {events && events.map((event, idx) => (
          event.latitude && event.longitude && (
            <Marker
              key={idx}
              position={{ lat: event.latitude, lng: event.longitude }}
              icon={L.divIcon({
                html: `<div style="background:${
                  event.category === 'VOLUNTEER'
                    ? '#10B981'
                    : event.category === 'DONATION'
                    ? '#F97316'
                    : '#3B82F6'
                };width:12px;height:12px;border-radius:50%;"></div>`,
                className: '',
                iconSize: [16, 16],
              })}
              eventHandlers={{
                click: () => onEventClick && onEventClick(event)
              }}
            >
              <Popup>{event.title}</Popup>
            </Marker>
          )
        ))}
      </MapContainer>

      {/* Center button */}
      <div className="absolute top-4 right-4 space-y-2 z-[1000]">
        <button
          onClick={centerOnUserLocation}
          className="p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
          title="Center on your location"
        >
          <Navigation className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-[1000]">
        <h4 className="font-medium text-gray-900 mb-2">Event Types</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Community Events</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-gray-600">Volunteer Work</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">Donation Drives</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapComponent;
