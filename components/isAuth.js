import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const isAuth = (Component) => {
  return function IsAuth(props) {
    const router = useRouter();
    const [auth, setAuth] = useState(null);

    const publicRoutes = ["/aboutus", "/privacypolicy", "/termsandconditions"];

    const currentPath = router.asPath.toLowerCase();
    const isPublic = publicRoutes.some((route) => route === currentPath);

    useEffect(() => {
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("userDetail");
        const token = localStorage.getItem("token");

        if (user && token) {
          const u = JSON.parse(user);
          setAuth(u?.type === "admin");
        } else {
          setAuth(false);
        }
      }
    }, [isPublic]);

    useEffect(() => {
      if (auth === false) {
        localStorage.clear();
        router.replace("/login");
      }
    }, [auth]);

    return <Component {...props} />;
  };
};

export default isAuth;
