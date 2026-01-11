import React, { useState, useEffect } from 'react';
import { createCandidate } from '../Api/Recruiter';
const CreateCandidate = ({ goBack }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        resumePath: '',
        status: 'Active',
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleCancelClick = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            resumePath: '',
            status: 'Active',
        });
        goBack();
    };

    const handleCreateClick = async () => {
        setLoading(true);
        const response = await createCandidate(formData);
        setLoading(false);
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
        <div className="w-full p-8 bg-gray-100">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center w-full mb-6">
                    <button
                        onClick={goBack}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-center text-gray-800 flex-grow">Create New Candidate</h1>
                    <div></div>  
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderField('Name', 'name')}
                    {renderField('Email', 'email', 'email')}
                    {renderField('Phone', 'phone')}
                    {renderField('Resume Path', 'resumePath')}
                    <div className="flex flex-col mb-4">
                         <label className="text-gray-600 font-semibold mb-1">Status:</label>
                         <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner bg-white"
                         >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Hired">Hired</option>
                         </select>
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
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition disabled:bg-blue-400"
                    >
                        {loading ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default CreateCandidate;