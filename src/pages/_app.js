import Layout from "../../components/layouts";
import "@/styles/globals.css";
import Loader from "../../components/loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

export const userContext = createContext();
export const dataContext = createContext();

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState({});
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState({
    type: "",
    message: "",
  });
  const router = useRouter();

  useEffect(() => {
    setToast(toast);
    if (!!toast.message) {
      setTimeout(() => {
        setToast({ type: "", message: "" });
      }, 5000);
    }
  }, [toast]);

  useEffect(() => {
    const publicRoutes = ["/aboutus", "/privacypolicy", "/termsandconditions"];
    const getUserDetail = () => {
      const user = localStorage.getItem("userDetail");
      const currentPath = router.pathname.toLowerCase();
      currentPath = currentPath.replace(/\/$/, ""); // 👈 FIX
      const isPublic = publicRoutes.includes(currentPath);

      if (user) {
        setUser(JSON.parse(user));
      } else {
        if (!isPublic && currentPath !== "/login") {
          router.push("/login");
        }
      }
    };

    getUserDetail();
  }, [router.pathname]);

  return (
    <>
      <dataContext.Provider value={[data, setData]}>
        <userContext.Provider value={[user, setUser]}>
          <ToastContainer position="top-right" autoClose={3000} />

          {/* Loader Add Here */}
          {open && <Loader open={open} />}

          <Layout loader={setOpen} toaster={setToast}>
            {user && (
              <Component
                {...pageProps}
                loader={setOpen}
                toaster={setToast}
                user={user}
              />
            )}
          </Layout>
        </userContext.Provider>
      </dataContext.Provider>
    </>
  );
}
