import { userContext } from "@/pages/_app";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { PiSignOutFill } from "react-icons/pi";
import Swal from "sweetalert2";

const Navbar = ({ setOpenTab, openTab }) => {
  const [user, setUser] = useContext(userContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const logOut = () => {
    setUser({});
    localStorage.removeItem("userDetail");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleLogout = () => {
    Swal.fire({
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#4EB0CF",
      customClass: {
        confirmButton: 'px-12 rounded-xl',
        title: 'text-[20px] text-black',
        actions: 'swal2-actions-no-hover',
        popup: 'rounded-[15px] shadow-lg'
      },
      buttonsStyling: true,
      reverseButtons: true,
      width: '320px'
    }).then(function (result) {
      if (result.isConfirmed) {
        logOut();
      }
    });
  };

  const imageOnError = (event) => {
    event.currentTarget.src = "/userprofile.png";
  };

  return (
    <nav className="w-full bg-[#4EB0CF] md:bg-white z-20 sticky top-0 max-w-screen shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className=" flex items-center justify-between md:h-16 h-20">
          {/* Logo */}
          <div className="md:hidden flex items-center ">
            <img 
              className="h-16 w-auto object-contain" 
              src="/Logo2.png" 
              alt="Logo"
              onClick={() => router.push("/")}
              style={{ cursor: "pointer" }}
            />
          </div>

          {user?._id && (
            <div className="hidden md:flex items-center justify-end space-x-4 flex-1">
              <div className="relative">
                <button 
                  className="flex items-center space-x-3 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors duration-200" 
                >
                  <div> 
                    <input 
                    className="w-[20rem] bg-[#4EB0CF4D] text-black rounded-3xl px-4 py-2"
                    placeholder="Search"
                    />
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 border-4EB0CF flex-shrink-0"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <img
                      src={user?.profile || "/office-man.png"} 
                      alt="User"
                      className="w-full h-full object-cover"
                      onError={imageOnError}
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="text-gray-800 font-medium text-sm">{user?.name}</p>
                    {/* <p className="text-gray-500 text-xs">{user?.type}</p> */}
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <PiSignOutFill size={16} className="text-4EB0CF" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* <button 
                onClick={handleLogout}
                className="bg-4EB0CF text-white rounded-lg px-4 py-2 flex items-center space-x-2 transition-colors duration-200 hover:bg-3BA0BF"
              >
                <span>Sign Out</span>
                <PiSignOutFill size={16} />
              </button> */}
            </div>
          )}

          <div className="md:hidden">
            <button 
              onClick={() => setOpenTab(!openTab)}
              className="p-2 rounded-md text-white  focus:outline-none"
            >
              <GiHamburgerMenu size={32} />
            </button>
          </div>
        </div>
      </div>

      {openTab && (
        <div className="md:hidden bg-white border-t border-gray-100 py-2 px-4 shadow-lg">
          {user?.token ? (
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3 p-2">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-4EB0CF">
                  <img
                    src={user?.profile || "/userprofile.png"} 
                    alt="User"
                    className="w-full h-full object-cover"
                    onError={imageOnError}
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-800 font-medium">{user?.name}</p>
                  <p className="text-gray-500 text-xs">{user?.type}</p>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="w-full bg-4EB0CF hover:bg-3BA0BF text-white rounded-lg py-2 px-4 flex items-center justify-center space-x-2 transition-colors duration-200"
              >
                <span>Sign Out</span>
                <PiSignOutFill size={16} />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <div className="block w-full text-center py-2 px-4 text-4EB0CF hover:bg-blue-50 rounded-lg">
                Log In
              </div>
            </Link>
          )}
        </div>
      )}
      
      <style jsx>{`
        .border-4EB0CF { border-color: #4EB0CF; }
        .bg-4EB0CF { background-color: #4EB0CF; }
        .hover\:bg-3BA0BF:hover { background-color: #3BA0BF; }
        .text-4EB0CF { color: #4EB0CF; }
      `}</style>

    </nav>
  );
};

export default Navbar;