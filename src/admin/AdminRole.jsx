import { useEffect } from "react";
import { useState } from "react";
import  {getAllRoles}  from "../api/Admin";
import { deleteRole } from "../api/Admin";
import { addRoleFun } from "../api/Admin";
import RoleDetails from "./RoleDetails";
function AdminRole()
{
    const [loading, setLoading]=useState(false);
    const [data,setData]=useState([]);
    const [error,setError]=useState();
    const [count,setCount]=useState(0);
    const [addRole,setAddRole]=useState(false);
    const [seeMoreRoleId,setSeeMoreRoleId]=useState(null);
    useEffect(()=>{
        async function fetchData(){
            setLoading(true);
            const allRole= await getAllRoles();
            if(allRole.data === null)
            {
                setData([]);
                setError(allRole.msg.substring(0,100));
                setLoading(false);
            }
            else{
                setError(null);
            setData(allRole);
            setLoading(false);
            }
        }
        fetchData();
    },[count]);
    const handleDeleteRole= async (roleId)=>{
        setLoading(true);
        const deleteResponse= await deleteRole(roleId);
        if(deleteResponse.data === null)
        {  
          setError(deleteResponse.msg.substring(0,100));
        }
        setCount(count+1);
        setLoading(false);
    }
     const handleAddRole= async()=>{
        
        const roleName=document.getElementById("name").value;
        const description=document.getElementById("description").value;
        if(roleName === "")
        {
            setError("Role name is required");
            return;
        }
        setLoading(true);
        const response =await addRoleFun({roleName:roleName,description:description});
        if(response.data === null)
        {
            setError(response.msg.substring(0,100));
            setLoading(false);
            return;
        }
        setAddRole(false);
        console.log("roles",response);
        setCount(count+1);
        setLoading(false);

    }
    const handleSeeMoreRoleId= ()=>{
        console.log("see more",seeMoreRoleId);
       return  <RoleDetails role={seeMoreRoleId}/>
    }
    return(
        <div className="p-6">
       <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">ALL Roles</h1>
                <button
                onClick={() => setAddRole(true)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                ADD ROLE
                </button>
            </div>

                  
        {loading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {addRole && (
                      <>
                      <div className="mb-3">
                        <input
                          type="text"
                          placeholder="Role Name"
                          className="w-full border px-2 py-1 mb-2"
                          id="name"
                        />
                        <input
                          type="text"
                          placeholder="Role Description"
                          className="w-full border px-2 py-1"
                          id="description"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setAddRole(false)}
                          className="bg-gray-300 px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          onClick={handleAddRole}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Add Role
                        </button>
                      </div>
                      </>
                    
                    )}
        {!loading && data.length === 0 && <p>No Role found.</p>}
          
        {seeMoreRoleId && (handleSeeMoreRoleId())}
        {!loading && !seeMoreRoleId &&data.length > 0 && (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border border-gray-300">ID</th>
                  <th className="px-4 py-2 border border-gray-300">Name</th>
                  <th className="px-4 py-2 border border-gray-300">Description</th>
                </tr>
              </thead>
              <tbody>
                {data.map((role) => (
                  <tr
                    key={role.roleId}
                    className="hover:bg-gray-50 transition" 
                  >
                    <td className="px-4 py-2 border border-gray-300">{role.roleId}</td>
                    <td className="px-4 py-2 border border-gray-300">{role.roleName}</td>
                    <td className="px-4 py-2 border border-gray-300 max-w-xs truncate">{role.description ? role.description : "N/A"}</td>
                    
    
                    <td className="px-4 py-2 border border-gray-300 text-center flex items-center gap-4 justify-center ">
                      <button
                        onClick={() => handleDeleteRole(role.roleId)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        DELETE
                      </button>
                      <button
                        onClick={() => setSeeMoreRoleId(role)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                      >
                        SEE MORE
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
export default AdminRole;