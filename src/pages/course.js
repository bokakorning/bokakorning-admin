import React, { useState, useEffect } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import isAuth from "../../components/isAuth";
import { toast } from "react-toastify";
import { Save, Pencil, Trash2, X } from "lucide-react";
import { MultiSelect } from "react-multi-select-component";
import Swal from "sweetalert2";

function Course(props) {
  const router = useRouter();
  const [courseTypes, setCourseTypes] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [courses, setCourses] = useState([]);

  const [name, setName] = useState("");
  const [selectedCourseType, setSelectedCourseType] = useState("");
  const [date, setDate] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [availableSlot, setAvailableSlot] = useState("");
  const [price, setPrice] = useState("");
  const [language, setLanguage] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchSettings();
    fetchCourses();
  }, []);

  // Single call fetches both course types and cities from CoursesSettings
  const fetchSettings = () => {
    Api("get", "courseSetting/getCoursesSettings", router).then(
      (res) => {
        setCourseTypes(res?.data?.course_types || []);
        const cities = res?.data?.city || [];
        setCityOptions(cities.map((c) => ({ label: c.name, value: c._id })));
      },
      () => {}
    );
  };

  const fetchCourses = () => {
    props.loader(true);
    Api("get", "courses/getCourses", router).then(
      (res) => {
        props.loader(false);
        setCourses(res?.data || []);
      },
      (err) => {
        props.loader(false);
        toast.error(err?.message || "Failed to load courses");
      }
    );
  };

  const resetForm = () => {
    setName("");
    setSelectedCourseType("");
    setDate("");
    setTimeFrom("");
    setTimeTo("");
    setAvailableSlot("");
    setPrice("");
    setLanguage("");
    setSelectedCities([]);
    setEditId(null);
  };

  const saveCourse = () => {
    if (!name.trim() || !selectedCourseType || !date || !timeFrom || !timeTo || !availableSlot || !language) {
      toast.error("Please fill all fields");
      return;
    }
    props.loader(true);
    const body = {
      name: name.trim(),
      course_types: selectedCourseType,
      date,
      time_from: timeFrom,
      time_to: timeTo,
      available_slot: Number(availableSlot),
      price: Number(price),
      language,
      city: selectedCities.map((c) => c.value),
    };
    if (editId) body.id = editId;

    Api("post", editId ? "courses/updateCourse" : "courses/createCourse", body, router).then(
      () => {
        props.loader(false);
        resetForm();
        fetchCourses();
        toast.success(editId ? "Course updated successfully" : "Course created successfully");
      },
      (err) => {
        props.loader(false);
        toast.error(err?.message || "Failed to save course");
      }
    );
  };

  const startEdit = (course) => {
    setEditId(course._id);
    setName(course.name || "");
    setSelectedCourseType(course.course_types || "");
    setDate(course.date ? course.date.slice(0, 10) : "");
    setTimeFrom(course.time_from || "");
    setTimeTo(course.time_to || "");
    setAvailableSlot(course.available_slot ?? "");
    setPrice(course.price ?? "");
    setLanguage(course.language || "");
    // Re-hydrate selected cities from stored IDs against current city options
    const saved = (course.city || []).map((id) => {
      const match = cityOptions.find((o) => o.value === id);
      return match || { label: id, value: id };
    });
    setSelectedCities(saved);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCourseTypeName = (typeId) =>
    courseTypes.find((ct) => ct._id === typeId)?.name || typeId;

  const getCityName = (cityId) =>
    cityOptions.find((o) => o.value === cityId)?.label || cityId;

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const deleteCourse = (id) => {
    Swal.fire({
      text: "Are you sure? Do you really want to delete this course?",
      showCancelButton: true,
      confirmButtonColor: "#0ea5e9",
      cancelButtonColor: "#d33",
      width: "360px",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        props.loader(true);
        Api("post", "courses/deleteCourse", { id }, router).then(
          () => {
            props.loader(false);
            fetchCourses();
            toast.success("Course deleted successfully");
          },
          (err) => {
            props.loader(false);
            toast.error(err?.message || "Failed to delete course");
          }
        );
      }
    });
  };

  return (
    <div className="w-full h-full bg-transparent mt-5 md:px-8 px-4">
      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="text-lg font-semibold text-gray-900 mb-4">
          {editId ? "Edit Course" : "Add Course"}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
              placeholder="Enter course name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Type</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black bg-white"
              value={selectedCourseType}
              onChange={(e) => setSelectedCourseType(e.target.value)}
            >
              <option value="">Select course type</option>
              {courseTypes.map((ct) => (
                <option key={ct._id} value={ct._id}>
                  {ct.name} {ct.isPaid ? "(Paid)" : "(Free)"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
              value={date}
              min={getTodayDate()}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="time"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
              value={timeFrom}
              onChange={(e) => setTimeFrom(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              type="time"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
              value={timeTo}
              onChange={(e) => setTimeTo(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available Slots</label>
            <input
              type="number"
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
              placeholder="Enter number of slots"
              value={availableSlot}
              onChange={(e) => setAvailableSlot(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black bg-white"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="">Select language</option>
              <option value="en">English</option>
              <option value="sv">Swedish</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <MultiSelect
              options={cityOptions}
              value={selectedCities}
              onChange={setSelectedCities}
              labelledBy="Select cities"
              hasSelectAll={true}
              disableSearch={false}
              className="multi-select-city"
              overrideStrings={{
                selectSomeItems: "Select cities...",
                allItemsAreSelected: "All cities selected",
                selectAll: "Select All",
                search: "Search cities",
              }}
            />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button
            className="flex items-center px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            onClick={saveCourse}
          >
            <Save className="w-5 h-5 mr-2" />
            {editId ? "Update Course" : "Add Course"}
          </button>
          {editId && (
            <button
              className="flex items-center px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              onClick={resetForm}
            >
              <X className="w-5 h-5 mr-2" />
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="text-lg font-semibold text-gray-900 mb-4">Courses</div>
      {courses.length === 0 ? (
        <p className="text-gray-400 text-sm">No courses added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div key={course._id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{course.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-gray-500">
                      {getCourseTypeName(course.course_types)}
                    </span>
                    {course.language && (
                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                        {course.language === "en" ? "English" : "Swedish"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => startEdit(course)}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={() => deleteCourse(course._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Date: </span>
                  {course.date ? new Date(course.date).toLocaleDateString() : "-"}
                </div>
                <div>
                  <span className="font-medium">Slots: </span>
                  {course.available_slot ?? "-"}
                </div>
                <div>
                  <span className="font-medium">Start: </span>
                  {course.time_from || "-"}
                </div>
                <div>
                  <span className="font-medium">End: </span>
                  {course.time_to || "-"}
                </div>
                <div>
                  <span className="font-medium">Price: </span>
                  {course.price != null ? course.price : "-"}
                </div>
              </div>
              {course.city?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {course.city.map((cityId) => (
                    <span
                      key={cityId}
                      className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                    >
                      {getCityName(cityId)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        .multi-select-city .dropdown-container {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          min-height: 50px;
        }
        .multi-select-city .dropdown-container:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
        }
        .multi-select-city .dropdown-heading {
          height: 50px;
          padding: 0 16px;
          color: #111827;
        }
        /* Selected value text and placeholder */
        .multi-select-city .dropdown-heading-value span,
        .multi-select-city .dropdown-heading-value {
          color: #111827 !important;
        }
        /* Grey placeholder when nothing selected */
        .multi-select-city .gray {
          color: #111827 !important;
        }
        /* Search input */
        .multi-select-city .search input {
          color: #111827 !important;
        }
        .multi-select-city .search input::placeholder {
          color: #6b7280 !important;
        }
        /* Dropdown panel */
        .multi-select-city .dropdown-content {
          z-index: 50;
        }
        /* Each option label */
        .multi-select-city .option {
          color: #111827 !important;
        }
        .multi-select-city .option label {
          color: #111827 !important;
        }
        /* Select-all row */
        .multi-select-city .select-item {
          color: #111827 !important;
        }
        .multi-select-city .select-item span {
          color: #111827 !important;
        }
      `}</style>
    </div>
  );
}

export default isAuth(Course);
