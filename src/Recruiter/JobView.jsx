import React, { useState, useEffect } from 'react';
import { getAllSkills } from '../Api/Recruiter';  
import { updateJob } from '../Api/Recruiter';
import { deleteJob  } from '../Api/Recruiter';
import  ApplicationForJob from './ApplicationForJob';
import  JobConfig from './JobConfig';
import { useNavigate } from 'react-router-dom';
import {Link } from 'react-router-dom';
const JobView = ({ job, goBack ,refreshList}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [allSkills, setAllSkills] = useState([]);
    const [filteredSkills, setFilteredSkills] = useState([]);
    const [skillSearchInput, setSkillSearchInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [count, setCount] = useState(0);
    const [applicationShow, setApplicationShow] = useState(false);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (job) {
        setFormData(job);
      }
    }, [job]);
  
    useEffect(() => {
      async function fetchSkills() {
        setLoading(true);
        setError(null);
        const response = await getAllSkills();
        if (response.data === null) {
          setAllSkills([]);
          setError(response.msg);
          setLoading(false);
        } else {
          setAllSkills(response.data);
          setError(null);
          setLoading(false);
        }
      }
      fetchSkills();
    }, [count]);
  
    useEffect(() => {
      if (skillSearchInput.trim() !== '' && allSkills.length > 0) {
        setFilteredSkills(
          allSkills.filter(
            (skill) =>
              skill.skillName.toLowerCase().includes(skillSearchInput.toLowerCase()) &&
              !formData.skills.some((s) => s.skillId === skill.skillId)
          )
        );
      } else {
        setFilteredSkills([]);
      }
    }, [skillSearchInput, allSkills, formData.skills]);
  
    if (!job) {
      return <div className="p-6 text-center text-gray-500">No job details provided.</div>;
    }
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevData => {
        const updates = { [name]: value };
        // Clear closedReason if status changes to Open
        if (name === 'status' && value === 'Open') {
          updates.closedReason = null;
        }
        return { ...prevData, ...updates };
      });
    };
  
    const handleAddSkill = (selectedSkill, skillType) => {
      const newSkill = { ...selectedSkill, skillType };
      setFormData(prevData => ({
        ...prevData,
        skills: [...prevData.skills, newSkill]
      }));
      setSkillSearchInput('');
    };

    const handleSkillTypeChange = (skillId, newType) => {
      setFormData(prevData => ({
        ...prevData,
        skills: prevData.skills.map(skill =>
          skill.skillId === skillId ? { ...skill, skillType: newType } : skill
        )
      }));
    };
  
    const handleDeleteSkill = (skillId) => {
      setFormData(prevData => ({
        ...prevData,
        skills: prevData.skills.filter(skill => skill.skillId !== skillId)
      }));
    };
  
    const handleEditClick = () => {
      setIsEditing(true);
    };
    const handleDeleteClick = async () => {
      setLoading(true);
      setError(null);
      const response = await deleteJob({jobId : job.jobId});
      if (response.data === null) {
         
        setError(response.msg);
        
      }  else{
        console.log('Delete successful!');
        refreshList();
        goBack();
      }
        setLoading(false);
    };
  
    const handleCancelClick = () => {
      setIsEditing(false);
      setFormData(job);
    };
  
    const handleUpdateClick = async () => {
      const transformedSkills = formData.skills.map(skill => ({
          Id: skill.skillId,
          Type: skill.skillType
      }));
      
      const dataToUpdate = {
          ...formData,
          skills: transformedSkills
      };
  
      const response = await updateJob(dataToUpdate);
      if (response.data) {
        console.log('Update successful!');
        refreshList();
        setIsEditing(false);
      } else {
        console.error('Update failed.');
      }
    };

    const renderField = (label, name, type = 'text', readOnly) => (
      <div className="flex flex-col mb-4">
        <label className="text-gray-600 font-semibold mb-1">{label}:</label>
        {readOnly ? (
          <span className="text-gray-800 p-3 bg-gray-200 rounded-lg shadow-inner">{formData[name]}</span>
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name] || ''}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
          />
        )}
      </div>
    );

    const isStatusClosed = formData.status === 'Temporary Close' || formData.status === 'Permanent Close';
    
    return (
       <>
      {applicationShow && <ApplicationForJob jobId={job.jobId} goBack={()=>setApplicationShow(false)}/>}
      {!applicationShow &&
      <div className="p-6 bg-white rounded-lg shadow-md max-w-5xl mx-auto border border-gray-100">
        <div className="flex justify-between items-center w-full mb-6">
          <button
            onClick={goBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-center text-gray-800 flex-grow">Job Details</h1>
        </div>
        
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            {renderField('Job ID', 'jobId', 'text', true)}
            
            <div className="flex flex-col mb-4">
              <label className="text-gray-600 font-semibold mb-1">Status:</label>
              {!isEditing ? (
                <span className="text-gray-800 p-3 bg-gray-200 rounded-lg shadow-inner">{formData.status}</span>
              ) : (
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                >
                  <option value="Open">Open</option>
                  <option value="Temporary Close">Temporary Close</option>
                  <option value="Permanent Close">Permanent Close</option>
                  <option value="Permanent Close(Required Candidate Found)">Permanent Close(Required Candidate Found)</option>
                </select>
              )}
            </div>

            {renderField('Min. Experience', 'minExperience', 'number', !isEditing)}
            {renderField('Created At', 'createdAt', 'text', true)}
          </div>
          <div className="flex flex-col">
            {renderField('Title', 'title', 'text', !isEditing)}
            {renderField('Location', 'location', 'text', !isEditing)}
            {renderField('Created By', 'createdByName', 'text', true)}
            {renderField('Updated At', 'updatedAt', 'text', true)}
          </div>

          <div className="flex flex-col mb-4 col-span-full">
            <label className="text-gray-600 font-semibold mb-1">Description:</label>
            {!isEditing ? (
              <span className="text-gray-800 p-3 bg-gray-200 rounded-lg shadow-inner">{formData.description}</span>
            ) : (
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
              />
            )}
          </div>

          {isStatusClosed && (
            <div className="flex flex-col mb-4 col-span-full">
              <label className="text-gray-600 font-semibold mb-1">Closed Reason:</label>
              {!isEditing ? (
                <span className="text-gray-800 p-3 bg-gray-200 rounded-lg shadow-inner">{formData.closedReason || 'N/A'}</span>
              ) : (
                <textarea
                  name="closedReason"
                  value={formData.closedReason || ''}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                  placeholder="Please provide a reason for closing..."
                />
              )}
            </div>
          )}

          <div className="col-span-full mt-4 border-t pt-6 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills</h2>
            {loading ? (
              <p className="text-gray-500">Loading skills...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.skills && formData.skills.map((skill) => (
                  <div key={skill.skillId} className="flex items-center px-3 py-1 rounded-full border border-gray-300 bg-gray-100 shadow-sm">
                    <span className="text-sm font-medium text-gray-800 mr-2">
                      {skill.skillName}
                    </span>
                    {isEditing && (
                      <>
                        <select
                          value={skill.skillType}
                          onChange={(e) => handleSkillTypeChange(skill.skillId, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 mr-1"
                        >
                          <option value="Required">Required</option>
                          <option value="Preferred">Preferred</option>
                        </select>
                        <button
                          onClick={() => handleDeleteSkill(skill.skillId)}
                          className="ml-1 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      </>
                    )}
                    {!isEditing && (
                      <span className="text-xs text-gray-600 ml-1">({skill.skillType})</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {isEditing && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Add New Skill</h3>
                <div className="relative">
                  <input
                    type="text"
                    value={skillSearchInput}
                    onChange={(e) => setSkillSearchInput(e.target.value)}
                    placeholder="Search and add skills..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                  />
                  {skillSearchInput.length > 0 && (
                    <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredSkills.length > 0 ? (
                        filteredSkills.map((skill) => (
                          <li
                            key={skill.skillId}
                            className="p-3 hover:bg-gray-50 transition-colors duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-gray-800">{skill.skillName}</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAddSkill(skill, 'Required')}
                                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                  Required
                                </button>
                                <button
                                  onClick={() => handleAddSkill(skill, 'Preferred')}
                                  className="px-3 py-1 text-sm bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                                >
                                  Preferred
                                </button>
                              </div>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="p-3 text-gray-500">No skills found.</li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
           
        </div>
        <div className="mt-8 w-full flex justify-end space-x-4">
          {!isEditing ? (<>
            <button
              onClick={handleEditClick}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Edit
            </button>
            <button
             onClick={handleDeleteClick}
             className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition"
           >
             Delete
           </button>
           </>
          ) : (
            <>
              <button
                onClick={handleCancelClick}
                className="bg-gray-400 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateClick}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Update
              </button>
            </>
          )}
         
        </div>
        {job.status === 'Permanent Close(Required Candidate Found)' &&
        <div> 
        <h3 className="text-lg font-bold text-green-800">Selected Candidate</h3>
         <ul> {job.selectedCandidates.map((candidate) => (
            <li key={candidate.candidateId} className="mt-4 p-4 border border-green-300 rounded-lg bg-green-50">
              <p className="text-green-700">Name: {candidate.candidateName}</p>
              <p className="text-green-700">Email: {candidate.candidateEmail}</p>
              <Link to={`/candidate/view/${candidate.candidateId}`} className="text-blue-600 hover:text-blue-800 hover:underline transition" >
                         - see more
               </Link>
            </li>
          ))}
          </ul>
          </div>
          }
        <div className="mt-12">
          <button className="bg-gray-400 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-500 transition" onClick={()=>setApplicationShow(true)}>Applications for this Job</button>
          </div>
          <div className="mt-12">
          <JobConfig jobId={job.jobId} />
          </div>
      </div>
       } 
      </>
    );
};

export default JobView;