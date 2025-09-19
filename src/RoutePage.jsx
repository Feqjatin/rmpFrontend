import React from "react";
import HomeCommn from "./HomeCommn";
import Login from "./Login";
import SignUp from "./SignUp";
import {Routes,Route} from 'react-router-dom' ;
import NavBar from "./NavBar";
import PrivateRoute from "./component/PrivateRoute";
import AdminDashboard from "./admin/AdminDashboard";
import RoleDetails from "./admin/RoleDetails";
import RecruiterDashboard from "./Recruiter/RecruiterDashBoard";

function RoutePage (){
  const [count, setCount] = React.useState(0);
return (<>
<div>
    <NavBar count={count}/>
  <Routes>
    <Route path="/" element={<HomeCommn />} />
    <Route path="/login" element={<Login setCount={setCount} count={count}/>} />
    <Route path="/signup" element={<SignUp/>} />


    <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
         
    </Route>
    <Route element={<PrivateRoute allowedRoles={["recruiter"]} />}>
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />

    </Route>
  </Routes>
  </div>
</>);
}
export default RoutePage;