import React, { useEffect, useState } from 'react';
import { getApplicationsByJobId,getMatchByJobId } from '../api/Recruiter';
function ApplicationsForJob({ jobId }) {
  const [loading, setLoading] = useState(false);
  const [applicationsData, setApplicationsData] = useState([]);
  const [matchesData, setMatchesData] = useState([]);
  const [error, setError] = useState();
  const [activeTab, setActiveTab] = useState('In Process');
  const tabs = ['In Process', 'Possible Matches'];
  const activeIndex = tabs.indexOf(activeTab);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
        setError(null);
            const response = await getApplicationsByJobId(jobId);
            if (response.data) {
                setApplicationsData(response.data);
            } else {
                setError('Failed to fetch applications data.');
            }

            const matchesResponse = await getMatchByJobId(jobId);
            if (matchesResponse.data) {
                setMatchesData(matchesResponse.data.sort((a, b) => b.rank - a.rank));
            }else{
                setError('Failed to fetch matches data.');
            }
       

    
      setLoading(false);
    }
    
    fetchData();
  }, [jobId]);

  const handleViewDetails = (candidate) => {
    console.log('View details for:', candidate);
 
  };

  const handleInviteCandidate = (candidate) => {
    console.log('Invite candidate:', candidate);
   
  };

  return (
    <div>
      <div className="max-w-6xl mx-auto my-8 p-6 bg-white rounded-2xl border border-gray-200 font-sans" style={{ background: "#dce9f2" }}>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Job Applications</h2>
        
        <div className="relative mb-6">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-1/2 py-2 text-sm font-semibold transition-colors duration-300 ${  
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
              width: '50%',  
              transform: `translateX(${activeIndex * 100}%)`
            }}
          />
        </div>

        <div className="p-6">
          {loading && <p className="text-blue-500">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* In Process Tab */}
          {!loading && activeTab === 'In Process' && (
            <>
              {applicationsData.length === 0 ? (
                <p>No Applications in Process</p>
              ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                  <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 border border-gray-300">Candidate Name</th>
                        <th className="px-4 py-2 border border-gray-300">Email</th>
                        <th className="px-4 py-2 border border-gray-300">Phone</th>
                        <th className="px-4 py-2 border border-gray-300">Status</th>
                        <th className="px-4 py-2 border border-gray-300">Applied At</th>
                        <th className="px-4 py-2 border border-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicationsData.map((app) => (
                        <tr key={app.applicationId}>
                          <td className="px-4 py-2 border border-gray-300 text-center">{app.name}</td>
                          <td className="px-4 py-2 border border-gray-300 text-center">{app.email}</td>
                          <td className="px-4 py-2 border border-gray-300 text-center">{app.phone}</td>
                          <td className="px-4 py-2 border border-gray-300 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              app.applicationStatus === 'Interview' ? 'bg-blue-100 text-blue-800' :
                              app.applicationStatus === 'Screening' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {app.applicationStatus}
                            </span>
                          </td>
                          <td className="px-4 py-2 border border-gray-300 text-center">
                            {new Date(app.appliedAt).toLocaleString()}
                          </td>
                          <td className="px-4 py-2 border border-gray-300 text-center">
                            <button
                              onClick={() => handleViewDetails(app)}
                              className="text-blue-500 hover:underline"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Possible Matches Tab */}
          {!loading && activeTab === 'Possible Matches' && (
            <>
              {matchesData.length === 0 ? (
                <p>No Possible Matches Found</p>
              ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                  <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 border border-gray-300">Rank</th>
                        <th className="px-4 py-2 border border-gray-300">Candidate Name</th>
                        <th className="px-4 py-2 border border-gray-300">Email</th>
                        <th className="px-4 py-2 border border-gray-300">Phone</th>
                        <th className="px-4 py-2 border border-gray-300">Resume</th>
                        <th className="px-4 py-2 border border-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchesData.map((match, index) => (
                        <tr key={match.candidateId} className={index < 3 ? 'bg-green-50' : ''}>
                          <td className="px-4 py-2 border border-gray-300 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              match.rank >= 90 ? 'bg-green-200 text-green-800' :
                              match.rank >= 50 ? 'bg-yellow-200 text-yellow-800' :
                              'bg-gray-200 text-gray-800'
                            }`}>
                              {/* {match.rank || 'N/A'} */}
                              {match.rank }
                            </span>
                          </td>
                          <td className="px-4 py-2 border border-gray-300 text-center">{match.name}</td>
                          <td className="px-4 py-2 border border-gray-300 text-center">{match.email}</td>
                          <td className="px-4 py-2 border border-gray-300 text-center">{match.phone}</td>
                          <td className="px-4 py-2 border border-gray-300 text-center">
                            {match.resumePath ? (
                              <a href={`/${match.resumePath}`} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                                View Resume
                              </a>
                            ) : (
                              <span className="text-gray-400">No Resume</span>
                            )}
                          </td>
                          <td className="px-4 py-2 border border-gray-300 text-center">
                            <button
                              onClick={() => handleInviteCandidate(match)}
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm mr-2"
                            >
                              Invite
                            </button>
                            <button
                              onClick={() => handleViewDetails(match)}
                              className="text-blue-500 hover:underline text-sm"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicationsForJob;