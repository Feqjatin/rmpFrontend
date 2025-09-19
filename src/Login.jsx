import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {loginUser} from "./api/Auth";
import {login,print} from "./redux/userReducer"
import { useSelector, useDispatch } from 'react-redux'

function Login(props) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const user= useSelector((state) => state.user.userName);
  const roles= useSelector((state) => state.user.roles);
  const [error,setError]=useState();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
    (
      async ()=>{
          const response = await loginUser(formData);
          console.log(response);
          if(response.data !== null)
          {
             console.log("good login");
             dispatch(login(response));
            dispatch(print());
              console.log(user);
              props.setCount(props.count+1);
             navigate("/");
          }
          else{
           setError(response.msg);
          }
      }
  )();
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
        { error &&
         (<p className="text-center text-sm text-red-500 mt-4">
          {error}
        </p>) }
      </div>
    </div>
  );
}

export default Login;
