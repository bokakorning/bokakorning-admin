import React, { useState, useEffect } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import isAuth from "../../components/isAuth";
import { toast } from "react-toastify";
import { Save, Pencil, Trash2, Check, X } from "lucide-react";
import Swal from "sweetalert2";

function instructors(props) {
  const router = useRouter();
  const [ratePerHour, setRatePerHour] = useState();
  const [courseVat, setCourseVat] = useState("");
  const [settingId, setsettingId] = useState();
  const [cityName, setCityName] = useState("");
  const [cities, setCities] = useState([]);
  const [courseSettingId, setCourseSettingId] = useState(null);
  const [editCityId, setEditCityId] = useState(null);
  const [editCityName, setEditCityName] = useState("");
  const [courseTypeName, setCourseTypeName] = useState("");
  const [courseTypeDescription, setCourseTypeDescription] = useState("");
  const [courseTypes, setCourseTypes] = useState([]);
  const [editCourseTypeId, setEditCourseTypeId] = useState(null);
  const [editCourseTypeName, setEditCourseTypeName] = useState("");
  const [editCourseTypeDescription, setEditCourseTypeDescription] = useState("");

  useEffect(() => {
    getRatePerHour();
    getCoursesSettings();
  }, []);

  const getRatePerHour = async () => {
    props.loader(true);
    Api("get", "setting/getSetting", router).then(
      (res) => {
        props.loader(false);
        setRatePerHour(res?.data?.per_hour_hour);
        // setCourseVat(res?.data?.course_vat ?? "");
        setsettingId(res?.data?._id);
      },
      (err) => {
        props.loader(false);
        toast.error(err?.message || "Something went Wrong");
      }
    );
  };

  const getCoursesSettings = async () => {
    Api("get", "courseSetting/getCoursesSettings", router).then(
      (res) => {
        setCities(res?.data?.city || []);
        setCourseTypes(res?.data?.course_types || []);
        setCourseSettingId(res?.data?._id || null);
      },
      (err) => {
        if (err?.status !== 404) {
          toast.error(err?.message || "Failed to load settings");
        }
      }
    );
  };

  const updateRatePerHour = async () => {
    props.loader(true);
    const body = { per_hour_hour: ratePerHour };
    let url = "setting/createSetting";
    if (settingId) {
      url = "setting/updateSetting";
      body.id = settingId;
    }
    Api("post", url, body, router).then(
      () => {
        props.loader(false);
        getRatePerHour();
        toast.success("Rate updated successfully");
      },
      (err) => {
        props.loader(false);
        toast.error(err?.message || "Something went Wrong");
      }
    );
  };

  const updateCourseVat = async () => {
    props.loader(true);
    const body = { course_vat: Number(courseVat) };
    let url = "setting/createSetting";
    if (settingId) {
      url = "setting/updateSetting";
      body.id = settingId;
    }
    Api("post", url, body, router).then(
      (res) => {
        props.loader(false);
        setCourseVat(res?.data?.course_vat ?? courseVat);
        setsettingId(res?.data?._id || settingId);
        toast.success("Course VAT updated successfully");
      },
      (err) => {
        props.loader(false);
        toast.error(err?.message || "Something went Wrong");
      }
    );
  };

  const addCity = async () => {
    if (!cityName.trim()) {
      toast.error("Please enter a city name");
      return;
    }
    props.loader(true);
    Api("post", "courseSetting/addCityInCourseSetting", { cityName: cityName.trim() }, router).then(
      (res) => {
        props.loader(false);
        setCityName("");
        setCities(res?.data?.city || []);
        setCourseSettingId(res?.data?._id || courseSettingId);
        toast.success("City added successfully");
      },
      (err) => {
        props.loader(false);
        toast.error(err?.message || "Failed to add city");
      }
    );
  };

  const startEditCity = (city) => {
    setEditCityId(city._id);
    setEditCityName(city.name);
  };

  const cancelEdit = () => {
    setEditCityId(null);
    setEditCityName("");
  };

  const saveEditCity = async (cityId) => {
    if (!editCityName.trim()) {
      toast.error("City name cannot be empty");
      return;
    }
    props.loader(true);
    Api("post", "courseSetting/updateCityInCourseSetting", { cityId, cityName: editCityName.trim() }, router).then(
      (res) => {
        props.loader(false);
        setCities(res?.data?.city || []);
        setEditCityId(null);
        setEditCityName("");
        toast.success("City updated successfully");
      },
      (err) => {
        props.loader(false);
        toast.error(err?.message || "Failed to update city");
      }
    );
  };

  const deleteCity = (cityId) => {
    Swal.fire({
      text: "Are you sure? Do you really want to delete this city?",
      showCancelButton: true,
      confirmButtonColor: "#0ea5e9",
      cancelButtonColor: "#d33",
      width: "360px",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        props.loader(true);
        Api("post", "courseSetting/deleteCityInCourseSetting", { cityId }, router).then(
          (res) => {
            props.loader(false);
            setCities(res?.data?.city || []);
            toast.success("City deleted successfully");
          },
          (err) => {
            props.loader(false);
            toast.error(err?.message || "Failed to delete city");
          }
        );
      }
    });
  };

  const addCourseType = async () => {
    if (!courseTypeName.trim()) {
      toast.error("Please enter a course type name");
      return;
    }
    if (!courseTypeDescription.trim()) {
      toast.error("Please enter a description");
      return;
    }
    props.loader(true);
    Api("post", "courseSetting/addCourseTypeInCourseSetting", {
      courseTypeName: courseTypeName.trim(),
      courseTypeDescription: courseTypeDescription.trim(),
    }, router).then(
      (res) => {
        props.loader(false);
        setCourseTypeName("");
        setCourseTypeDescription("");
        setCourseTypes(res?.data?.course_types || []);
        setCourseSettingId(res?.data?._id || courseSettingId);
        toast.success("Course type added successfully");
      },
      (err) => {
        props.loader(false);
        toast.error(err?.message || "Failed to add course type");
      }
    );
  };

  const startEditCourseType = (ct) => {
    setEditCourseTypeId(ct._id);
    setEditCourseTypeName(ct.name);
    setEditCourseTypeDescription(ct.description || "");
  };

  const cancelEditCourseType = () => {
    setEditCourseTypeId(null);
    setEditCourseTypeName("");
    setEditCourseTypeDescription("");
  };

  const saveEditCourseType = async (courseTypeId) => {
    if (!editCourseTypeName.trim()) {
      toast.error("Course type name cannot be empty");
      return;
    }
    props.loader(true);
    Api("post", "courseSetting/updateCourseTypeInCourseSetting", {
      courseTypeId,
      courseTypeName: editCourseTypeName.trim(),
      courseTypeDescription: editCourseTypeDescription.trim(),
    }, router).then(
      (res) => {
        props.loader(false);
        setCourseTypes(res?.data?.course_types || []);
        setEditCourseTypeId(null);
        setEditCourseTypeName("");
        setEditCourseTypeDescription("");
        toast.success("Course type updated successfully");
      },
      (err) => {
        props.loader(false);
        toast.error(err?.message || "Failed to update course type");
      }
    );
  };

  const deleteCourseType = (courseTypeId) => {
    Swal.fire({
      text: "Are you sure? Do you really want to delete this course type?",
      showCancelButton: true,
      confirmButtonColor: "#0ea5e9",
      cancelButtonColor: "#d33",
      width: "360px",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        props.loader(true);
        Api("post", "courseSetting/deleteCourseTypeInCourseSetting", { courseTypeId }, router).then(
          (res) => {
            props.loader(false);
            setCourseTypes(res?.data?.course_types || []);
            toast.success("Course type deleted successfully");
          },
          (err) => {
            props.loader(false);
            toast.error(err?.message || "Failed to delete course type");
          }
        );
      }
    });
  };

  const toggleCourseTypePaid = async (courseTypeId, isPaid) => {
    setCourseTypes((prev) =>
      prev.map((ct) => (ct._id === courseTypeId ? { ...ct, isPaid } : ct))
    );
    Api("post", "courseSetting/toggleCourseTypePaidStatus", { courseTypeId, isPaid }, router).then(
      (res) => {
        setCourseTypes(res?.data?.course_types || []);
      },
      (err) => {
        setCourseTypes((prev) =>
          prev.map((ct) => (ct._id === courseTypeId ? { ...ct, isPaid: !isPaid } : ct))
        );
        toast.error(err?.message || "Failed to update paid status");
      }
    );
  };

  return (
    <div className="w-full h-full bg-transparent mt-5 md:px-8 px-4">
        <div>
          <div className="text-lg font-semibold text-gray-900 cursor-pointer mb-[10px]">
            Instructer Rate Per Hour
          </div>
          <div className="flex flex-row">
            <div className="border border-gray-200 rounded-xl p-1 hover:border-green-300 transition-colors w-full flex items-center">
              <div className="flex items-center justify-center w-full">
                <input
                  type="number"
                  name="rate"
                  value={ratePerHour}
                  placeholder="Rate Per Hour"
                  required
                  onChange={(e) => setRatePerHour(e.target.value)}
                  className="w-full h-5 text-black outline-none rounded"
                />
              </div>
            </div>
            <div className="flex justify-center w-100">
              <button
                className="flex items-center px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                onClick={() => updateRatePerHour()}
              >
                <Save className="w-5 h-5 mr-2" />
                Update Rate Per Hour
              </button>
            </div>
          </div>
        </div>

      {/* <div className="mt-8">
        <div className="text-lg font-semibold text-gray-900 cursor-pointer mb-[10px]">
          Course VAT (%)
        </div>
        <div className="flex flex-row">
          <div className="border border-gray-200 rounded-xl p-1 hover:border-green-300 transition-colors w-full flex items-center">
            <div className="flex items-center justify-center w-full">
              <input
                type="number"
                min="0"
                max="100"
                name="courseVat"
                value={courseVat}
                placeholder="Course VAT %"
                onChange={(e) => setCourseVat(e.target.value)}
                className="w-full h-5 text-black outline-none rounded"
              />
            </div>
          </div>
          <div className="flex justify-center w-100">
            <button
              className="flex items-center px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              onClick={() => updateCourseVat()}
            >
              <Save className="w-5 h-5 mr-2" />
              Update Course VAT
            </button>
          </div>
        </div>
      </div> */}

      <div className="mt-8">
        <div className="text-lg font-semibold text-gray-900 mb-[10px]">
          City
        </div>
        <div className="flex gap-2 mb-4">
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
            placeholder="Enter city name"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCity()}
          />
          <button
            className="flex items-center px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
            onClick={addCity}
          >
            <Save className="w-5 h-5 mr-2" />
            Add City
          </button>
        </div>

        {cities.length > 0 && (
          <div className="md:grid grid-cols-2 gap-4">
            {cities.map((city, index) => (
              <div
                key={city._id}
                className={`flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl overflow-hidden  ${
                  index !== cities.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                {editCityId === city._id ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      className="flex-1 px-3 py-1.5 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                      value={editCityName}
                      onChange={(e) => setEditCityName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEditCity(city._id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      autoFocus
                    />
                    <button
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      onClick={() => saveEditCity(city._id)}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={cancelEdit}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-gray-800">{city.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => startEditCity(city)}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => deleteCity(city._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {cities.length === 0 && (
          <p className="text-gray-400 text-sm mt-2">No cities added yet.</p>
        )}
      </div>

      <div className="mt-8">
        <div className="text-lg font-semibold text-gray-900 mb-[10px]">
          Course
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex gap-2">
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
              placeholder="Enter course type name"
              value={courseTypeName}
              onChange={(e) => setCourseTypeName(e.target.value)}
            />
            <button
              className="flex items-center px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
              onClick={addCourseType}
            >
              <Save className="w-5 h-5 mr-2" />
              Add Type
            </button>
          </div>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
            placeholder="Enter description"
            value={courseTypeDescription}
            onChange={(e) => setCourseTypeDescription(e.target.value)}
          />
        </div>

        {courseTypes.length > 0 && (
          <div className="md:grid grid-cols-2 gap-4">
            {courseTypes.map((ct, index) => (
              <div
                key={ct._id}
                className={`flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl overflow-hidden ${
                  index !== courseTypes.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                {editCourseTypeId === ct._id ? (
                  <div className="flex items-start gap-2 w-full">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <input
                        className="w-full px-3 py-1.5 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                        value={editCourseTypeName}
                        onChange={(e) => setEditCourseTypeName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEditCourseType(ct._id);
                          if (e.key === "Escape") cancelEditCourseType();
                        }}
                        autoFocus
                        placeholder="Course type name"
                      />
                      <input
                        className="w-full px-3 py-1.5 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                        value={editCourseTypeDescription}
                        onChange={(e) => setEditCourseTypeDescription(e.target.value)}
                        placeholder="Description (optional)"
                      />
                    </div>
                    <div className="flex items-center gap-1 pt-1">
                      <button
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        onClick={() => saveEditCourseType(ct._id)}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={cancelEditCourseType}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <span className="text-gray-800">{ct.name}</span>
                      {ct.description ? <p className="text-xs text-gray-500 mt-0.5">{ct.description}</p> : null}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleCourseTypePaid(ct._id, !ct.isPaid)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                            ct.isPaid ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                              ct.isPaid ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span className={`text-xs font-medium w-6 ${ct.isPaid ? "text-green-600" : "text-gray-400"}`}>
                          {ct.isPaid ? "Paid" : "Free"}
                        </span>
                      </div>
                      <button
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => startEditCourseType(ct)}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => deleteCourseType(ct._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {courseTypes.length === 0 && (
          <p className="text-gray-400 text-sm mt-2">No course types added yet.</p>
        )}
      </div>
    </div>
  );
}

export default isAuth(instructors);
