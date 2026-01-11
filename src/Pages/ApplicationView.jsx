import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApplication} from '../Api/forAll';
import {Link } from 'react-router-dom';
function ApplicationView() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [applicationData, setApplicationData] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    skillAssessments: false,
    feedback: false,
    interviews: false,
    reviewStage: false
  });

  useEffect(() => {
    fetchApplicationData();
  }, [applicationId]);

  const fetchApplicationData = async () => {
    setLoading(true);
      const response = await getApplication(applicationId);
      if (response.data == null) {
        setError('Failed to load application details');
      } else {
        setApplicationData(response.data);
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

  const getInterviewStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-700',
      'SCHEDULED': 'bg-blue-100 text-blue-700',
      'COMPLETED': 'bg-green-100 text-green-700',
      'CANCELLED': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getReviewStatusColor = (status) => {
    const colors = {
      'Accepted': 'bg-green-100 text-green-700',
      'Rejected': 'bg-red-100 text-red-700',
      'Pending': 'bg-yellow-100 text-yellow-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error || !applicationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <p className="text-red-500 mb-4">{error || 'Application not found'}</p>
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
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <button className="text-blue-600 hover:text-blue-800 font-semibold">
            Back
          </button>
        </div>

      
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Application #{applicationData.applicationId}</h1>
              <p className="text-lg text-gray-600">Job ID: {applicationData.jobId}</p>
              <Link to={`/candidate/view/${applicationData.candidateId}`} className="text-blue-600 hover:text-blue-800 hover:underline transition" >
               Candidate ID: {applicationData.candidateId} </Link>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(applicationData.applicationStatus)}`}>
              {applicationData.applicationStatus}
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Applied Date</p>
              <p className="text-gray-800 font-semibold">{new Date(applicationData.appliedAt).toLocaleString()}</p>
            </div>
            {applicationData.updatedAt && (
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-gray-800 font-semibold">{new Date(applicationData.updatedAt).toLocaleString()}</p>
              </div>
            )}
            {applicationData.statusReason && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Status Reason</p>
                <p className="text-gray-800">{applicationData.statusReason}</p>
              </div>
            )}
            {applicationData.rank && (
              <div>
                <p className="text-sm text-gray-500">Match Rank</p>
                <p className="text-gray-800 font-semibold">{applicationData.rank}%</p>
              </div>
            )}
          </div>
        </div>

     
        <div className="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden">
          <button
            onClick={() => toggleSection('skillAssessments')}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Skill Assessments ({applicationData.skillAssessments?.length || 0})
            </h2>
            <svg 
              className={`w-6 h-6 text-gray-600 transition-transform ${expandedSections.skillAssessments ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.skillAssessments && (
            <div className="p-6 pt-0 space-y-4">
              {applicationData.skillAssessments?.map((assessment) => (
                <div key={assessment.assessmentId} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{assessment.skillName}</h3>
                      <p className="text-sm text-gray-600">{assessment.yearsOfExperience} years of experience</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {assessment.stage}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2"><strong>Comment:</strong> {assessment.comment}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Assessed by: <strong>{assessment.assessedByUserName}</strong> ({assessment.assessedInRoleName})</span>
                    <span>Date: {new Date(assessment.assessmentDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        
        <div className="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden">
          <button
            onClick={() => toggleSection('feedback')}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Feedback ({applicationData.applicationFeedbacks?.length || 0})
            </h2>
            <svg 
              className={`w-6 h-6 text-gray-600 transition-transform ${expandedSections.feedback ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.feedback && (
            <div className="p-6 pt-0 space-y-4">
              {applicationData.applicationFeedbacks?.map((feedback) => (
                <div key={feedback.feedbackId} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">{feedback.userName} - {feedback.userRole}</p>
                      <p className="text-xs text-gray-500">Stage: {feedback.feedbackStage}</p>
                    </div>
                    <p className="text-xs text-gray-500">{new Date(feedback.createdAt).toLocaleString()}</p>
                  </div>
                  <p className="text-gray-700 mt-2">{feedback.commentText}</p>
                </div>
              ))}
            </div>
          )}
        </div>

       
        <div className="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden">
          <button
            onClick={() => toggleSection('interviews')}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Interview Rounds ({applicationData.interviews?.length || 0})
            </h2>
            <svg 
              className={`w-6 h-6 text-gray-600 transition-transform ${expandedSections.interviews ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.interviews && (
            <div className="p-6 pt-0 space-y-4">
              {applicationData.interviews?.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No interviews scheduled yet</p>
              ) : (
                applicationData.interviews?.sort((a, b) => a.roundSequence - b.roundSequence).map((interview) => (
                  <div key={interview.roundTemplateId} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Round {interview.roundSequence}</h3>
                        <p className="text-sm text-gray-600">Template ID: {interview.roundTemplateId}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getInterviewStatusColor(interview.status)}`}>
                        {interview.status}
                      </span>
                    </div>
                    {interview.scheduledStartTime && interview.scheduledEndTime ? (
                      <div className="mt-3 p-3 bg-white rounded border border-blue-100">
                        <p className="text-sm text-gray-600">
                          <strong>Scheduled:</strong> {new Date(interview.scheduledStartTime).toLocaleString()} - {new Date(interview.scheduledEndTime).toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-2">Not scheduled yet</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
 
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <button
            onClick={() => toggleSection('reviewStage')}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Review History ({applicationData.reviewStage?.length || 0})
            </h2>
            <svg 
              className={`w-6 h-6 text-gray-600 transition-transform ${expandedSections.reviewStage ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.reviewStage && (
            <div className="p-6 pt-0 space-y-3">
              {applicationData.reviewStage?.sort((a, b) => new Date(b.actionDate) - new Date(a.actionDate)).map((review, index) => (
                <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">Review Action</p>
                    <p className="text-sm text-gray-600">{new Date(review.actionDate).toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getReviewStatusColor(review.status)}`}>
                    {review.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicationView;