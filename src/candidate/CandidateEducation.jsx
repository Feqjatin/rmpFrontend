import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {updateCandidateEducationData,deleteCandidateEducationData,addCandidateEducationData,getCandidateData} from '../Api/Candidate'
function CandidateEducation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [educationList, setEducationList] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const id = useSelector((state) => state.user.Id);

  const emptyForm = {
    degree: '',
    institution: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    grade: '',
    description: ''
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchEducationData();
  }, []);

  const fetchEducationData = async () => {
    setLoading(true);
     
    const response = await getCandidateData(id);
  
    if (!response || !response.data) {
        setError("Failed to load education data");
    } else {
    setEducationList(response.data.candidateEducations);
    setError(null);
   }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData(emptyForm);
    setError(null);
  };

  const handleEdit = (education) => {
    setEditingId(education.educationId);
    setIsAdding(false);
    setFormData({
      degree: education.degree,
      institution: education.institution,
      fieldOfStudy: education.fieldOfStudy,
      startDate: education.startDate,
      endDate: education.endDate,
      grade: education.grade,
      description: education.description
    });
    setError(null);
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    setError(null);


      if (editingId) {
       const response = await updateCandidateEducationData(formData,editingId);
        console.log("Update education:", editingId, formData);
        if(response.msg!=null)setError(response.msg);
      } else {
        const response=await addCandidateEducationData(formData,id)
        console.log("Add education:", formData);
        if(response.msg!=null)setError(response.msg);
      }
   
       
      
      setSuccess(true);
      setIsAdding(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchEducationData();
      setLoading(false);
  };

  const handleDelete = async (educationId) => {
    setLoading(true);
    setError(null);
    const response = await deleteCandidateEducationData(educationId);
  
    if (!response || !response.data) {
        setError("Failed to delete education");
    } else {
      fetchEducationData();
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
          <h2 className="text-2xl font-bold text-gray-800">Education</h2>
          {!isAdding && !editingId && (
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Add Education
            </button>
          )}
        </div>

        {loading && <p className="text-blue-500">Processing...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Education saved successfully!</p>}

        {(isAdding || editingId) && (
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {editingId ? 'Edit Education' : 'Add New Education'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Degree *</label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  placeholder="Bachelor of Science"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-1">Institution *</label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  placeholder="University Name"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-1">Field of Study *</label>
                <input
                  type="text"
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleInputChange}
                  placeholder="Computer Science"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-1">Grade</label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  placeholder="3.8 GPA"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                <label className="text-sm text-gray-500 block mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-500 block mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your education, coursework, achievements..."
                  className="w-full h-24 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          {!loading && educationList.length === 0 && (
            <p className="text-gray-500 text-center py-8">No education records found. Add your first one!</p>
          )}

          {educationList.map((edu) => (
            <div
              key={edu.educationId}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-lg text-gray-700">{edu.institution}</p>
                  <p className="text-sm text-gray-600">{edu.fieldOfStudy}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(edu)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(edu.educationId)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span>
                  {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                  {edu.endDate 
                    ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    : 'Present'}
                </span>
                {edu.grade && (
                  <>
                    <span>•</span>
                    <span className="font-semibold">{edu.grade}</span>
                  </>
                )}
              </div>

              {edu.description && (
                <p className="text-gray-700">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CandidateEducation;