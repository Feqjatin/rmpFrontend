import React, { useState, useEffect } from 'react';
import { getAllCandidate, deleteCandidate } from '../Api/Recruiter';
import CandidateDetails from './CandidateDetails';
import CreateCandidate from './CreateCandidate';
import {Link } from 'react-router-dom';

 
const RecruiterCandidate = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [count, setCount] = useState(0);
 
    const [showDetails, setShowDetails] = useState(false);
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);
    const [addCandidate, setAddCandidate] = useState(false);

    useEffect(() => {
        async function fetchCandidates() {
            setLoading(true);
            setError(null);
            const response = await getAllCandidate();
            if (response.data) {
                setCandidates(response.data);
            } else {
                setError(response.msg || "Failed to fetch candidates.");
                setCandidates([]);
            }
            setLoading(false);
        }
        fetchCandidates();
    }, [count]);

    const handleDelete = async (candidateId) => {
        if (window.confirm('Are you sure you want to delete this candidate?')) {
            const response = await deleteCandidate(candidateId);
            if (response.data) {
                setCount(c => c + 1);  
            } else {
                alert(response.msg || "Failed to delete candidate.");
            }
        }
    };
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'Selected':
            case 'Interview Scheduled':
                return 'bg-green-100 text-green-800';
            case 'Applied':
            case 'Screening':
                return 'bg-blue-100 text-blue-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (showDetails) {
        return (
            <CandidateDetails
                candidateId={selectedCandidateId}
                goBack={() => {
                    setShowDetails(false);
                    setSelectedCandidateId(null);
                    setCount(c => c + 1);  
                }}
            />
        );
    }

    if (addCandidate) {
        return (
            <CreateCandidate
                goBack={() => {
                    setAddCandidate(false);
                    setCount(c => c + 1);  
                }}
            />
        );
    }

    return (
           <><div className="p-4 border-b flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">All Candidates</h1>
                    <button
                        onClick={() => setAddCandidate(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        + Add New Candidate
                    </button>
                </div>

                <div className="p-6">
                    {loading ? (
                         <p className="text-center text-blue-500">Loading...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : candidates.length === 0 ? (
                        <p>No candidates found.</p>
                    ) : (
                        <div className="overflow-x-auto shadow-md rounded-md">
                            <table className="min-w-full table-auto border-collapse border border-gray-300">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 border border-gray-300">ID</th>
                                        <th className="px-4 py-2 border border-gray-300">Name</th>
                                        <th className="px-4 py-2 border border-gray-300">Email</th>
                                        <th className="px-4 py-2 border border-gray-300">Phone</th>
                                        <th className="px-4 py-2 border border-gray-300">Status</th>
                                        <th className="px-4 py-2 border border-gray-300">Created At</th>
                                        <th className="px-4 py-2 border border-gray-300">Updated At</th>
                                        <th className="px-4 py-2 border border-gray-300 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {candidates.map((candidate) => (
                                        <tr key={candidate.candidateId} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-2 border border-gray-300">
                                            <Link to={`/candidate/view/${candidate.candidateId}`} className="text-blue-600 hover:text-blue-800 hover:underline transition" >
                                            {candidate.candidateId}
                                            </Link> 
                                                </td>
                                            <td className="px-4 py-2 border border-gray-300">{candidate.name}</td>
                                            <td className="px-4 py-2 border border-gray-300 max-w-xs truncate">{candidate.email}</td>
                                            <td className="px-4 py-2 border border-gray-300">{candidate.phone}</td>
                                            <td className="px-4 py-2 border border-gray-300">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(candidate.status)}`}>
                                                    {candidate.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 border border-gray-300">{new Date(candidate.createdAt).toLocaleString()}</td>
                                            <td className="px-4 py-2 border border-gray-300">
                                                {candidate.updatedAt ? new Date(candidate.updatedAt).toLocaleString() : "N/A"}
                                            </td>
                                            <td className="px-4 py-2 border border-gray-300 text-center space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setShowDetails(true);
                                                        setSelectedCandidateId(candidate.candidateId);
                                                    }}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                                                >
                                                    See More
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(candidate.candidateId)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                                >
                                                    DELETE
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                </>
    );
};

export default RecruiterCandidate;

