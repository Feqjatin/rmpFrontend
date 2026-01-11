import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {loginUser,loginCandidate} from "../Api/Auth";
import {login,print} from "../Redux/userReducer"
import { useSelector, useDispatch } from 'react-redux'

function Login(props) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [candidateFormData, setCandidateFormData] = useState({
    email: "",
    password: "",
  });
  const [state, setState] = useState("user");
  const user= useSelector((state) => state.user.userName);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordUser, setShowPasswordUser] = useState(false);
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

  const handleChange2 = (e) => {
    setCandidateFormData({
      ...candidateFormData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit2 = (e) => {
    e.preventDefault();
    console.log("Registration Data:", candidateFormData);
    (
        async ()=>{
            const response = await loginCandidate(candidateFormData);
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
             setError("something went wrong");
            }
        }
    )();
     
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to Your Account{ state==="user"?" as User":" as Candidate"}
        </h2>
           {state==="user"&&<>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your Email"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
            <input
              type={showPasswordUser ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
             <button
                type="button"
                onClick={() => setShowPasswordUser(!showPasswordUser)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPasswordUser ? "👁️" :<img src="./closeEye.png" width={'25px'} height={'25px'}></img>}
              </button>
              </div>
          </div>

          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        </>}

        {state==="candidate"&&<>
        <form onSubmit={handleSubmit2} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={candidateFormData.email}
              onChange={handleChange2}
              placeholder="Enter your email"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={candidateFormData.password}
              onChange={handleChange2}
              placeholder="Enter your password"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
             <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "👁️" :<img src="./closeEye.png" width={'25px'} height={'25px'}></img>}
              </button>
              </div>
          </div>

          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        </>}
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

        <p className="text-center text-sm text-gray-500 mt-4">
        {state=="user"?(<button className="text-blue-600 hover:underline" onClick={()=>setState("candidate")} >login For Candidate</button>):(<button className="text-blue-600 hover:underline" onClick={()=>setState("user")}> login For User</button>) }
        </p>

        <p className="text-center text-sm text-gray-500 mt-4">
          Forgot Password?
          <a href="/recoverAccount" className="text-blue-600 hover:underline">
            Recover Account
          </a>
        </p>
      </div>
     
    </div>
  );
}

export default Login;
