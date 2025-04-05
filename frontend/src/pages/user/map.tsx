import React, { useEffect, useState, useRef } from 'react';
import { useShop } from '../../context/shopdataContext';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const MapPage = () => {
  const { selectedShop } = useShop();
  const [userLocation, setUserLocation] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<L.Routing.Control | null>(null);
  const watchIdRef = useRef<number | null>(null); // Ref to store the watchPosition ID

  const updateUserLocation = () => {
    if ('geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          // Update the routing control with the new user location if it exists
          if (routingControlRef.current && selectedShop.latitude !== null) {
            routingControlRef.current.setWaypoints([
              L.latLng(position.coords.latitude, position.coords.longitude),
              L.latLng(selectedShop.latitude, selectedShop.longitude),
            ]);
          } else if (mapRef.current && selectedShop.latitude !== null) {
            // If routing control isn't initialized yet, just update the map view and user marker
            mapRef.current.setView([position.coords.latitude, position.coords.longitude], 15);
            // You might want to update the user marker's position here if you're keeping a separate marker
          }
        },
        (err) => {
          setError(`Error getting location: ${err.message}`);
          console.error('Error getting user location:', err);
        },
        {
          enableHighAccuracy: true, // Use GPS if available (can drain battery)
          timeout: 10000,         // Maximum time to wait for location
          maximumAge: 0,          // Don't use cached locations
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  useEffect(() => {
    // Initial call to start getting the user's location
    updateUserLocation();

    // Initialize the map once the initial user location and shop location are available
    if (userLocation.latitude !== null && selectedShop.latitude !== null && mapRef.current === null) {
      const userLat = userLocation.latitude;
      const userLng = userLocation.longitude;
      const shopLat = selectedShop.latitude;
      const shopLng = selectedShop.longitude;

      mapRef.current = L.map('map-container').setView([userLat, userLng], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);

      L.marker([userLat, userLng]).addTo(mapRef.current).bindPopup('Your Location').openPopup();
      L.marker([shopLat, shopLng]).addTo(mapRef.current).bindPopup(selectedShop.shopName || 'Shop Location');

      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(userLat, userLng),
          L.latLng(shopLat, shopLng)
        ],
        routeWhileDragging: true,
        addWaypoints: false,
        draggableWaypoints: false
      }).addTo(mapRef.current);

      routingControlRef.current.on('routingerror', (e) => {
        setError(`Error finding route: ${e.message}`);
        console.error('Routing error:', e);
      });
    } else if (mapRef.current && userLocation.latitude !== null && selectedShop.latitude !== null && routingControlRef.current) {
      // If map and routing control are already initialized, just update waypoints
      routingControlRef.current.setWaypoints([
        L.latLng(userLocation.latitude, userLocation.longitude),
        L.latLng(selectedShop.latitude, selectedShop.longitude),
      ]);
    }
  }, [userLocation, selectedShop]);

  useEffect(() => {
    // Cleanup function to stop watching the location when the component unmounts
    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        routingControlRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-[80%] text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Shop Location</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {selectedShop.shopName && <p className="text-gray-700 mb-2">Shop: {selectedShop.shopName}</p>}
        {selectedShop.shopAddress && <p className="text-gray-700 mb-2">Address: {selectedShop.shopAddress}</p>}
        {selectedShop.latitude && selectedShop.longitude && (
          <p className="text-gray-700 mb-2">
            Coordinates: {selectedShop.latitude.toFixed(6)}, {selectedShop.longitude.toFixed(6)}
          </p>
        )}
        <div id="map-container" className="bg-gray-200 h-96 rounded-lg">
          {/* Leaflet map will be rendered here */}
        </div>
        <Link to="/" className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default MapPage;