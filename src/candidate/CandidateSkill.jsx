import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAllSkills ,updateCandidateSkill,deleteCandidateSkill,getCandidateData} from '../api/Candidate';
function CandidateSkill() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [candidateSkills, setCandidateSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const id = useSelector((state) => state.user.Id);

  const [formData, setFormData] = useState({
    skillId: '',
    proficiencyLevel: ''
  });

  useEffect(() => {
    fetchSkillsData();
  }, []);

  const fetchSkillsData = async () => {
    setLoading(true);
    
    
    const allSkillsResponse = await getAllSkills();
    
    if (!allSkillsResponse || !allSkillsResponse.data) {
      setError("Failed to load skills");
      setLoading(false);
      return;
    }

    setAllSkills(allSkillsResponse.data);

     
    const response = await getCandidateData(id);
  
    if (!response || !response.data) {
      setError("Failed to load candidate skills");
    } else {
      setCandidateSkills(response.data.candidateSkillMaps || []);
      updateAvailableSkills(response.data.candidateSkillMaps || [], allSkillsResponse.data);
      setError(null);
    }
    setLoading(false);
  };

  const updateAvailableSkills = (candidateSkillsList, allSkillsList) => {
    const candidateSkillIds = candidateSkillsList.map(cs => cs.skill?.skillId || cs.skillId);
    const available = allSkillsList.filter(skill => !candidateSkillIds.includes(skill.skillId));
    setAvailableSkills(available);
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
    setFormData({
      skillId: '',
      proficiencyLevel: ''
    });
    setError(null);
  };

  const handleEdit = (skillMap) => {
    setEditingId(skillMap.candidateSkillId || skillMap.skillId);
    setIsAdding(false);
    setFormData({
      skillId: skillMap.skill?.skillId || skillMap.skillId,
      proficiencyLevel: skillMap.proficiencyLevel
    });
    setError(null);
  };

  const handleSave = async () => {
    if (!formData.proficiencyLevel) {
      setError("Please select proficiency level");
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError(null);

    if (editingId) {
      console.log(formData,editingId,id);
      const response = await updateCandidateSkill(formData,id);

      if (!response || !response.data) {
        setError(response?.msg || "Failed to update skill");
      } else {
        setSuccess(true);
        setIsAdding(false);
        setEditingId(null);
        setFormData({ skillId: '', proficiencyLevel: '' });
        fetchSkillsData();
        setTimeout(() => setSuccess(false), 3000);
      }
    } else {
       
      if (!formData.skillId) {
        setError("Please select a skill");
        setLoading(false);
        return;
      }
       console.log(formData,id);
      const response = await updateCandidateSkill(formData,id);

      if (!response || !response.data) {
        setError(response?.msg || "Failed to add skill");
      } else {
        setSuccess(true);
        setIsAdding(false);
        setFormData({ skillId: '', proficiencyLevel: '' });
        fetchSkillsData();
        setTimeout(() => setSuccess(false), 3000);
      }
    }
    setLoading(false);
  };

  const handleDelete = async (candidateSkillId) => {
    

    setLoading(true);
    setError(null);
     
    const response = await deleteCandidateSkill( id,candidateSkillId);

    if (!response || !response.data) {
      setError(response?.msg || "Failed to delete skill");
    } else {
      fetchSkillsData();
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ skillId: '', proficiencyLevel: '' });
    setError(null);
  };

  const getSkillName = (skillId) => {
    const skill = allSkills.find(s => s.skillId === skillId);
    return skill ? skill.skillName : 'Unknown';
  };

  const getProficiencyColor = (level) => {
    const colors = {
      'Beginner': 'bg-blue-100 text-blue-700',
      'Intermediate': 'bg-green-100 text-green-700',
      'Advanced': 'bg-purple-100 text-purple-700',
      'Expert': 'bg-orange-100 text-orange-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 rounded-xl font-sans" style={{ background: "#f9fafb" }}>
      <div className="max-w-6xl mx-auto my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Skills</h2>
          {!isAdding && !editingId && (
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Add Skill
            </button>
          )}
        </div>

        {loading && <p className="text-blue-500">Processing...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Skill saved successfully!</p>}

        {(isAdding || editingId) && (
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {editingId ? 'Edit Skill' : 'Add New Skill'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!editingId && (
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Select Skill *</label>
                  <select
                    name="skillId"
                    value={formData.skillId}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a skill</option>
                    {availableSkills.map((skill) => (
                      <option key={skill.skillId} value={skill.skillId}>
                        {skill.skillName} {skill.description && `- ${skill.description}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {editingId && (
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Skill</label>
                  <p className="text-lg font-semibold text-gray-900 p-2">
                    {getSkillName(formData.skillId)}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm text-gray-500 block mb-1">Proficiency Level *</label>
                <select
                  name="proficiencyLevel"
                  value={formData.proficiencyLevel}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select proficiency</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!loading && candidateSkills.length === 0 && (
            <p className="col-span-full text-gray-500 text-center py-8">No skills found. Add your first one!</p>
          )}

          {candidateSkills.map((skillMap) => (
            <div
              key={skillMap.candidateSkillId || skillMap.skillId}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-900">
                  {skillMap.skill?.skillName || getSkillName(skillMap.skillId)}
                </h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(skillMap)}
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(skillMap.candidateSkillId || skillMap.skillId)}
                    className="px-2 py-1 text-xs bg-red-600 text-white rounded font-medium hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {skillMap.skill?.description && (
                <p className="text-sm text-gray-600 mb-3">{skillMap.skill.description}</p>
              )}

              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getProficiencyColor(skillMap.proficiencyLevel)}`}>
                {skillMap.proficiencyLevel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CandidateSkill;