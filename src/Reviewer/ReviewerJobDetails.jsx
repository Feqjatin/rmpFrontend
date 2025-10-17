import React, { useState, useEffect } from 'react';
import JobPostingCard from '../component/JobPostingCard';
import { getApplicationsToReview } from '../api/Reviewer';

function ReviewerJobDetails({ jobId, setPage, page,setSelectedApplicationId }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);            
  const [filteredData, setFilteredData] = useState([]);  
  const [error, setError] = useState();
  const [count, setCount] = useState(0);
  const [activeTab, setActiveTab] = useState('All');
   
  const tabs = ['All', 'New', 'On Hold', 'Accepted', 'Rejected'];
  const activeIndex = tabs.findIndex(tab => tab === activeTab);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      console.log("jobId", jobId);

      const response = await getApplicationsToReview(jobId);
      console.log("response", response);

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
  }, [jobId, count]);

  useEffect(() => {
    setLoading(true);
    if (activeTab === 'All') {
      setFilteredData(data);
    } else {
      const statusMap = {
        'New': 'New',
        'On Hold': 'OnHold',
        'Accepted': 'Accepted',
        'Rejected': 'Rejected'
      };
      const filtered = data.filter(item => item.status === statusMap[activeTab]);
      setFilteredData(filtered);
    }
    setLoading(false);
  }, [activeTab, data]);  

  const handleClick = (id) => {
    setSelectedApplicationId(id);
     setPage(3);
  };

  return (
    
    <>
     
   
      <JobPostingCard jobid={jobId} />
      <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-2xl border border-gray-200 font-sans" style={{ background: "#dce9f2" }}>
        <div className="relative">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-1/4 py-2 text-sm font-semibold transition-colors duration-300 ${
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
                    <th className="px-4 py-2 border border-gray-300">Application Id</th>
                    <th className="px-4 py-2 border border-gray-300">ReviewerUserId</th>
                    <th className="px-4 py-2 border border-gray-300">Personal Note</th>
                    <th className="px-4 py-2 border border-gray-300">Action Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((a) => (
                    <tr key={a.applicationId} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-2 border border-gray-300">
                        <button onClick={() => handleClick(a)}>{a.applicationId}</button>
                      </td>
                      <td className="px-4 py-2 border border-gray-300">{a.reviewerUserId ?? "N/A"}</td>
                      <td className="px-4 py-2 border border-gray-300">{a.personalNote ?? "—"}</td>
                      <td className="px-4 py-2 border border-gray-300">
                        {a.actionDate
                          ? new Date(a.actionDate).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
  
       
    </>
  );
}

export default ReviewerJobDetails;
