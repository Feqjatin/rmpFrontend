import React, { use, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllInterview } from '../api/Interviewer';
import InterviewerApplication from './InterviewerApplication';
 

function InterviewerManage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState();
  const [count, setCount] = useState(0);  
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Upcoming', 'Completed', 'Cancelled','Pre-Scheduled'];
  const activeIndex = tabs.indexOf(activeTab);
  
  const user= useSelector((state) => state.user.userName);
  const [page, setPage] = useState(1);  
  const [selectedInterview, setSelectedInterview] = useState(null);
  useEffect( () => {
    async function fetchData() {
        setLoading(true);
        const response = await getAllInterview(user);
  
        if (!response || !response.data) {
          setData([]);
          setFilteredData([]);
          setError(response?.msg || "No data found");
        } else {
          setError(null);
          setData(response.data);
          setFilteredData(response.data);  
        }
        setLoading(false);
      }
      fetchData();

  },[count]);
  const handleNavigate = (a) => {
    setSelectedInterview(a);
    setPage(2);
    
  }
  useEffect(() => {
    if (activeTab === 'All') {
      setFilteredData(data);
    } 
    else if(activeTab==='Upcoming'){
        const filtered = data.filter((item) => item.status === 'Scheduled' || item.status==='Rescheduled');
        filtered.sort((a, b) => new Date(a.scheduledStartTime) - new Date(b.scheduledStartTime));
        setFilteredData(filtered);
    }
    else {
      const filtered = data.filter((item) => item.status === activeTab);
      setFilteredData(filtered);
    }
  }, [activeTab]);

  return (
    <>
    {page ===2 && <InterviewerApplication setPage={setPage} data={selectedInterview} refresh={setCount}/>}
    {page ===1 &&
    <div>
        <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-2xl border border-gray-200 font-sans" style={{ background: "#dce9f2" }}>
        <div className="relative">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-1/5 py-2 text-sm font-semibold transition-colors duration-300 ${  
                  activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div
            className="absolute bottom-0 h-0.5 bg-blue-600 rounded-full transition-transform duration-300 ease-in-out"
            style={{
              width: '20%',  
              transform: `translateX(${activeIndex * 100}%)`
            }}
          />
        </div>

        <div className="p-6">
          {loading && <p className="text-blue-500">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && filteredData.length === 0 && <p>No Applications Found</p>}

          {!loading && filteredData.length > 0 && (
            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border border-gray-300">job title</th>
                    <th className="px-4 py-2 border border-gray-300">candidate name</th>
                    <th className="px-4 py-2 border border-gray-300">Date-Time</th>
                    <th className="px-4 py-2 border border-gray-300">Status</th>  
                    <th className="px-4 py-2 border border-gray-300">Round Order</th>
                    <th className="px-4 py-2 border border-gray-300">Round Name</th>
                    <th className="px-4 py-2 border border-gray-300">roundType</th>     
                    <th className="px-4 py-2 border border-gray-300">View Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((a) => ( 
                    <tr key={a.interviewId} >
                   <td key={a.id} className="px-4 py-2 border border-gray-300 text-center">{a.jobInfo.title}</td>
                   <td className="px-4 py-2 border border-gray-300 text-center">{a.candidateInfo.name}</td>
                     <td className="px-4 py-2 border border-gray-300 text-center">
                        {new Date(a.scheduledStartTime).toLocaleString()} - 
                        {new Date(a.scheduledEndTime).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-center">{a.status}</td>
                    <td className="px-4 py-2 border border-gray-300 text-center">{a.roundInfo.roundSequence}</td>
                    <td className="px-4 py-2 border border-gray-300 text-center">{a.roundInfo.roundName}</td>
                    <td className="px-4 py-2 border border-gray-300 text-center">{a.roundInfo.roundType}</td>
                    <td className="px-4 py-2 border border-gray-300 text-center">
                      <a 
                        
                        className="text-blue-500 hover:underline"
                        onClick={() => handleNavigate(a)}
                      >
                        View Details
                      </a>
                    </td>
                   </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </div>
    </div>
}
    </>
  );
}
export default InterviewerManage;


