import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();

    if (username && password) {
      navigate("/");
    } else {
      alert("Please enter both username and password");
    }
  };

  return (
    <div className="login-container flex justify-center items-center min-h-screen text-white">
      <form
        className="login-form bg-white/10 p-5 px-4 rounded-lg shadow-lg text-center w-[380px] border border-gray-300"
        onSubmit={handleLogin}
      >
        <h2 className="font-bold pb-4 text-2xl">Login</h2>
        <div className="form-group mb-4 text-left block text-sm text-gray-600 w-full p-2 rounded-md">
          <label
            htmlFor="username"
            className="block mb-2 text-white text-lg w-full"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Enter username"
            className="text-white w-full p-2 border border-gray-300 rounded-md text-sm bg-transparent"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ color: "#333" }}
          />
        </div>
        <div className="form-group mb-4 text-left block text-sm text-gray-600 w-full p-2 rounded-md">
          <label htmlFor="password" className="block mb-2 text-white text-lg">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            className="text-white w-full p-2 border border-gray-300 rounded-md text-sm bg-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ color: "#333" }}
          />
        </div>
        <button
          type="submit"
          className="login-button w-1/2 p-1 bg-violet-500 text-white border-none rounded-md cursor-pointer text-lg font-bold hover:bg-violet-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
