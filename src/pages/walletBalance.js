import React, { useMemo, useState, useEffect, useContext } from "react";
import Table from "../../components/table";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { userContext } from "./_app";
import isAuth from "../../components/isAuth";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { Users } from "lucide-react";
import moment from "moment";
import constant from "@/services/constant";
import Swal from "sweetalert2";

function instructors(props) {
    const router = useRouter();
    const [instructorList, setInstructorList] = useState([]);
    const [user] = useContext(userContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [themeData] = useState([]);
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

    const getProduct = async () => {
        props.loader(true);
        let url = `auth/getInstructersBalence`;
        Api("get", url, router).then(
            (res) => {
                props.loader(false);
                console.log("abcd", res?.data);
                setInstructorList(res.data);
                setPagination(res?.pagination);
            },
            (err) => {
                props.loader(false);
                console.log(err);
                toast.error(err?.message || "Something went Wrong")
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


    const balanace = ({ value }) => {
        return (
            <div className="p-4 flex flex-col items-center justify-center">
                <p className="text-black text-base font-normal"> {constant.currency} {value}</p>
            </div>
        );
    };
    const RatePerHour = ({ row }) => {
        return (
            <div className="p-4 flex flex-col items-center justify-center">
                {row?.original?.rate_per_hour && (
                    <p className="text-black text-base font-normal">
                        {constant?.currency} {row.original.rate_per_hour}
                    </p>
                )}
            </div>
        );
    };

    const actionHandler = ({ row }) => {
        return (
            <div className="flex bg-custom-sky px-4 cursor-pointer text-white items-center justify-evenly py-2 rounded-[10px] mr-[10px]"
                onClick={() => {
                    setPopupData(row.original)
                    setOpen(true)
                }}
            >
                <button className="underline cursor-pointer" > View Details  </button>
            </div>
        );
    };

    const Withdraw = ({ row }) => {

        const withdraw = async () => {

            Swal.fire({
                text: "Are you sure? Do you really want to approve this withdrawal?",
                showCancelButton: true,
                confirmButtonColor: "#0ea5e9", // custom-sky
                cancelButtonColor: "#d33",
                width: "360px",
                confirmButtonText: "Yes, Approve",
            }).then((result) => {
                if (result.isConfirmed) {
                    props.loader(true);
                    let url = `auth/resetInstBalence/${row?.original?._id}`;

                    Api("get", url, router).then(
                        (res) => {
                            props.loader(false);
                            toast.success("Withdrawal approved successfully!");
                            getProduct(currentPage);
                        },
                        (err) => {
                            props.loader(false);
                            console.log(err);
                            toast.error(err?.message || "Something went wrong");
                        }
                    );
                }
            });
        };

        return (
            <div className="flex items-center justify-center py-2">
                <button
                    onClick={withdraw}
                    className="px-6 py-2 bg-custom-sky hover:bg-sky-500 text-white font-medium rounded-lg shadow transition cursor-pointer"
                >
                    Approve
                </button>
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
                Header: "Wallet Balanace",
                accessor: "wallet",
                Cell: balanace,
            },
            {
                Header: "Withdraw",
                // accessor: "Document",
                Cell: Withdraw,
            },


            {
                Header: "ACTION",
                Cell: actionHandler,
            },
        ],
        []
    );


    return (
        <div className="w-full h-full bg-transparent mt-5  md:px-8 px-4">
            <div className=" h-full">
                <p className="text-black font-bold md:text-[46px] text-2xl cursor-pointer">
                    <span className="w-2 h-8 bg-[#F38529] rounded "></span>
                    Instructor Wallet Balance
                </p>
                <div className="bg-white md:pb-32 px-1 rounded-[12px] h-full overflow-y-scroll scrollbar-hide overflow-scroll pb-28 mt-3">
                    <div className="bg-[#CFE0E54D] px-4 min-h-screen rounded-[24px]">
                        <p className="text-black text-[20px] pt-6"> Wallet Details</p>
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
                                            <span className="font-medium text-gray-700 w-32">Wallet Balanace :</span>
                                            <span className="text-gray-600">{popupData.wallet}</span>
                                        </div>
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
                                            <span className="font-medium text-gray-700 w-32">Rate Per Hour:</span>
                                            <span className="text-gray-600">{popupData.rate_per_hour}</span>
                                        </div>

                                        <div className="flex">
                                            <span className="font-medium text-gray-700 w-32">Availability:</span>
                                            <span className="text-gray-600">{popupData?.available ? "Yes" : "No"}</span>
                                        </div>

                                        <div className="flex">
                                            <span className="font-medium text-gray-700 w-32">Vehicle Model:</span>
                                            <span className="text-gray-600">{popupData.vehicle_model}</span>
                                        </div>
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
