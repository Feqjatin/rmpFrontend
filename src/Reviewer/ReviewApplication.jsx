import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { updateApplicationsStatus } from '../api/Reviewer';
import { updateApplicationNote } from '../api/Reviewer';
import {crateApplicationComment} from '../api/forAll';
import SkillReview from '../component/SkillReview';
import ApplicationFeedbackHistory from '../component/ApplicationFeedbackHistory';
import CandidateSkillHistory from '../component/CandidateSkillHistory';

const ReviewerApplication = ({initialReviewAction ,setPage,countFor1 , setCountFor1,skillSet  }) => {
    
    const [status, setStatus] = useState(initialReviewAction.status);
    const [note, setNote] = useState(initialReviewAction.personalNote || '');
    const [resumeLoading, setResumeLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [count, setCount] = useState(0);
    const user= useSelector((state) => state.user.userName);
    const [applicationComment, setApplicationComment] = useState('');
    

  console.log("Initial Review Action:",initialReviewAction);
   const  handleSaveComment= async()=>{
    setLoading(true);
    const response = await crateApplicationComment({applicationId:initialReviewAction.applicationId,username:user, comment: applicationComment,role:"reviewer"});

    if (!response.data ==null) {
      setError(response?.msg || "");
    }
    else{
        setApplicationComment('');
    }
    
    setLoading(false);
  
    }

    useEffect(() => {
        setStatus(initialReviewAction.status);
        setNote(initialReviewAction.personalNote || '');
    }, [initialReviewAction]);
     
    const handleSaveNote = async() => {
        setLoading(true);
        const response = await updateApplicationNote({id:initialReviewAction.applicationId, personalNote: note,username:user});

        if (!response.data ==null) {
          setError(response?.msg || "");
        }
        setCountFor1(c => c + 1);
        setLoading(false);
        setCount(c => c + 1);
    }

    const handleStatusChange =async (newStatus) => {
    if(!initialReviewAction.isPublished){
        setLoading(true);
    const response = await updateApplicationsStatus({ids: [initialReviewAction.applicationId], status: newStatus,username:user});

    if (!response.data ==null) {
      setError(response?.msg || "");
    }
    setLoading(false);
        setStatus(newStatus);
        setCountFor1(c => c + 1);
    setCount(c => c + 1);  
     }
    };

    const handleSave = () => {
         setPage(2);
    };

    const handlePublish = async() => {
    setLoading(true);
    const filtered = [initialReviewAction.applicationId];
     if(status==='OnHold')alert("Cannot publish review with status On Hold. Please change the status to Accepted or Rejected before publishing.");
     else{
    const response = await updateApplicationsStatus({ids: filtered, status: 'Published',username:user});
    console.log("publish response",response);
    if (!response.data ==null) {
        setError(response?.msg || "");
      }
     }
   
    setLoading(false);
        setCountFor1(c => c + 1);
       setPage(2);
    };

 
    const ActionButton = ({ text, onClick, isActive, color }) => {
        const baseClasses = "w-full text-center font-semibold py-2 px-4 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
      
        const colorMap = {
          green: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
          red: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
          yellow: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
        };
      
        const activeClasses = `${colorMap[color]} text-white shadow-md`;
        const inactiveClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400";
      
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
        <>
       <div className="flex items-center gap-2" onClick={() => setPage(2)}>
        <img src="../back.png" height="10" width="10" />
        <button 
           
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          Back
        </button>
      </div>
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
             {error && <p className="text-red-500">{error}</p>}
             {loading && <p className="text-blue-500">Processing...</p>}

           { !loading && !error && 
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
                    { initialReviewAction.isPublished ?<p className="mb-4 text-blue-600 hover:text-blue-800 font-semibold">Published</p> :<>
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
                    </>}
                    
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Personal Note</h3>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        onBlur={handleSaveNote}
                        placeholder="Add your private notes here..."
                        readOnly={initialReviewAction.isPublished}
                        className={`w-full h-32 p-2 border rounded-lg transition ${
                            initialReviewAction.isPublished
                            ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            : 'border-gray-200 bg-gray-100 text-gray-500  '
                        }`}
                        />

 
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Application Comment (Public)</h3>
                               <textarea
                                    value={applicationComment}
                                    onChange={(e) => setApplicationComment(e.target.value)}
                                    placeholder="Add a public comment for the hiring team..."
                                    readOnly={initialReviewAction.isPublished}
                                    className={`w-full h-32 p-2 border rounded-lg transition ${
                                        !initialReviewAction.isPublished
                                            ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                            : 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                                    }`}
                                />
                                {!initialReviewAction.isPublished && (
                                    <button
                                    onClick={handleSaveComment}
                                    className={`mt-2 w-full text-white text-sm font-semibold rounded-lg shadow focus:outline-none
                                      ${applicationComment.length === 0 
                                        ? 'bg-green-500 hover:bg-green-600' 
                                        : 'bg-blue-500 hover:bg-blue-600'}`}
                                  >
                                    Save Comment
                                  </button>
                                  
                                )}
                            </div>
                            <SkillReview
                                jobSkills={skillSet}
                                applicationId={initialReviewAction.applicationId}
                                username={user}
                                isPublished={initialReviewAction.isPublished}
                                stage={"REVIEWER_SKILL_ASSESSMENT"}
                                role={"reviewer"}
                                />
                      {!initialReviewAction.isPublished &&  
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
                    </div>}

                </div>
            </div>}
        </div>
        <ApplicationFeedbackHistory applicationId={initialReviewAction.applicationId} />
       <CandidateSkillHistory candidateId={initialReviewAction.candidateId} applicationId={initialReviewAction.applicationId} /> 
        </>
    );
};

 


export default ReviewerApplication;



 