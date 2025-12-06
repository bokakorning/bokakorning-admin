import React, { useEffect, useRef } from "react";

export default function LocationPicker({
  pickupAddress,
  setPickupAddress,
  setUserLocation,
}) {
  const inputRef = useRef(null);

  // Load Google script from env key
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_KEY;

    if (!apiKey) {
      console.error("Google API Key Missing in .env");
      return;
    }

    // If script already present, skip
    if (window.google) return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    document.body.appendChild(script);

    script.onload = initAutocomplete;
  }, []);

  const initAutocomplete = () => {
    if (!window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode"],
        componentRestrictions: { country: "in" },
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setPickupAddress(place.formatted_address);
      setUserLocation({
        lat: lat,
        long: lng,
      });
    });
  };

  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">
        Select your pickup location:
      </label>

      <input
        type="text"
        ref={inputRef}
        value={pickupAddress}
        onChange={(e) => setPickupAddress(e.target.value)}
        placeholder="Enter pickup address"
        className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
