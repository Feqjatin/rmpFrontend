import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SkillReview from '../component/SkillReview';
import { crateApplicationComment } from '../api/forAll';
import JobPostingCard from '../component/JobPostingCard';
import ApplicationFeedbackHistory from '../component/ApplicationFeedbackHistory';
import CandidateSkillHistory from '../component/CandidateSkillHistory';
import {updateInterviewSchedule,addInterviewerToInterview, removeInterviewerFromInterview, updateRoundScore,}from '../api/Interviewer'
import {getAllUsers} from '../api/Admin'
import InterviewRoundManager from './InterviewRoundManager';

function InterviewerApplication({data, setPage, refresh}) {
  const [resumeLoading, setResumeLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const user = useSelector((state) => state.user.userName);
  const [applicationComment, setApplicationComment] = useState('');
  const [showSkillAssessment, setShowSkillAssessment] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showRoundManager, setShowRoundManager] = useState(false);
  
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    status: 'Scheduled',
    scheduledStartTime: '',
    scheduledEndTime: ''
  });


  const [isManagingInterviewers, setIsManagingInterviewers] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

 
  const [isAddingScore, setIsAddingScore] = useState(false);
  const [roundScore, setRoundScore] = useState(data.roundScore);

  useEffect(() => {
    if (isManagingInterviewers) {
      fetchAllUsers();
    }
  }, [isManagingInterviewers]);

  const fetchAllUsers = async () => {
    const response = await getAllUsers();
    if (response ) {
      setAllUsers(response);
    }
  };

  const handleSaveComment = async () => {
    setLoading(true);
    const response = await crateApplicationComment({
      applicationId: data.applicationId,
      username: user,
      comment: applicationComment,
      role: "interviewer"
    });
    
    if (!response.data == null) {
      setError(response?.msg || "");
    } else {
      setApplicationComment('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
    refresh(c => c + 1);
    setLoading(false);
  };

  const handleSchedule = async () => {
    if (!scheduleForm.scheduledStartTime || !scheduleForm.scheduledEndTime) {
      setError("Please fill all schedule fields");
      return;
    }

    setLoading(true);
    setError(null);

     let newStatus = scheduleForm.status;

      if (data.status === "Pre-Scheduled") {
        newStatus = "Scheduled";
      } else if (data.status === "Scheduled") {
        newStatus = "Rescheduled";
      }

    
      const payload = {
        ...scheduleForm,
        status: newStatus
      };
    
    const response = await updateInterviewSchedule(data.interviewId, payload);

    if (!response || !response.data) {
      setError(response?.msg || "Failed to schedule interview");
    } else {
      setSuccess(true);
      setIsScheduling(false);
      setScheduleForm({
        status: 'Scheduled',
        scheduledStartTime: '',
        scheduledEndTime: ''
      });
      refresh(c => c + 1);
      setTimeout(() => setSuccess(false), 2000);
    }
    setLoading(false);
  };

  const handleAddInterviewer = async () => {
    if (!selectedUserId) {
      setError("Please select a user");
      return;
    }

    setLoading(true);
    setError(null);

    const response = await addInterviewerToInterview(data.interviewId, selectedUserId);

    if (!response || !response.data) {
      setError(response?.msg || "Failed to add interviewer");
    } else {
      setSuccess(true);
      setSelectedUserId('');
      refresh(c => c + 1);
      setTimeout(() => setSuccess(false), 2000);
    }
    setLoading(false);
  };

  const handleRemoveInterviewer = async (interviewer) => {
    setLoading(true);
    setError(null);

    const response = await removeInterviewerFromInterview(data.interviewId, interviewer.userId);

    if (!response || !response.data) {
      setError(response?.msg || "Failed to remove interviewer");
    } else {
      setSuccess(true);
      refresh(c => c + 1);
      setTimeout(() => setSuccess(false), 2000);
    }
    setLoading(false);
  };

  const handleSaveRoundScore = async () => {
    if (!roundScore) {
      setError("Please enter a score");
      return;
    }

    setLoading(true);
    setError(null);

    const response = await updateRoundScore(data.interviewId, { roundScore: parseFloat(roundScore) });

    if (!response || !response.data) {
      setError(response?.msg || "Failed to save round score");
    } else {
      setSuccess(true);
      setIsAddingScore(false);
      setRoundScore('');
      refresh(c => c + 1);
      setTimeout(() => setSuccess(false), 2000);
    }
    setLoading(false);
  };

  const handleStatusSave = async (val) =>{
    setLoading(true);
    setError(null);

    const response = await updateRoundScore(data.interviewId, {status: val });

    if (!response || !response.data) {
      setError(response?.msg || "Failed to save status");
    } else {
      setSuccess(true); 
      refresh(c => c + 1);
      setTimeout(() => setSuccess(false), 2000);
    }
    setLoading(false);
  }

  return (
    <div className="p-6 rounded-xl font-sans" style={{ background: "#f9fafb" }}>
       
      <div className="flex items-center gap-2" onClick={() => setPage(1)}>
        <img src="../back.png" height="10" width="10" />
        <button 
           
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          Back
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">Success!</p>}
      
      <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen font-sans gap-4">
        <div className="flex-grow md:w-2/3 p-4">
          <div className="relative w-full h-full bg-white rounded-lg shadow-lg border border-gray-200" style={{ minHeight: "600px" }}>
            {resumeLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500">Loading Resume...</p>
              </div>
            )}
            <iframe
              src={data.candidateInfo.resumePath || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}
              title="Candidate Resume"
              className="w-full h-full border-0 rounded-lg"
              onLoad={() => setResumeLoading(false)}
            />
          </div>
        </div>

        {loading && <p className="text-blue-500">Processing...</p>}
        
        {!loading && (
          <div className="w-full md:w-1/3 bg-white p-6 shadow-xl border-l border-gray-200 space-y-4">
             <JobPostingCard jobData={data.jobInfo} />
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">Interview Panel</h2>
            
            <div>
              <p className="text-sm text-gray-500">Application ID</p>
              <p className="text-lg font-semibold text-gray-900">{data.applicationId}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Interview ID</p>
              <p className="text-lg font-semibold text-gray-900">{data.interviewId}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-lg font-semibold text-gray-900">{data.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Test</p>
              <p className="text-lg font-semibold text-gray-900">Id-{data.testId} : score -{data.testScore}</p>
            </div>
            {data.scheduledStartTime && data.scheduledEndTime && (
              <div>
                <p className="text-sm text-gray-500">Scheduled Time</p>
                <p className="text-sm text-gray-700">
                  {new Date(data.scheduledStartTime).toLocaleString()} - {new Date(data.scheduledEndTime).toLocaleString()}
                </p>
              </div>
            )}
            

            {data.status!="Completed"&&data.status!="Cancelled" && data.meetingLink ? (
                            <div className="flex gap-2">
                              <a
                                href={data.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                              >
                                Join Meeting
                              </a>
                              <button
                                onClick={() => handleCopyMeetingLink(data.meetingLink)}
                                className="px-3 py-1 text-sm bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition"
                              >
                                Copy Link
                              </button>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500">Meeting link not available yet</p>
                          )}

            {data.roundScore && (
              <div>
                <p className="text-sm text-gray-500">Round Score</p>
                <p className="text-lg font-semibold text-gray-900">{data.roundScore}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Candidate</p>
              <p className="text-lg font-semibold text-gray-900">{data.candidateInfo.name}</p>
              <p className="text-sm text-gray-600">{data.candidateInfo.email}</p>
            </div>

            
            <div className="border-t pt-4">
              {data.status!="Completed"&&data.status!="Cancelled"&&!isScheduling && (
                <button
                  onClick={() => setIsScheduling(true)}
                  className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  {data.status === 'Pre-Scheduled' ? 'Schedule Interview' : 'Reschedule Interview'}
                </button>
              )}

              {data.status!="Completed"&&data.status!="Cancelled" && isScheduling && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-700">Schedule Interview</h3>
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Start Time *</label>
                    <input
                      type="datetime-local"
                      value={scheduleForm.scheduledStartTime}
                      onChange={(e) => setScheduleForm(prev => ({...prev, scheduledStartTime: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">End Time *</label>
                    <input
                      type="datetime-local"
                      value={scheduleForm.scheduledEndTime}
                      onChange={(e) => setScheduleForm(prev => ({...prev, scheduledEndTime: e.target.value}))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSchedule}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsScheduling(false)}
                      className="flex-1 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

             
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-700">Interviewers</h3>
                
                {data.status!="Completed"&&data.status!="Cancelled"&&<button
                  onClick={() => setIsManagingInterviewers(!isManagingInterviewers)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {isManagingInterviewers ? 'Close' : 'Manage'}
                </button>
                }
              </div>

              <div className="space-y-2">
                {data.interviewers?.map((interviewer) => (
                  <div key={interviewer.username} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-semibold">{interviewer.username}</p>
                      <p className="text-xs text-gray-600">{interviewer.email}</p>
                    </div>
                    {isManagingInterviewers && (
                      <button
                        onClick={() => handleRemoveInterviewer(interviewer)}
                        className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

               {data.status!="Completed"&&data.status!="Cancelled"&&isManagingInterviewers && (
                <div className="mt-3 space-y-2">
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select user to add</option>
                    {allUsers.filter(u => !data.interviewers?.some(i => i.userId === u.userId)).map((u) => (
                      <option key={u.userId} value={u.userId}>
                        {u.username} - {u.email}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddInterviewer}
                    disabled={!selectedUserId}
                    className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
                  >
                    Add Interviewer
                  </button>
                </div>
              )}
            </div>

         
            <div className="border-t pt-4">
              {data.status!="Completed"&&data.status!="Cancelled"&& !isAddingScore && (
                <button
                  onClick={() => setIsAddingScore(true)}
                  defaultValue={data.roundScore}
                  className="w-full py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Add/update Round Score
                </button>
              )}

              {data.status!="Completed"&&data.status!="Cancelled"&& isAddingScore && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-700">Round Score</h3>
                  <input
                    type="number"
                    value={roundScore}
                    onChange={(e) => setRoundScore(e.target.value)}
                    placeholder="Enter score"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveRoundScore}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsAddingScore(false)}
                      className="flex-1 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
           
           

          
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Application Comment</h3>
              <textarea
                value={applicationComment}
                onChange={(e) => setApplicationComment(e.target.value)}
                placeholder="Add a public comment..."
                className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {!data.isPublished && (
                <button
                  onClick={handleSaveComment}
                  className="mt-2 w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Save Comment
                </button>
              )}
            </div>
          
           
            <div className="border-t pt-4 space-y-2">
              <button
                onClick={() => setShowSkillAssessment(!showSkillAssessment)}
                className="w-full py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
              >
                {showSkillAssessment ? 'Hide' : 'Show'} Skill Assessment
              </button>
              
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
              >
                {showHistory ? 'Hide' : 'Show'} History
              </button>
              <button
                onClick={() => setShowRoundManager(!showRoundManager)}
                className="w-full py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
              >
                {showRoundManager ? 'Hide' : 'Show'} Round Manager
              </button>
            </div>

            {data.status!="Completed"&&data.status!="Cancelled"&&
            <div className='flex flex-row'>
               <button
               onClick={()=>handleStatusSave("Completed")}
               className="mt-2 w-full py-2 bg-blue-300 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
             >
               Mark Completed
             </button>
              <button
              onClick={()=>handleStatusSave("Cancelled")}
              className="mt-2 w-full py-2 bg-red-300 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
               Mark Cancelled
            </button>
            </div>
            }

          </div>
        )}
      </div>
      
      {showRoundManager && (
        <div className="mt-6">
          <InterviewRoundManager
            applicationId={data.applicationId}
            refresh={refresh}
          />
        </div>
      )}

     
      {showSkillAssessment && (
        <div className="mt-6">
          <SkillReview
            jobSkills={data.jobInfo.skills}
            applicationId={data.applicationId}
            username={user}
            isPublished={data.isPublished}
            stage={"INTERVIEWER_SKILL_ASSESSMENT"}
            role={"interviewer"}
            refresh={refresh}
          />
        </div>
      )}

      {showHistory && (
        <div className="mt-6 space-y-6">
          <ApplicationFeedbackHistory applicationId={data.applicationId} />
          <CandidateSkillHistory 
            candidateId={data.candidateInfo.candidateId} 
            applicationId={data.applicationId} 
          />
        </div>
      )}
    </div>
  );
}

export default InterviewerApplication;