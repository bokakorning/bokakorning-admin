import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Api } from "@/services/service";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import Locationinput from "../../components/LocationInput";

export default function AddUser(props) {
  const router = useRouter();
  const [type, setType] = useState();
  const [editId, setEditId] = useState();
  const [pageReady, setPageReady] = useState(false);
  const fileRef = useRef(null);

  const [value, setValue] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    vehicle_model: "",
    model_year: "",
    bio: "",
    experience_year: 0,
    experience_month: 0,
    ratePerHour: 0,
    transmission: "",
    address: "",
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
  });

  const [image, setImage] = useState(null);
  const [document, setDocument] = useState(null);

  const months = [
    { label: "0 Month", value: 0 },
    { label: "1 Month", value: 1 },
    { label: "2 Months", value: 2 },
    { label: "3 Months", value: 3 },
    { label: "4 Months", value: 4 },
    { label: "5 Months", value: 5 },
    { label: "6 Months", value: 6 },
    { label: "7 Months", value: 7 },
    { label: "8 Months", value: 8 },
    { label: "9 Months", value: 9 },
    { label: "10 Months", value: 10 },
    { label: "11 Months", value: 11 },
    { label: "12 Months", value: 12 },
  ];

  const years = [
    { label: "0 Year", value: 0 },
    { label: "1 Year", value: 1 },
    { label: "2 Years", value: 2 },
    { label: "3 Years", value: 3 },
    { label: "4 Years", value: 4 },
    { label: "5 Years", value: 5 },
    { label: "6 Years", value: 6 },
    { label: "7 Years", value: 7 },
    { label: "8 Years", value: 8 },
    { label: "9 Years", value: 9 },
    { label: "10 Years", value: 10 },
    { label: "11 Years", value: 11 },
    { label: "12 Years", value: 12 },
    { label: "13+ Years", value: "13+" },
  ];

  useEffect(() => {
    if (!router.isReady) return;

    const t = router.query.type || "";
    const id = router.query.editId || "";
    console.log("m", t, id);

    if (t !== type) setType(t);
    if (id !== editId) setEditId(id);
    if (!pageReady) setPageReady(true);
  }, []);

