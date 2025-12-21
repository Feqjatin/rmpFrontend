import React, { useState, useEffect } from 'react';
import { getCandidateById, updateCandidate } from '../api/Recruiter';

const CandidateDetails = ({ candidateId, goBack }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [originalData, setOriginalData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (candidateId) {
            async function fetchCandidate() {
                setLoading(true);
                setError(null);
                const response = await getCandidateById(candidateId);
                if (response.data) {
                    console.log(response.data);
                    setFormData(response.data);
                    setOriginalData(response.data);  
                } else {
                    setError(response.msg || `Candidate with ID ${candidateId} not found.`);
                    setFormData({});
                }
                setLoading(false);
            }
            fetchCandidate();
        }
    }, [candidateId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setFormData(originalData);  
    };

    const handleUpdateClick = async () => {
        const response = await updateCandidate(formData);
        if (response.data) {
            console.log('Update successful!');
            setIsEditing(false);
            setOriginalData(formData);  
        } else {
            setError(response.msg || 'Failed to update candidate.');
            console.error('Update failed.');
            
        }
    };

    const renderField = (label, name, type = 'text', readOnly) => (
        <div className="flex flex-col mb-4">
            <label className="text-gray-600 font-semibold mb-1">{label}:</label>
            {readOnly ? (
                <span className="text-gray-800 p-3 bg-gray-200 rounded-lg shadow-inner min-h-[48px] flex items-center">
                    {name.includes('At') && formData[name] ? new Date(formData[name]).toLocaleString() : formData[name] || 'N/A'}
                </span>
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

    if (loading) return <div className="p-6 text-center text-gray-500">Loading candidate details...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
    if (!formData.candidateId) return <div className="p-6 text-center text-gray-500">No candidate details available.</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-5xl mx-auto border border-gray-100">
                <div className="flex justify-between items-center w-full mb-6">
                    <button
                        onClick={goBack}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-center text-gray-800 flex-grow">Candidate Details</h1>
                    <div></div>  
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    {renderField('Candidate ID', 'candidateId', 'text', true)}
                    {renderField('Name', 'name', 'text', !isEditing)}
                    {renderField('Email', 'email', 'email', !isEditing)}
                    {renderField('Phone', 'phone', 'text', !isEditing)}
                    {renderField('Resume Path', 'resumePath', 'text', !isEditing)}
                    {renderField('Status', 'status', 'text', !isEditing)}
                    {renderField('Created At', 'createdAt', 'text', true)}
                    {renderField('Updated At', 'updatedAt', 'text', true)}
                </div>

                <div className="mt-8 w-full flex justify-end space-x-4">
                    {!isEditing ? (
                        <button
                            onClick={handleEditClick}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
                        >
                            Edit
                        </button>
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
            </div>
    );
};

export default CandidateDetails;    