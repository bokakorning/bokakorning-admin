import React, { useState, useEffect } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import isAuth from "../../components/isAuth";
import { toast } from "react-toastify";
import { Save, Pencil, Trash2, Check, X, Plus } from "lucide-react";
import Swal from "sweetalert2";

function ComboPackages(props) {
  const router = useRouter();
  const [packages, setPackages] = useState([]);

  // Add form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [drivingLessons, setDrivingLessons] = useState("");
  const [courseLessons, setCourseLessons] = useState("");

  // Edit state
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDriving, setEditDriving] = useState("");
  const [editCourse, setEditCourse] = useState("");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = () => {
    Api("get", "combo/getPackages?all=true", router).then(
      (res) => setPackages(res?.data || []),
      (err) => toast.error(err?.message || "Failed to load packages"),
    );
  };

  const addPackage = () => {
    if (!name.trim() || !price || !drivingLessons || !courseLessons) {
      toast.error("All fields are required");
      return;
    }
    props.loader(true);
    Api("post", "combo/createPackage", {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      driving_lessons: Number(drivingLessons),
      course_lessons: Number(courseLessons),
    }, router).then(
      (res) => {
        props.loader(false);
        setPackages((prev) => [...prev, res?.data]);
        setName(""); setDescription(""); setPrice(""); setDrivingLessons(""); setCourseLessons("");
        toast.success("Package created");
      },
      (err) => { props.loader(false); toast.error(err?.message || "Failed to create"); },
    );
  };

  const startEdit = (pkg) => {
    setEditId(pkg._id);
    setEditName(pkg.name);
    setEditDescription(pkg.description || "");
    setEditPrice(String(pkg.price));
    setEditDriving(String(pkg.driving_lessons));
    setEditCourse(String(pkg.course_lessons));
  };

  const cancelEdit = () => setEditId(null);

  const saveEdit = () => {
    if (!editName.trim() || !editPrice || !editDriving || !editCourse) {
      toast.error("All fields are required");
      return;
    }
    props.loader(true);
    Api("post", "combo/updatePackage", {
      id: editId,
      name: editName.trim(),
      description: editDescription.trim(),
      price: Number(editPrice),
      driving_lessons: Number(editDriving),
      course_lessons: Number(editCourse),
    }, router).then(
      (res) => {
        props.loader(false);
        setPackages((prev) => prev.map((p) => p._id === editId ? res?.data : p));
        setEditId(null);
        toast.success("Package updated");
      },
      (err) => { props.loader(false); toast.error(err?.message || "Failed to update"); },
    );
  };

  const toggleActive = (pkg) => {
    Api("post", "combo/togglePackageActive", { id: pkg._id, isActive: !pkg.isActive }, router).then(
      (res) => setPackages((prev) => prev.map((p) => p._id === pkg._id ? res?.data : p)),
      (err) => toast.error(err?.message || "Failed to toggle"),
    );
  };

  const deletePackage = (id) => {
    Swal.fire({
      text: "Delete this combo package?",
      showCancelButton: true,
      confirmButtonColor: "#0ea5e9",
      cancelButtonColor: "#d33",
      width: "360px",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (!result.isConfirmed) return;
      props.loader(true);
      Api("post", "combo/deletePackage", { id }, router).then(
        () => {
          props.loader(false);
          setPackages((prev) => prev.filter((p) => p._id !== id));
          toast.success("Package deleted");
        },
        (err) => { props.loader(false); toast.error(err?.message || "Failed to delete"); },
      );
    });
  };

  return (
    <div className="w-full h-full bg-transparent mt-5 md:px-8 px-4">
      <div className="text-xl font-semibold text-gray-900 mb-6">Combo Packages</div>

      {/* Add form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-8 shadow-sm">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">New Package</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <input
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none text-black"
            placeholder="Package name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none text-black"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            min="0"
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none text-black"
            placeholder="Price (SEK)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="number"
            min="0"
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none text-black"
            placeholder="Driving lessons included"
            value={drivingLessons}
            onChange={(e) => setDrivingLessons(e.target.value)}
          />
          <input
            type="number"
            min="0"
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none text-black"
            placeholder="Course lessons included"
            value={courseLessons}
            onChange={(e) => setCourseLessons(e.target.value)}
          />
        </div>
        <button
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          onClick={addPackage}
        >
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>

      {/* Package list */}
      {packages.length === 0 ? (
        <p className="text-gray-400 text-sm">No combo packages yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className={`bg-white rounded-2xl border p-5 shadow-sm ${pkg.isActive ? "border-gray-200" : "border-gray-100 opacity-60"}`}
            >
              {editId === pkg._id ? (
                <div className="space-y-2">
                  <input className="w-full px-3 py-2 border border-blue-400 rounded-lg text-sm outline-none text-black" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" autoFocus />
                  <input className="w-full px-3 py-2 border border-blue-400 rounded-lg text-sm outline-none text-black" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Description" />
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" className="px-3 py-2 border border-blue-400 rounded-lg text-sm outline-none text-black" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} placeholder="Price" />
                    <input type="number" className="px-3 py-2 border border-blue-400 rounded-lg text-sm outline-none text-black" value={editDriving} onChange={(e) => setEditDriving(e.target.value)} placeholder="Driving" />
                    <input type="number" className="px-3 py-2 border border-blue-400 rounded-lg text-sm outline-none text-black" value={editCourse} onChange={(e) => setEditCourse(e.target.value)} placeholder="Course" />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={saveEdit} className="flex items-center gap-1 px-4 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                      <Check className="w-3.5 h-3.5" /> Save
                    </button>
                    <button onClick={cancelEdit} className="flex items-center gap-1 px-4 py-1.5 border border-gray-300 text-sm text-gray-600 rounded-lg hover:bg-gray-50">
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                      {pkg.description ? <p className="text-xs text-gray-500 mt-0.5">{pkg.description}</p> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleActive(pkg)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${pkg.isActive ? "bg-green-500" : "bg-gray-300"}`}>
                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform ${pkg.isActive ? "translate-x-5" : "translate-x-1"}`} />
                      </button>
                      <button onClick={() => startEdit(pkg)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deletePackage(pkg._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-blue-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-blue-500 font-medium">PRICE</p>
                      <p className="text-lg font-bold text-blue-700">SEK {pkg.price}</p>
                    </div>
                    <div className="flex-1 bg-purple-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-purple-500 font-medium">DRIVING</p>
                      <p className="text-lg font-bold text-purple-700">{pkg.driving_lessons} lessons</p>
                    </div>
                    <div className="flex-1 bg-teal-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-teal-500 font-medium">COURSE</p>
                      <p className="text-lg font-bold text-teal-700">{pkg.course_lessons} lessons</p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pkg.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {pkg.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default isAuth(ComboPackages);