//   useEffect(() => {
//     if (!editId) return;
//     fetchDataById();
//   }, [editId]);

  console.log(editId);
  console.log(type);

  const fetchDataById = async () => {
    try {
      const res = await Api("get", `/getById/${editId}`);

      if (res?.status && res.data) {
        if (type === "user") {
          setValue(res.data);
        } else {
          setUserDetail(res.data);
        }
      }
    } catch (err) {
      toast.error("Unable to load user");
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      toast.error("Max 1MB allowed");
      return;
    }

    setImage(file);
  };

  const removeImage = () => {
    setImage(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const updateUserValue = (field, newValue) => {
    setUserDetail((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };
  const updateValue = (field, newValue) => {
    setValue((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  console.log(userDetail, image);

  const handleSubmit = async (e) => {
    e.preventDefault();
    props.loader(true);

    try {
      const formData = new FormData();

      if (type === "user") {
        formData.append("name", value.name);
        formData.append("email", value.email);
        formData.append("phone", value.phone);
        formData.append("password", value.password);
        formData.append("type", "user");
        if (document) formData.append("document", document);
      } else {
        if (image) formData.append("image", image);
        formData.append("name", userDetail.name);
        formData.append("email", userDetail.email);
        formData.append("phone", userDetail.phone);
        formData.append("password", userDetail.password);
        formData.append("vehicle_model", userDetail.vehicle_model);
        formData.append("model_year", userDetail.model_year);
        formData.append("bio", userDetail.bio);
        formData.append("experience_year", userDetail.experience_year);
        formData.append("experience_month", userDetail.experience_month);
        formData.append("transmission", userDetail.transmission);
        formData.append("rate_per_hour", userDetail.ratePerHour);
        formData.append("location", JSON.stringify(userDetail.location));
        formData.append("status", "Approved");
        formData.append("type", "instructor");
      }

      let url = editId ? `update/${editId}` : `auth/register`;
      let method = "post";

      const res = await Api(method, url, formData, router);
      props.loader(false);

      if (res?.status) {
        toast.success(
          editId ? "Updated Successfully!" : "Created Successfully!"
        );
        if (type == "user") {
          router.push(`/student`);
        } else {
          router.push("/instructors");
        }
      } else {
        toast.error(res?.message || "Failed");
      }
    } catch (err) {
      props.loader(false);
      toast.error(err?.message || "Something went wrong");
    }
  };



  if (!pageReady) return null;

  return (
    <div className="min-h-screen px-4 py-2 pb-10">
      <div className="w-full">
        <div className="bg-white shadow rounded-2xl  overflow-hidden">
          {/* Header */}
          <div className="bg-custom-blue md:px-8 px-4 py-6">
            <h2 className="text-2xl font-bold text-white">
              {editId ? "Edit" : "Add"}{" "}
              {type === "user" ? "User" : "Instructor"}
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {editId
                ? "Update the information below"
                : "Fill in the details to create a new account"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="md:p-8 p-4">
            {type === "user" ? <div className="space-y-4 ">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
            placeholder="Enter full name"
            name="name"
            value={value.name}
            onChange={(e) => updateValue("name", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
            placeholder="Enter email"
            type="email"
            name="email"
            value={value.email}
            onChange={(e) => updateValue("email", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
            placeholder="Enter phone number"
            name="phone"
            value={value.phone}
            onChange={(e) => updateValue("phone", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
            placeholder="Enter password"
            type="password"
            name="password"
            value={value.password}
            onChange={(e) => updateValue("password", e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attach Your Driving Permit
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              if (file.size > 1 * 1024 * 1024) {
                toast.error("Max 1MB allowed");
                return;
              }
              setDocument(file);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent outline-none text-black transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-sky-400 "
          />
        </div>
      </div>
    </div> : <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
              placeholder="Enter full name"
              name="name"
              value={userDetail.name}
              onChange={(e) => updateUserValue("name", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
              placeholder="Enter email"
              type="email"
              name="email"
              value={userDetail.email}
              onChange={(e) => updateUserValue("email", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
              placeholder="Enter phone number"
              name="phone"
              value={userDetail.phone}
              onChange={(e) => updateUserValue("phone", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
              placeholder="Enter password"
              type="password"
              name="password"
              value={userDetail.password}
              onChange={(e) => updateUserValue("password", e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Vehicle Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Model <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
              placeholder="e.g., Toyota Corolla"
              name="vehicle_model"
              value={userDetail.vehicle_model}
              onChange={(e) => updateUserValue("vehicle_model", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Year <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
              placeholder="e.g., 2023"
              name="model_year"
              value={userDetail.model_year}
              onChange={(e) => updateUserValue("model_year", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transmission <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-black"
              name="transmission"
              value={userDetail.transmission}
              onChange={(e) => updateUserValue("transmission", e.target.value)}
              required
            >
              <option value="">Select Transmission</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
              <option value="Both">Both</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rate Per Hour <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
              placeholder="e.g., 20"
              type="number"
              name="ratePerHour"
              value={userDetail.ratePerHour}
              onChange={(e) => updateUserValue("ratePerHour", e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Experience</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black bg-white"
              name="experience_year"
              value={userDetail.experience_year}
              onChange={(e) =>
                updateUserValue("experience_year", e.target.value)
              }
              required
            >
              {years.map((year) => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Months <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none  text-black transition-all bg-white"
              name="experience_month"
              value={userDetail.experience_month}
              onChange={(e) =>
                updateUserValue("experience_month", e.target.value)
              }
              required
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black resize-none"
            placeholder="Tell us about yourself and your teaching experience..."
            name="bio"
            rows="4"
            value={userDetail.bio}
            onChange={(e) => updateUserValue("bio", e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image
          </label>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none 
            text-black transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg 
            file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-sky-400"
          />

          {image && (
            <div className="relative inline-block mt-2">
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="w-20 h-20 object-cover rounded"
              />

              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        <Locationinput userDetail={userDetail} setUserDetail={setUserDetail} />
      </div>
    </div>}

            {/* Submit Button */}
            <div className="mt-8 flex flex-col md:flex-row gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-custom-blue text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                {editId ? "Update" : "Create"}{" "}
                {type === "user" ? "User" : "Instructor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
