import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCandidateData ,updateCandidateData} from '../Api/Candidate';
function CandidateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const id = useSelector((state) => state.user.Id);
  
  const [profileData, setProfileData] = useState({
    candidateId: null,
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    profileSummary: '',
    createdAt: '',
    updatedAt: ''
  });

  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    profileSummary: '',
    newPassword: ''
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    const response = await getCandidateData(id);
  
    if (!response || !response.data) {
        setError("Failed to load profile data");
    } else {
        setProfileData(response.data);
        setEditData({
          name: response.data.name || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          city: response.data.city || '',
          state: response.data.state || '',
          zipCode: response.data.zipCode || '',
          linkedinUrl: response.data.linkedinUrl || '',
          githubUrl: response.data.githubUrl || '',
          portfolioUrl: response.data.portfolioUrl || '',
          profileSummary: response.data.profileSummary || '',
          newPassword: ''
        });
        setError(null); 
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    setError(null);
   
      const updateDto = {};
      Object.keys(editData).forEach(key => {
        if (key === 'newPassword') {
          if (editData[key]) updateDto[key] = editData[key];
        } else if (editData[key] !== profileData[key]) {
          updateDto[key] = editData[key] || null;
        }
      });
      console.log("Update DTO:", updateDto);
    
      
    const response = await updateCandidateData(updateDto,id);
  
    if (!response || !response.data) {
        setError("Failed to load profile data");
    } else {
            console.log("good update");
    }

      setSuccess(true);
      setIsEditing(false);
      fetchProfileData();
      setLoading(false);
  };

  const handleCancel = () => {
    setEditData({
      name: profileData.name || '',
      phone: profileData.phone || '',
      address: profileData.address || '',
      city: profileData.city || '',
      state: profileData.state || '',
      zipCode: profileData.zipCode || '',
      linkedinUrl: profileData.linkedinUrl || '',
      githubUrl: profileData.githubUrl || '',
      portfolioUrl: profileData.portfolioUrl || '',
      profileSummary: profileData.profileSummary || '',
      newPassword: ''
    });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="p-6 rounded-xl font-sans" style={{ background: "#f9fafb" }}>
      <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Candidate Profile</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        {loading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Profile updated successfully!</p>}

        {!loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-900">{profileData.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-1">Email</label>
                <p className="text-lg font-semibold text-gray-900">{profileData.email}</p>
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={editData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-900">{profileData.phone}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-1">Candidate ID</label>
                <p className="text-lg font-semibold text-gray-900">{profileData.candidateId}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-500 block mb-1">Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={editData.address}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">{profileData.address}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-500 block mb-1">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={editData.city}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">{profileData.city}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-500 block mb-1">State</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="state"
                      value={editData.state}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">{profileData.state}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-500 block mb-1">Zip Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="zipCode"
                      value={editData.zipCode}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">{profileData.zipCode}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Social Links</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">LinkedIn URL</label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="linkedinUrl"
                      value={editData.linkedinUrl}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <a href={profileData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {profileData.linkedinUrl || 'Not provided'}
                    </a>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-500 block mb-1">GitHub URL</label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="githubUrl"
                      value={editData.githubUrl}
                      onChange={handleInputChange}
                      placeholder="https://github.com/yourusername"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <a href={profileData.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {profileData.githubUrl || 'Not provided'}
                    </a>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-500 block mb-1">Portfolio URL</label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="portfolioUrl"
                      value={editData.portfolioUrl}
                      onChange={handleInputChange}
                      placeholder="https://yourportfolio.com"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <a href={profileData.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {profileData.portfolioUrl || 'Not provided'}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Profile Summary</h3>
              {isEditing ? (
                <textarea
                  name="profileSummary"
                  value={editData.profileSummary}
                  onChange={handleInputChange}
                  placeholder="Write a brief summary about yourself..."
                  className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profileData.profileSummary || 'No summary provided'}</p>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition disabled:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="text-xs text-gray-400 pt-4 border-t border-gray-200">
              <p>Created: {new Date(profileData.createdAt).toLocaleString()}</p>
              <p>Last Updated: {new Date(profileData.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateProfile;