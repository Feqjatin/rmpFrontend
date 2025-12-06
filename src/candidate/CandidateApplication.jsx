import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {deleteRescheduleRequest,createRescheduleRequest,getCandidateRescheduleRequests,getCandidateData} from "../api/Candidate"

function CandidateApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [applications, setApplications] = useState([]);
  const [rescheduleRequests, setRescheduleRequests] = useState([]);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activeTab, setActiveTab] = useState('applications');
  const id = useSelector((state) => state.user.Id);

  const [rescheduleForm, setRescheduleForm] = useState({
    interviewId: '',
    requestedNewStartTime: '',
    requestedNewEndTime: '',
    reason: ''
  });

  useEffect(() => {
    fetchApplicationData();
    fetchRescheduleRequests();
  }, []);

  const fetchApplicationData = async () => {
    setLoading(true);
    
    const response = await getCandidateData(id);
  
    if (!response || !response.data) {
      setError("Failed to load applications");
    } else {
      setApplications(response.data.jobApplications || []);
      setError(null);
    }
    setLoading(false);
  };

  const fetchRescheduleRequests = async () => {
    const response = await getCandidateRescheduleRequests(id);
  
    if (!response || !response.data) {
      setRescheduleRequests([]);
    } else {
      setRescheduleRequests(response.data);
    }
  };

  const handleRescheduleClick = (application) => {
    setSelectedApplication(application);
    setIsRescheduling(true);
    setRescheduleForm({
      interviewId: application.interview?.interviewId || '',
      requestedNewStartTime: '',
      requestedNewEndTime: '',
      reason: ''
    });
    setError(null);
  };

  const handleCopyMeetingLink = (link) => {
    navigator.clipboard.writeText(link);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRescheduleForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitReschedule = async () => {
    if (!rescheduleForm.interviewId || !rescheduleForm.requestedNewStartTime || 
        !rescheduleForm.requestedNewEndTime || !rescheduleForm.reason) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError(null);

    const response = await createRescheduleRequest(rescheduleForm,id);

    if (!response || !response.data) {
      setError(response?.msg || "Failed to submit reschedule request");
    } else {
      setSuccess(true);
      setIsRescheduling(false);
      setSelectedApplication(null);
      setRescheduleForm({
        interviewId: '',
        requestedNewStartTime: '',
        requestedNewEndTime: '',
        reason: ''
      });
      fetchRescheduleRequests();
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  const handleDeleteReschedule = async (requestId) => {
    if (!window.confirm("Are you sure you want to delete this reschedule request?")) {
      return;
    }

    setLoading(true);
    setError(null);

    const response = await deleteRescheduleRequest(requestId);

    if (!response || !response.data) {
      setError(response?.msg || "Failed to delete reschedule request");
    } else {
      fetchRescheduleRequests();
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setIsRescheduling(false);
    setSelectedApplication(null);
    setRescheduleForm({
      interviewId: '',
      requestedNewStartTime: '',
      requestedNewEndTime: '',
      reason: ''
    });
    setError(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Applied': 'bg-blue-100 text-blue-700',
      'Screening': 'bg-yellow-100 text-yellow-700',
      'Interview': 'bg-purple-100 text-purple-700',
      'Selected': 'bg-green-100 text-green-700',
      'Rejected': 'bg-red-100 text-red-700',
      'Withdrawn': 'bg-gray-100 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getRescheduleStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Approved': 'bg-green-100 text-green-700',
      'Rejected': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 rounded-xl font-sans" style={{ background: "#f9fafb" }}>
      <div className="max-w-6xl mx-auto my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">My Applications</h2>
        </div>

        <div className="mb-6">
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'applications'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setActiveTab('reschedule')}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'reschedule'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              Reschedule Requests
            </button>
          </div>
        </div>

        {loading && <p className="text-blue-500">Processing...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Reschedule request submitted successfully!</p>}

        {activeTab === 'applications' && (
          <>
            {isRescheduling && selectedApplication && (
              <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-300">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Request Interview Reschedule - Application #{selectedApplication.applicationId}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Interview ID</label>
                    <input
                      type="number"
                      name="interviewId"
                      value={rescheduleForm.interviewId}
                      onChange={handleInputChange}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>

                  <div className="md:col-span-2"></div>

                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Requested New Start Time *</label>
                    <input
                      type="datetime-local"
                      name="requestedNewStartTime"
                      value={rescheduleForm.requestedNewStartTime}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Requested New End Time *</label>
                    <input
                      type="datetime-local"
                      name="requestedNewEndTime"
                      value={rescheduleForm.requestedNewEndTime}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-500 block mb-1">Reason *</label>
                    <textarea
                      name="reason"
                      value={rescheduleForm.reason}
                      onChange={handleInputChange}
                      placeholder="Explain why you need to reschedule..."
                      className="w-full h-24 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleSubmitReschedule}
                    disabled={loading}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                  >
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition disabled:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {!loading && applications.length === 0 && (
                <p className="text-gray-500 text-center py-8">No applications found.</p>
              )}

              {applications.map((app) => (
                <div
                  key={app.applicationId}
                  className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          Application #{app.applicationId}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.applicationStatus)}`}>
                          {app.applicationStatus}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Job ID: {app.jobId}</p>
                      <p className="text-sm text-gray-600">
                        Applied: {new Date(app.appliedAt).toLocaleString()}
                      </p>
                      {app.updatedAt && (
                        <p className="text-sm text-gray-600">
                          Updated: {new Date(app.updatedAt).toLocaleString()}
                        </p>
                      )}
                      
                      {app.applicationStatus === 'Interview' && app.interview && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Interview ID: {app.interview.interviewId}
                          </p>
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Interview Scheduled Time: {new Date(app.interview.scheduledStartTime).toLocaleString()}-{new Date(app.interview.scheduledEndTime).toLocaleString()}
                          </p>
                           
                          {app.interview.meetingLink ? (
                            <div className="flex gap-2">
                              <a
                                href={app.interview.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                              >
                                Join Meeting
                              </a>
                              <button
                                onClick={() => handleCopyMeetingLink(app.interview.meetingLink)}
                                className="px-3 py-1 text-sm bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition"
                              >
                                Copy Link
                              </button>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500">Meeting link not available yet</p>
                          )}
                        </div>
                      )}
                    </div>
                    {app.applicationStatus === 'Interview' && !isRescheduling && (
                      <button
                        onClick={() => handleRescheduleClick(app)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                      >
                        Request Reschedule
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'reschedule' && (
          <div className="space-y-4">
            {!loading && rescheduleRequests.length === 0 && (
              <p className="text-gray-500 text-center py-8">No reschedule requests found.</p>
            )}

            {rescheduleRequests.map((request) => (
              <div
                key={request.requestId}
                className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        Reschedule Request #{request.requestId}
                      </h3>
                      {request.status && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRescheduleStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Interview ID: {request.interviewId}</p>
                    <p className="text-sm text-gray-600">
                      Requested Time: {new Date(request.requestedNewStartTime).toLocaleString()} - {new Date(request.requestedNewEndTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700 mt-2">
                      <span className="font-semibold">Reason:</span> {request.reason}
                    </p>
                    {request.requestedAt && (
                      <p className="text-sm text-gray-600 mt-2">
                        Requested: {new Date(request.requestedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  {(!request.status || request.status === 'Pending') && (
                    <button
                      onClick={() => handleDeleteReschedule(request.requestId)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateApplication;