import React from "react";
import HomeCommn from "./HomeCommn";
import Login from "./Login";
import SignUp from "./SignUp";
import {Routes,Route} from 'react-router-dom' ;
import NavBar from "../Components/NavBar";
import PrivateRoute from "../Components/PrivateRoute";
import AdminDashboard from "../Admin/AdminDashboard";
import ReviewerDashboard from "../Reviewer/ReviewerDashboard";
import RecruiterDashboard from "../Recruiter/RecruiterDashBoard";
import InterviewerDashboard from "../Interviewer/InterviewerDashboard";
import CandidateDashboard from "../Candidate/CandidateDashboard";
import HrDashboard from "../Hr/HrDashboard";  
import RecoverAccount from "./RecoverAccount";
import Footer from "../Components/Footer";
import JobApply from "../Candidate/JobApply";
import CandidateView from "./CandidateView";
import ApplicationView from "./ApplicationView";
function RoutePage (){
  const [count, setCount] = React.useState(0);
return (<>
<div>
    <NavBar count={count} setCount={setCount}/>
  <Routes>
    <Route path="/" element={<HomeCommn />} />
    <Route path="/login" element={<Login setCount={setCount} count={count}/>} />
    <Route path="/signup" element={<SignUp/>} />
    <Route path="/recoverAccount" element={<RecoverAccount/>} />

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
        <Route path="/candidate/jobApply/:jobId" element={<JobApply />} />
    </Route>
    <Route element={<PrivateRoute allowedRoles={["hr"]} />}>
        <Route path="/hr/dashboard" element={<HrDashboard />} />
    </Route>
    <Route element={<PrivateRoute allowedRoles={["hr","interviewer","reviewer","recruiter","admin"]} />}>
        <Route path="/candidate/view/:candidateId" element={<CandidateView />} />
        <Route path="/application/view/:applicationId" element={<ApplicationView />} />
    </Route>
  </Routes>
  <Footer/>
  </div>
</>);
}
export default RoutePage;