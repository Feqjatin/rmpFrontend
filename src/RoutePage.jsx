import React from "react";
import HomeCommn from "./HomeCommn";
import Login from "./Login";
import SignUp from "./SignUp";
import {Routes,Route} from 'react-router-dom' ;
import NavBar from "./NavBar";
import PrivateRoute from "./component/PrivateRoute";
import AdminDashboard from "./admin/AdminDashboard";
import RoleDetails from "./admin/RoleDetails";
import ReviewerDashboard from "./Reviewer/ReviewerDashboard";
import RecruiterDashboard from "./Recruiter/RecruiterDashBoard";
import InterviewerDashboard from "./Interviewer/InterviewerDashboard";
import CandidateDashboard from "./candidate/CandidateDashboard";

function RoutePage (){
  const [count, setCount] = React.useState(0);
return (<>
<div>
    <NavBar count={count} setCount={setCount}/>
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
    <Route element={<PrivateRoute allowedRoles={["reviewer"]} />}>
        <Route path="/reviewer/dashboard" element={<ReviewerDashboard />} />
    </Route>
    <Route element={<PrivateRoute allowedRoles={["interviewer"]} />}>
        <Route path="/interviewer/dashboard" element={<InterviewerDashboard />} />
    </Route>
    <Route element={<PrivateRoute allowedRoles={["candidate"]} />}>
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
    </Route>
  </Routes>
  </div>
</>);
}
export default RoutePage;