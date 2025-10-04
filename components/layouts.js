import { useRouter } from "next/router";
import { useState } from "react";
import SidePannel from "./SidePannel";
import Navbar from "./Navbar";

const Layout = ({ children, loader, toaster }) => {
  const router = useRouter();
  const [openTab, setOpenTab] = useState(false);

  // ✅ Public routes jisme SidePannel aur Navbar nahi chahiye
  const publicRoutes = ["/aboutus", "/privacypolicy", "/termsandconditions", "/login"];

  // ✅ Agar current route public hai
  const isPublic = publicRoutes.includes(router.pathname.toLowerCase());

  return (
    <div className="h-screen max-w-screen bg-white">
      <div className="md:h-[10vh] h-[8vh] w-full">
        <div className="max-w-screen flex relative">
          {
            !isPublic && (
              <SidePannel setOpenTab={setOpenTab} openTab={openTab} />
            )
          }

          <div className={!isPublic ? "w-full xl:pl-[280px] md:pl-[250px] sm:pl-[200px]" : "w-full"}>
            <main className="w-full h-screen relative overflow-y-auto">
              {
                !isPublic && (
                  <Navbar setOpenTab={setOpenTab} openTab={openTab} />
                )
              }
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
