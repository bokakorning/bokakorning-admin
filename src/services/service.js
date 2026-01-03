import axios from "axios";
// const ConstantsUrl = "http://localhost:3004/";
const ConstantsUrl = "https://api.bokakorning.online/";


const publicRoutes = ["/aboutus", "/privacypolicy", "/termsandconditions"];

function handleAuthError(err, router) {
  if (typeof window !== "undefined") {
    const currentPath = router?.pathname?.toLowerCase();
    if (!publicRoutes.includes(currentPath)) {
      console.warn("Auth error:", err?.response?.data?.message || err.message);
      localStorage.removeItem("token");
      localStorage.removeItem("userDetail");
      router?.push("/login");
    }
  }
}

function Api(method, url, data, router) {
  return new Promise(function (resolve, reject) {
    let token = "";
    const currentPath = typeof window !== "undefined" ? window.location.pathname.toLowerCase() : "";

    if (!publicRoutes.includes(currentPath)) {
      token = localStorage?.getItem("token") || "";
    }

    axios({
      method,
      url: ConstantsUrl + url,
      data,
      headers: token ? { Authorization: `jwt ${token}` } : {},
    }).then(
      (res) => resolve(res.data),
      (err) => {
        console.log("API Error:", err?.response?.data || err.message);

        if (err.response) {
          const status = err.response.status;
          const msg = err.response.data?.message || "";

          if (
            status === 401 ||
            msg.toLowerCase().includes("expired") ||
            msg.toLowerCase().includes("invalid token")
          ) {
            handleAuthError(err, router);
          }

          reject(err.response.data);
        } else {
          reject(err);
        }
      }
    );
  });
}

function ApiFormData(method, url, data, router) {
  return new Promise(function (resolve, reject) {
    let token = "";
    const currentPath = typeof window !== "undefined" ? window.location.pathname.toLowerCase() : "";

    // Agar public route hai → token skip
    if (!publicRoutes.includes(currentPath)) {
      token = localStorage?.getItem("token") || "";
    }

    axios({
      method,
      url: ConstantsUrl + url,
      data,
      headers: {
        ...(token ? { Authorization: `jwt ${token}` } : {}),
        "Content-Type": "multipart/form-data",
      },
    }).then(
      (res) => resolve(res.data),
      (err) => {
        console.log("API Error:", err?.response?.data || err.message);

        if (err.response) {
          const status = err.response.status;
          const msg = err.response.data?.message || "";

          if (
            status === 401 ||
            msg.toLowerCase().includes("expired") ||
            msg.toLowerCase().includes("invalid token")
          ) {
            handleAuthError(err, router);
          }

          reject(err.response.data);
        } else {
          reject(err);
        }
      }
    );
  });
}

export { Api, ApiFormData };
