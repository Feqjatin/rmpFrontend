import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { updateSelectedCandidate, generateOfferLetter, getCandidateDocuments } from '../api/Hr';

function HRSelectedApplicationDetail({ candidate, onBack, onViewDocument }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const user = useSelector((state) => state.user.userName);

  const [updateForm, setUpdateForm] = useState({
    joiningDate: candidate.joiningDate ? candidate.joiningDate.split('T')[0] : '',
    isMovedToEmpTable: candidate.isMovedToEmpTable,
    isDocumentVerified: candidate.isDocumentVerified,
    comment: candidate.comment || ''
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    
    const response = await getCandidateDocuments(candidate.applicationId, candidate.candidateId);
  
    if (!response || !response.data) {
      setError("Failed to load documents");
      setDocuments([]);
    } else {
      setDocuments(response.data);
      setError(null);
    }
    setLoading(false);
  };

  const handleSaveUpdate = async () => {
    setLoading(true);
    setError(null);

    const updates = {};
    if (updateForm.joiningDate !== (candidate.joiningDate ? candidate.joiningDate.split('T')[0] : '')) {
      updates.joiningDate = updateForm.joiningDate;
    }
    if (updateForm.isMovedToEmpTable !== candidate.isMovedToEmpTable) {
      updates.isMovedToEmpTable = updateForm.isMovedToEmpTable;
    }
    if (updateForm.isDocumentVerified !== candidate.isDocumentVerified) {
      updates.isDocumentVerified = updateForm.isDocumentVerified;
    }
    if (updateForm.comment !== (candidate.comment || '')) {
      updates.comment = updateForm.comment;
    }

    if (Object.keys(updates).length === 0) {
      setError("No changes detected");
      setLoading(false);
      return;
    }

    const response = await updateSelectedCandidate(user, candidate.jobCandidateSelectedId, updates);

    if (!response || !response.data) {
      setError(response?.msg || "Failed to update candidate");
    } else {
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 2000);
    }
    setLoading(false);
  };

  const handleGenerateOffer = async () => {
    setLoading(true);
    setError(null);

    const response = await generateOfferLetter(candidate.jobCandidateSelectedId);

    if (!response || !response.data) {
      setError(response?.msg || "Failed to generate offer letter");
    } else {
      setSuccess(true);
      alert("Offer letter generated successfully!");
      setTimeout(() => setSuccess(false), 2000);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'REUPLOAD_REQUIRED': 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 rounded-xl font-sans" style={{ background: "#f9fafb" }}>
      <div className="max-w-7xl mx-auto my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center gap-2 mb-4" onClick={onBack} style={{ cursor: "pointer" }}>
          <img src="../back.png" height="10" width="10" alt="back" />
          <button className="text-blue-600 hover:text-blue-800 font-semibold">
            Back
          </button>
        </div>

        <div className="mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Candidate Details</h2>
          <p className="text-gray-600">{candidate.name} - {candidate.email}</p>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">Changes saved successfully!</p>}

        <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Candidate Information</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Edit
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500 block mb-1">Candidate ID</label>
              <p className="text-lg font-semibold text-gray-900">{candidate.candidateId}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500 block mb-1">Job Title</label>
              <p className="text-lg font-semibold text-gray-900">{candidate.title}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500 block mb-1">Job ID</label>
              <p className="text-lg font-semibold text-gray-900">{candidate.jobId}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500 block mb-1">Application ID</label>
              <p className="text-lg font-semibold text-gray-900">{candidate.applicationId}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500 block mb-1">Joining Date</label>
              {isEditing ? (
                <input
                  type="date"
                  value={updateForm.joiningDate}
                  onChange={(e) => setUpdateForm(prev => ({...prev, joiningDate: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-900">
                  {updateForm.joiningDate ? new Date(updateForm.joiningDate).toLocaleDateString() : 'Not set'}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 pt-6">
              {isEditing ? (
                <>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={updateForm.isDocumentVerified}
                      onChange={(e) => setUpdateForm(prev => ({...prev, isDocumentVerified: e.target.checked}))}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Documents Verified</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={updateForm.isMovedToEmpTable}
                      onChange={(e) => setUpdateForm(prev => ({...prev, isMovedToEmpTable: e.target.checked}))}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Move to Employee</span>
                  </label>
                </>
              ) : (
                <div className="flex gap-2">
                  {updateForm.isDocumentVerified && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      Documents Verified
                    </span>
                  )}
                  {updateForm.isMovedToEmpTable && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      Moved to Employee
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-500 block mb-1">Comment / Request</label>
              {isEditing ? (
                <textarea
                  value={updateForm.comment}
                  onChange={(e) => setUpdateForm(prev => ({...prev, comment: e.target.value}))}
                  placeholder="Add comments or request additional documents..."
                  className="w-full h-24 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 p-2 border border-gray-200 rounded-lg min-h-24">
                  {updateForm.comment || 'No comments'}
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleSaveUpdate}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setUpdateForm({
                    joiningDate: candidate.joiningDate ? candidate.joiningDate.split('T')[0] : '',
                    isMovedToEmpTable: candidate.isMovedToEmpTable,
                    isDocumentVerified: candidate.isDocumentVerified,
                    comment: candidate.comment || ''
                  });
                }}
                disabled={loading}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition disabled:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          )}

          {!isEditing && (
            <div className="mt-4">
              <button
                onClick={handleGenerateOffer}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
              >
                Generate Offer Letter
              </button>
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Documents</h3>
          
          {loading && <p className="text-blue-500">Loading documents...</p>}
          
          {!loading && documents.length === 0 && (
            <p className="text-gray-500">No documents found</p>
          )}

          {!loading && documents.length > 0 && (
            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border border-gray-300">Document ID</th>
                    <th className="px-4 py-2 border border-gray-300">Type</th>
                    <th className="px-4 py-2 border border-gray-300">Status</th>
                    <th className="px-4 py-2 border border-gray-300">Uploaded At</th>
                    <th className="px-4 py-2 border border-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.documentId}>
                      <td className="px-4 py-2 border border-gray-300 text-center">
                        {doc.documentId}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-center">
                        {doc.documentType}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-center">
                        {new Date(doc.uploadedAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-center">
                        <button
                          onClick={() => onViewDocument(doc)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Take Action →
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
    </div>
  );
}

export default HRSelectedApplicationDetail;