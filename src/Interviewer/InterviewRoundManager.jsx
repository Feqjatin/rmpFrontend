import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {getApplicationRounds,deleteInterview,createInterview} from '../api/Interviewer';
import{ getRoundTemplatesByJobId as getRoundTemplatesByJob,  deleteRoundTemplatesByJobId as deleteRoundTemplate,createRoundTemplatesByJobId as createRoundTemplate } from '../api/Recruiter';

function InterviewRoundManager({ applicationId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [rounds, setRounds] = useState([]);
  const [isAddingRound, setIsAddingRound] = useState(false);
  const [existingTemplates, setExistingTemplates] = useState([]);
  const [useExistingTemplate, setUseExistingTemplate] = useState(true);
  const user = useSelector((state) => state.user.userName);

  const [newTemplateForm, setNewTemplateForm] = useState({
    jobId: null,
    roundOrder: '',
    roundType: '',
    roundName: '',
    description: '',
    weightage: '',
    isCustomRound: true
  });

  const [newInterviewForm, setNewInterviewForm] = useState({
    applicationId: applicationId,
    roundTemplateId: '',
    status: 'PENDING',
    scheduledStartTime: null,
    scheduledEndTime: null,
    meetingLink: '',
    location: '',
    testId: null,
    testScore: null,
    roundScore: null,
    roundSequence: ''
  });

  useEffect(() => {
    fetchRounds();
  }, [applicationId]);

  const fetchRounds = async () => {
    setLoading(true);
    
    const response = await getApplicationRounds(applicationId);
  
    if (!response || !response.data) {
      setError("Failed to load rounds");
      setRounds([]);
    } else {
      setRounds(response.data);
      if (response.data.length > 0) {
        setNewTemplateForm(prev => ({
          ...prev,
          jobId: response.data[0].jobId
        }));
        fetchExistingTemplates(response.data[0].jobId);
      }
      setError(null);
    }
    setLoading(false);
  };

  const fetchExistingTemplates = async (jobId) => {
    const response = await getRoundTemplatesByJob(jobId);
    if (response && response.data) {
      setExistingTemplates(response.data);
    }
  };

  const handleDeleteInterview = async (interviewId) => {
    if (!window.confirm("Are you sure you want to delete this interview?")) {
      return;
    }

    setLoading(true);
    setError(null);

    const response = await deleteInterview(interviewId);

    if (!response || !response.data) {
      setError(response?.msg || "Failed to delete interview");
    } else {
      setSuccess(true);
      fetchRounds();
      setTimeout(() => setSuccess(false), 2000);
    }
    setLoading(false);
  };

  const handleDeleteRoundTemplate = async (roundTemplateId) => {
    if (!window.confirm("Are you sure you want to delete this custom round template? This will affect all interviews using this template.")) {
      return;
    }

    setLoading(true);
    setError(null);

    const response = await deleteRoundTemplate(roundTemplateId);

    if (!response || !response.data) {
      setError(response?.msg || "Failed to delete round template");
    } else {
      setSuccess(true);
      fetchRounds();
      setTimeout(() => setSuccess(false), 2000);
    }
    setLoading(false);
  };

  const handleCreateRoundTemplate = async () => {
    if (!newTemplateForm.roundType || !newTemplateForm.roundName || !newTemplateForm.roundOrder || !newTemplateForm.weightage) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    const response = await createRoundTemplate([newTemplateForm]);

    if (!response || !response.data) {
      setError(response?.msg || "Failed to create round template");
      setLoading(false);
      return null;
    }
    console.log("Created Round Template:", response.data);

    return response.data.entities[0].roundTemplateId;
  };

  const handleAddInterview = async () => {
    let templateId = newInterviewForm.roundTemplateId;

    if (!useExistingTemplate) {
      templateId = await handleCreateRoundTemplate();
      if (!templateId) return;
    }

    if (!templateId || !newInterviewForm.roundSequence) {
      setError("Please select template and round sequence");
      return;
    }

    setLoading(true);
    setError(null);

    const interviewData = {
      ...newInterviewForm,
      roundTemplateId: parseInt(templateId),
      roundSequence: parseInt(newInterviewForm.roundSequence)
    };

    const response = await createInterview(interviewData);

    if (!response || !response.data) {
      setError(response?.msg || "Failed to create interview");
    } else {
      setSuccess(true);
      setIsAddingRound(false);
      setUseExistingTemplate(true);
      setNewTemplateForm({
        jobId: newTemplateForm.jobId,
        roundOrder: '',
        roundType: '',
        roundName: '',
        description: '',
        weightage: '',
        isCustomRound: true
      });
      setNewInterviewForm({
        applicationId: applicationId,
        roundTemplateId: '',
        status: 'PENDING',
        scheduledStartTime: '',
        scheduledEndTime: '',
        meetingLink: '',
        location: '',
        testId: null,
        testScore: null,
        roundScore: null,
        roundSequence: ''
      });
      fetchRounds();
      setTimeout(() => setSuccess(false), 2000);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-700',
      'Scheduled': 'bg-blue-100 text-blue-700',
      'Completed': 'bg-green-100 text-green-700',
      'Cancelled': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getRoundTypeColor = (type) => {
    const colors = {
      'Technical': 'bg-purple-100 text-purple-700',
      'HR': 'bg-pink-100 text-pink-700',
      'Manager': 'bg-indigo-100 text-indigo-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 rounded-xl font-sans" style={{ background: "#f9fafb" }}>
      <div className="max-w-7xl mx-auto my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Interview Rounds</h2>
            <p className="text-sm text-gray-600">Application ID: {applicationId}</p>
          </div>
          {!isAddingRound && (
            <button
              onClick={() => setIsAddingRound(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Add Round
            </button>
          )}
        </div>

        {loading && <p className="text-blue-500">Processing...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Operation successful!</p>}

        {isAddingRound && (
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Interview Round</h3>
            
            <div className="mb-4">
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  checked={useExistingTemplate}
                  onChange={() => setUseExistingTemplate(true)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Use Existing Template</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!useExistingTemplate}
                  onChange={() => setUseExistingTemplate(false)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Create New Custom Template</span>
              </label>
            </div>

            {useExistingTemplate ? (
              <div className="mb-4">
                <label className="text-sm text-gray-500 block mb-1">Select Template *</label>
                <select
                  value={newInterviewForm.roundTemplateId}
                  onChange={(e) => setNewInterviewForm(prev => ({...prev, roundTemplateId: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a template</option>
                  {existingTemplates.map((template) => (
                    <option key={template.roundTemplateId} value={template.roundTemplateId}>
                      Round {template.roundOrder} - {template.roundName} ({template.roundType})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border border-gray-300 rounded-lg">
                <h4 className="col-span-2 font-semibold text-gray-700">New Template Details</h4>
                
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Round Order *</label>
                  <input
                    type="number"
                    value={newTemplateForm.roundOrder}
                    onChange={(e) => setNewTemplateForm(prev => ({...prev, roundOrder: e.target.value}))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500 block mb-1">Round Type *</label>
                  <select
                    value={newTemplateForm.roundType}
                    onChange={(e) => setNewTemplateForm(prev => ({...prev, roundType: e.target.value}))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select type</option>
                    <option value="Technical">Technical</option>
                    <option value="HR">HR</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-500 block mb-1">Round Name *</label>
                  <input
                    type="text"
                    value={newTemplateForm.roundName}
                    onChange={(e) => setNewTemplateForm(prev => ({...prev, roundName: e.target.value}))}
                    placeholder="e.g., System Design Round"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500 block mb-1">Weightage *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTemplateForm.weightage}
                    onChange={(e) => setNewTemplateForm(prev => ({...prev, weightage: e.target.value}))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-500 block mb-1">Description</label>
                  <textarea
                    value={newTemplateForm.description}
                    onChange={(e) => setNewTemplateForm(prev => ({...prev, description: e.target.value}))}
                    placeholder="Round description..."
                    className="w-full h-20 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Round Sequence *</label>
                <input
                  type="number"
                  value={newInterviewForm.roundSequence}
                  onChange={(e) => setNewInterviewForm(prev => ({...prev, roundSequence: e.target.value}))}
                  placeholder="Position in interview process"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-1">Location</label>
                <input
                  type="text"
                  value={newInterviewForm.location}
                  onChange={(e) => setNewInterviewForm(prev => ({...prev, location: e.target.value}))}
                  placeholder="Online / Office location"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-1">Meeting Link</label>
                <input
                  type="url"
                  value={newInterviewForm.meetingLink}
                  onChange={(e) => setNewInterviewForm(prev => ({...prev, meetingLink: e.target.value}))}
                  placeholder="https://..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={handleAddInterview}
                disabled={loading}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {loading ? 'Adding...' : 'Add Interview'}
              </button>
              <button
                onClick={() => setIsAddingRound(false)}
                disabled={loading}
                className="flex-1 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition disabled:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {!loading && rounds.length === 0 && (
            <p className="text-gray-500 text-center py-8">No rounds found for this application.</p>
          )}

          {rounds.map((round) => (
            <div
              key={round.interviewId}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      Sequence {round.roundSequence} - {round.roundName || 'Unnamed Round'}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoundTypeColor(round.roundType)}`}>
                      {round.roundType}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(round.status)}`}>
                      {round.status}
                    </span>
                    {round.isCustomRound && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        Custom
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 mt-3">
                    <div>
                      <span className="font-semibold">Interview ID:</span> {round.interviewId}
                    </div>
                    <div>
                      <span className="font-semibold">Template ID:</span> {round.roundTemplateId}
                    </div>
                    <div>
                      <span className="font-semibold">Round Order:</span> {round.roundOrder}
                    </div>
                    <div>
                      <span className="font-semibold">Weightage:</span> {round.weightage}
                    </div>
                  </div>

                  {round.description && (
                    <p className="text-sm text-gray-700 mt-2">{round.description}</p>
                  )}

                  {round.scheduledStartTime && round.scheduledEndTime && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Scheduled:</span>{' '}
                        {new Date(round.scheduledStartTime).toLocaleString()} - {new Date(round.scheduledEndTime).toLocaleString()}
                      </p>
                      {round.meetingLink && (
                        <p className="text-sm text-gray-700 mt-1">
                          <span className="font-semibold">Meeting:</span>{' '}
                          <a href={round.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {round.meetingLink}
                          </a>
                        </p>
                      )}
                      {round.location && (
                        <p className="text-sm text-gray-700 mt-1">
                          <span className="font-semibold">Location:</span> {round.location}
                        </p>
                      )}
                    </div>
                  )}

                  {(round.roundScore !== null || round.testScore !== null) && (
                    <div className="mt-3 flex gap-4">
                      {round.roundScore !== null && (
                        <div className="px-3 py-2 bg-green-50 rounded-lg">
                          <span className="text-sm font-semibold text-gray-700">Round Score:</span>{' '}
                          <span className="text-lg font-bold text-green-700">{round.roundScore}</span>
                        </div>
                      )}
                      {round.testScore !== null && (
                        <div className="px-3 py-2 bg-purple-50 rounded-lg">
                          <span className="text-sm font-semibold text-gray-700">Test Score:</span>{' '}
                          <span className="text-lg font-bold text-purple-700">{round.testScore}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {round.status === 'PENDING' && (
                    <button
                      onClick={() => handleDeleteInterview(round.interviewId)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                    >
                      Delete Interview
                    </button>
                  )}
                  {round.isCustomRound && (
                    <button
                      onClick={() => handleDeleteRoundTemplate(round.roundTemplateId)}
                      className="px-3 py-1 text-sm bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition"
                    >
                      Delete Template
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InterviewRoundManager;