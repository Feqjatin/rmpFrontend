import { useEffect, useState } from "react";
import { getAllUserBYRole } from "../api/Admin";
import { deleteUserToRole } from "../api/Admin";
import { getAllUsers } from "../api/Admin";
import { assignRole } from "../api/Admin";
function RoleDetails({ role, setSeeMoreRoleId}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);  
  const [addUserInput, setAddUserInput] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  
  useEffect(() => {
    setFilteredUsers( allUsers
    .filter((user) => user.username.toLowerCase().includes(addUserInput.toLowerCase()))
    .slice(0, 5));
    console.log(allUsers
      .filter((user) => user.username.toLowerCase().includes(addUserInput.toLowerCase()))
      .slice(0, 5));
      console.log("all users",allUsers);
  },[addUserInput,allUsers]);

  useEffect(() => {
    async function fetchData() {
      try {
         
        setLoading(true);
        const response = await getAllUserBYRole({ roleId: role.roleId });
        const responseUser=await getAllUsers();
        
                 setAllUsers(responseUser);
                 console.log("all usersd",responseUser);
        

        if (!response || !response.data) {
          setData([]);
          setError(response?.msg || "No users found for this role.");
        } else {
          setData(response.data);  
          setError(null);
        }
      } catch (err) {
        setError("Failed to fetch users.");
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    if (role) fetchData();
  }, [role, count]);

  const handleDeleteUser = async (userId) => {
    setLoading(true);
    setError(null);
    const deleteResponse= await deleteUserToRole({userId:userId,roleId:role.roleId});
    if(deleteResponse.data === null)
    {  
      setError(deleteResponse.msg.substring(0,100));
    }
     setCount(count+1);
    setLoading(false);
  };
  const handleAssign= async()=>{
    if(addUserInput.trim()==="")
    {
      setError("Please enter a username to assign");
      return;
    }
    const userToAssign= allUsers.find(user=>user.username.toLowerCase()===addUserInput.toLowerCase());
    if(!userToAssign)
    {
      setError("User not found");
      return;
    }
    setLoading(true);
    setError(null);
    const assignResponse= await assignRole({userId:userToAssign.userId,roleId:role.roleId});
    if(assignResponse.data === null)
    {  
      setError(assignResponse.msg.substring(0,100));
      setLoading(false);
      return;
    } setError(null);
     setCount(count+1);
     setAddUserInput("");
    setLoading(false);
  }
  const handleGoBack=()=>{
    setSeeMoreRoleId(null);
  }
  return (
    <div> 
    
    <div className="flex items-center gap-2" onClick={handleGoBack}>
        <img src="../back.png" height="10" width="10" />
        <button 
           
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          Back
        </button>
      </div>
      {role ? (
  <>
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Role Details</h2>

    <div className="space-y-2">
      <div className="flex">
        <span className="font-semibold w-32">Role ID:</span>
        <span>{role.roleId}</span>
      </div>

      <div className="flex">
        <span className="font-semibold w-32">Role Name:</span>
        <span>{role.roleName}</span>
      </div>

      <div className="flex">
        <span className="font-semibold w-32">Description:</span>
        <span>{role.description}</span>
      </div>
    </div>
  </>
) : (
  <p className="text-red-500">No role selected.</p>
)}



          {error && <p className="text-red-500 mt-2">{error}</p>}
          
         <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={addUserInput}
              onChange={(e) => setAddUserInput(e.target.value)}
              placeholder="Search user..."
              className="flex-1 p-2 border rounded-md border-gray-300"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={handleAssign}>
              Assign
            </button>
            
          </div>
    

       {addUserInput.length>=1 && (filteredUsers.length>0 ?( 
       <ul className="mt-2 border  shadow">
         
          {filteredUsers.map((user) => (
            <li
              key={user.userId}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => setAddUserInput(user.username)}  
            >
              {user.username}
            </li>
          ))}
        </ul>):(
          <p className="mt-2 border rounded-md bg-gray-200 shadow">No users found As mentioned</p>
        )
        )}
        <br />
      

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {role && !loading && data.length === 0 && (
        <p className="text-gray-500">No users found for this role.</p>
      )}
      {!loading && data.length > 0 && (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border border-gray-300">ID</th>
                <th className="px-4 py-2 border border-gray-300">Username</th>
                <th className="px-4 py-2 border border-gray-300">Email</th>
                <th className="px-4 py-2 border border-gray-300">Phone</th>
                <th className="px-4 py-2 border border-gray-300">Status</th>
                <th className="px-4 py-2 border border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user.userId} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-300">{user.userId}</td>
                  <td className="px-4 py-2 border border-gray-300">{user.username}</td>
                  <td className="px-4 py-2 border border-gray-300 truncate">{user.email}</td>
                  <td className="px-4 py-2 border border-gray-300">{user.phone}</td>
                  <td className="px-4 py-2 border border-gray-300">{user.status}</td>
                  <td className="px-4 py-2 border border-gray-300 text-center">
                    <button
                      onClick={() => handleDeleteUser(user.userId)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RoleDetails;
