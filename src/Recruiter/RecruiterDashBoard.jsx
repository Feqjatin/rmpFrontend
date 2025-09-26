import { useState } from "react";
import RecruiterJob from "./RecruiterJob";
import RecruiterSkill from "./RecruiterSkill";
import RecruiterCandidate from "./RecruiterCandidate";

function RecruiterDashboard() {
  const [activePage, setActivePage] = useState("job");

  const renderContent = () => {
    switch (activePage) {
      case "job":
        return <RecruiterJob />;
      case "skill":
        return <RecruiterSkill />;
      case "candidate":
        return <RecruiterCandidate />;
      default:
        return <p>Select a section from the sidebar</p>;
    }
  };
  const handleStyle=(page)=>{
   if(activePage==page)
   {
    return `px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition`;
   }
   else{
    return `px-4 py-2 bg-gray-400 text-white rounded-lg font-medium hover:bg-blue-700 transition`;
   }
  }
  return (
    <div style={{ display: "flex", height: "100vh" }}>
       
      <div style={{ width: "200px", background: "#f4f4f4", padding: "20px" }}>
        <h3>Recuiter Panel</h3>
        <hr />
        <br />
        
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li className={handleStyle("job")}>
            <button onClick={() => setActivePage("job")}> Manage Jobs</button>
          </li>
          <li className={handleStyle("skill")}>
            <button onClick={() => setActivePage("skill")}>Manage skills</button> 
          </li>
          <li className={handleStyle("candidate")}>
            <button onClick={() => setActivePage("candidate")}>Manage candidates</button>
          </li>
        </ul>
      </div>

     
      <div style={{ flex: 1, padding: "20px" }}>{renderContent()}</div>
    </div>
  );
}

export default RecruiterDashboard;
