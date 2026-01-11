import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCandidate } from '../Api/forAll';
import {Link } from 'react-router-dom';
function CandidateView() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [candidateData, setCandidateData] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    education: false,
    experience: false,
    skills: false,
    applications: false,
    matches: false
  });

  useEffect(() => {
    fetchCandidateData();
  }, [candidateId]);

  const fetchCandidateData = async () => {
    setLoading(true);
    
     const response = await getCandidate(candidateId); 

      if (response.data==null) {
        setError('Failed to load candidate profile');
      } else {
        setCandidateData(response.data);
        setError(null);
      }
     
    setLoading(false);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      'Applied by candidate': 'bg-blue-100 text-blue-700',
      'Screening': 'bg-yellow-100 text-yellow-700',
      'Interview': 'bg-purple-100 text-purple-700',
      'Accepted by Reviewer': 'bg-green-100 text-green-700',
      'Rejected': 'bg-red-100 text-red-700',
      'Selected': 'bg-emerald-100 text-emerald-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (error || !candidateData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <p className="text-red-500 mb-4">{error || 'Profile not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
      
        <div className="flex items-center gap-2 mb-6" onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
          <img src="/back.png" height="10" width="10" alt="back" />
          <button className="text-blue-600 hover:text-blue-800 font-semibold">
            Back
          </button>
        </div>

        
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-start gap-6">
            
            <div className="flex-grow">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{candidateData.name}</h1>
              <div className="grid md:grid-cols-2 gap-2 text-gray-600 mb-4">
                <p className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {candidateData.email}
                </p>
                <p className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {candidateData.phone}
                </p>
                {candidateData.city && (
                  <p className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {candidateData.city}, {candidateData.state} - {candidateData.zipCode}
                  </p>
                )}
              </div>
              <div className="flex gap-3 mb-4">
                {candidateData.linkedinUrl && (
                  <a href={candidateData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    LinkedIn →
                  </a>
                )}
                {candidateData.githubUrl && (
                  <a href={candidateData.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    GitHub →
                  </a>
                )}
                {candidateData.portfolioUrl && (
                  <a href={candidateData.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    Portfolio →
                  </a>
                )}
                {candidateData.resumePath && (
                  <a href={candidateData.resumePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-semibold">
                    View Resume →
                  </a>
                )}
              </div>
              {candidateData.profileSummary && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-gray-700 leading-relaxed">{candidateData.profileSummary}</p>
                </div>
              )}
            </div>
          </div>
        </div>

       
        <div className="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden">
          <button
            onClick={() => toggleSection('education')}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Education ({candidateData.candidateEducations?.length || 0})
            </h2>
            <svg 
              className={`w-6 h-6 text-gray-600 transition-transform ${expandedSections.education ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.education && (
            <div className="p-6 pt-0 space-y-4">
              {candidateData.candidateEducations?.map((edu) => (
                <div key={edu.educationId} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800">{edu.degree}</h3>
                  <p className="text-gray-700 font-semibold">{edu.institution}</p>
                  <p className="text-sm text-gray-600">{edu.fieldOfStudy}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()} • Grade: {edu.grade}
                  </p>
                  {edu.description && <p className="text-sm text-gray-600 mt-2">{edu.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

     
        <div className="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden">
          <button
            onClick={() => toggleSection('experience')}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Experience ({candidateData.candidateExperiences?.length || 0})
            </h2>
            <svg 
              className={`w-6 h-6 text-gray-600 transition-transform ${expandedSections.experience ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.experience && (
            <div className="p-6 pt-0 space-y-4">
              {candidateData.candidateExperiences?.map((exp) => (
                <div key={exp.experienceId} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{exp.jobTitle}</h3>
                      <p className="text-gray-700 font-semibold">{exp.companyName}</p>
                      <p className="text-sm text-gray-600">{exp.location}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrentJob ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    {exp.isCurrentJob && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Current
                      </span>
                    )}
                  </div>
                  {exp.description && <p className="text-sm text-gray-600 mt-3">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

    
        <div className="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden">
          <button
            onClick={() => toggleSection('skills')}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Skills ({candidateData.candidateSkillMaps?.length || 0})
            </h2>
            <svg 
              className={`w-6 h-6 text-gray-600 transition-transform ${expandedSections.skills ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.skills && (
            <div className="p-6 pt-0">
              <div className="flex flex-wrap gap-3">
                {candidateData.candidateSkillMaps?.map((skillMap) => (
                  <div key={skillMap.skillId} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium border-2 border-green-300">
                    {skillMap.skill.skillName} - <span className="text-sm">{skillMap.proficiencyLevel}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

       
        <div className="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden">
          <button
            onClick={() => toggleSection('applications')}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Applications ({candidateData.jobApplications?.length || 0})
            </h2>
            <svg 
              className={`w-6 h-6 text-gray-600 transition-transform ${expandedSections.applications ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.applications && (
            <div className="p-6 pt-0 space-y-3">
              {candidateData.jobApplications?.map((app) => (
                <div key={app.applicationId} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">Application #
                    <Link to={`/application/view/${app.applicationId}`} className="text-blue-600 hover:text-blue-800 hover:underline transition" > 
                    {app.applicationId}
                    </Link>
                    </p>
                    <p className="text-sm text-gray-600">Job ID: {app.jobId}</p>
                    <p className="text-sm text-gray-500">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.applicationStatus)}`}>
                    {app.applicationStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

       
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <button
            onClick={() => toggleSection('matches')}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <svg className="w-7 h-7 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Job Matches ({candidateData.jobMatch?.length || 0})
            </h2>
            <svg 
              className={`w-6 h-6 text-gray-600 transition-transform ${expandedSections.matches ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.matches && (
            <div className="p-6 pt-0 space-y-3">
              {candidateData.jobMatch?.sort((a, b) => b.rank - a.rank).map((match) => (
                <div key={match.jobId} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800">{match.title}</h3>
                      <p className="text-sm text-gray-600">{match.description}</p>
                      <p className="text-sm text-gray-500 mt-1">{match.location} • {match.status}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      match.rank >= 70 ? 'bg-green-200 text-green-800' :
                      match.rank >= 40 ? 'bg-yellow-200 text-yellow-800' :
                      'bg-gray-200 text-gray-800'
                    }`}>
                      {match.rank}% Match
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CandidateView;