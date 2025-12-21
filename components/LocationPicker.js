"use client";


import React, { useEffect, useRef } from "react";

export default function LocationPicker({
  pickupAddress,
  setPickupAddress,
  setUserLocation,
}) {
  const inputRef = useRef(null);
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_KEY;

    if (!apiKey) {
      console.error("Google API Key Missing");
      return;
    }

    const loadScript = () => {
      if (window.google && window.google.maps) {
        initAutocomplete();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onload = initAutocomplete;
      document.body.appendChild(script);
    };

    loadScript();
  }, []);

  const initAutocomplete = () => {
    if (!inputRef.current || autoCompleteRef.current) return;

    autoCompleteRef.current =
      new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode"],
        componentRestrictions: { country: "in" },
      });

    autoCompleteRef.current.addListener("place_changed", () => {
      const place = autoCompleteRef.current.getPlace();
      if (!place.geometry) return;

      setPickupAddress(place.formatted_address);
      setUserLocation({
        lat: place.geometry.location.lat(),
        long: place.geometry.location.lng(),
      });
    });
  };

  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">
        Select your pickup location:
      </label>

      <input
        ref={inputRef}
        type="text"
        defaultValue={pickupAddress}
        placeholder="Enter pickup address"
        className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
