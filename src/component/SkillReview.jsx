import React, { useState, useEffect } from 'react';
import {saveSkillAssessments} from '../api/forAll'; 


const SkillAssessmentRow = ({ skill, assessment, onChange, isPublished }) => {
    
     
    const handleYearsChange = (e) => {
        onChange(skill.skillId, 'years', e.target.value);
    };

     
    const handleCommentChange = (e) => {
        onChange(skill.skillId, 'comment', e.target.value);
    };

    return (
        <div className="py-4 border-t border-gray-200">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
                {skill.skillName}
                
                {skill.skillType && (
                    <span className="ml-2 text-xs font-normal text-gray-500">({skill.skillType})</span>
                )}
            </label>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                    <label htmlFor={`years-${skill.skillId}`} className="block text-xs font-medium text-gray-500 mb-1">Years</label>
                    <input
                        type="number"
                        id={`years-${skill.skillId}`}
                        value={assessment.years}  
                        onChange={handleYearsChange}  
                        readOnly={isPublished}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm text-sm focus:outline-none ${
                            !isPublished
                                ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                : 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                        placeholder="e.g., 5"
                    />
                </div>
                <div className="col-span-2">
                    <label htmlFor={`comment-${skill.skillId}`} className="block text-xs font-medium text-gray-500 mb-1">Comment</label>
                    <input
                        type="text"
                        id={`comment-${skill.skillId}`}
                        value={assessment.comment}  
                        onChange={handleCommentChange}  
                        readOnly={isPublished}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm text-sm focus:outline-none ${
                            !isPublished
                                ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                : 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                        placeholder="e.g., 'Strong' or 'Lacking'"
                    />
                </div>
            </div>
        </div>
    );
};

 
const SkillReview = ({
    jobSkills,            
    applicationId,       
    username,             
    isPublished,    
    role,stage      
}) => {

   
    const [skillAssessments, setSkillAssessments] = useState(() => 
    jobSkills.map(skill => ({
        skillId: skill.skillId,
        years: 0,
        comment: 'null'
    }))
); 
    const[update,setUpdate]=useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
     


     
    const handleSkillChange = (skillId, field, value) => {
        setUpdate(true);
        setSkillAssessments(prevAssessments => 
            prevAssessments.map(assessment => 
                assessment.skillId === skillId 
                    ? { ...assessment, [field]: value }
                    : assessment
            )
        );
    };

     
    const handleSaveSkills = async () => {
         setLoading(true);
        setError(null);
        const newOne=skillAssessments.map(sa =>{ if(sa.years==='' ||sa.years==null ) {return {...sa,years:0};} else {return sa;}});
         
        console.log("skillAssessments",newOne);
        const response= await saveSkillAssessments({
            applicationId,
            username,
            assessments: newOne,
            stage:stage,
            role:role
        });
        if(response.msg !== null)
        {
            setError(response.msg);
        }
        setUpdate(false); 
        setLoading(false);
      };

    if (loading) {
        return <p className="text-gray-500">Loading skills...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>
    }

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Review Candidate Skills</h3>
            <div className="space-y-2">
                {jobSkills.map((skill) => {
                     
                    const assessment = skillAssessments.find(a => a.skillId === skill.skillId) || 
                                       { skillId: skill.skillId, years: '', comment: '' };
                    
                    return (
                        <SkillAssessmentRow
                            key={skill.skillId}
                            skill={skill}
                            assessment={assessment}
                            onChange={handleSkillChange}  
                            isPublished={isPublished}
                        />
                    );
                })}
                
                 
                {!isPublished && (
                    <button
                        onClick={handleSaveSkills}  
                        className={`mt-4 w-full px-4 py-2  text-white text-sm font-semibold rounded-lg shadow hover:bg-green-700  
                           ${update ? 'bg-green-600' : 'bg-gray-400 '}`}
                    >
                        Save Skill Review
                    </button>  
                )}
            </div>
        </div>
    );
};

export default SkillReview;

