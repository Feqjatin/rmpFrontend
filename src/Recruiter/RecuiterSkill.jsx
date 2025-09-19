import React, { useEffect, useState } from "react";
import  {getAllSkills,deleteSkill,createSkill } from "../api/Recruiter";
function RecuiterSkill() {
  const [loading, setLoading]=useState(false);
  const [data,setData]=useState([]);
  const [error,setError]=useState();
  const [count,setCount]=useState(0);
  const [newSkill,setNewSkill]=useState(false);

  useEffect(()=>{
    async function fetchData(){
        setLoading(true);
        const response= await getAllSkills();
        if(response.data === null)
        {
            setData([]);
            setError(response.msg.substring(0,100));
            setLoading(false);
        }
        else{
            setError(null);
        setData(response.data);
        setLoading(false);
        }
    }
    fetchData();
},[count]);
const handleDeleteskill= async(skillId)=>{
    setLoading(true);
    const deleteResponse= await deleteSkill({skillId:skillId});
    if(deleteResponse.data === null)
    {  
      setError(deleteResponse.msg.substring(0,100));
    }
    setCount(count+1);
    setLoading(false);
}

const handleAddSkill= async()=>{
  const skillName=document.getElementById("skillName").value;
  const description=document.getElementById("description").value;
  if(skillName === ""){
    return setError("Skill name is required");
  }
  setLoading(true);
  const Response= await createSkill({skillName:skillName,description:description});
  console.log(Response);
  if(Response.data === null)
  {  
    setError(Response.msg.substring(0,100));
  }
  setCount(count+1);
  setNewSkill(false);
 setLoading(false);
}


  return (
    <div className="recuiter-skill">
       {error && <p className="text-red-500">{error}</p>}
      {newSkill==true ? (
         
        <div>
          <h2 className="text-2xl font-bold mb-4">Add New Skill</h2>
          
            <div>
              <label htmlFor="skillName" className="block text-sm font-medium text-gray-700">
                Skill Name
              </label>
              <input
                type="text"
                id="skillName"
                name="skillName"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter skill name"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter skill description"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {setNewSkill(false);setError(null);}}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                onClick={handleAddSkill}
              >
                Add Skill
              </button>
            </div>
          
         </div>
      ):(
        <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold"> Recruiter-Skill</h1>
        <button
        onClick={() => setNewSkill(true)}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition mr-30"
        >
        ADD SKILL 
        </button>
    </div>
      )}
     {!loading &&data.length > 0 && (
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
                {data.map((skill) => (
                  <tr
                    key={skill.skillId}
                    className="hover:bg-gray-50 transition" 
                  >
                    <td className="px-4 py-2 border border-gray-300">{skill.skillId}</td>
                    <td className="px-4 py-2 border border-gray-300">{skill.skillName}</td>
                    <td className="px-4 py-2 border border-gray-300 max-w-xs truncate">{skill.description ? skill.description : "N/A"}</td>
                    
    
                    <td className="px-4 py-2 border border-gray-300 text-center flex items-center gap-4 justify-center ">
                      <button
                        onClick={() => handleDeleteskill(skill.skillId)}
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
export default RecuiterSkill;