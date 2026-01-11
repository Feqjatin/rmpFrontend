import React, { useState, useEffect } from 'react';
import { getSkillAssessmentsForCandidate } from '../Api/forAll';
import {Link } from 'react-router-dom';
const CandidateSkillHistory = ({ candidateId, applicationId }) => {
    const [allAssessments, setAllAssessments] = useState([]);
    const [filteredAssessments, setFilteredAssessments] = useState([]);
    const [filter, setFilter] = useState('application');  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getSkillAssessmentsForCandidate(candidateId);
                if(response.msg===null){
                setAllAssessments(response.data);
                setFilteredAssessments(response.data.filter(a => a.applicationId === applicationId));
                }
                else {
                    setError("Failed to fetch skill assessments.");
                }
                
                
            } catch (err) {
                setError("Failed to fetch skill assessments.");
                console.error(err);
            }
            setLoading(false);
        };
        fetchData();
    }, [candidateId, applicationId]);
 
    useEffect(() => {
        if (filter === 'all') {
            setFilteredAssessments(allAssessments);
        } else {
            if(allAssessments.length>0)
            setFilteredAssessments(allAssessments.filter(a => a.applicationId === applicationId));
        }
    }, [filter, allAssessments, applicationId]);

    const getToggleClass = (tab) => {
        return filter === tab
            ? 'bg-blue-600 text-white shadow'
            : 'bg-white text-gray-600 hover:bg-gray-50';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <div className="p-6 rounded-xl font-sans" style={{ background: "#dce9f2" }}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Candidate Skill History 
            <Link to={`/candidate/view/${candidateId}`} className="text-blue-600 hover:text-blue-800 hover:underline transition" >
                        (view candidate details)
                        </Link></h2>
            
            
            <div className="flex p-1 bg-gray-200 rounded-lg mb-4">
                <button
                    onClick={() => setFilter('application')}
                    className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${getToggleClass('application')}`}
                >
                    This Application
                </button>
                <button
                    onClick={() => setFilter('all')}
                    className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${getToggleClass('all')}`}
                >
                    All History
                </button>
            </div>

           
            {loading && <p className="text-center text-blue-600 py-4">Loading history...</p>}
            {error && <p className="text-center text-red-600 py-4">{error}</p>}
            {!loading && !error && filteredAssessments.length === 0 && (
                <p className="text-center text-gray-500 py-4">No skill assessments found for this filter.</p>
            )}
            {!loading && !error && filteredAssessments.length > 0 && (
                <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application Id</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Years</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessed By</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAssessments.map(assessment => (
                                <tr key={assessment.assessmentId} className="hover:bg-gray-50">
                                   <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                   <Link to={`/application/view/${assessment.applicationId}`} className="text-blue-600 hover:text-blue-800 hover:underline transition" > 
                                   {assessment.applicationId}
                                  </Link> </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">{assessment.skillName}</div>
                                        <div className="text-xs text-gray-500">{assessment.stage}</div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center">{assessment.yearsOfExperience?.toFixed(1) || 0}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate" title={assessment.comment}>{assessment.comment && assessment.comment !== "null" ? assessment.comment : 'N/A'}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{assessment.assessedByUserName}</div>
                                        <div className="text-xs text-gray-500">{assessment.assessedInRoleName}</div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(assessment.assessmentDate)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CandidateSkillHistory;