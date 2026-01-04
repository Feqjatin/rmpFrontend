import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { updateDocument } from '../api/Hr';

function HRDocumentDetail({ document, onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const user = useSelector((state) => state.user.userName);

  const [docUpdateForm, setDocUpdateForm] = useState({
    status: document.status,
    comment: document.comment || ''
  });

  const handleUpdateDocument = async () => {
    setLoading(true);
    setError(null);

    const updates = {};
    if (docUpdateForm.status) updates.status = docUpdateForm.status;
    if (docUpdateForm.comment) updates.comment = docUpdateForm.comment;

    const response = await updateDocument(user, document.documentId, updates);

    if (!response || !response.data) {
      setError(response?.msg || "Failed to update document");
    } else {
      setSuccess(true);
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
      <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center gap-2 mb-4" onClick={onBack} style={{ cursor: "pointer" }}>
          <img src="../back.png" height="10" width="10" alt="back" />
          <button className="text-blue-600 hover:text-blue-800 font-semibold">
            Back
          </button>
        </div>

        <div className="mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Document Details</h2>
          <p className="text-gray-600">Document ID: {document.documentId}</p>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">Document updated successfully!</p>}

        <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-300">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Document Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-500 block mb-1">Document Type</label>
              <p className="text-lg font-semibold text-gray-900">{document.documentType}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500 block mb-1">Current Status</label>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(document.status)}`}>
                {document.status}
              </span>
            </div>

            <div>
              <label className="text-sm text-gray-500 block mb-1">Uploaded At</label>
              <p className="text-gray-900">{new Date(document.uploadedAt).toLocaleString()}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500 block mb-1">File</label>
              <a
                href={document.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                View Document →
              </a>
            </div>
          </div>

          {document.comment && (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <label className="text-sm font-semibold text-gray-700 block mb-1">Previous Comment:</label>
              <p className="text-gray-900">{document.comment}</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-300">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Update Document Status</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 block mb-1">Status</label>
              <select
                value={docUpdateForm.status}
                onChange={(e) => setDocUpdateForm(prev => ({...prev, status: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="REUPLOAD_REQUIRED">Re-upload Required</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-500 block mb-1">Comment / Feedback</label>
              <textarea
                value={docUpdateForm.comment}
                onChange={(e) => setDocUpdateForm(prev => ({...prev, comment: e.target.value}))}
                placeholder="Add feedback or request re-upload with reason..."
                className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                This comment will be visible to the candidate. Use it to provide feedback or request specific changes.
              </p>
            </div>

            <button
              onClick={handleUpdateDocument}
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Updating...' : 'Update Document'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HRDocumentDetail;