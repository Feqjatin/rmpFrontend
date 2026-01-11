import { useState } from "react";
 import HRSelectedManage from "./HRSelectedManage";

function HrDashboard() {
  const [activePage, setActivePage] = useState("Review");

  const renderContent = () => {
    switch (activePage) {
      case "Review":
        return <HRSelectedManage/>;
     
      default:
        return <p>Select a section from the sidebar</p>;
    }
  };
  
  const handleStyle = (page) => {
    if (activePage === page) {
      return `px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition mb-2`;
    } else {
      return `px-4 py-2 bg-gray-400 text-white rounded-lg font-medium hover:bg-blue-700 transition mb-2`;
    }
  };
  
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "200px", background: "#f4f4f4", padding: "20px", minHeight: "100vh" }}>
        <h3>HR Panel</h3>
        <hr />
        <br />
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li
            className={handleStyle("Review")}
            onClick={() => setActivePage("Review")}
            style={{ cursor: "pointer" }}
          >
            Manage Documents Review
          </li>
          
        </ul>
      </div>
      <div style={{ flex: 1, padding: "20px" }}>{renderContent()}</div>
    </div>
  );
}

export default HrDashboard;