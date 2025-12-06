import Cookies from "js-cookie";
import { data } from "react-router-dom";
export async function getJobDetails(jobid) {
    try {

      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Util/jobViaId/`+jobid, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
        return { data: null, msg: errorMsg };
      }
      const data = await response.json();
      return { data, msg: null };
    } catch (error) {
      console.error("  error:", error);
      throw error;
    }
  }

  
export async function crateApplicationComment(val) {
    try {
      
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Util/save-comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify(val),
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
        return { data: null, msg: errorMsg };
      }
      
      return { data:response, msg: null };
    } catch (error) {
      console.error("  error:", error);
      throw error;
    }
  }

    
export async function saveSkillAssessments(val) {
  try {
    console.log("val in api",val);
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Util/save-skill-assessments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body:JSON.stringify(val),
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      return { data: null, msg: errorMsg };
    }
    
    return { data:response, msg: null };
  } catch (error) {
    console.error("  error:", error);
    throw error;
  }
}
  

    
export async function getSkillAssessmentsForCandidate(val) {
  try {
     
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Util/getSkillAssessments/`+val, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      
    });
   console.log("response",response);
    if (!response.ok) {
      const errorMsg = await response.text();
      return { data: null, msg: errorMsg };
    }
    const data = await response.json();
    return { data:data, msg: null };
  } catch (error) {
    console.error("  error:", error);
    throw error;
  }
}


    
export async function getFeedbackForApplication(val) {
  try {
     
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Util/feedback/`+val, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      return { data: null, msg: errorMsg };
    }
    const data = await response.json();
    return { data:data, msg: null };
  } catch (error) {
    console.error("  error:", error);
    throw error;
  }
}

   
export async function uploadFileToThirdParty(val) {
  return {data:"https:123.com"};
}
