import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SkillReview from '../component/SkillReview';
import { crateApplicationComment } from '../api/forAll';
import JobPostingCard from '../component/JobPostingCard';
import ApplicationFeedbackHistory from '../component/ApplicationFeedbackHistory';
import CandidateSkillHistory from '../component/CandidateSkillHistory';
function InterviewerApplication({data, setPage, refresh}) 
 {
  
    const [resumeLoading, setResumeLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [count, setCount] = useState(0);
    const user= useSelector((state) => state.user.userName);
    const [applicationComment, setApplicationComment] = useState('');
    console.log("Application Data:",data);

    const  handleSaveComment= async()=>{
        setLoading(true);
        const response = await crateApplicationComment({applicationId:data.applicationId,username:user, comment: applicationComment,role:"interviewer"});
    
        if (!response.data ==null) {
          setError(response?.msg || "");
        }
        else{
            setApplicationComment('');
        }
        refresh(c=>c+1);
        setLoading(false);
    }    


  return <>
  <div className="p-6 rounded-xl font-sans" style={{ background: "#f9fafb" }}>
  <button onClick={() => setPage(1)} className="mb-4 text-blue-600 hover:text-blue-800 font-semibold">Back</button>
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
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Interview Panel</h2>
              
              <div className="mb-4">
                  <p className="text-sm text-gray-500">Application ID</p>
                  <p className="text-lg font-semibold text-gray-900">{data.applicationId}</p>
              </div>
                
              <div className="mb-6">
                  <p className="text-sm text-gray-500">Interviewer ID</p>
                  <p className="text-lg font-semibold text-gray-900">{data.interviewId}</p>
              </div>
              <div className="mb-6">
                  <p className="text-sm text-gray-500">candidate ID</p>
                  <p className="text-lg font-semibold text-gray-900">{data.candidateInfo.candidateId}</p>
              </div>
           
              
              {/* <h3 className="text-lg font-semibold text-gray-700 mb-3">Personal Note</h3>
              <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onBlur={handleSaveNote}
                  placeholder="Add your private notes here..."
                  readOnly={data.isPublished}
                  className={`w-full h-32 p-2 border rounded-lg transition ${
                      data.isPublished
                      ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      : 'border-gray-200 bg-gray-100 text-gray-500  '
                  }`}
                  /> */}

<JobPostingCard jobData={data.jobInfo} />
  <div className="mt-6">
                          <h3 className="text-lg font-semibold text-gray-700 mb-3">Application Comment (Public)</h3>
                         <textarea
                              value={applicationComment}
                              onChange={(e) => setApplicationComment(e.target.value)}
                              placeholder="Add a public comment for the hiring team..."
                              
                              className={`w-full h-32 p-2 border rounded-lg transition ${
                                  
                                      'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                      
                              }`}
                          />
                          {!data.isPublished && (
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
                          jobSkills={data.jobInfo.skills}
                          applicationId={data.applicationId}
                          username={user}
                          isPublished={data.isPublished}
                          stage={"INTERVIEWER_SKILL_ASSESSMENT"}
                          role={"interviewer"}
                          />
               
             
          </div>
      </div>}
     </div>
      <ApplicationFeedbackHistory applicationId={data.applicationId} />
      <CandidateSkillHistory candidateId={data.candidateInfo.candidateId} applicationId={data.applicationId} />
                    
  </div>
  </>;
} 
export default InterviewerApplication;  