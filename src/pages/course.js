import React, { useState, useEffect } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import isAuth from "../../components/isAuth";
import { toast } from "react-toastify";
import { Save, Pencil, Trash2, X, Plus, CircleCheck, Upload, Loader2 } from "lucide-react";
import { MultiSelect } from "react-multi-select-component";
import Swal from "sweetalert2";

function Course(props) {
  const router = useRouter();
  const [courseTypes, setCourseTypes] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [courses, setCourses] = useState([]);

  // Course fields
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

  // Questions state
  const [questions, setQuestions] = useState([]);
  const [qText, setQText] = useState("");
  const [qOptions, setQOptions] = useState(["", ""]);
  const [qCorrect, setQCorrect] = useState(null); // index of correct option
  const [editingQIndex, setEditingQIndex] = useState(null); // null = add mode

  // Enrolled users modal
  const [enrolledModal, setEnrolledModal] = useState({ open: false, users: [], courseName: "", loading: false });

  // Question media state
  const [qMediaUrl, setQMediaUrl] = useState(null);
  const [qMediaType, setQMediaType] = useState(null); // 'image' | 'video'
  const [qMediaPreview, setQMediaPreview] = useState(null);
  const [qMediaUploading, setQMediaUploading] = useState(false);

  const IMAGE_LIMIT = 100 * 1024;      // 100 KB
  const VIDEO_LIMIT = 3 * 1024 * 1024; // 3 MB

  useEffect(() => {
    fetchSettings();
    fetchCourses();
  }, []);

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

  const resetMediaState = () => {
    setQMediaUrl(null);
    setQMediaType(null);
    setQMediaPreview(null);
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
    setQuestions([]);
    setQText("");
    setQOptions(["", ""]);
    setQCorrect(null);
    setEditingQIndex(null);
    resetMediaState();
  };

  const handleMediaSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      toast.error("Only image and video files are allowed");
      e.target.value = "";
      return;
    }
    if (isImage && file.size > IMAGE_LIMIT) {
      toast.error(`Image must be under 100 KB (selected: ${Math.round(file.size / 1024)} KB)`);
      e.target.value = "";
      return;
    }
    if (isVideo && file.size > VIDEO_LIMIT) {
      toast.error(`Video must be under 3 MB (selected: ${Math.round(file.size / (1024 * 1024))} MB)`);
      e.target.value = "";
      return;
    }
    // Show local preview
    console.log('formdata')
    setQMediaPreview(URL.createObjectURL(file));
    setQMediaType(isImage ? "image" : "video");
    // Upload to S3
    setQMediaUploading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:3000/courses/uploadMedia", {
        method: "POST",
        headers: token ? { Authorization: `jwt ${token}` } : {},
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Upload failed");
        resetMediaState();
        e.target.value = "";
        return;
      }
      setQMediaUrl(json.data?.media_url);
      setQMediaType(json.data?.media_type);
    } catch {
      toast.error("Upload failed");
      resetMediaState();
    } finally {
      setQMediaUploading(false);
    }
  };

  // ── Question builder helpers ──────────────────────────────────────────────
  const updateOption = (idx, val) => {
    const next = [...qOptions];
    next[idx] = val;
    setQOptions(next);
    // If selected correct answer was this option, clear it
    if (qCorrect === idx && !val.trim()) setQCorrect(null);
  };

  const addOptionField = () => {
    if (qOptions.length >= 6) return;
    setQOptions([...qOptions, ""]);
  };

  const removeOptionField = (idx) => {
    if (qOptions.length <= 2) return;
    const next = qOptions.filter((_, i) => i !== idx);
    setQOptions(next);
    if (qCorrect === idx) setQCorrect(null);
    else if (qCorrect > idx) setQCorrect(qCorrect - 1);
  };

  const addQuestion = () => {
    if (!qText.trim()) { toast.error("Enter question text"); return; }
    const filled = qOptions.map((o) => o.trim()).filter(Boolean);
    if (filled.length < 2) { toast.error("Add at least 2 options"); return; }
    if (qCorrect === null || !qOptions[qCorrect]?.trim()) { toast.error("Select the correct answer"); return; }
    if (qMediaUploading) { toast.error("Please wait for media upload to finish"); return; }
    setQuestions((prev) => [
      ...prev,
      {
        question_text: qText.trim(),
        options: filled,
        correct_answer: qOptions[qCorrect].trim(),
        media_url: qMediaUrl || undefined,
        media_type: qMediaUrl ? qMediaType : null,
      },
    ]);
    setQText("");
    setQOptions(["", ""]);
    setQCorrect(null);
    resetMediaState();
  };

  const removeQuestion = (idx) => {
    if (editingQIndex === idx) cancelEditQuestion();
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
    setEditingQIndex((prev) => {
      if (prev === null || prev < idx) return prev;
      if (prev === idx) return null;
      return prev - 1;
    });
  };

  const startEditQuestion = (idx) => {
    const q = questions[idx];
    setQText(q.question_text);
    setQOptions(q.options.length >= 2 ? [...q.options] : [...q.options, ""]);
    const correctIdx = q.options.findIndex((o) => o === q.correct_answer);
    setQCorrect(correctIdx >= 0 ? correctIdx : null);
    setQMediaUrl(q.media_url || null);
    setQMediaType(q.media_type || null);
    setQMediaPreview(q.media_url || null);
    setEditingQIndex(idx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditQuestion = () => {
    setQText("");
    setQOptions(["", ""]);
    setQCorrect(null);
    setEditingQIndex(null);
    resetMediaState();
  };

  const updateQuestion = () => {
    if (!qText.trim()) { toast.error("Enter question text"); return; }
    const filled = qOptions.map((o) => o.trim()).filter(Boolean);
    if (filled.length < 2) { toast.error("Add at least 2 options"); return; }
    if (qCorrect === null || !qOptions[qCorrect]?.trim()) { toast.error("Select the correct answer"); return; }
    if (qMediaUploading) { toast.error("Please wait for media upload to finish"); return; }
    const updated = {
      question_text: qText.trim(),
      options: filled,
      correct_answer: qOptions[qCorrect].trim(),
      media_url: qMediaUrl || undefined,
      media_type: qMediaUrl ? qMediaType : null,
    };
    setQuestions((prev) => prev.map((q, i) => i === editingQIndex ? updated : q));
    setQText("");
    setQOptions(["", ""]);
    setQCorrect(null);
    setEditingQIndex(null);
    resetMediaState();
  };

  // ── Save course ───────────────────────────────────────────────────────────
  const saveCourse = () => {
    if (!name.trim() || !selectedCourseType || !date || !timeFrom || !timeTo || !availableSlot || !language) {
      toast.error("Please fill all required fields");
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
      questions,
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
    const saved = (course.city || []).map((id) => {
      const match = cityOptions.find((o) => o.value === id);
      return match || { label: id, value: id };
    });
    setSelectedCities(saved);
    setQuestions(
      (course.questions || []).map((q) => ({
        question_text: q.question_text,
        options: q.options || [],
        correct_answer: q.correct_answer,
        media_url: q.media_url || undefined,
        media_type: q.media_type || null,
      }))
    );
    setQText("");
    setQOptions(["", ""]);
    setQCorrect(null);
    resetMediaState();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCourseTypeName = (typeId) =>
    courseTypes.find((ct) => ct._id === typeId)?.name || typeId;

  const getCityName = (cityId) =>
    cityOptions.find((o) => o.value === cityId)?.label || cityId;

  const openEnrolledModal = (course) => {
    setEnrolledModal({ open: true, users: [], courseName: course.name, loading: true });
    Api("get", `courses/getEnrolledUsers?course_id=${course._id}`, router).then(
      (res) => setEnrolledModal((prev) => ({ ...prev, users: res?.data || [], loading: false })),
      () => setEnrolledModal((prev) => ({ ...prev, loading: false }))
    );
  };

  const getTodayDate = () => new Date().toISOString().split("T")[0];

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

  const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="w-full h-full bg-transparent mt-5 md:px-8 px-4">
      {/* ── Course Form ── */}
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

        {/* ── Questions Section ── */}
        <div className="mt-6 border-t border-gray-100 pt-5">
          <div className="text-base font-semibold text-gray-900 mb-4">Questions</div>

          {/* Question builder */}
          <div className={`border rounded-xl p-4 mb-4 ${editingQIndex !== null ? "bg-blue-50 border-blue-300" : "bg-gray-50 border-gray-200"}`}>
            {editingQIndex !== null && (
              <div className="flex items-center gap-2 mb-3 text-blue-700 text-sm font-semibold">
                <Pencil className="w-4 h-4" />
                Editing Q{editingQIndex + 1}
              </div>
            )}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black bg-white"
                placeholder="Enter question text"
                value={qText}
                onChange={(e) => setQText(e.target.value)}
              />
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options &nbsp;
              <span className="text-xs text-gray-400 font-normal">(select radio for correct answer)</span>
            </label>
            <div className="flex flex-col gap-2 mb-3">
              {qOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {/* Correct-answer radio */}
                  <input
                    type="radio"
                    name="correct_answer"
                    checked={qCorrect === idx}
                    onChange={() => setQCorrect(idx)}
                    className="accent-green-600 w-4 h-4 cursor-pointer flex-shrink-0"
                    title="Mark as correct answer"
                  />
                  <span className="text-xs font-semibold text-gray-500 w-5">{OPTION_LABELS[idx]}</span>
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black bg-white text-sm"
                    placeholder={`Option ${OPTION_LABELS[idx]}`}
                    value={opt}
                    onChange={(e) => updateOption(idx, e.target.value)}
                  />
                  {qOptions.length > 2 && (
                    <button
                      type="button"
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      onClick={() => removeOptionField(idx)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Media upload */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Media &nbsp;
                <span className="text-xs text-gray-400 font-normal">(optional · image ≤ 100 KB, video ≤ 3 MB)</span>
              </label>
              <label className={`flex items-center gap-2 px-3 py-2 w-fit border rounded-lg cursor-pointer transition-colors text-sm ${qMediaUploading ? "border-blue-300 bg-blue-50 text-blue-500" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}>
                {qMediaUploading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                  : <><Upload className="w-4 h-4" /> {qMediaUrl ? "Change media" : "Upload image / video"}</>
                }
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleMediaSelect}
                  disabled={qMediaUploading}
                />
              </label>

              {/* Preview */}
              {qMediaPreview && !qMediaUploading && (
                <div className="mt-2 relative inline-block">
                  {qMediaType === "image" ? (
                    <img src={qMediaPreview} alt="preview" className="h-24 rounded-lg object-cover border border-gray-200" />
                  ) : (
                    <video src={qMediaPreview} className="h-24 rounded-lg border border-gray-200" controls />
                  )}
                  <button
                    type="button"
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    onClick={() => { resetMediaState(); }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {qMediaUrl && <span className="block text-xs text-green-600 mt-1">✓ Uploaded</span>}
                </div>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {qOptions.length < 6 && (
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={addOptionField}
                >
                  <Plus className="w-4 h-4" /> Add Option
                </button>
              )}
              {editingQIndex !== null ? (
                <>
                  <button
                    type="button"
                    className="flex items-center gap-1 px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    onClick={updateQuestion}
                  >
                    <Save className="w-4 h-4" /> Update Question
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={cancelEditQuestion}
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="flex items-center gap-1 px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  onClick={addQuestion}
                >
                  <Plus className="w-4 h-4" /> Add Question
                </button>
              )}
            </div>
          </div>

          {/* Added questions list */}
          {questions.length > 0 && (
            <div className="flex flex-col gap-3">
              {questions.map((q, qi) => (
                <div key={qi} className={`border rounded-xl p-4 ${editingQIndex === qi ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-white"}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-800">
                      Q{qi + 1}. {q.question_text}
                    </span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        className="p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        onClick={() => startEditQuestion(qi)}
                        title="Edit question"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        onClick={() => removeQuestion(qi)}
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {q.media_url && (
                    <div className="mb-2">
                      {q.media_type === "image" ? (
                        <img src={q.media_url} alt="question media" className="h-20 rounded-lg object-cover border border-gray-200" />
                      ) : (
                        <video src={q.media_url} className="h-20 rounded-lg border border-gray-200" controls />
                      )}
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    {q.options.map((opt, oi) => {
                      const isCorrect = opt === q.correct_answer;
                      return (
                        <div key={oi} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${isCorrect ? "bg-green-50 border border-green-200 text-green-800" : "text-gray-600"}`}>
                          {isCorrect
                            ? <CircleCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                            : <span className="w-4 h-4 flex-shrink-0 inline-flex items-center justify-center rounded-full border border-gray-300 text-xs text-gray-400">{OPTION_LABELS[oi]}</span>
                          }
                          {opt}
                          {isCorrect && <span className="ml-auto text-xs font-medium text-green-600">Correct</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
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

      {/* ── Courses List ── */}
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
                    {course.questions?.length > 0 && (
                      <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full">
                        {course.questions.length} Q
                      </span>
                    )}
                    <button
                      type="button"
                      className="text-xs px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full hover:bg-teal-100 transition-colors"
                      onClick={() => openEnrolledModal(course)}
                    >
                      👥 {course.enrolled_user?.length || 0} Enrolled
                    </button>
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

      {/* ── Enrolled Users Modal ── */}
      {enrolledModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400 font-medium">Enrolled Users</p>
                <p className="text-sm font-semibold text-gray-900 leading-tight">{enrolledModal.courseName}</p>
              </div>
              <button
                type="button"
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setEnrolledModal({ open: false, users: [], courseName: "", loading: false })}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-5 py-3">
              {enrolledModal.loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
                </div>
              ) : enrolledModal.users.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-10">No users enrolled yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {enrolledModal.users.map((u, i) => (
                    <div key={u._id || i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      {u.image ? (
                        <img src={u.image} alt={u.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-teal-700 text-sm font-semibold">{u.name?.[0]?.toUpperCase() || "?"}</span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{u.name || "—"}</p>
                        <p className="text-xs text-gray-500 truncate">{u.email || u.phone || "—"}</p>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">#{i + 1}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {!enrolledModal.loading && enrolledModal.users.length > 0 && (
              <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400 text-right">
                {enrolledModal.users.length} user{enrolledModal.users.length !== 1 ? "s" : ""} enrolled
              </div>
            )}
          </div>
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
        .multi-select-city .dropdown-heading-value span,
        .multi-select-city .dropdown-heading-value {
          color: #111827 !important;
        }
        .multi-select-city .gray { color: #111827 !important; }
        .multi-select-city .search input { color: #111827 !important; }
        .multi-select-city .search input::placeholder { color: #6b7280 !important; }
        .multi-select-city .dropdown-content { z-index: 50; }
        .multi-select-city .option { color: #111827 !important; }
        .multi-select-city .option label { color: #111827 !important; }
        .multi-select-city .select-item { color: #111827 !important; }
        .multi-select-city .select-item span { color: #111827 !important; }
      `}</style>
    </div>
  );
}

export default isAuth(Course);
