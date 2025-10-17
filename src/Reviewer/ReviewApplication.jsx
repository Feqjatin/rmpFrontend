import React, { useState, useEffect } from 'react';

 
const ReviewerApplication = ({initialReviewAction  }) => {
    
    const [status, setStatus] = useState(initialReviewAction.status);
    const [note, setNote] = useState(initialReviewAction.personalNote || '');
    const [resumeLoading, setResumeLoading] = useState(true);
 
    useEffect(() => {
        setStatus(initialReviewAction.status);
        setNote(initialReviewAction.personalNote || '');
    }, [initialReviewAction]);
 
    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        console.log(`Status changed to: ${newStatus}`);
    };

    const handleSave = () => {
        const payload = {
            ...initialReviewAction,
            status,
            personalNote: note,
            isPublished: false,  
        };
        console.log("Saving Draft:", payload);
        alert("Draft saved! (Check console for data)");
    };

    const handlePublish = () => {
        const payload = {
            ...initialReviewAction,
            status,
            personalNote: note,
            isPublished: true,  
        };
        console.log("Publishing Review:", payload);
        alert("Review Published! (Check console for data)");
    };

 
    const ActionButton = ({ text, onClick, isActive, color }) => {
        const baseClasses = "w-full text-center font-semibold py-2 px-4 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
        const activeClasses = `bg-${color}-600 text-white shadow-md hover:bg-${color}-700 focus:ring-${color}-500`;
        const inactiveClasses = `bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400`;
        return (
            <button
                onClick={onClick}
                className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            >
                {text}
            </button>
        );
    };

    return (
        <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen font-sans">
       
            <div className="flex-grow md:w-2/3 p-4">
                <div className="relative w-full h-full bg-white rounded-lg shadow-lg border border-gray-200">
                    {resumeLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-gray-500">Loading Resume...</p>
                        </div>
                    )}
                    <iframe
                        src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                        title="Candidate Resume"
                        className="w-full h-full border-0 rounded-lg"
                        onLoad={() => setResumeLoading(false)}
                    />
                </div>
            </div>

            
            <div className="w-full md:w-1/3 bg-white p-6 shadow-xl border-l border-gray-200">
                <div className="sticky top-6">
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Reviewer Panel</h2>
                    
                    <div className="mb-4">
                        <p className="text-sm text-gray-500">Application ID</p>
                        <p className="text-lg font-semibold text-gray-900">{initialReviewAction.applicationId}</p>
                    </div>

                    <div className="mb-6">
                        <p className="text-sm text-gray-500">Reviewer ID</p>
                        <p className="text-lg font-semibold text-gray-900">{initialReviewAction.reviewerUserId}</p>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Take Action</h3>
                    <div className="space-y-3 mb-6">
                        <ActionButton
                            text="Accept"
                            onClick={() => handleStatusChange('Accepted')}
                            isActive={status === 'Accepted'}
                            color="green"
                        />
                        <ActionButton
                            text="Reject"
                            onClick={() => handleStatusChange('Rejected')}
                            isActive={status === 'Rejected'}
                            color="red"
                        />
                        <ActionButton
                            text="On Hold"
                            onClick={() => handleStatusChange('OnHold')}
                            isActive={status === 'OnHold'}
                            color="yellow"
                        />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Personal Note</h3>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add your private notes here..."
                        className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />

                    <div className="mt-6 border-t pt-6 space-y-3">
                        <button 
                            onClick={handleSave}
                            className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                        >
                            Save as Draft
                        </button>
                         <button 
                            onClick={handlePublish}
                            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Publish Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

 


export default ReviewerApplication;
