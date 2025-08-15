import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  distance: number;
  deliveryTime: string;
  cuisine: string;
  isOpen: boolean;
  lat: number;
  lng: number;
}

interface MapProps {
  restaurants: Restaurant[];
  onRestaurantClick?: (restaurantId: string) => void;
  className?: string;
}

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const restaurantIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

export const Map: React.FC<MapProps> = ({
  restaurants,
  onRestaurantClick,
  className = "",
}) => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          // fallback location: New York City
          setUserLocation({ latitude: 40.7128, longitude: -74.006 });
        }
      );
    } else {
      setUserLocation({ latitude: 40.7128, longitude: -74.006 });
    }
  }, []);

  if (!userLocation) return <div>Loading map...</div>;

  return (
    <MapContainer
      center={[userLocation.latitude, userLocation.longitude]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
      className={className}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* User Location */}
      <Marker
        position={[userLocation.latitude, userLocation.longitude]}
        icon={userIcon}
      >
        <Popup>You are here</Popup>
      </Marker>

      {/* Restaurant Markers */}
      {restaurants.map((restaurant) => (
        <Marker
          key={restaurant.id}
          position={[restaurant.lat, restaurant.lng]}
          icon={restaurantIcon}
          eventHandlers={{
            click: () => onRestaurantClick?.(restaurant.id),
          }}
        >
          <Popup>
            <div>
              <h4>{restaurant.name}</h4>
              <p>{restaurant.cuisine}</p>
              <p>⭐ {restaurant.rating}</p>
              <p>📍 {restaurant.distance} km</p>
              <p>🕒 {restaurant.deliveryTime}</p>
              <p
                style={{
                  color: restaurant.isOpen ? "#155724" : "#721c24",
                  fontWeight: "bold",
                }}
              >
                {restaurant.isOpen ? "Open" : "Closed"}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
