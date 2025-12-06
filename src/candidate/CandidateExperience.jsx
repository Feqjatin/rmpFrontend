import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {getCandidateData,updateCandidateExperienceData,deleteCandidateExperienceData,addCandidateExperienceData} from "../api/Candidate"
function CandidateExperience() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [experienceList, setExperienceList] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const id = useSelector((state) => state.user.Id);

  const emptyForm = {
    jobTitle: '',
    companyName: '',
    startDate: '',
    endDate: '',
    isCurrentJob: false,
    description: '',
    location: ''
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchExperienceData();
  }, []);

  const fetchExperienceData = async () => {
    setLoading(true);
     
    const response = await getCandidateData(id);
  
    if (!response || !response.data) {
        setError("Failed to load education data");
    } else {
    setExperienceList(response.data.candidateExperiences);
    setError(null);
   }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData(emptyForm);
    setError(null);
  };

  const handleEdit = (experience) => {
    setEditingId(experience.experienceId);
    setIsAdding(false);
    setFormData({
      jobTitle: experience.jobTitle,
      companyName: experience.companyName,
      startDate: experience.startDate,
      endDate: experience.endDate || '',
      isCurrentJob: experience.isCurrentJob,
      description: experience.description,
      location: experience.location
    });
    setError(null);
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      if (editingId) {
        const response = await updateCandidateExperienceData(formData,editingId);
        console.log("Update Experience:", editingId, formData);
        if(response.msg!=null)setError(response.msg);
      } else {
        const response=await addCandidateExperienceData(formData,id)
        console.log("Add experience:", formData);
        if(response.msg!=null)setError(response.msg);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setIsAdding(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchExperienceData();
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.msg || "Failed to save experience");
    }
    setLoading(false);
  };

  const handleDelete = async (experienceId) => {
    setLoading(true);
    setError(null);
    const response = await deleteCandidateExperienceData(experienceId);
  
    if (!response || !response.data) {
        setError("Failed to delete Experience");
    } else {
      fetchExperienceData();
    }
    
    setLoading(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData(emptyForm);
    setError(null);
  };

  return (
    <div className="p-6 rounded-xl font-sans" style={{ background: "#f9fafb" }}>
      <div className="max-w-6xl mx-auto my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Work Experience</h2>
          {!isAdding && !editingId && (
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Add Experience
            </button>
          )}
        </div>

        {loading && <p className="text-blue-500">Processing...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Experience saved successfully!</p>}

        {(isAdding || editingId) && (
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {editingId ? 'Edit Experience' : 'Add New Experience'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Job Title *</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="Senior Software Engineer"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-1">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Company Inc."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="San Francisco, CA"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  name="isCurrentJob"
                  checked={formData.isCurrentJob}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700 font-medium">
                  I currently work here
                </label>
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-1">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-1">
                  End Date {formData.isCurrentJob && <span className="text-xs text-gray-400">(Not required for current job)</span>}
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  disabled={formData.isCurrentJob}
                  className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formData.isCurrentJob ? 'bg-gray-100 text-gray-400' : ''
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-500 block mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your role, responsibilities, achievements..."
                  className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : 'Save'}
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
          {!loading && experienceList.length === 0 && (
            <p className="text-gray-500 text-center py-8">No experience records found. Add your first one!</p>
          )}

          {experienceList.map((exp) => (
            <div
              key={exp.experienceId}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900">{exp.jobTitle}</h3>
                  <p className="text-lg text-gray-700">{exp.companyName}</p>
                  {exp.location && (
                    <p className="text-sm text-gray-600">{exp.location}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.experienceId)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <span>
                  {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                  {exp.isCurrentJob 
                    ? ' Present'
                    : exp.endDate 
                      ? ' ' + new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                      : ' Present'}
                </span>
                {exp.isCurrentJob && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                    Current
                  </span>
                )}
              </div>

              {exp.description && (
                <p className="text-gray-700 whitespace-pre-line">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CandidateExperience;