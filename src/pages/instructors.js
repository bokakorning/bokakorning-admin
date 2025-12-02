import React, { useMemo, useState, useEffect, useContext } from "react";
import Table from "../../components/table";
import { Api, ApiFormData } from "@/services/service";
import { useRouter } from "next/router";
import { userContext } from "./_app";
import isAuth from "../../components/isAuth";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Users } from "lucide-react";
import moment from "moment";
import constant from "@/services/constant";

function instructors(props) {
  const router = useRouter();
  const [instructorList, setInstructorList] = useState([]);
  const [user, setUser] = useContext(userContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [themeData, setThemeData] = useState([]);
  const [open, setOpen] = useState(false)
  const [popupData, setPopupData] = useState([])
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 4,
  });

  useEffect(() => {
    getProduct(currentPage);
  }, [user, currentPage]);

  const getProduct = async (page = 1, limit = 10) => {
    props.loader(true);
    let url = `auth/getUser?type=instructer&page=${page}&limit=${limit}`;
    Api("get", url, router).then(
      (res) => {
        props.loader(false);
        console.log("abcd", res?.data);
        const data = res?.data;
        setInstructorList(data?.users);
        setPagination(data?.pagination);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        toast.error(err?.message || "Something went Wrong")
      }
    );
  };

  const students = [
    {
      studentId: "IN-502",
      name: "Jonas",
      email: "jonas@email.com",
      phone: "+46 73 123 45 67",
      CreatedAt: "12th, August 2025",
      Document: "✅",
      Availability: "Online",
      TotalLessons: 15,
      Completed: 12,
      Upcoming: "20 Aug, 14:00",
      Rating: "★★★★★",
    },
    {
      studentId: "IN-503",
      name: "Ron",
      email: "ron@email.com",
      phone: "+46 12 562 23 97",
      CreatedAt: "9th, August 2025",
      Document: "✅",
      Availability: "Offline",
      TotalLessons: 8,
      Completed: 5,
      Upcoming: "20 Aug, 12:00",
      Rating: "★★★★★",
    },
  ];

  const StudentId = ({ value }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{value || "N/A"}</p>
      </div>
    );
  };

  const StudentName = ({ value }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{value || "N/A"}</p>
      </div>
    );
  };

  const Email = ({ value }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{value || "N/A"}</p>
      </div>
    );
  };

  const phone = ({ value }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{value}</p>
      </div>
    );
  };

  const Document = ({ row }) => {
    const value = row.original.doc ? "✅" : "❌";
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{value}</p>
      </div>
    );
  };

  const Registered = ({ value }) => {
    const date = value
      ? moment(value).format("DD/MM/YYYY")
      : "N/A";

    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{date}</p>
      </div>
    );
  };

  const Availability = ({ row }) => (
    <div className="p-4 flex flex-col items-center justify-center">
      <p className="text-black text-base font-normal">
        {row?.original?.available ? "Yes" : "No"}
      </p>
    </div>
  );


  const TotalLessons = ({ value }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{value}</p>
      </div>
    );
  };

  const Completed = ({ value }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{value}</p>
      </div>
    );
  };

  const RatePerHour = ({ row }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [rate, setRate] = useState(row?.original?.rate_per_hour || "");

    const handleSave = async () => {
      try {
        const res = await Api(
          "post",
          "auth/updateInstRate",
          { instructer_id: row?.original?._id, rate_per_hour: rate },
          router
        );

        if (res?.status) {
          setIsOpen(false);
          getProduct(currentPage);
          toast.success("Rate updated successfully");
        }
      } catch (err) {
        console.error("Error updating rate:", err);
        toast.error("Failed to update rate");
      }
    };


    return (
      <div className="p-4 flex flex-col items-center justify-center">
        {row?.original?.rate_per_hour ? (
          <p className="text-black text-base font-normal">
            {constant?.currency} {row.original.rate_per_hour}
          </p>
        ) : (
          <>
            <button
              onClick={() => setIsOpen(true)}
              className="px-3 py-2  text-white cursor-pointer rounded-md bg-custom-sky"
            >
              Set Rate
            </button>

            {/* Modal */}
            {isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-96 mx-4 p-6 transform transition-all duration-300 scale-100">

                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Set Rate per Hour</h2>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-200"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Input Section */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hourly Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-200"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 font-medium">{constant?.currency}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Enter the hourly rate in {constant?.currency}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 cursor-pointer font-medium transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 px-4 py-3 bg-sky-400 text-white rounded-xl hover:bg-sky-600 font-medium transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer transform hover:-translate-y-0.5"
                    >
                      Save Rate
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const actionHandler = ({ row }) => {
    return (
      <div className="flex  cursor-pointer text-black items-center justify-evenly py-2 rounded-[10px] mr-[10px]"
        onClick={() => {
          setPopupData(row.original)
          setOpen(true)
        }}
      >
        <button className="underline cursor-pointer"> View  </button>
        <FaEye />
      </div>
    );
  };

  const columns = useMemo(
    () => [

      {
        Header: "Name",
        accessor: "name",
        Cell: StudentName,
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: Email,
      },
      {
        Header: "Phone Number",
        accessor: "phone",
        Cell: phone,
      },
      {
        Header: "Registered On",
        accessor: "createdAt",
        Cell: Registered,
      },
      {
        Header: "Rate Per Hour",
        // accessor: "Document",
        Cell: RatePerHour,
      },
      {
        Header: "Availability",
        // accessor: "available",
        Cell: Availability,
      },
      // {
      //   Header: "TotalLessons",
      //   accessor: "TotalLessons",
      //   Cell: TotalLessons,
      // },
      // {
      //   Header: "Completed",
      //   accessor: "Completed",
      //   Cell: Completed,
      // },

      {
        Header: "ACTION",
        Cell: actionHandler,
      },
    ],
    [themeData]
  );

  console.log(open)
  return (
    <div className="w-full h-full bg-transparent mt-5 md:px-8 px-4">
      <div className=" h-full">
        <p className="text-black font-bold md:text-[46px] text-2xl cursor-pointer">
          <span className="w-2 h-8 bg-[#F38529] rounded "></span>
          Instructor
        </p>
        <div className="bg-white md:pb-22 px-1 rounded-[12px] h-full overflow-y-scroll scrollbar-hide overflow-scroll pb-14 mt-3">
          <div className="bg-[#CFE0E54D] px-4 min-h-screen rounded-[24px]">
            <p className="text-black text-[20px] pt-6">Instructor Details</p>
            <div className="-mt-4">
              {instructorList.length > 0 ? (
                <Table
                  columns={columns}
                  data={instructorList}
                  pagination={pagination}
                  onPageChange={(page) => setCurrentPage(page)}
                  currentPage={currentPage}
                  itemsPerPage={pagination?.itemsPerPage}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-10 min-h-[600px] text-gray-500">
                  <Users className="h-12 w-12 mb-2 text-gray-400" />
                  <p className="text-lg font-medium">No instructors found</p>
                  <p className="text-sm">Try adjusting filters or add new students.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {open && (
          <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl transform transition-all relative overflow-y-scroll scrollbar-hide overflow-scroll max-h-[90vh]">

              <div className="bg-gray-50 px-6 py-6 border-b border-gray-200">
                <div className="flex items-center justify-between relative">

                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img
                        src={popupData?.image || "/person.png"}
                        alt="Student Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{popupData?.name}</h2>
                      <p className="text-gray-600">{popupData?.email}</p>
                      <p className="text-gray-500 text-sm">{popupData?.phone}</p>
                    </div>
                  </div>
                  {/* <div className="text-right">
                    <p className="text-gray-600 text-sm">Date Of Birth: 01-01-1990</p>
                  </div> */}
                </div>
                <p
                  onClick={() => setOpen(false)}
                  className="text-black text-2xl absolute right-4 top-2"
                > <RxCross2 /></p>
              </div>


              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 divide ">

                  <div className="space-y-4">
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">About us:</span>
                      <span className="text-gray-600">{popupData.bio}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">Student Name:</span>
                      <span className="text-gray-600">{popupData.name}</span>
                    </div>

                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">Email:</span>
                      <span className="text-gray-600">{popupData.email}</span>
                    </div>

                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">Phone No:</span>
                      <span className="text-gray-600">{popupData.phone}</span>
                    </div>

                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">Registered On:</span>
                      <span className="text-gray-600">
                        {popupData?.createdAt ? moment(popupData?.createdAt).format("DD/MM/YYYY") : ""}
                      </span>
                    </div>

                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">Availability:</span>
                      <span className="text-gray-600">{popupData?.available ? "Yes" : "No"}</span>
                    </div>

                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">Vehicle Model:</span>
                      <span className="text-gray-600">{popupData.vehicle_model}</span>
                    </div>

                    {/* <div className="flex">
                      <span className="font-medium text-gray-700 w-32">Completed Lesson:</span>
                      <span className="text-gray-600">{popupData.Completed}</span>
                    </div>

                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">Upcoming:</span>
                      <span className="text-gray-600">12th, August 2025</span>
                    </div>

                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">Rating:</span>
                      <span className="text-yellow-500">★★★★★</span>
                    </div>  */}
                  </div>

                  <div className="flex flex-col justify-center">
                  </div>
                </div>
              </div>



            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default isAuth(instructors);
