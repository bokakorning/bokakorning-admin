import { useEffect } from "react";
import { useRouter } from "next/router";

const isAuth = (Component) => {
  return function IsAuth(props) {
    const router = useRouter();
    let auth = false;

    
    const publicRoutes = ["/Aboutus", "/PrivacyPolicy", "/TermsandConditions"];

    if (publicRoutes.includes(router.pathname)) {
      return <Component {...props} />;
    }

    if (typeof window !== "undefined") {
      const user = localStorage.getItem("userDetail");
      const token = localStorage.getItem("token");

      if (user && token) {
        const u = JSON.parse(user);
        auth = u?.type === "admin";
      }
    }

    useEffect(() => {
      if (!auth) {
        localStorage.clear();
        router.replace("/login");
      }
    }, [auth]);

    return <Component {...props} />;
  };
};

export default isAuth;
