import axios from "axios";

// const ConstantsUrl = "http://localhost:3004/";
const ConstantsUrl = "https://api.bokakorning.online/";

function handleAuthError(err, router) {
  if (typeof window !== "undefined") {
    console.warn("Auth error:", err?.response?.data?.message || err.message);
    localStorage.removeItem("token");
    localStorage.removeItem("userDetail");
    router.push("/login");
  }
}

function Api(method, url, data, router) {
  return new Promise(function (resolve, reject) {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage?.getItem("token") || "";
    }

    axios({
      method,
      url: ConstantsUrl + url,
      data,
      headers: { Authorization: `jwt ${token}` },
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
    if (typeof window !== "undefined") {
      token = localStorage?.getItem("token") || "";
    }

    axios({
      method,
      url: ConstantsUrl + url,
      data,
      headers: {
        Authorization: `jwt ${token}`,
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
