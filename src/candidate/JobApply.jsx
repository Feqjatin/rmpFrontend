import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {getJobData,createJobApply} from '../Api/Candidate';

function JobApply() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const candidateId = useSelector((state) => state.user.Id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [jobData, setJobData] = useState(null);

  useEffect(() => {
    fetchJobDetails();
  }, [jobId, candidateId]);

  const fetchJobDetails = async () => {
    setLoading(true);
       const response = await getJobData(jobId, candidateId); 
       console.log(response);
      if (response.data === null) {
        setError('Failed to load job details');
      } else {
        setJobData(response.data[0]);
        setError(null);
      }
    
    setLoading(false);
  };


  const handleApply = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const response = await createJobApply(jobId,candidateId);
      if (response.data === null) {
        setError('Failed to apply');
      } else {
        setSuccess(true);
        fetchJobDetails();  
        setTimeout(() => setSuccess(false), 3000);
      }
   
    setLoading(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Open': 'bg-green-100 text-green-700',
      'Closed': 'bg-red-100 text-red-700',
      'On Hold': 'bg-yellow-100 text-yellow-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };
 
  if (!jobData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
      
        <div className="flex items-center gap-2 mb-6" onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
          <img src="/back.png" height="10" width="10" alt="back" />
          <button className="text-blue-600 hover:text-blue-800 font-semibold">
            Back
          </button>
        </div>
 
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium">Application submitted successfully!</p>
          </div>
        )}
 
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
 
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{jobData.title}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {jobData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {jobData.minExperience}+ years experience
                  </span>
                </div>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(jobData.status)}`}>
              {jobData.status}
            </span>
          </div>
          
           {jobData.status === 'Open' && !jobData.applied && (
            <button
              onClick={handleApply}
              disabled={loading}
              className="p-5 py-4 bg-blue-500 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? 'Applying...' : 'Apply Now'}
            </button>
          )}

          {jobData.applied && (
            <div className="w-full py-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
              <p className="text-green-700 font-semibold text-lg flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Already Applied
              </p>
            </div>
          )}
        </div>
 
        <div className="grid md:grid-cols-3 gap-6">
        
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Description</h2>
              <p className="text-gray-700 leading-relaxed">{jobData.description ? jobData.description: 'N/A'}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-3">
                {jobData.skills!=null&&jobData.skills.length>0 &&jobData.skills.map((skill) => (
                  <div
                    key={skill.skillId}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      skill.skillType === "Required"
                        ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                        : "bg-gray-100 text-gray-700 border-2 border-gray-300"
                    }`}
                  >
                    {skill.skillName}
                    <span className="ml-2 text-xs">({skill.skillType})</span>
                  </div>
                ))}
              </div>
            </div>

            {jobData.selectedCandidate && jobData.selectedCandidate.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Selected Candidates</h2>
                <div className="space-y-2">
                  {jobData.selectedCandidate.map((candidate, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-bold">
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{candidate.name}</p>
                        <p className="text-sm text-gray-600">Candidate ID: {candidate.candidateId}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

         
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Job Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Job ID</p>
                  <p className="font-semibold text-gray-800">#{jobData.jobId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Posted On</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(jobData.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(jobData.updatedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                {jobData.closedReason && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Closed Reason</p>
                    <p className="font-semibold text-gray-800">{jobData.closedReason}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobApply;