import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Wallet } from "lucide-react";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response =
        await api.post(
          "/auth/login",
          form
        );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "userId",
        response.data.userId
      );

      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px]">

        <div className="flex flex-col items-center mb-6">
          <Wallet
            size={50}
            className="text-blue-600"
          />

          <h1 className="text-3xl font-bold mt-2">
            Finance Tracker
          </h1>

          <p className="text-slate-500 mt-2">
            Welcome Back
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <button
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;
