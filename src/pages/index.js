import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  Bell,
  Eye,
  User,
  PlusCircle,
  PlusIcon,
} from "lucide-react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";

const Dashboard = (props) => {
  const [Dashboard, setDashboard] = useState({});
  const [lastWeekBooking, setLastWeekBooking] = useState([]);
  const [lastWeekUser, setLastWeekUser] = useState([]);
  const [instruter, setInstructor] = useState([]);
  const [instructorList, setInstructorList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getDashBoardDetails();
    getBookingLastWeek();
    getUserLastWeek();
    getBookings();
    getInstaruterLastWeek();
  }, []);

  const getBookings = async () => {
    props.loader(true);
    let url = `booking/getAllBookings?page=1&limit=4`;
    Api("get", url, router).then(
      (res) => {
        props.loader(false);
        console.log("abcd", res?.data);
        const data = res?.data;
        setInstructorList(data.data);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        toast.error(err?.message || "Something went Wrong");
      }
    );
  };

  const getDashBoardDetails = async () => {
    props.loader(true);
    let url = `admindashboard/totalnumberdata`;
    Api("get", url, router).then(
      (res) => {
        props.loader(false);
        console.log("abcd", res?.data);
        setDashboard(res.data);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        toast.error(err?.message || "Something went Wrong");
      }
    );
  };

  const formatWeeklyBookings = (data) => {
    return data.map((item) => ({
      date: item._id, // X-axis
      total: item.total, // Y-axis
    }));
  };

  const getBookingLastWeek = async () => {
    props.loader(true);
    let url = `admindashboard/lastweekbookings`;
    Api("get", url, router).then(
      (res) => {
        props.loader(false);
        console.log("abcd", res?.data);
        const formatted = formatWeeklyBookings(res.data);
        setLastWeekBooking(formatted);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        toast.error(err?.message || "Something went Wrong");
      }
    );
  };

  const getUserLastWeek = async () => {
    props.loader(true);
    let url = `admindashboard/lastweekusers?type=user`;
    Api("get", url, router).then(
      (res) => {
        props.loader(false);
        console.log("abcd", res?.data);
        const formatted = res?.data.map((item) => ({
          date: moment(item._id).format("DD MMM"), // e.g., 12 Jan
          total: item.total,
        }));
        setLastWeekUser(formatted);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        toast.error(err?.message || "Something went Wrong");
      }
    );
  };

  const getInstaruterLastWeek = async () => {
    props.loader(true);
    let url = `admindashboard/lastweekusers?type=instructer`;
    Api("get", url, router).then(
      (res) => {
        props.loader(false);
        console.log("abcd", res?.data);
        const formatted = res?.data.map((item) => ({
          date: moment(item._id).format("DD MMM"), // e.g., 12 Jan
          total: item.total,
        }));
        setInstructor(formatted);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        toast.error(err?.message || "Something went Wrong");
      }
    );
  };

  const statsCards = [
    {
      title: "Total Students",
      value: Dashboard?.user,
      icon: Users,
      color: "bg-blue-100",
    },
    {
      title: "Total Instructors",
      value: Dashboard?.instructer,
      icon: Users,
      color: "bg-blue-100",
    },
    {
      title: "Active Bookings",
      value: Dashboard?.activebooking,
      icon: Calendar,
      color: "bg-blue-100",
    },
    {
      title: "Completed Lessons",
      value: Dashboard?.completebooking,
      icon: CheckCircle,
      color: "bg-blue-100",
    },
    {
      title: "Cancelled Lessons",
      value: Dashboard?.cancelbooking,
      icon: XCircle,
      color: "bg-blue-100",
    },
  ];

  return (
    <div className="md:p-6 p-3 ">
      <div className="max-w-7xl mx-auto space-y-6 overflow-x-auto scrollbar-hide overflow-scroll  pb-32">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex justify-start gap-4">
            <button
              className="flex justify-center items-center gap-1 text-sm text-white
             bg-custom-blue px-3 py-3 rounded-xl cursor-pointer"
              onClick={() => router.push("/AddUser?type=user")}
            >
              <PlusIcon size={18} />
              Add Student
            </button>
            <button
              className="flex justify-center items-center gap-1 text-sm text-white
             bg-custom-blue px-3 py-3 rounded-xl cursor-pointer"
              onClick={() => router.push("/AddUser?type=instructer")}
            >
              <PlusIcon size={18} />
              Add Instruter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {statsCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className={`bg-[#4EB0CF4D] rounded-[20px] p-6 shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {card.value}
                    </p>
                  </div>
                  <IconComponent className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Bookings This Week
            </h3>

            <div className="h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lastWeekBooking} barSize={40}>
                  <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />

                  <XAxis dataKey="date" tick={{ fill: "#000", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#000", fontSize: 12 }} />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      color: "#000",
                    }}
                    cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  />

                  <Bar
                    dataKey="total"
                    fill="rgba(78, 176, 207, 0.30)"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            {/* USERS */}
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Last 7 Days Users
            </h3>

            <div className="h-[200px] mb-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lastWeekUser} barSize={40}>
                  <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />

                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />

                  <Bar
                    dataKey="total"
                    fill="rgba(78, 176, 207, 0.30)"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* INSTRUCTORS */}
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Last 7 Days Instructors
            </h3>

            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={instruter} barSize={40}>
                  <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />

                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />

                  <Bar
                    dataKey="total"
                    fill="rgba(78, 176, 207, 0.30)"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl md:p-6 p-3 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Upcoming Lessons
            </h3>
            <button
              className="flex items-center cursor-pointer text-sm text-gray-600 hover:text-gray-800"
              onClick={() => router.push("/bookings")}
            >
              <span className="mr-1 underline">View</span>
              <Eye className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            {instructorList.map((lesson, key) => (
              <div key={key} className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3 ">
                    <div>
                      <p className="text-xs text-gray-600">
                        {lesson?.user.name || "User"}
                      </p>
                      <div className="flex items-center space-x-2">
                        {/* <span className="text-xl">{lesson.studentAvatar}</span> */}
                        <img
                          src={lesson?.user?.image || "man.jpg"}
                          alt="no image"
                          className="w-12 h-12 object-cover rounded-full"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">
                        {lesson?.instructer?.name || "Instructer"}
                      </p>
                      <div className="flex items-center space-x-2">
                        <img
                          src={lesson?.instructer?.image || "man.jpg"}
                          alt="no image"
                          className="w-12 h-12 object-cover rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">
                      {moment(lesson.date).format("DD MMM YYYY")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {moment(lesson.date).format("dddd")} ·{" "}
                      {lesson.selectedTime}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
