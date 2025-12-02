import React, { useMemo, useState, useEffect, useContext } from "react";
import Table from "../../components/table";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { userContext } from "./_app";
import isAuth from "../../components/isAuth";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Users } from "lucide-react";
import moment from "moment";
import constant from "@/services/constant";

function Bookings(props) {
  const router = useRouter();
  const [instructorList, setInstructorList] = useState([]);
  const [user, setUser] = useContext(userContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [themeData, setThemeData] = useState([]);
  const [open, setOpen] = useState(false);
  const [popupData, setPopupData] = useState([]);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
  });

  useEffect(() => {
    getBookings(currentPage);
  }, [user, currentPage]);

  const getBookings = async () => {
    props.loader(true);
    let url = `booking/getAllBookings?page=1&limit=20`;
    Api("get", url, router).then(
      (res) => {
        props.loader(false);
        console.log("abcd", res?.data);
        const data = res?.data;
        setInstructorList(data.data);
        setPagination({
          totalPages: data?.totalPages,
          currentPage: data?.currentPage,
          itemsPerPage: data?.itemsPerPage,
        });
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

  const PickupAddress = ({ value }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">
          {value?.slice(0, 30) + "..."}
        </p>
      </div>
    );
  };

  const Status = ({ value }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{value}</p>
      </div>
    );
  };

  const SessionId = ({ value }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{value || "N/A"}</p>
      </div>
    );
  };

  const PaymentMode = ({ value }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{value}</p>
      </div>
    );
  };

  const Total = ({ value }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        {value ? (
          <p className="text-black text-base font-normal">
            {constant?.currency} {value}
          </p>
        ) : (
          <p className="text-gray-400 text-base font-normal">N/A</p>
        )}
      </div>
    );
  };

  const SheduleDateTime = ({ row }) => {
    const date = moment(row.original.sheduleDate).format("DD/MM/YYYY");
    const value = date + " " + row.original.selectedTime;
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{value}</p>
      </div>
    );
  };

  const actionHandler = ({ row }) => {
    return (
      <div
        className="flex  text-black items-center justify-evenly py-2 rounded-[10px] mr-[10px]"
        onClick={() => {
          setPopupData(row.original);
          setOpen(true);
        }}
      >
        <button className="underline"> View </button>
        <FaEye />
      </div>
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: "Session Id",
        accessor: "session_id",
        Cell: SessionId,
      },
      {
        Header: "Student Name",
        accessor: "user.name",
        Cell: StudentName,
      },
      {
        Header: "Instructor Name",
        accessor: "instructer.name",
        Cell: Email,
      },
      {
        Header: "Shedule Date & Time",
        // accessor: "phone",
        Cell: SheduleDateTime,
      },
      {
        Header: "Pickup Location",
        accessor: "pickup_address",
        Cell: PickupAddress,
      },

      {
        Header: "Status",
        accessor: "status",
        Cell: Status,
      },
      // {
      //   Header: "Payment Status",
      //   accessor: "payment_mode",
      //   Cell: PaymentMode,
      // },
      {
        Header: "Total Amount",
        accessor: "total",
        Cell: Total,
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
        <p className="text-black font-bold md:text-[46px] text-2xl cursor-pointer">
          <span className="w-2 h-8 bg-[#F38529] rounded "></span>
          Bookings
        </p>
        <div className="bg-white md:pb-32 px-1 rounded-[12px] h-full overflow-y-scroll scrollbar-hide overflow-scroll pb-28 mt-3">
          <div className="bg-[#CFE0E54D] px-4 min-h-screen rounded-[24px]">
            <p className="text-black text-[20px] pt-4"> Booking Details</p>
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
                  <p className="text-lg font-medium">No Booking found</p>
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
                        src={popupData?.user?.image || "/person.png"}
                        alt="Student Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {popupData?.user?.name}
                      </h2>
                      <p className="text-gray-600">{popupData?.user?.email}</p>
                      <p className="text-gray-500 text-sm">
                        {popupData?.user?.phone}
                      </p>
                    </div>
                  </div>
                </div>
                <p
                  onClick={() => setOpen(false)}
                  className="text-black text-2xl absolute right-4 top-2"
                >
                  {" "}
                  <RxCross2 />
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 divide ">
                  <div className="space-y-4">
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">
                        Student ID:
                      </span>
                      <span className="text-gray-600">
                        {popupData.user?._id}
                      </span>
                    </div>

                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">
                        Shedule Date & Time:
                      </span>
                      <span className="text-gray-600">
                        {`${moment(popupData.sheduleDate).format(
                          "DD/MM/YYYY"
                        )} ${moment(popupData.selectedTime, "HH:mm").format(
                          "hh:mm A"
                        )}`}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">
                        Pickup Address:
                      </span>
                      <span className="text-gray-600">
                        {popupData.pickup_address}
                      </span>
                    </div>

                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">
                        Payment Mode:
                      </span>
                      <span className="text-gray-600">
                        {popupData.payment_mode}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">
                        Status:
                      </span>
                      <span className="text-gray-600">{popupData.status}</span>
                    </div>

                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">
                        Registered On:
                      </span>
                      <span className="text-gray-600">
                        {popupData?.user?.createdAt
                          ? moment(popupData?.user?.createdAt).format(
                              "DD/MM/YYYY"
                            )
                          : ""}
                      </span>
                    </div>
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

export default isAuth(Bookings);
