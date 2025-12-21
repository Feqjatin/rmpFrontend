import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import{getRescheduleRequests,updateRescheduleRequest}from '../api/Interviewer'
function InterviewerReschedule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isResponding, setIsResponding] = useState(false);
  const user = useSelector((state) => state.user.userName);

  const [responseForm, setResponseForm] = useState({
    requestId: '',
    status: '',
    adminComment: ''
  });

  useEffect(() => {
    fetchRescheduleRequests();
  }, []);

  const fetchRescheduleRequests = async () => {
    setLoading(true);
    
    const response = await getRescheduleRequests(user);
  
    if (!response || !response.data) {
      setError("Failed to load reschedule requests");
      setRequests([]);
    } else {
      setRequests(response.data);
      setError(null);
    }
    setLoading(false);
  };

  const handleRespondClick = (request) => {
    setSelectedRequest(request);
    setIsResponding(true);
    setResponseForm({
      requestId: request.requestId,
      status: '',
      adminComment: ''
    });
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResponseForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitResponse = async () => {
    if (!responseForm.status || !responseForm.adminComment) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError(null);

    const response = await updateRescheduleRequest(responseForm);

    if (!response || !response.data) {
      setError(response?.msg || "Failed to update reschedule request");
    } else {
      setSuccess(true);
      setIsResponding(false);
      setSelectedRequest(null);
      setResponseForm({
        requestId: '',
        status: '',
        adminComment: ''
      });
      fetchRescheduleRequests();
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setIsResponding(false);
    setSelectedRequest(null);
    setResponseForm({
      requestId: '',
      status: '',
      adminComment: ''
    });
    setError(null);
  };

  const getStatusColor = (status) => {
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
          <h2 className="text-2xl font-bold text-gray-800">Reschedule Requests</h2>
        </div>

        {loading && <p className="text-blue-500">Processing...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Response submitted successfully!</p>}

        {isResponding && selectedRequest && (
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Respond to Request #{selectedRequest.requestId}
            </h3>
            
            <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Candidate:</span> {selectedRequest.candidateName}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Interview ID:</span> {selectedRequest.interviewId}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Requested Time:</span> {new Date(selectedRequest.requestedNewStartTime).toLocaleString()} - {new Date(selectedRequest.requestedNewEndTime).toLocaleString()}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Reason:</span> {selectedRequest.reason}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Decision *</label>
                <select
                  name="status"
                  value={responseForm.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select decision</option>
                  <option value="Approved">Approve</option>
                  <option value="Rejected">Reject</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-1">Admin Comment *</label>
                <textarea
                  name="adminComment"
                  value={responseForm.adminComment}
                  onChange={handleInputChange}
                  placeholder="Add your comment..."
                  className="w-full h-24 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={handleSubmitResponse}
                disabled={loading}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {loading ? 'Submitting...' : 'Submit Response'}
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
          {!loading && requests.length === 0 && (
            <p className="text-gray-500 text-center py-8">No reschedule requests found.</p>
          )}

          {requests.map((request) => (
            <div
              key={request.requestId}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      Request #{request.requestId}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Candidate: {request.candidateName}</p>
                  <p className="text-sm text-gray-600">Interview ID: {request.interviewId}</p>
                  <p className="text-sm text-gray-600">
                    Requested Time: {new Date(request.requestedNewStartTime).toLocaleString()} - {new Date(request.requestedNewEndTime).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    <span className="font-semibold">Reason:</span> {request.reason}
                  </p>
                  {request.adminComment && (
                    <p className="text-sm text-gray-700 mt-2">
                      <span className="font-semibold">Admin Comment:</span> {request.adminComment}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Requested: {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
                {request.status === 'Pending' && !isResponding && (
                  <button
                    onClick={() => handleRespondClick(request)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Respond
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InterviewerReschedule;