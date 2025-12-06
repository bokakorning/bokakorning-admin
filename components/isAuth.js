import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const isAuth = (Component) => {
  return function IsAuth(props) {
    const router = useRouter();
    const [auth, setAuth] = useState(null);

    const publicRoutes = ["/aboutus", "/privacypolicy", "/termsandconditions"];
    let currentPath = router.pathname.toLowerCase().replace(/\/$/, ""); // 👈 FIX
    const isPublic = publicRoutes.includes(currentPath);

    // ✅ Public page short-circuit
    if (isPublic) return <Component {...props} />;

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
    }, []);

    useEffect(() => {
      if (auth === false) {
        localStorage.clear();
        router.replace("/login");
      }
    }, [auth]);

    if (auth === null) return null;

    return <Component {...props} />;
  };
};

export default isAuth;
