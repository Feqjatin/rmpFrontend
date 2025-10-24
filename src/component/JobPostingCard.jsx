 
import React from 'react';
import { useEffect } from 'react';
 import { useState } from 'react';
 import { getJobDetails } from '../api/forAll';

 
 const LocationPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"   fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-500">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
  
  const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"   fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-500">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
  
  const UserIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-500">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
      </svg>
  );
  
  
  
  


 
const JobPostingCard = ({ jobid, setSkillSet}) => {
 
    const [jobData, setJobData] = useState({});
    const [loading, setLoading]=useState(false);
    const [data,setData]=useState([]);
    const [error,setError]=useState();
    const [count,setCount]=useState(0);
    const [page,setPage]=useState(1);
    const [selectedJobId,setSelectedJobId]=useState(null);
    useEffect(()=>{
        async function fetchData(){
            setLoading(true);
            const response= await  getJobDetails(jobid);
            console.log("response",response.data);
            if(response.data === null)
            {
                setData([]);
                setError(response.msg);
                setLoading(false);
            }
            else{
                setError(null);
            setSkillSet(response.data[0].skills);
            setData(response.data[0]);
            setJobData(response.data[0]);
            setLoading(false);
            }
          
        }
        fetchData();
    }
    ,[count]);

  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
<>
    {loading && <p className="text-blue-500">Loading...</p>}
    {error && <p className="text-red-500">{error}</p>}
    
  
    {!loading && jobData!= null && 
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-2xl   border border-gray-200 font-sans" style={{background: "#dce9f2"}}>
      
    
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border">
          <img 
            src={`https://placehold.co/64x64/E2E8F0/4A5568?text=Logo`} 
            alt="Company Logo"
            className="rounded-lg"
          />
        </div>
        <div>
          <div className="flex items-center gap-3">
             <h1 className="text-2xl font-bold text-blue-600">{jobData.title || 'Job Title'}</h1>
             {jobData.status && (
               <span className="px-2.5 py-0.5 text-xs font-semibold text-green-800 bg-green-100 rounded-full border border-green-200">
                  {jobData.status}
               </span>
             )}
          </div>
          <p className="text-md text-gray-600">{jobData.location || 'Location'}</p>
        </div>
      </div>
       
    </div>

    
    {jobData.description && (
      <div className="mb-6 pl-1">
        <p className="text-gray-700">{jobData.description}</p>
      </div>
    )}

  
    <div className="space-y-3 mb-6 pl-1">
      <div className="flex items-center space-x-3">
        <LocationPinIcon />
        <span className="text-gray-700">{jobData.location || 'Location details not available'}</span>
      </div>
      <div className="flex items-center space-x-3">
        <CalendarIcon />
        <span className="text-gray-700">
          Posted On: {formatDate(jobData.createdAt)}
        </span>
      </div>
       <div className="flex items-center space-x-3">
        <CalendarIcon />
        <span className="text-gray-700">
          Updated On: {formatDate(jobData.updatedAt)}
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <UserIcon />
        <span className="text-gray-700">
          Posted by: User ID {jobData.createdBy}
        </span>
      </div>
    </div>

    
    {jobData.skills && jobData.skills.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {jobData.skills.map((skill) => (
          <span
            key={skill.skillId}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors
              ${skill.skillType === 'Required' 
                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                : 'bg-gray-100 text-gray-800 border border-gray-200'}`}
          >
            {skill.skillName}
          </span>
        ))}
         <span className="px-3 py-1 text-sm font-medium rounded-full transition-colors bg-gray-100 text-gray-800 border border-gray-200">
            {jobData.minExperience}+ years experience
          </span>
      </div>
    )}
  </div>
          }
    </>
  );

        }
 
export default JobPostingCard;