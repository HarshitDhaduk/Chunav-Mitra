"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { MapPin, Navigation, Crosshair, Loader2, Search } from "lucide-react";
import { VoiceNarration } from "@/components/accessibility/VoiceNarration";

// Default center (New Delhi)
const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 };

type Booth = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
};

function Directions({ 
  origin, 
  destination 
}: { 
  origin: { lat: number; lng: number } | null; 
  destination: { lat: number; lng: number } | null 
}) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

  useEffect(() => {
    if (!routesLibrary || !map) return;
    const renderer = new routesLibrary.DirectionsRenderer({ 
      map,
      suppressMarkers: true,
      polylineOptions: { strokeColor: "#F97316", strokeWeight: 4 }
    });
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(renderer);

    return () => renderer.setMap(null);
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !origin || !destination) return;

    directionsService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING
    }).then(response => {
      directionsRenderer.setDirections(response);
    }).catch(e => {
      console.error("Directions request failed", e);
    });
  }, [directionsService, directionsRenderer, origin, destination]);

  return null;
}

function PlaceAutocomplete({ 
  onPlaceSelect,
  placeholder 
}: { 
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void,
  placeholder: string
}) {
  const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"]
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      const place = placeAutocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        onPlaceSelect(place);
      }
    });
  }, [placeAutocomplete, onPlaceSelect]);

  return (
    <div className="relative w-full max-w-md">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
        <Search size={18} />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm outline-none transition-all focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />
    </div>
  );
}

function BoothLocatorInner() {
  const t = useTranslations("booth");
  const map = useMap();
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [booths, setBooths] = useState<Booth[]>([]);
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

  const generateMockBooths = (lat: number, lng: number) => {
    return [
      { id: "1", name: "Govt. Primary School (Booth 42)", lat: lat + 0.005, lng: lng + 0.005, address: "Sector 4, Main Road" },
      { id: "2", name: "Community Center (Booth 43)", lat: lat - 0.004, lng: lng + 0.003, address: "Sector 5, Near Park" },
      { id: "3", name: "City College Hall (Booth 44)", lat: lat + 0.002, lng: lng - 0.006, address: "University Campus" }
    ];
  };

  const handleUseMyLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setCenter(loc);
          setUserLocation(loc);
          setBooths(generateMockBooths(loc.lat, loc.lng));
          setIsLocating(false);
          setShowDirections(false);
          if (map) map.panTo(loc);
        },
        () => {
          alert(t("errorLocation"));
          setIsLocating(false);
        }
      );
    } else {
      alert(t("errorGeo"));
      setIsLocating(false);
    }
  };

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const loc = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
      setCenter(loc);
      setUserLocation(loc);
      setBooths(generateMockBooths(loc.lat, loc.lng));
      setShowDirections(false);
      if (map) {
        map.panTo(loc);
        map.setZoom(14);
      }
    }
  };

  const handleMarkerClick = (booth: Booth) => {
    setSelectedBooth(booth);
  };

  const handleGetDirections = (booth: Booth) => {
    if (!userLocation) {
      alert(t("alertLocation"));
      return;
    }
    setSelectedBooth(booth);
    setShowDirections(true);
    if (map) {
      map.panTo({ lat: booth.lat, lng: booth.lng });
    }
  };

  return (
    <div className="space-y-6">
      <VoiceNarration text={`${t("title")}. ${t("subtitle")}`} />
      
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 shadow-sm dark:bg-orange-900/30 dark:text-orange-400">
          <MapPin size={32} />
        </div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <PlaceAutocomplete onPlaceSelect={handlePlaceSelect} placeholder={t("searchPlaceholder")} />
        <span className="text-sm font-medium text-slate-400">{t("or")}</span>
        <button
          onClick={handleUseMyLocation}
          disabled={isLocating}
          className="flex min-h-[44px] items-center gap-2 rounded-xl bg-orange-500 px-6 py-2 font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-70 shrink-0"
        >
          {isLocating ? <Loader2 className="animate-spin" size={18} /> : <Crosshair size={18} />}
          {t("useLocation")}
        </button>
      </div>

      <div className="relative h-[500px] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-md dark:border-slate-700">
        <Map
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={14}
          center={center}
          onCenterChanged={(ev) => setCenter(ev.detail.center)}
          mapId="electoral_map_id"
          disableDefaultUI={true}
          zoomControl={true}
        >
          {userLocation && (
            <AdvancedMarker position={userLocation} title="Your Location">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 shadow-lg ring-2 ring-white"></div>
            </AdvancedMarker>
          )}

          {booths.map((booth) => (
            <AdvancedMarker
              key={booth.id}
              position={{ lat: booth.lat, lng: booth.lng }}
              title={booth.name}
              onClick={() => handleMarkerClick(booth)}
            >
              <Pin background={"#F97316"} borderColor={"#C2410C"} glyphColor={"#FFF"} />
            </AdvancedMarker>
          ))}

          {selectedBooth && (
            <InfoWindow
              position={{ lat: selectedBooth.lat, lng: selectedBooth.lng }}
              onCloseClick={() => setSelectedBooth(null)}
            >
              <div className="p-2 text-slate-900">
                <h3 className="mb-1 font-bold">{selectedBooth.name}</h3>
                <p className="mb-3 text-sm text-slate-600">{selectedBooth.address}</p>
                <button
                  onClick={() => {
                    if (userLocation) {
                      window.open(`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selectedBooth.lat},${selectedBooth.lng}`, '_blank');
                    } else {
                      window.open(`https://www.google.com/maps/search/?api=1&query=${selectedBooth.lat},${selectedBooth.lng}`, '_blank');
                    }
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-orange-500 py-1.5 text-xs font-semibold text-white hover:bg-orange-600"
                >
                  <Navigation size={14} /> {t("getDirections")}
                </button>
              </div>
            </InfoWindow>
          )}

          {showDirections && selectedBooth && userLocation && (
            <Directions origin={userLocation} destination={selectedBooth} />
          )}
        </Map>
      </div>

      {booths.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          {booths.map((booth) => (
            <motion.div
              key={booth.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border p-4 shadow-sm transition-all ${selectedBooth?.id === booth.id ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"}`}
            >
              <h4 className="font-bold text-slate-900 dark:text-white">{booth.name}</h4>
              <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">{booth.address}</p>
              <button
                onClick={() => handleGetDirections(booth)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-100 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50"
              >
                <Navigation size={16} /> {t("viewRoute")}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export function BoothLocator({ apiKey }: { apiKey?: string }) {
  const finalApiKey = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  if (!finalApiKey) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
        Google Maps API Key missing in .env.local
      </div>
    );
  }

  return (
    <APIProvider apiKey={finalApiKey}>
      <BoothLocatorInner />
    </APIProvider>
  );
}
