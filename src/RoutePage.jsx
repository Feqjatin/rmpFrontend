import React from "react";
import HomeCommn from "./HomeCommn";
import Login from "./Login";
import SignUp from "./SignUp";
import {Routes,Route} from 'react-router-dom' ;
import NavBar from "./NavBar";
function RoutePage (){
return (<>
<div>
    <NavBar/>
  <Routes>
    <Route path="/" element={<HomeCommn/>} />
    <Route path="/login" element={<Login/>} />
    <Route path="/signup" element={<SignUp/>} />
  </Routes>
  </div>
</>);
}
export default RoutePage;