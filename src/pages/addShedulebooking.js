import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, User, Car } from "lucide-react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import LocationPicker from "../../components/LocationPicker";
import Select from "react-select";

export default function AddScheduleBooking(props) {
  const [vehicleType, setVehicleType] = useState("automatic");
  const [selectedUser, setSelectedUser] = useState("");
  const router = useRouter();
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [userLocation, setUserLocation] = useState({
    lat: 0,
    long: 0,
  });
  const [scheduleDate, setScheduleDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [times, setTimes] = useState([]);
  const [userList, setUserList] = useState([]);
  const [instructorList, setInstructorList] = useState([]);
  const [loading, setLoading] = useState(false);

  function generateTimeSlots(start = "06:00", end = "23:50", gapMinutes = 30) {
    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);

    const startTime = new Date();
    startTime.setHours(startHour, startMin, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMin, 0, 0);

    const slots = [];
    let current = new Date(startTime);

    while (current <= endTime) {
      slots.push(
        current.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
      current = new Date(current.getTime() + gapMinutes * 60000);
    }

    return slots;
  }

  useEffect(() => {
    const generatedSlots = generateTimeSlots();
    setTimes(generatedSlots);
  }, []);

  useEffect(() => {
    getAllUser();
  }, []);

  useEffect(() => {
    if (
      userLocation?.lat &&
      userLocation?.long &&
      vehicleType &&
      vehicleType !== ""
    ) {
      getAllInstaruter();
    }
  }, [userLocation, vehicleType]);

  const getAllUser = async () => {
    props.loader(true);
    let url = `auth/getUser?type=user`;
    Api("get", url, router).then(
      (res) => {
        props.loader(false);
        console.log("abcd", res?.data);
        setUserList(res?.data.users);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        toast.error(err?.message || "Something went Wrong");
      }
    );
  };

  const getAllInstaruter = async () => {
    props.loader(true);

    const url = `booking/getAllInstructers`;

    const data = {
      user_location: {
        type: "Point",
        coordinates: [userLocation.long, userLocation.lat],
      },
      transmission: vehicleType,
    };

    try {
      const res = await Api("post", url, data, router);
      props.loader(false);
      console.log("abcd", res?.data);
      setInstructorList(res?.data);
    } catch (err) {
      props.loader(false);
      console.log(err);
    }
  };

  const handleConfirm = async () => {
    if (!selectedUser || !pickupAddress || !scheduleDate || !selectedTime) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!selectedInstructor) {
      toast.error("Select Instructor");
      return;
    }

    const body = {
      selectedTime: selectedTime,
      sheduleDate: scheduleDate,
      sheduleSeesion: true,
      payment_mode: "online",
      user_location: {
        type: "Point",
        coordinates: [userLocation.long, userLocation.lat],
      },
      pickup_address: pickupAddress,
      user: selectedUser,
      instructer: selectedInstructor,
      vehicleType: vehicleType,
    };

    console.log("Booking payload:", body);

    try {
      props.loader(true);

      const res = await Api("post", "booking/createBooking", body, router);

      if (res?.status) {
        props.loader(false);
        toast.success("Booking created successfully!");
        router.push("/bookings");
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Booking Error:", error);
      toast.error(error?.message || "API request failed");
    } finally {
      props.loader(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-custom-blue text-white p-6">
          <h1 className="text-2xl font-bold">Schedule Booking</h1>
          <p className="text-blue-100 mt-1">Create a new driving session</p>
        </div>

        <div className="md:p-6 p-4 space-y-6">
          {/* Vehicle Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-3">
              <Car className="inline-block w-5 h-5 mr-2" />
              Select your preferred vehicle:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setVehicleType("automatic")}
                className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
                  vehicleType === "automatic"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="text-6xl mb-2">🚗</div>
                <div className="font-semibold text-gray-800">Automatic Car</div>
              </button>
              <button
                onClick={() => setVehicleType("manual")}
                className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
                  vehicleType === "manual"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="text-6xl mb-2">🚙</div>
                <div className="font-semibold text-gray-800">Manual Car</div>
              </button>
            </div>
          </div>

          <div>
            <LocationPicker
              pickupAddress={pickupAddress}
              setPickupAddress={setPickupAddress}
              setUserLocation={setUserLocation}
            />
            <p className="text-center text-gray-500 text-sm mt-2">
              Or find it on map
            </p>
            <div className="mt-3 bg-gray-100 rounded-lg p-4 h-48 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2 text-blue-500" />
                <p className="text-sm">Map integration placeholder</p>
                <p className="text-xs mt-1">
                  Lat: {userLocation.lat}, Long: {userLocation.long}
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <User className="inline-block w-5 h-5 mr-2" />
                Select Student:
              </label>
              <Select
                options={userList.map((u) => ({
                  value: u._id,
                  label: `${u.name} - ${u.email}`,
                }))}
                value={
                  selectedUser
                    ? {
                        value: selectedUser,
                        label:
                          userList.find((u) => u._id === selectedUser)?.name +
                          " - " +
                          userList.find((u) => u._id === selectedUser)?.email,
                      }
                    : null
                }
                onChange={(val) => setSelectedUser(val.value)}
                placeholder="Choose a student"
                className="text-black"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <User className="inline-block w-5 h-5 mr-2" />
                Select Instructor:
              </label>
              <Select
                options={instructorList?.map((i) => ({
                  value: i._id,
                  label: `${i.name} - ${i.email}`,
                }))}
                value={
                  selectedInstructor
                    ? {
                        value: selectedInstructor,
                        label:
                          instructorList.find(
                            (i) => i._id === selectedInstructor
                          )?.name +
                          " - " +
                          instructorList.find(
                            (i) => i._id === selectedInstructor
                          )?.email,
                      }
                    : null
                }
                onChange={(val) => setSelectedInstructor(val.value)}
                placeholder="Choose an instructor"
                className="text-black"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <Calendar className="inline-block w-5 h-5 mr-2" />
                Schedule Date:
              </label>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                min={getTodayDate()}
                className="w-full p-3 text-black border cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <Clock className="inline-block w-5 h-5 mr-2" />
                Schedule Time:
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black cursor-pointer focus:border-transparent"
              >
                <option value="">Choose a time slot</option>
                {times.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full bg-custom-blue text-white py-3 cursor-pointer rounded-lg font-semibold text-md hover:bg-gray-800 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
