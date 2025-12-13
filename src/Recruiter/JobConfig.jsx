import React, { useEffect, useState } from 'react';
import { X, Plus, Edit2, Trash2, Save } from 'lucide-react';
import {getRoundTemplatesByJobId,getReviewersByJobId,assignReviewerToJob,removeReviewerToJob,createRoundTemplatesByJobId,deleteRoundTemplatesByJobId,updateRoundTemplatesByJobId} from '../api/Recruiter';
import {getAllUsers} from '../api/Admin';

function JobConfig({ jobId }) {

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Reviewers');
  const [error, setError] = useState(null);
  // Reviewer Management State
  const [reviewers, setReviewers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showAddReviewer, setShowAddReviewer] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  
  // Round Templates State
  const [roundTemplates, setRoundTemplates] = useState([]);
  const [showAddRound, setShowAddRound] = useState(false);
  const [editingRounds, setEditingRounds] = useState([]);
  const [newRounds, setNewRounds] = useState([]);
  
  const tabs = ['Reviewers', 'Round Templates'];
  const activeIndex = tabs.indexOf(activeTab);
  
  const roundTypes = ['Technical', 'HR', 'Managerial', 'Cultural Fit', 'Final'];

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const fetchData = async () => {
    setLoading(true);  
    setError(null);
     const fetchedReviewers = await getReviewersByJobId(jobId);
     const fetchedUsers = await getAllUsers();
     const fetchedRounds = await getRoundTemplatesByJobId(jobId);
     
     if(fetchedReviewers.data==null || fetchedUsers==null || fetchedRounds.data==null){
      setError('Error fetching data');
      
     }
     else{
      setReviewers(fetchedReviewers.data);
      setAllUsers(fetchedUsers);
      setRoundTemplates(fetchedRounds.data);
     }
    setLoading(false);
  };

 
  const handleAssignReviewer = async () => {
    if (!selectedUser) return;
    
    const payload = {
      jobId: jobId,
      userName: selectedUser
    };
    
    console.log('Assigning reviewer:', payload);
     
    const response = await assignReviewerToJob(payload);
    if(response.msg!=null){
      setError("Error assigning reviewer ");
    }
    setShowAddReviewer(false);
    setSelectedUser('');
    fetchData();
  };

  const handleDeleteReviewer = async (username) => {
     
    
    const payload = {
      jobId: jobId,
      userName: username
    };
    
    console.log('Deleting reviewer:', payload);
    const response = await removeReviewerToJob(payload);
    if(response.msg!=null){
      setError("Error remove reviewer ");
    }
    
    fetchData();
  };

  // Round Templates Functions
  const handleAddNewRound = () => {
    const newRound = {
      tempId: Date.now(),
      jobId: jobId,
      roundOrder: roundTemplates.length + newRounds.length + 1,
      roundType: "Technical",
      roundName: "",
      description: ""
    };
    setNewRounds([...newRounds, newRound]);
  };

  const handleUpdateNewRound = (tempId, field, value) => {
    setNewRounds(newRounds.map(round => 
      round.tempId === tempId ? { ...round, [field]: value } : round
    ));
  };

  const handleRemoveNewRound = (tempId) => {
    setNewRounds(newRounds.filter(round => round.tempId !== tempId));
  };

  const handleSaveNewRounds = async () => {
    const payload = newRounds.map(({ tempId, ...round }) => round);
    console.log('Creating rounds:', payload);
    const response = await createRoundTemplatesByJobId(payload);
    if(response.msg!=null){
      setError("Error  creating round templete ");
    }
    setNewRounds([]);
    fetchData();
  };

  const handleEditRound = (round) => {
    if (!editingRounds.find(r => r.roundTemplateId === round.roundTemplateId)) {
      setEditingRounds([...editingRounds, { ...round }]);
    }
  };

  const handleUpdateEditingRound = (roundTemplateId, field, value) => {
    setEditingRounds(editingRounds.map(round => 
      round.roundTemplateId === roundTemplateId ? { ...round, [field]: value } : round
    ));
  };

  const handleCancelEdit = (roundTemplateId) => {
    setEditingRounds(editingRounds.filter(r => r.roundTemplateId !== roundTemplateId));
  };

  const handleSaveEdits = async () => {
    console.log('Updating rounds:', editingRounds);
    const response = await updateRoundTemplatesByJobId(editingRounds);
    if(response.msg!=null){
      setError("Error  updating round templete ");
    }
    
    setEditingRounds([]);
    fetchData();
  };

  const handleDeleteRound = async (roundTemplateId) => {
     
    console.log('Deleting round:', roundTemplateId);
    const response = await deleteRoundTemplatesByJobId(roundTemplateId);
    if(response.msg!=null){
      console.log('Error deleting round:', response.msg);
      setError("Error delete round templete :"+response.msg);
    }else{
    fetchData();
    }
  };

  const isEditing = (roundTemplateId) => {
    return editingRounds.some(r => r.roundTemplateId === roundTemplateId);
  };

  const getEditingRound = (roundTemplateId) => {
    return editingRounds.find(r => r.roundTemplateId === roundTemplateId);
  };

  return (
    <div className="max-w-6xl mx-auto my-8 p-6 bg-white rounded-2xl border border-gray-200 font-sans" style={{ background: "#dce9f2" }}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Job Configuration</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {/* Tabs */}
      <div className="relative mb-6">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-1/2 py-2 text-sm font-semibold transition-colors duration-300 ${  
                activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div
          className="absolute bottom-0 h-0.5 bg-blue-600 rounded-full transition-transform duration-300 ease-in-out"
          style={{
            width: '50%',  
            transform: `translateX(${activeIndex * 100}%)`
          }}
        />
      </div>

      {loading && <p className="text-blue-500">Loading...</p>}

      {/* Reviewers Tab */}
      {!loading && activeTab === 'Reviewers' && (
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Assigned Reviewers</h3>
            <button
              onClick={() => setShowAddReviewer(!showAddReviewer)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Plus size={16} />
              Add Reviewer
            </button>
          </div>

          {/* Add Reviewer Form */}
          {showAddReviewer && (
            <div className="mb-4 p-4 bg-white rounded-lg shadow border border-gray-200">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select User
                  </label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select User --</option>
                    {allUsers.filter(user => 
                      !reviewers.some(r => r.username === user.username)
                    ).map(user => (
                      <option key={user.userId} value={user.username}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAssignReviewer}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Assign
                </button>
                <button
                  onClick={() => setShowAddReviewer(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Reviewers Table */}
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border border-gray-300">Username</th>
                  <th className="px-4 py-2 border border-gray-300">Assigned At</th>
                  <th className="px-4 py-2 border border-gray-300">Applications Reviewed</th>
                  <th className="px-4 py-2 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviewers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                      No reviewers assigned
                    </td>
                  </tr>
                ) : (
                  reviewers.map((reviewer) => (
                    <tr key={reviewer.userId}>
                      <td className="px-4 py-2 border border-gray-300 text-center">
                        {reviewer.username}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-center">
                        {new Date(reviewer.assignedAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-center">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                          {reviewer.totalApplicationReviewed}
                        </span>
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-center">
                        <button
                          onClick={() => handleDeleteReviewer(reviewer.username)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Round Templates Tab */}
      {!loading && activeTab === 'Round Templates' && (
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Round Templates</h3>
            <div className="flex gap-2">
              {editingRounds.length > 0 && (
                <button
                  onClick={handleSaveEdits}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  <Save size={16} />
                  Save Edits
                </button>
              )}
              {newRounds.length > 0 && (
                <button
                  onClick={handleSaveNewRounds}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  <Save size={16} />
                  Save New Rounds
                </button>
              )}
              <button
                onClick={handleAddNewRound}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Plus size={16} />
                Add Round
              </button>
            </div>
          </div>

          {/* Existing Rounds */}
          <div className="space-y-3 mb-6">
            {roundTemplates.map((round) => {
              const editing = isEditing(round.roundTemplateId);
              const editData = editing ? getEditingRound(round.roundTemplateId) : round;
              
              return (
                <div key={round.roundTemplateId} className="p-4 bg-white rounded-lg shadow border border-gray-200">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <label className="block text-xs text-gray-500 mb-1">Order</label>
                      <input
                        type="number"
                        value={editData.roundOrder}
                        onChange={(e) => handleUpdateEditingRound(round.roundTemplateId, 'roundOrder', parseInt(e.target.value))}
                        disabled={!editing}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center disabled:bg-gray-100"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Type</label>
                      <select
                        value={editData.roundType}
                        onChange={(e) => handleUpdateEditingRound(round.roundTemplateId, 'roundType', e.target.value)}
                        disabled={!editing}
                        className="w-full px-2 py-1 border border-gray-300 rounded disabled:bg-gray-100"
                      >
                        {roundTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-xs text-gray-500 mb-1">Name</label>
                      <input
                        type="text"
                        value={editData.roundName}
                        onChange={(e) => handleUpdateEditingRound(round.roundTemplateId, 'roundName', e.target.value)}
                        disabled={!editing}
                        className="w-full px-2 py-1 border border-gray-300 rounded disabled:bg-gray-100"
                      />
                    </div>
                    <div className="col-span-4">
                      <label className="block text-xs text-gray-500 mb-1">Description</label>
                      <input
                        type="text"
                        value={editData.description || ''}
                        onChange={(e) => handleUpdateEditingRound(round.roundTemplateId, 'description', e.target.value)}
                        disabled={!editing}
                        className="w-full px-2 py-1 border border-gray-300 rounded disabled:bg-gray-100"
                      />
                    </div>
                    <div className="col-span-2 flex gap-2 justify-end">
                      {editing ? (
                        <button
                          onClick={() => handleCancelEdit(round.roundTemplateId)}
                          className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditRound(round)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteRound(round.roundTemplateId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* New Rounds */}
          {newRounds.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-green-700">New Rounds</h4>
              {newRounds.map((round) => (
                <div key={round.tempId} className="p-4 bg-green-50 rounded-lg shadow border-2 border-green-200">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <label className="block text-xs text-gray-500 mb-1">Order</label>
                      <input
                        type="number"
                        value={round.roundOrder}
                        onChange={(e) => handleUpdateNewRound(round.tempId, 'roundOrder', parseInt(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Type</label>
                      <select
                        value={round.roundType}
                        onChange={(e) => handleUpdateNewRound(round.tempId, 'roundType', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      >
                        {roundTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-xs text-gray-500 mb-1">Name</label>
                      <input
                        type="text"
                        value={round.roundName}
                        onChange={(e) => handleUpdateNewRound(round.tempId, 'roundName', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                        placeholder="Round name..."
                      />
                    </div>
                    <div className="col-span-4">
                      <label className="block text-xs text-gray-500 mb-1">Description</label>
                      <input
                        type="text"
                        value={round.description}
                        onChange={(e) => handleUpdateNewRound(round.tempId, 'description', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                        placeholder="Description..."
                      />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <button
                        onClick={() => handleRemoveNewRound(round.tempId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {roundTemplates.length === 0 && newRounds.length === 0 && (
            <p className="text-center text-gray-500 py-8">No round templates configured</p>
          )}
        </div>
      )}
    </div>
  );
}

export default JobConfig;