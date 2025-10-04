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
    getUserDetail();
  }, []);

  const getUserDetail = () => {
    const user = localStorage.getItem("userDetail");

    if (user) {
      setUser(JSON.parse(user));
      // router.push("/");
    } else {
      if (router.route !== "/login") {
        router.push("/login");
      }
    }
  };

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
