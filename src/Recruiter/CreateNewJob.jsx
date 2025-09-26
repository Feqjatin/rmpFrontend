import React, { useState, useEffect } from 'react';
 import { getAllSkills } from '../api/Recruiter';
 import{createJob} from '../api/Recruiter';
import { useSelector } from 'react-redux';
 

const CreateNewJob = ({ goBack }) => {
    const user = useSelector((state) => state.user.userName);
  const [formData, setFormData] = useState({
    Username:user,
    title: '',
    description: '',
    location: '',
    status: 'Open',
    minExperience: 0,
    skills: [],
  });
  const [allSkills, setAllSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [skillSearchInput, setSkillSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleAddSkill = (selectedSkill) => {
    const newSkill = { ...selectedSkill, skillType: 'Required' };
    setFormData(prevData => ({
      ...prevData,
      skills: [...prevData.skills, newSkill]
    }));
    setSkillSearchInput('');
  };

  const handleDeleteSkill = (skillId) => {
    setFormData(prevData => ({
      ...prevData,
      skills: prevData.skills.filter(skill => skill.skillId !== skillId)
    }));
  };

  const handleCancelClick = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      status: 'Open',
      minExperience: 0,
      skills: [],
    });
    goBack();
  };

  const handleCreateClick = async () => {
    const transformedSkills = formData.skills.map(skill => ({
        Id: skill.skillId,
        Type: skill.skillType
    }));
    
    const dataToCreate = {
        ...formData,
        skills: transformedSkills
    };

    const response = await createJob(dataToCreate);
    console.log(response);
    if (response.data) {
      console.log('Creation successful!');
      goBack();
    } else {
      console.error('Creation failed.');
    }
  };

  const renderField = (label, name, type = 'text') => (
    <div className="flex flex-col mb-4">
      <label className="text-gray-600 font-semibold mb-1">{label}:</label>
      <input
        type={type}
        name={name}
        value={formData[name] || ''}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
      />
    </div>
  );

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start transition-transform">
        <div className="flex justify-between items-center w-full mb-6">
          <button
            onClick={goBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-center text-gray-800 flex-grow">Create New Job</h1>
          <div></div>
        </div>
        
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col mb-4">
            {renderField('Title', 'title', 'text')}
            {renderField('Status', 'status', 'text')}
            {renderField('Min. Experience', 'minExperience', 'number')}
            {renderField('Location', 'location', 'text')}
          </div>
          <div className="flex flex-col mb-4">
            <div className="flex flex-col mb-4 col-span-full">
              <label className="text-gray-600 font-semibold mb-1">Description:</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
              />
            </div>
            
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
                      <span className="text-sm font-medium text-gray-800">
                        {skill.skillName}
                      </span>
                      <button
                        onClick={() => handleDeleteSkill(skill.skillId)}
                        className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
  
  
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
                            onClick={() => handleAddSkill(skill)}
                            className="p-3 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                          >
                            {skill.skillName}
                          </li>
                        ))
                      ) : (
                        <li className="p-3 text-gray-500">No skills found.</li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 w-full flex justify-end space-x-4">
          <button
            onClick={handleCancelClick}
            className="bg-gray-400 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateClick}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewJob;
