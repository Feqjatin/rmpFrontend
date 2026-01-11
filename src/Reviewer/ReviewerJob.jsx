import { use, useEffect, useState } from "react";
import  {getJobsToReview}  from "../Api/Reviewer";
import { useSelector  } from 'react-redux'
import ReviewerJobDetails from "./ReviewerJobDetails";
import React from "react";
import ReviewerApplication from "./ReviewApplication";
function RecruiterJob()
{   
    const [loading, setLoading]=useState(false);
    const [data,setData]=useState([]);
    const [error,setError]=useState();
    const [countFor1,setCountFor1]=useState(0);
    const user= useSelector((state) => state.user.userName);
    const [page,setPage]=useState(1);
    const [selectedJobId,setSelectedJobId]=useState(null);
    const [selectedApplicationId,setSelectedApplicationId]=useState(null);
    const [skillSet, setSkillSet] = useState([]);
    useEffect(()=>{
        async function fetchData(){
            setLoading(true);
            const response= await getJobsToReview(user);
            console.log("response",response);
            if(response.data === null)
            {
                setData([]);
                setError(response.msg);
                setLoading(false);
            }
            else{
                setError(null);
            setData(response.data);
            setLoading(false);
            }
          
        }
        fetchData();
    }
    ,[countFor1,page]);
  const handleClick=(jobid)=>{
   setSelectedJobId(jobid);
    setPage(2);
  }
    return(
      <>
      {page==3&&  <ReviewerApplication initialReviewAction={selectedApplicationId} setPage={setPage} page={page} countFor1={countFor1} setCountFor1={setCountFor1} skillSet={skillSet} />}
      {page==2&& <ReviewerJobDetails jobId ={selectedJobId} setPage={setPage} page={page} countFor1={countFor1} setCountFor1={setCountFor1} setSelectedApplicationId={setSelectedApplicationId} setSkillSet={setSkillSet}/>}
      {page==1&& 
        <div className="p-6">
        <div className=" border-b mb-4"><h1 className="text-2xl font-bold mb-4">ALL jobs to Review</h1>
        </div>
      
        {loading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && data.length === 0 && <p>No jobs found.</p>}
      
        {!loading && data.length > 0 && (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border border-gray-300">JobID</th>
                  <th className="px-4 py-2 border border-gray-300">job Title</th>
                  <th className="px-4 py-2 border border-gray-300">accepted</th>
                  <th className="px-4 py-2 border border-gray-300">rejected</th>
                  <th className="px-4 py-2 border border-gray-300">onHold</th>
                  <th className="px-4 py-2 border border-gray-300">new </th>
                  <th className="px-4 py-2 border border-gray-300">published </th>
                  <th className="px-4 py-2 border border-gray-300">total </th>
                  <th  className="px-4 py-2 border border-gray-300"> </th>
                </tr>
              </thead>
              <tbody>
                {data.map((a) => (
                 
                  <tr
                    key={a.jobId}
                    className="hover:bg-gray-50 transition"
                  >
                    
                    <td className="px-4 py-2 border border-gray-300"> {a.jobId}</td>
                    <td className="px-4 py-2 border border-gray-300"> {a.jobTitle} </td>
                    <td className="px-4 py-2 border border-gray-300 ">{a.accepted}</td>
                    <td className="px-4 py-2 border border-gray-300">{a.rejected}</td>
                    <td className="px-4 py-2 border border-gray-300">{a.onHold}</td>
                    <td className="px-4 py-2 border border-gray-300">{a.new}</td>
                    <td className="px-4 py-2 border border-gray-300">{a.published}</td>
                    <td className="px-4 py-2 border border-gray-300">{a.total}</td>
                    <td className="px-4 py-2 border border-gray-300">
                      <button onClick={(e)=>{handleClick(a.jobId)}}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      >See More</button>
                  </td>
                  </tr>  
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>}
      </>
    );
}
export default RecruiterJob;