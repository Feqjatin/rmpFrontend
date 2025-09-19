import { useEffect, useState } from "react";
import { getAllJobsbyUser} from "../api/Recruiter";
import { useSelector } from "react-redux";
import JobView from "./JobView";
function RecruiterJob() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  const [seeMore, setSeeMore] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const user= useSelector((state) => state.user.userName);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const allJobs = await getAllJobsbyUser(user);
        if (allJobs.data === null) {
          setData([]);
          setError(allJobs.msg.substring(0, 100));
        } else {
          setError(null);
          setData(allJobs.data);
        }
      } catch (err) {
        setError("Failed to fetch jobs.");
      }
      setLoading(false);
    }
    fetchData();
  }, [count]);

 const handleSeeMore=()=>{
  return <JobView job={selectedJob} goBack={()=>{setSeeMore(false);setSelectedJob(null);}} />
 }
  

  const renderSkills = (skills) => {
    return skills.map((skill) => (
      <span
        key={skill.skillId}
        className="text-xs px-2 py-1 rounded-full border border-gray-300 bg-gray-100 mr-2"
      >
        {skill.skillName}
      </span>
    ));
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    
    <div className="p-6 max-w-4xl mx-auto">
     
      {loading && <p className="text-blue-500 text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {seeMore ? (
        handleSeeMore()
      ):( 
        <>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Job Openings</h1>
            <button
              onClick={() => console.log("Add Job form toggle")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
            >
              ADD JOB
            </button>
          </div>

      {!loading && data.length === 0  && <p className="text-center">No job openings found.</p>}

      {!loading  && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((job) => (
            <div
              key={job.jobId}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start transition-transform transform hover:scale-105"
            >
              <div className="flex items-center mb-4">
                <img
                  src="/assets/B.png"
                  alt="Company Logo"
                  className="w-16 h-16 rounded-full mr-4 border-2 border-gray-200"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                  <p className="text-sm text-gray-500">{job.location}</p>
                </div>
              </div>
              <div className="w-full">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Min. Experience:</span>{" "}
                  {job.minExperience ? `${job.minExperience} years` : "N/A"}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="text-sm font-medium text-gray-600">Skills:</span>
                  {renderSkills(job.skills)}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  <p>
                    <span className="font-medium">Status:</span> {job.status}
                  </p>
                  <p>
                    <span className="font-medium">Updated On:</span>{" "}
                    {formatDate(job.updatedAt)}
                  </p>
                </div>
              </div>
              <div className="mt-auto flex justify-between w-full">
                 <button
                  onClick={() => {setSeeMore(!seeMore);setSelectedJob(job);}}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                  SEE MORE
                </button>
              </div>
            </div>
            
          ))}
        </div>
      )}</>
      )}
     

       
    </div>
  );
}

export default RecruiterJob;