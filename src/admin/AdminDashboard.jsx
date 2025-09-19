import { useState } from "react";
import AdminUsers from "./AdminUsers";
import AdminRole from "./AdminRole";

function AdminDashboard() {
  const [activePage, setActivePage] = useState("users");

  const renderContent = () => {
    switch (activePage) {
      case "users":
        return <AdminUsers />;
      case "role":
        return <AdminRole />;
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
        <h3>Admin Panel</h3>
        <hr />
        <br />
        
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li className={handleStyle("users")}>
            <button onClick={() => setActivePage("users")}> Manage Users</button>
          </li>
          <li className={handleStyle("role")}>
            <button onClick={() => setActivePage("role")}>Manage role</button>
          </li>
        </ul>
      </div>

     
      <div style={{ flex: 1, padding: "20px" }}>{renderContent()}</div>
    </div>
  );
}

export default AdminDashboard;
