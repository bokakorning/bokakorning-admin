import React, { useMemo, useState, useEffect, useContext } from "react";
import Table from "../../components/table";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { userContext } from "./_app";
import isAuth from "../../components/isAuth";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { PlusIcon, Users } from "lucide-react";
import moment from "moment";

function students(props) {
  const router = useRouter();
  const [studentList, setStudentList] = useState([]);
  const [user, setUser] = useContext(userContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [themeData, setThemeData] = useState([]);
  const [open, setOpen] = useState(false);
  const [popupData, setPopupData] = useState([]);
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
    let url = `auth/getUser?type=user&page=${page}&limit=${limit}`;
    Api("get", url, router).then(
      (res) => {
        props.loader(false);
        const data = res.data;
        setStudentList(data?.users);
        setPagination(data?.pagination);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        toast.error(err?.message || "Something went Wrong");
      }
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

  const Status = ({ value }) => {
    let display = "";

    if (value === "Pending") {
      display = "Pending";
    } else if (value === "Approved") {
      display = "Approved";
    } else if (value === "Rejected") {
      display = "Rejected";
    }

    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{display}</p>
      </div>
    );
  };

  const Registered = ({ value }) => {
    const date = value ? moment(value).format("DD/MM/YYYY") : "N/A";

    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{date}</p>
      </div>
    );
  };


  const actionHandler = ({ row }) => {
    return (
      <div
        className="flex cursor-pointer text-black items-center justify-evenly py-2 rounded-[10px] mr-[10px]"
        onClick={() => {
          setPopupData(row.original);
          setOpen(true);
        }}
      >
        <button className="underline cursor-pointer"> View </button>
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
        Header: "Status",
        accessor: "status",
        Cell: Status,
      },
  
      {
        Header: "ACTION",
        Cell: actionHandler,
      },
    ],
    [themeData]
  );

  console.log(open);
  return (
    <div className="w-full h-full bg-transparent mt-5  md:px-8 px-4">
      <div className=" h-full">
        <div className="flex justify-between items-center">
          <p className="text-black font-bold md:text-[46px] text-2xl cursor-pointer">
            Students
          </p>
          <button
            className="flex justify-center items-center gap-1 text-sm text-white
                           bg-custom-blue px-3 py-3 rounded-xl cursor-pointer"
            onClick={() => router.push("/AddUser?type=user")}
          >
            <PlusIcon size={18} />
            Add Student
          </button>
        </div>
        <div className="bg-white md:pb-22 px-1 rounded-[12px] h-full overflow-y-scroll scrollbar-hide overflow-scroll pb-18 md:mt-5 mt-5">
          <div className="bg-[#CFE0E54D] px-4 min-h-screen rounded-[24px]">
            <div className="flex justify-between items-center pt-2">
              <p className="text-black text-[20px] pt-6"> Student Details</p>
            </div>

            <div className="-mt-4">
              {studentList.length > 0 ? (
                <Table
                  columns={columns}
                  data={studentList}
                  pagination={pagination}
                  onPageChange={(page) => setCurrentPage(page)}
                  currentPage={currentPage}
                  itemsPerPage={pagination?.itemsPerPage}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-10 min-h-[600px] text-gray-500">
                  <Users className="h-12 w-12 mb-2 text-gray-400" />
                  <p className="text-lg font-medium">No Student found</p>
                  <p className="text-sm">
                    Try adjusting filters or add new students.
                  </p>
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
                      <h2 className="text-xl font-semibold text-gray-800">
                        {popupData.name}
                      </h2>
                      <p className="text-gray-600">{popupData.email}</p>
                      <p className="text-gray-500 text-sm">{popupData.phone}</p>
                    </div>
                  </div>
                  {/* <div className="text-right">
                    <p className="text-gray-600 text-sm">Date Of Birth: 01-01-1990</p>
                  </div> */}
                </div>
                <p
                  onClick={() => setOpen(false)}
                  className="text-black text-2xl absolute cursor-pointer right-4 top-2"
                >
                  {" "}
                  <RxCross2 />
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 divide ">
                  <div className="space-y-4">
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">
                        Student ID:
                      </span>
                      <span className="text-gray-600">
                        {popupData.studentId}
                      </span>
                    </div>

                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">
                        Student Name:
                      </span>
                      <span className="text-gray-600">{popupData.name}</span>
                    </div>

                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">
                        Email:
                      </span>
                      <span className="text-gray-600">{popupData.email}</span>
                    </div>

                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">
                        Phone No:
                      </span>
                      <span className="text-gray-600">{popupData.phone}</span>
                    </div>

                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">
                        Registered On:
                      </span>
                      <span className="text-gray-600">
                        {popupData?.createdAt
                          ? moment(popupData?.createdAt).format("DD/MM/YYYY")
                          : ""}
                      </span>
                    </div>

                    {/* <div className="flex">
                      <span className="font-medium text-gray-700 w-32">Availability:</span>
                      <span className="text-gray-600">{popupData.Availability}</span>
                    </div> */}

                    {/* <div className="flex">
                      <span className="font-medium text-gray-700 w-32">Total Lesson:</span>
                      <span className="text-gray-600">{popupData.TotalLessons}</span>
                    </div>

                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">Completed Lesson:</span>
                      <span className="text-gray-600">{popupData.Completed}</span>
                    </div> */}

                    {/* <div className="flex">
                      <span className="font-medium text-gray-700 w-32">Upcoming:</span>
                      <span className="text-gray-600">12th, August 2025</span>
                    </div>

                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">Rating:</span>
                      <span className="text-yellow-500">★★★★★</span>
                    </div> */}
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className=" rounded-lg w-full ">
                      <div className="shadow-sm overflow-hidden">
                        <img
                          src={
                            popupData?.doc ||
                            "https://via.placeholder.com/400x300?text=No+Image"
                          }
                          className="h-[30rem]"
                        />
                      </div>
                    </div>

                    {/* <div className=" py-4 border-t border-gray-200">
                      <div className="flex space-x-4 justify-center w-full">
                        <button className="bg-[#4EB0CFD9] w-1/2 text-white px-6 py-2 rounded-lg transition-colors duration-200 cursor-pointer">
                          Approve
                        </button>
                        <button className="bg-[#FF6C6C] w-1/2 text-white px-6 py-2 rounded-lg transition-colors duration-200 cursor-pointer">
                          Reject
                        </button>
                      </div>
                    </div> */}
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

export default isAuth(students);
