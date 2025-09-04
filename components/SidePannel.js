import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { MdDashboard } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { userContext } from "@/pages/_app";
import { PiSignOutFill } from "react-icons/pi";
import { BookCheck, LayoutDashboard ,UserRound , UserStar} from "lucide-react";
import Swal from "sweetalert2";
import { FaUserTie } from "react-icons/fa";

const SidePannel = ({ setOpenTab, openTab }) => {
  const [user, setUser] = useContext(userContext);
  const router = useRouter();

  const logOut = () => {
    setUser({});
    localStorage.removeItem("userDetail");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const menuItems = [
    {
      href: "/",
      title: "Dashboard",
      img: <LayoutDashboard className="text-3xl" />,
      access: ["admin"],
    },
    {
      href: "/bookings",
      title: "Bookings",
      img: <BookCheck className="text-3xl" />,
      access: ["admin"],
    },
    {
      href: "/student",
      title: "Student",
      img: <UserRound className="text-3xl" />,
      access: ["admin"],
    },
    {
      href: "/instructors",
      title: "Instructors",
      img: <FaUserTie className="text-2xl" />,
      access: ["admin"],
    },
    
  ]

  const imageOnError = (event) => {
    event.currentTarget.src = "/userprofile.png";
  };

  return (
    <>
      {/* Desktop Side Panel */}
      <div className="xl:w-[280px] fixed top-0 left-0 z-20 md:w-[250px] sm:w-[200px] hidden sm:grid grid-rows-5 overflow-hidden rounded-tr-[25px] rounded-br-[20px]">
        <div>
          <div className="bg-custom-blue overflow-y-scroll h-screen scrollbar-hide">
            <div
              className="bg-custom-blue pt-5 pb-5 row-span-1 flex items-center justify-center cursor-pointer mx-5 rounded"
              onClick={() => router.push("/")}
            >
              <img
                src="/Logo2.png"
                alt="Logo"
                className="w-full h-[8rem] object-contain"
              />
            </div>

            <div className="flex flex-col justify-between row-span-4 w-full">
              <ul className="w-full flex flex-col text-left mt-5">
                {menuItems.map((item, i) =>
                  item?.access?.includes(user?.type) ? (
                    <Link
                      href={item.href}
                      key={i}
                      className={`flex items-center ml-5 px-8 cursor-pointer group hover:bg-[#ffffff] hover:text-black hover:rounded-tl-[60px] hover:rounded-bl-[60px] my-1 ${
                        router.pathname === item.href
                          ? "bg-[#ffffff] text-black rounded-tl-[60px] rounded-bl-[60px]"
                          : "text-white"
                      }`}
                    >
                      <div className=" flex items-center gap-4">
                        
                      </div>
                      <div className="py-3 font-semibold flex items-center gap-2">
                       {item?.img} {item?.title}
                      </div>
                    </Link>
                  ) : null
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Side Panel */}
      <div
        className={`w-full absolute top-0 left-0 z-40 sm:hidden flex flex-col h-screen max-h-screen overflow-hidden bg-custom-blue ${
          openTab ? "scale-x-100" : "scale-x-0"
        } transition-all duration-300 origin-left`}
      >
        <div className="row-span-1 w-full text-white relative">
          <ImCross
            className="absolute text-white top-4 right-4 z-40 text-2xl"
            onClick={() => setOpenTab(!openTab)}
          />
          <div className="flex flex-col gap-3 w-full p-3">
            <div className="p-1 rounded flex justify-center items-center overflow-hidden">
              <img
                src="/Logo2.png"
                alt="Logo"
                className="w-[92px]  object-contain"
              />
            </div>
            <div className="flex ms-2 justify-between">
              <div className="flex">
                <div className="w-12 h-12 rounded-full overflow-hidden border-white border">
                  <img
                    src={user?.profile || "/office-man.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={imageOnError}
                  />
                </div>
                <p className="mt-3 ms-3 text-lg text-white font-bold">
                  {user?.name}
                </p>
              </div>
              <div>
                {user?._id ? (
                  <div
                    className="flex gap-2 mt-3 items-center cursor-pointer"
                    onClick={() => {
                      Swal.fire({
                        text: "Are you sure you want to logout?",
                        showCancelButton: true,
                        confirmButtonText: "Yes",
                        cancelButtonText: "No",
                        confirmButtonColor: "#FEC200",
                        customClass: {
                          confirmButton: "px-12 rounded-xl",
                          title: "text-[20px] text-black",
                          actions: "swal2-actions-no-hover",
                          popup: "rounded-[15px] shadow-custom-green",
                        },
                        buttonsStyling: true,
                        reverseButtons: true,
                        width: "320px",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          logOut();
                        }
                      });
                    }}
                  >
                    <div className="text-white font-bold">Sign Out</div>
                    <div className="rounded-full">
                      <PiSignOutFill className="text-3xl text-white" />
                    </div>
                  </div>
                ) : (
                  <Link href="/login">
                    <div className="p-3 mt-3 items-center font-bold text-white">
                      LogIn
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-start row-span-2 h-full w-full">
          <ul className="w-full h-full flex flex-col text-left justify-start items-center border-t-2 border-white">
            {menuItems.map((item, i) =>
              item?.access?.includes(user?.type) ? (
                <li
                  key={i}
                  className="w-full flex items-center text-white cursor-pointer group hover:bg-black border-b-2 border-white"
                >
                  <div
                    className="py-2 pl-6 font-semibold flex items-center gap-4"
                    onClick={() => setOpenTab(!openTab)}
                  >
                    <div className="w-6">{item?.img}</div>
                    <Link href={item.href}>{item?.title}</Link>
                  </div>
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SidePannel;
