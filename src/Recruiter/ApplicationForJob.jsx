import React, { useEffect, useState } from 'react';
import { getApplicationsByJobId, getMatchByJobId, getInterviewsByJobId, bulkAssignInterviewer, bulkAssignTest, bulkCreateApplications } from '../api/Recruiter';
import { getAllUsers } from '../api/Admin';
import { getAllCandidates } from '../api/Candidate';

function ApplicationsForJob({jobId, goBack}) {
  const [loading, setLoading] = useState(false);
  const [applicationsData, setApplicationsData] = useState([]);
  const [matchesData, setMatchesData] = useState([]);
  const [interviewsData, setInterviewsData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('In Process');
  const tabs = ['In Process', 'Possible Matches', 'Interviews'];
  const activeIndex = tabs.indexOf(activeTab);

 
  const [selectedInterviews, setSelectedInterviews] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectedMatches, setSelectedMatches] = useState([]);
  
 
  const [showAssignInterviewer, setShowAssignInterviewer] = useState(false);
  const [showAssignTest, setShowAssignTest] = useState(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [testId, setTestId] = useState('');

  useEffect(() => {
    fetchData();
  }, [jobId]);

  useEffect(() => {
    if (showAssignInterviewer) {
      fetchUsers();
    }
  }, [showAssignInterviewer]);

  useEffect(() => {
    if (showBulkAdd) {
      fetchCandidates();
    }
  }, [showBulkAdd]);

  const fetchData = async () => {
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
    }

    const interviewsResponse = await getInterviewsByJobId(jobId);
    if (interviewsResponse.data) {
      setInterviewsData(interviewsResponse.data);
    }

    setLoading(false);
  };

  const fetchUsers = async () => {
    const response = await getAllUsers();
    if (response && response.data) {
      setAllUsers(response.data);
    }
  };

  const fetchCandidates = async () => {
    const response = await getAllCandidates();
    if (response && response.data) {
      setAllCandidates(response.data);
    }
  };

  const handleInterviewSelect = (interviewId) => {
    setSelectedInterviews(prev => 
      prev.includes(interviewId) 
        ? prev.filter(id => id !== interviewId)
        : [...prev, interviewId]
    );
  };

  const handleSelectAllInterviews = () => {
    if (selectedInterviews.length === interviewsData.length) {
      setSelectedInterviews([]);
    } else {
      setSelectedInterviews(interviewsData.map(i => i.interviewId));
    }
  };

  const handleCandidateSelect = (candidateId) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAllCandidates = () => {
    if (selectedCandidates.length === allCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(allCandidates.map(c => c.candidateId));
    }
  };

  const handleMatchSelect = (candidateId) => {
    setSelectedMatches(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAllMatches = () => {
    if (selectedMatches.length === matchesData.length) {
      setSelectedMatches([]);
    } else {
      setSelectedMatches(matchesData.map(m => m.candidateId));
    }
  };

  const handleBulkAssignInterviewer = async () => {
    if (!selectedUserId || selectedInterviews.length === 0) {
      setError("Please select user and interviews");
      return;
    }

    setLoading(true);
    setError(null);

    const response = await bulkAssignInterviewer({
      interviewIds: selectedInterviews,
      userId: parseInt(selectedUserId)
    });

    if (!response || !response.data) {
      setError(response?.msg || "Failed to assign interviewer");
    } else {
      setSuccess(true);
      setShowAssignInterviewer(false);
      setSelectedInterviews([]);
      setSelectedUserId('');
      fetchData();
      setTimeout(() => setSuccess(false), 2000);
    }
    setLoading(false);
  };

  const handleBulkAssignTest = async () => {
    if (!testId || selectedInterviews.length === 0) {
      setError("Please enter test ID and select interviews");
      return;
    }

    setLoading(true);
    setError(null);

    const response = await bulkAssignTest({
      scheduleIds: selectedInterviews,
      update: {
        testId: parseInt(testId)
      }
    });

    if (!response || !response.data) {
      setError(response?.msg || "Failed to assign test");
    } else {
      setSuccess(true);
      setShowAssignTest(false);
      setSelectedInterviews([]);
      setTestId('');
      fetchData();
      setTimeout(() => setSuccess(false), 2000);
    }
    setLoading(false);
  };

  const handleBulkCreateApplications = async () => {
    if (selectedCandidates.length === 0) {
      setError("Please select candidates");
      return;
    }

    setLoading(true);
    setError(null);

    const response = await bulkCreateApplications({
      candidateIds: selectedCandidates,
      jobId: jobId
    });

    if (!response || !response.data) {
      setError(response?.msg || "Failed to create applications");
    } else {
      setSuccess(true);
      setShowBulkAdd(false);
      setSelectedCandidates([]);
      fetchData();
      setTimeout(() => setSuccess(false), 2000);
    }
    setLoading(false);
  };

  const handleBulkCreateFromMatches = async () => {
    if (selectedMatches.length === 0) {
      setError("Please select candidates from matches");
      return;
    }

    setLoading(true);
    setError(null);

    const response = await bulkCreateApplications({
      candidateIds: selectedMatches,
      jobId: jobId
    });

    if (!response || !response.data) {
      setError(response?.msg || "Failed to create applications");
    } else {
      setSuccess(true);
      setSelectedMatches([]);
      fetchData();
      setTimeout(() => setSuccess(false), 2000);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'Scheduled': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Interview': 'bg-blue-100 text-blue-800',
      'Screening': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto my-8 p-6 bg-white rounded-2xl border border-gray-200 font-sans" style={{ background: "#dce9f2" }}>
        <div className="flex justify-between items-center w-full mb-6">
          <button
            onClick={() => goBack()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-center text-gray-800 flex-grow">Job Details</h1>
        </div>

        {success && <p className="text-green-500 mb-4">Operation successful!</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <div className="relative mb-6">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm font-semibold transition-colors duration-300 ${  
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
              width: `${100 / tabs.length}%`,
              transform: `translateX(${activeIndex * 100}%)`
            }}
          />
        </div>

        <div className="p-6">
          {loading && <p className="text-blue-500">Loading...</p>}

          {!loading && activeTab === 'In Process' && (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowBulkAdd(!showBulkAdd)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                >
                  {showBulkAdd ? 'Cancel' : 'Bulk Add Applications'}
                </button>
              </div>

              {showBulkAdd && (
                <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-300">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Select Candidates to Add</h3>
                  <div className="mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.length === allCandidates.length}
                        onChange={handleSelectAllCandidates}
                        className="w-4 h-4"
                      />
                      <span className="font-medium">Select All ({selectedCandidates.length} selected)</span>
                    </label>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {allCandidates.map((candidate) => (
                      <label key={candidate.candidateId} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
                        <input
                          type="checkbox"
                          checked={selectedCandidates.includes(candidate.candidateId)}
                          onChange={() => handleCandidateSelect(candidate.candidateId)}
                          className="w-4 h-4"
                        />
                        <span>{candidate.name} - {candidate.email}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={handleBulkCreateApplications}
                    disabled={selectedCandidates.length === 0}
                    className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                  >
                    Create {selectedCandidates.length} Application(s)
                  </button>
                </div>
              )}

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
                      </tr>
                    </thead>
                    <tbody>
                      {applicationsData.map((app) => (
                        <tr key={app.applicationId}>
                          <td className="px-4 py-2 border border-gray-300 text-center">{app.name}</td>
                          <td className="px-4 py-2 border border-gray-300 text-center">{app.email}</td>
                          <td className="px-4 py-2 border border-gray-300 text-center">{app.phone}</td>
                          <td className="px-4 py-2 border border-gray-300 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.applicationStatus)}`}>
                              {app.applicationStatus}
                            </span>
                          </td>
                          <td className="px-4 py-2 border border-gray-300 text-center">
                            {new Date(app.appliedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {!loading && activeTab === 'Possible Matches' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  {selectedMatches.length > 0 && (
                    <span className="text-gray-700 font-medium">
                      {selectedMatches.length} candidate(s) selected
                    </span>
                  )}
                </div>
                {selectedMatches.length > 0 && (
                  <button
                    onClick={handleBulkCreateFromMatches}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                  >
                    Add {selectedMatches.length} to Applications
                  </button>
                )}
              </div>

              {matchesData.length === 0 ? (
                <p>No Possible Matches Found</p>
              ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                  <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 border border-gray-300">
                          <input
                            type="checkbox"
                            checked={selectedMatches.length === matchesData.length}
                            onChange={handleSelectAllMatches}
                            className="w-4 h-4"
                          />
                        </th>
                        <th className="px-4 py-2 border border-gray-300">Rank</th>
                        <th className="px-4 py-2 border border-gray-300">Candidate Name</th>
                        <th className="px-4 py-2 border border-gray-300">Email</th>
                        <th className="px-4 py-2 border border-gray-300">Phone</th>
                        <th className="px-4 py-2 border border-gray-300">Resume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchesData.map((match, index) => (
                        <tr key={match.candidateId} className={index < 3 ? 'bg-green-50' : ''}>
                          <td className="px-4 py-2 border border-gray-300 text-center">
                            <input
                              type="checkbox"
                              checked={selectedMatches.includes(match.candidateId)}
                              onChange={() => handleMatchSelect(match.candidateId)}
                              className="w-4 h-4"
                            />
                          </td>
                          <td className="px-4 py-2 border border-gray-300 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              match.rank >= 90 ? 'bg-green-200 text-green-800' :
                              match.rank >= 50 ? 'bg-yellow-200 text-yellow-800' :
                              'bg-gray-200 text-gray-800'
                            }`}>
                              {match.rank}
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {!loading && activeTab === 'Interviews' && (
            <>
              <div className="flex gap-4 mb-4">
                {selectedInterviews.length > 0 && (
                  <>
                    <button
                      onClick={() => setShowAssignInterviewer(!showAssignInterviewer)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      Assign Interviewer ({selectedInterviews.length})
                    </button>
                    <button
                      onClick={() => setShowAssignTest(!showAssignTest)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                    >
                      Assign Test ({selectedInterviews.length})
                    </button>
                  </>
                )}
              </div>

              {showAssignInterviewer && (
                <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-300">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Assign Interviewer</h3>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  >
                    <option value="">Select User</option>
                    {allUsers.map((user) => (
                      <option key={user.userId} value={user.userId}>
                        {user.username} - {user.email}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-4">
                    <button
                      onClick={handleBulkAssignInterviewer}
                      disabled={!selectedUserId}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                      Assign to {selectedInterviews.length} Interview(s)
                    </button>
                    <button
                      onClick={() => setShowAssignInterviewer(false)}
                      className="flex-1 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {showAssignTest && (
                <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-300">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Assign Test</h3>
                  <input
                    type="number"
                    value={testId}
                    onChange={(e) => setTestId(e.target.value)}
                    placeholder="Enter Test ID"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handleBulkAssignTest}
                      disabled={!testId}
                      className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:bg-gray-400"
                    >
                      Assign to {selectedInterviews.length} Interview(s)
                    </button>
                    <button
                      onClick={() => setShowAssignTest(false)}
                      className="flex-1 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {interviewsData.length === 0 ? (
                <p>No Interviews Found</p>
              ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                  <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 border border-gray-300">
                          <input
                            type="checkbox"
                            checked={selectedInterviews.length === interviewsData.length}
                            onChange={handleSelectAllInterviews}
                            className="w-4 h-4"
                          />
                        </th>
                        <th className="px-4 py-2 border border-gray-300">Interview ID</th>
                        <th className="px-4 py-2 border border-gray-300">Application ID</th>
                        <th className="px-4 py-2 border border-gray-300">Round</th>
                        <th className="px-4 py-2 border border-gray-300">Status</th>
                        <th className="px-4 py-2 border border-gray-300">Scheduled Time</th>
                        <th className="px-4 py-2 border border-gray-300">Interviewers</th>
                        <th className="px-4 py-2 border border-gray-300">Test ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interviewsData.map((interview) => (
                        <tr key={interview.interviewId}>
                          <td className="px-4 py-2 border border-gray-300 text-center">
                            <input
                              type="checkbox"
                              checked={selectedInterviews.includes(interview.interviewId)}
                              onChange={() => handleInterviewSelect(interview.interviewId)}
                              className="w-4 h-4"
                            />
                          </td>
                          <td className="px-4 py-2 border border-gray-300 text-center">{interview.interviewId}</td>
                          <td className="px-4 py-2 border border-gray-300 text-center">{interview.application.applicationId}</td>
                          <td className="px-4 py-2 border border-gray-300 text-center">
                            <div className="text-sm">
                              <div className="font-semibold">{interview.round.roundName || 'Unnamed'}</div>
                              <div className="text-gray-600">{interview.round.roundType} - Seq {interview.roundSequence}</div>
                            </div>
                          </td>
                          <td className="px-4 py-2 border border-gray-300 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(interview.status)}`}>
                              {interview.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 border border-gray-300 text-center">
                            {interview.scheduledStartTime ? (
                              <div className="text-sm">
                                {new Date(interview.scheduledStartTime).toLocaleString()}
                              </div>
                            ) : (
                              <span className="text-gray-400">Not scheduled</span>
                            )}
                          </td>
                          <td className="px-4 py-2 border border-gray-300 text-center">
                            {interview.interviewers.length > 0 ? (
                              <div className="text-sm">
                                {interview.interviewers.map(i => i.name).join(', ')}
                              </div>
                            ) : (
                              <span className="text-gray-400">None</span>
                            )}
                          </td>
                          <td className="px-4 py-2 border border-gray-300 text-center">
                            {interview.testId || <span className="text-gray-400">None</span>}
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