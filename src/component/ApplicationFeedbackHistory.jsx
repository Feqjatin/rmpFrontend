import React, { useState, useEffect } from 'react';
import { getFeedbackForApplication } from '../api/forAll';

const ApplicationFeedbackHistory = ({ applicationId }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
 
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getFeedbackForApplication(applicationId);
                if(response.msg===null){
                setFeedbacks(response.data);
                }
                else {
                    setError("Failed to fetch application feedback.");
                }
              
            } catch (err) {
                setError("Failed to fetch application feedback.");
                console.error(err);
            }
            setLoading(false);
        };
        fetchData();
    }, [applicationId]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <div className="p-6 rounded-xl font-sans" style={{ background: "#dce9f2" }}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Application Feedback</h2>
             
            {loading && <p className="text-center text-blue-600 py-4">Loading feedback...</p>}
            {error && <p className="text-center text-red-600 py-4">{error}</p>}
            {!loading && !error && feedbacks.length === 0 && (
                <p className="text-center text-gray-500 py-4">No feedback has been submitted for this application.</p>
            )}
            {!loading && !error && feedbacks.length > 0 && (
                <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {feedbacks.map(feedback => (
                                <tr key={feedback.feedbackId} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">{feedback.userName}</div>
                                        <div className="text-xs text-gray-500">{feedback.userRole}</div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700 max-w-md" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                        {feedback.commentText}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                                            {feedback.feedbackStage}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(feedback.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

 export default ApplicationFeedbackHistory;