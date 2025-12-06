import React, { useEffect, useRef } from "react";

export default function Locationinput({ userDetail, setUserDetail }) {
  const inputRef = useRef(null);

  // Load Google Places Script
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_KEY;

    if (!apiKey) {
      console.error("Google API Key Missing in .env");
      return;
    }

    // Avoid loading script multiple times
    if (window.google) {
      initAutocomplete();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = initAutocomplete;
    document.body.appendChild(script);
  }, []);

  // Initialize Google Autocomplete
  const initAutocomplete = () => {
    if (!window.google || !inputRef.current) return;

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

      // UPDATE MAIN USER DETAIL HERE
      setUserDetail((prev) => ({
        ...prev,
        address: place.formatted_address,
        location: {
          type: "Point",
          coordinates: [lng, lat], // [long, lat]
        },
      }));
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Location
      </label>

      <input
        type="text"
        ref={inputRef}
        value={userDetail.address}
        onChange={(e) =>
          setUserDetail((prev) => ({
            ...prev,
            address: e.target.value,
          }))
        }
        placeholder="Enter your address"
        className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
