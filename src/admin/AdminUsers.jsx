import { use, useEffect, useState } from "react";
import  {getAllUsers}  from "../api/Admin";
import { deleteUser } from "../api/Admin";
function AdminUsers()
{   
    const [loading, setLoading]=useState(false);
    const [data,setData]=useState([]);
    const [error,setError]=useState();
    const [count,setCount]=useState(0);
    useEffect(()=>{
        async function fetchData(){
            setLoading(true);
            const allUser= await getAllUsers();
            if(allUser.data === null)
            {
                setData([]);
                setError(allUser.msg);
                setLoading(false);
            }
            else{
                setError(null);
            setData(allUser);
            setLoading(false);
            }
          
        }
        fetchData();
    }
    ,[count]);
    const handleDeleteUser= async (userId)=>{
         setLoading(true);
         const deleteResponse= await deleteUser(userId);
         if(deleteResponse.data === null)
         {  
           setError(deleteResponse.msg.substring(0,100));
         }
          
         setCount(count+1);
         setLoading(false);
    }
    return(
        <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">ALL Users</h1>
      
        {loading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && data.length === 0 && <p>No users found.</p>}
      
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
                  <th className="px-4 py-2 border border-gray-300">Created At</th>
                  <th className="px-4 py-2 border border-gray-300">Updated At</th>
                  <th className="px-4 py-2 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user) => (
                  <tr
                    key={user.userId}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2 border border-gray-300">{user.userId}</td>
                    <td className="px-4 py-2 border border-gray-300">{user.username}</td>
                    <td className="px-4 py-2 border border-gray-300 max-w-xs truncate">{user.email}</td>
                    <td className="px-4 py-2 border border-gray-300">{user.phone}</td>
                    <td className="px-4 py-2 border border-gray-300">{user.status}</td>
                    <td className="px-4 py-2 border border-gray-300">{new Date(user.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2 border border-gray-300">
                      {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "N/A"}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-center">
                      <button
                        onClick={() => handleDeleteUser(user.userId)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
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
export default AdminUsers;