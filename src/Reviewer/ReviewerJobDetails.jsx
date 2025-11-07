
import React, { useState, useEffect } from 'react';
 
import JobPostingCard from '../component/JobPostingCard';
import { getApplicationsToReview } from '../api/Reviewer';
import { useSelector } from 'react-redux'
import { updateApplicationsStatus } from '../api/Reviewer';
import { getJobDetails } from '../api/forAll';


function ReviewerJobDetails({ jobId, setPage,page,countFor1 , setCountFor1, setSelectedApplicationId ,setSkillSet}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState();
  const [count, setCount] = useState(0);  
  const [activeTab, setActiveTab] = useState('All');
  const [jobData, setJobData] = useState({});
 const user= useSelector((state) => state.user.userName);
  const [selectedApplicationIds, setSelectedApplicationIds] = useState([]);

  const tabs = ['All', 'New', 'On Hold', 'Accepted', 'Rejected'];
  const activeIndex = tabs.findIndex(tab => tab === activeTab);
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const response = await getApplicationsToReview(jobId);
      const responseOfJobDetails= await  getJobDetails(jobId);
      if (!response || !response.data) {
        setData([]);
        setFilteredData([]);
        setError(response?.msg || "No data found");
      } else {
        setError(null);
        setData(response.data);
        setFilteredData(response.data);  
      }
      if(responseOfJobDetails.data === null)
      {
          setError(responseOfJobDetails.msg);
      }
      else{
      setSkillSet(responseOfJobDetails.data[0].skills);
      setJobData(responseOfJobDetails.data[0]);
      }
      setLoading(false);
    }
    fetchData();
  }, [jobId, count,page,countFor1]);

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
    
    setSelectedApplicationIds([]);
    setLoading(false);
  }, [activeTab, data]);

  
  const handleNavigate = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setPage(3);
  };

  

 
  const handleSelectApplication = (applicationId) => {
    setSelectedApplicationIds(prevSelectedIds =>
      prevSelectedIds.includes(applicationId)
        ? prevSelectedIds.filter(id => id !== applicationId)
        : [...prevSelectedIds, applicationId]
    );
  };

  
  const handleSelectAll = () => {
    const currentFilteredIds =  filteredData.filter(app => !app.isPublished).map(app => app.applicationId);
    
   
    const allFilteredSelected = currentFilteredIds.length > 0 && currentFilteredIds.every(id => selectedApplicationIds.includes(id));

    if (allFilteredSelected) {
    
      setSelectedApplicationIds(prevSelectedIds =>
        prevSelectedIds.filter(id => !currentFilteredIds.includes(id))
      );
    } else {
      
      setSelectedApplicationIds(prevSelectedIds =>
         
        [...new Set([...prevSelectedIds, ...currentFilteredIds])]
      );
    }
  };
   
  
  
  const handleBulkAction =  async (status) => {
   // console.log(`Action: ${status}, Applications: ${selectedApplicationIds.join(', ')}`);
    
    setLoading(true);
    var filtered=[];
    if(status==='Published'){
       filtered = data.filter(item => (item.status === 'Accepted'||item.status === 'Rejected') && selectedApplicationIds.includes(item.applicationId)).map(item => item.applicationId);
       console.log("filtered",filtered);
       console.log("selectedApplicationIds",selectedApplicationIds);
    }
    else {
      filtered=selectedApplicationIds;
    
    }
    const response = await updateApplicationsStatus({ids: filtered, status: status,username:user});

    if (!response.data ==null) {
      setError(response?.msg || "");
    }
    setLoading(false);
    setCountFor1(c => c + 1);
    setSelectedApplicationIds([]);
    setCount(c => c + 1);  
  };

  
  const allFilteredSelected = filteredData.length > 0 && filteredData.every(app => selectedApplicationIds.includes(app.applicationId));

  return (
     
    <div className="pb-24">
      <button onClick={() => setPage(1)} className="mb-4 text-blue-600 hover:text-blue-800 font-semibold">Back</button>
      <JobPostingCard jobData={jobData} />
      
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
                    <th className="px-4 py-2 border border-gray-300">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600 rounded"
                        checked={allFilteredSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-4 py-2 border border-gray-300">Publish Status</th>
                    <th className="px-4 py-2 border border-gray-300">Application Id</th>
                    <th className="px-4 py-2 border border-gray-300">ReviewerUserId</th>
                    <th className="px-4 py-2 border border-gray-300">Personal Note</th>
                    <th className="px-4 py-2 border border-gray-300">Action Date</th>
                    <th className="px-4 py-2 border border-gray-300">View Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((a) => (
                    <tr key={a.applicationId} className={`hover:bg-gray-50 transition  ${
                      selectedApplicationIds.includes(a.applicationId)
                        ? 'bg-orange-100'  
                        : a.status === 'Accepted'
                        ? 'bg-green-100'  
                        : a.status === 'Rejected'
                        ? 'bg-red-100'  
                        : a.status === 'OnHold'
                        ? 'bg-yellow-100'  
                        : 'bg-gray-50'  
                    }`}>
                      <td className="px-4 py-2 border border-gray-300 text-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-blue-600 rounded"
                          checked={selectedApplicationIds.includes(a.applicationId)}
                          onChange={() => {if(!a.isPublished)handleSelectApplication(a.applicationId);else alert("Published applications cannot be selected");}}
                        />
                      </td>
                      <td className="px-4 py-2 border border-gray-300">{a.isPublished?'Pulished':'Not Published'}</td>
                      <td className="px-4 py-2 border border-gray-300">{a.applicationId}</td>
                      <td className="px-4 py-2 border border-gray-300">{a.reviewerUserId ?? "N/A"}</td>
                      <td className="px-4 py-2 border border-gray-300">
                      {a.personalNote 
                        ? (a.personalNote.length > 30 
                            ? a.personalNote.slice(0, 30) + "..." 
                            : a.personalNote)
                        : "—"}
                    </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {a.actionDate
                          ? new Date(a.actionDate).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })
                          : '—'}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-center">
                        <button 
                          onClick={() => handleNavigate(a)}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
  
       
      {selectedApplicationIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-gray-200 z-50">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div>
              <span className="font-semibold text-gray-700">
                {selectedApplicationIds.length} application(s) selected
              </span>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => handleBulkAction('Accepted')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition shadow-sm"
              >
                Accept
              </button>
              <button 
                onClick={() => handleBulkAction('Rejected')}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition shadow-sm"
              >
                Reject
              </button>
              <button 
                onClick={() => handleBulkAction('OnHold')}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition shadow-sm"
              >
                On Hold
              </button>
              <button 
                onClick={() => handleBulkAction('Published')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition shadow-sm"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewerJobDetails;


 