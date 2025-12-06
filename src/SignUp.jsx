import React, { useState } from "react";
import {makeNewUser} from "./api/Auth";
import { Navigate, useNavigate } from "react-router-dom";
import {makeNewCandidate} from "./api/Auth";
function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    passwordHash: "",
    phone: "",
  });
  const [state,setState]=useState("candidate");
  const [error,setError]=useState();
  const [candidateFormData, setCandidateFormData] = useState({
    Name :"",
    Email :"",
    PasswordHash: "",
    Phone : "",
    Address : "",
    City : "",
    State  : "",
    ZipCode : "",
    LinkedinUrl   : "",
    GithubUrl : "",  
    PortfolioUrl  : "",
    ProfileSummary  : "",
  });
  const navigate=useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleChange2 = (e) => {
    setCandidateFormData({
      ...candidateFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration Data:", formData);
    (
        async ()=>{
            const response = await makeNewUser(formData);
            console.log(response);
            if(response.data !== null)
            {
               console.log("good signUp");
               navigate("/login");
            }
            else{
             setError(response.msg);
            }
        }
    )();
     
  };
  const handleSubmit2 = (e) => {
    e.preventDefault();
    console.log("Registration Data:", candidateFormData);
    (
        async ()=>{
            const response = await makeNewCandidate(candidateFormData);
            console.log(response);
            if(response.data !== null)
            {
               console.log("good signUp");
               navigate("/login");
            }
            else{
             setError(response.msg);
            }
        }
    )();
     
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white pt-6 pb-6">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Your Account{ state==="user"?" as User":" as Candidate"}
        </h2>
          {state=="user" &&<>
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
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
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
              name="passwordHash"
              value={formData.passwordHash}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone (Optional)
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

           
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
        </>
        }
        {state=="candidate"&&<>
        <form onSubmit={handleSubmit2} className="space-y-4">
           
                <div>
                  <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Name</label>
                  <input
                    type="text"
                    name="Name"
                    value={candidateFormData.Name}
                    onChange={handleChange2}
                    placeholder="Enter your full name"
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Email</label>
                  <input
                    type="email"
                    name="Email"
                    value={candidateFormData.Email}
                    onChange={handleChange2}
                    placeholder="Enter your email"
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Password</label>
                  <input
                    type="password"
                    name="PasswordHash"
                    value={candidateFormData.PasswordHash}
                    onChange={handleChange2}
                    placeholder="Enter your password"
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Phone</label>
                  <input
                    type="text"
                    name="Phone"
                    value={candidateFormData.Phone}
                    onChange={handleChange2}
                    placeholder="Enter phone number"
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="Address"
                    value={candidateFormData.Address}
                    onChange={handleChange2}
                    placeholder="Enter your address"
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="City"
                    value={candidateFormData.City}
                    onChange={handleChange2}
                    placeholder="Enter your city"
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="State"
                    value={candidateFormData.State}
                    onChange={handleChange2}
                    placeholder="Enter your state"
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                  <input
                    type="text"
                    name="ZipCode"
                    value={candidateFormData.ZipCode}
                    onChange={handleChange2}
                    placeholder="Enter zip code"
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                  <input
                    type="text"
                    name="LinkedinUrl"
                    value={candidateFormData.LinkedinUrl}
                    onChange={handleChange2}
                    placeholder="https://linkedin.com/..."
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
                  <input
                    type="text"
                    name="GithubUrl"
                    value={candidateFormData.GithubUrl}
                    onChange={handleChange2}
                    placeholder="https://github.com/..."
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Portfolio URL</label>
                  <input
                    type="text"
                    name="PortfolioUrl"
                    value={candidateFormData.PortfolioUrl}
                    onChange={handleChange2}
                    placeholder="https://yourportfolio.com"
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Summary</label>
                  <textarea
                    name="ProfileSummary"
                    value={candidateFormData.ProfileSummary}
                    onChange={handleChange2}
                    placeholder="Write a short summary about yourself..."
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-24 resize-none"
                  />
                </div>

                            
           

           
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Register as Candidate
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
          </>
        }
       { error &&
         (<p className="text-center text-sm text-red-500 mt-4">
          {error}
        </p>) }
        <p className="text-center text-sm text-gray-500 mt-4">
        {state=="user"?(<button className="text-blue-600 hover:underline" onClick={()=>setState("candidate")} >For Candidate</button>):(<button className="text-blue-600 hover:underline" onClick={()=>setState("user")}>For User</button>) }
        </p>
      </div>
    </div>
  );
}

export default SignUp;
