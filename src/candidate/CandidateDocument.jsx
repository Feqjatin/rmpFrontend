import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {createCandidateDocument,deleteCandidateDocument,getCandidateData} from "../api/Candidate"
import {uploadFileToThirdParty} from "../api/forAll"

function CandidateDocument() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [documentList, setDocumentList] = useState([]);
  const [candidateData, setCandidateData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [applicationId, setApplicationId] = useState('');
  const [documentType, setDocumentType] = useState('');
  const id = useSelector((state) => state.user.Id);

  useEffect(() => {
    fetchCandidateData();
  }, []);

  const fetchCandidateData = async () => {
    setLoading(true);
     
    const response = await getCandidateData(id);
  
    if (!response || !response.data) {
      setError("Failed to load document data");
    } else {
      setCandidateData(response.data);
      setDocumentList(response.data.candidateDocuments);
      setError(null);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType) {
      setError("Please select a file and document type");
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError(null);

     
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    const uploadResponse = await uploadFileToThirdParty(formData);
    
    if (!uploadResponse || !uploadResponse.data) {
      setError("Failed to upload file");
      setLoading(false);
      return;
    }

    const filePath = uploadResponse.data;

    
    const documentData = {
      applicationId: applicationId ? parseInt(applicationId) : 0,
      documentType: documentType,
      filePath: filePath
    };

    const response = await createCandidateDocument(documentData,id);

    if (!response || !response.data) {
      setError(response?.msg || "Failed to save document");
    } else {
      setSuccess(true);
      setIsUploading(false);
      setSelectedFile(null);
      setApplicationId('');
      setDocumentType('');
      fetchCandidateData();
      
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    setLoading(true);
    setError(null);

    const response = await deleteCandidateDocument(documentId);

    if (!response || !response.data) {
      setError(response?.msg || "Failed to delete document");
    } else {
      fetchCandidateData();
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setIsUploading(false);
    setSelectedFile(null);
    setApplicationId('');
    setDocumentType('');
    setError(null);
  };

  const getFileIcon = (filePath) => {
    if (!filePath) return '📄';
    const ext = filePath.split('.').pop().toLowerCase();
    const icons = {
      pdf: '📕',
      doc: '📘',
      docx: '📘',
      txt: '📄',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️'
    };
    return icons[ext] || '📄';
  };

  return (
    <div className="p-6 rounded-xl font-sans" style={{ background: "#f9fafb" }}>
      <div className="max-w-6xl mx-auto my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Documents</h2>
          {!isUploading && (
            <button
              onClick={() => setIsUploading(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Upload Document
            </button>
          )}
        </div>

        {loading && <p className="text-blue-500">Processing...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Document uploaded successfully!</p>}

        {isUploading && (
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Upload New Document</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Document Type *</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select document type</option>
                  <option value="Resume">Resume</option>
                  <option value="Cover Letter">Cover Letter</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Transcript">Transcript</option>
                  <option value="Portfolio">Portfolio</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-1">
                  Application ID <span className="text-xs text-gray-400">(Optional - Leave 0 for general documents)</span>
                </label>
                <select
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None (General Document)</option>
                  {candidateData?.jobApplications.map((app) => (
                    <option key={app.applicationId} value={app.applicationId}>
                      Application #{app.applicationId} - Status: {app.applicationStatus}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-1">Select File *</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={handleUpload}
                disabled={loading || !selectedFile || !documentType}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {loading ? 'Uploading...' : 'Upload'}
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
          {!loading && documentList.length === 0 && (
            <p className="text-gray-500 text-center py-8">No documents found. Upload your first one!</p>
          )}

          {documentList.map((doc) => (
            <div
              key={doc.documentId}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-grow">
                  <div className="text-4xl">{getFileIcon(doc.filePath)}</div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{doc.documentType}</h3>
                      {doc.applicationId && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
                          App #{doc.applicationId}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
                    </p>
                    <a
                      href={doc.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Document
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(doc.documentId)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CandidateDocument;