import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShoppingCart } from "lucide-react";
import { userContext } from "./_app";
import { Api } from "@/services/service";
import { toast } from "react-toastify";

export default function Login(props) {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState({
    email: "",
    password: "",
  });
  const [user, setUser] = useContext(userContext);

  const submit = async () => {
    setSubmitted(true);

    if (!userDetail.email || !userDetail.password) {
      toast.error("Missing credentials");
      return;
    }

    try {
      setLoading(true);
      props.loader(true);

      const res = await Api("post", "auth/login", { ...userDetail }, router);
      if (res?.status) {
        const user = res.data?.user;
        if (user.type === "admin") {
          localStorage.setItem("userDetail", JSON.stringify(user));
          localStorage.setItem("token", res.data?.token);
          setUser(user);
          setUserDetail({ email: "", password: "" });
          toast.success("Login Successful")
          if (user.type === "admin") {
            router.push("/");
          }
          props.loader(false);
          setLoading(false);
        } else {
          toast.error("You are not authorized")
        }
      } else {
        toast.error("Login failed")
      }
    } catch (err) {
      props.loader(false);
      setLoading(false);
      console.error(err);
      toast.error(err?.message || "Something went Wrong")
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-4EB0CF via-68C0DC to-8ED5EB flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10 bg-opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-white backdrop-blur-sm shadow-2xl rounded-3xl p-8 transform hover:scale-[1.02] transition-all duration-300">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="text-left bg-4EB0CF p-2 rounded">
                  <img src="/Logo2.png" className="h-28 w-full" />
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
            <p className="text-gray-600 text-sm">Sign in to access your dashboard</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-3 border text-neutral-700 rounded-xl focus:ring-2 focus:ring-4EB0CF focus:border-transparent outline-none transition-all duration-200 ${submitted && !userDetail.email
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 focus:bg-white"
                    }`}
                  value={userDetail.email}
                  onChange={(e) => setUserDetail({ ...userDetail, email: e.target.value })}
                />
              </div>
              {submitted && !userDetail.email && (
                <p className="text-red-500 text-xs font-medium flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  email is required
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>

                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full pl-10 text-neutral-700 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-4EB0CF focus:border-transparent outline-none transition-all duration-200 ${submitted && !userDetail.password
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 focus:bg-white"
                    }`}
                  value={userDetail.password}
                  onChange={(e) => setUserDetail({ ...userDetail, password: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      submit(); // login function call
                    }
                  }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? (
                    <EyeOff className="h-5 w-5 text-gray-500  transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500  transition-colors" />
                  )}
                </button>

              </div>
              {submitted && !userDetail.password && (
                <p className="text-red-500 text-xs font-medium flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  Password is required
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-4EB0CF to-68C0DC hover:from-3BA0BF hover:to-58B0CC text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-4EB0CF/30 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              )}
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">© 2025 Boka Korning.se All rights reserved.</p>
          </div>
        </div>

        <div className="absolute -top-14 -left-10 w-32 h-32 bg-gradient-to-r from-68C0DC to-4EB0CF rounded-full blur-md opacity-20 animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div
          className="absolute -bottom-8 -right-10 w-32 h-32 bg-gradient-to-r from-68C0DC to-4EB0CF rounded-full blur-md opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <style jsx>{`
        .from-4EB0CF { --tw-gradient-from: #4EB0CF; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(78, 176, 207, 0)); }
        .via-68C0DC { --tw-gradient-stops: var(--tw-gradient-from), #68C0DC, var(--tw-gradient-to, rgba(104, 192, 220, 0)); }
        .to-8ED5EB { --tw-gradient-to: #8ED5EB; }
        .to-68C0DC { --tw-gradient-to: #68C0DC; }
        .from-3BA0BF { --tw-gradient-from: #3BA0BF; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(59, 160, 191, 0)); }
        .to-58B0CC { --tw-gradient-to: #58B0CC; }
        .bg-4EB0CF { background-color: #4EB0CF; }
        .text-4EB0CF { color: #4EB0CF; }
        .text-68C0DC { color: #68C0DC; }
        .focus\:ring-4EB0CF:focus { --tw-ring-color: rgba(78, 176, 207, 0.3); }
        .hover\:from-3BA0BF:hover { --tw-gradient-from: #3BA0BF; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(59, 160, 191, 0)); }
        .hover\:to-58B0CC:hover { --tw-gradient-to: #58B0CC; }
      `}</style>
    </div>
  );
}