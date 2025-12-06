import { useState } from "react";
import CandidateProfile from "./CandidateProfile"
import CandidateDocument from "./CandidateDocument"
import CandidateEducation from "./CandidateEducation"
import CandidateExperience from "./CandidateExperience"
import CandidateSkill from "./CandidateSkill"
import CandidateApplication from "./CandidateApplication"

function CandidateDashboard() {
  const [activePage, setActivePage] = useState("profile");

  const renderContent = () => {
    switch (activePage) {
      case "profile":
        return <CandidateProfile/>;
        case "education":
        return <CandidateEducation/>;
        case "document":
        return <CandidateDocument/>;
        case "experience":
        return <CandidateExperience/>;
        case "skill":
        return <CandidateSkill/>;
        case "application":
        return <CandidateApplication/>;
        
       
      default:
        return <p>Select a section from the sidebar</p>;
    }
  };
  const handleStyle=(page)=>{
   if(activePage==page)
   {
    return `px-4 py-2 my-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-800 transition`;
   }
   else{
    return `px-4 py-2 my-2 bg-gray-400 text-white rounded-lg font-medium hover:bg-blue-800 transition`;
   }
  }
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
    <div style={{ width: "200px", background: "#f4f4f4", padding: "20px", minHeight: "100vh" }}>
      <h3>Candidate Panel</h3>
      <hr />
      <br />
      <ul style={{ listStyle: "none", padding: 0 }}>
         
        <li
            className={handleStyle("profile")}
            onClick={() => setActivePage("profile")}
            style={{ cursor: "pointer" }}
          >
            Profile
          </li>
          <li
            className={handleStyle("education")}
            onClick={() => setActivePage("education")}
            style={{ cursor: "pointer" }}
          >
            Education
          </li>
          <li
            className={handleStyle("document")}
            onClick={() => setActivePage("document")}
            style={{ cursor: "pointer" }}
          >
            Document
          </li>
          <li
            className={handleStyle("experience")}
            onClick={() => setActivePage("experience")}
            style={{ cursor: "pointer" }}
          >
            Experience
          </li>
          <li
            className={handleStyle("skill")}
            onClick={() => setActivePage("skill")}
            style={{ cursor: "pointer" }}
          >
            Skill
          </li>
          <li
            className={handleStyle("application")}
            onClick={() => setActivePage("application")}
            style={{ cursor: "pointer" }}
          >
           All Applications
          </li>
         
      </ul>
    </div>
  
    <div style={{ flex: 1, padding: "20px" }}>{renderContent()}</div>
  </div>
  
  );
}

export default CandidateDashboard;
