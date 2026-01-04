import Cookies from "js-cookie";

 

export async function getCandidateData(id) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Candidate/profile/`+id, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      return { data: null, msg: errorMsg };
    }

    const data = await response.json();
    console.log("candidate data:", data);
    return { data, msg: null };
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
}

export async function updateCandidateData(formData,id) {
    try {
      console.log("form data in api:", formData);
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Candidate/profile/`+id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
        return { data: null, msg: errorMsg };
      }
  
   
      return { data:response, msg: null };
    } catch (error) {
      console.error(" error:", error);
      throw error;
    }
  }


  export async function updateCandidateEducationData(formData,id) {
    try {
      console.log("form data in api:", formData);
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Candidate/education/`+id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
        return { data: null, msg: errorMsg };
      }
  
   
      return { data:response, msg: null };
    } catch (error) {
      console.error("error:", error);
      throw error;
    }
  }

  export async function deleteCandidateEducationData(id) {
    try {
       
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Candidate/education/`+id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
        return { data: null, msg: errorMsg };
      }
  
   
      return { data:response, msg: null };
    } catch (error) {
      console.error("error:", error);
      throw error;
    }
  }

  export async function addCandidateEducationData(formData,id) {
    try {
      console.log("form data in api:", formData);
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Candidate/education/`+id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
        return { data: null, msg: errorMsg };
      }
  
   
      return { data:response, msg: null };
    } catch (error) {
      console.error("error:", error);
      throw error;
    }
  }

  export async function updateCandidateExperienceData(formData,id) {
    try {
      console.log("form data in api:", formData);
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Candidate/experience/`+id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
        return { data: null, msg: errorMsg };
      }
  
   
      return { data:response, msg: null };
    } catch (error) {
      console.error("error:", error);
      throw error;
    }
  }

  export async function deleteCandidateExperienceData(id) {
    try {
       
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Candidate/experience/`+id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
        return { data: null, msg: errorMsg };
      }
  
   
      return { data:response, msg: null };
    } catch (error) {
      console.error("error:", error);
      throw error;
    }
  }

  export async function addCandidateExperienceData(formData,id) {
    try {
      console.log("form data in api:", formData);
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Candidate/experience/`+id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
        return { data: null, msg: errorMsg };
      }
  
   
      return { data:response, msg: null };
    } catch (error) {
      console.error("error:", error);
      throw error;
    }
  }


  export async function deleteCandidateDocument(id) {
    try {
       
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Candidate/document/`+id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
        return { data: null, msg: errorMsg };
      }
  
   
      return { data:response, msg: null };
    } catch (error) {
      console.error("error:", error);
      throw error;
    }
  }

  export async function createCandidateDocument(formData,id) {
    try {
      console.log("form data in api:", formData);
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Candidate/document/`+id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
        return { data: null, msg: errorMsg };
      }
  
   
      return { data:response, msg: null };
    } catch (error) {
      console.error("error:", error);
      throw error;
    }
  }


  export async function getAllSkills() {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Candidate/skill-all`, {
        method: "GET",
        headers: {
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
      console.error("get all skills error:", error);
      throw error;
    }
  }

  export async function updateCandidateSkill(formData,id) {
    try {
      console.log("form data in api:", formData);
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Candidate/skill/`+id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
        return { data: null, msg: errorMsg };
      }
  
   
      return { data:response, msg: null };
    } catch (error) {
      console.error(" error:", error);
      throw error;
    }
  }


 

  export async function deleteCandidateSkill(id,id2) {
    try {
       
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Candidate/skill?candidateId=`+id+"&skillId="+id2, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
        return { data: null, msg: errorMsg };
      }
  
   
      return { data:response, msg: null };
    } catch (error) {
      console.error("error:", error);
      throw error;
    }
  }

  export async function createRescheduleRequest(formData,id) {
    try {
      console.log("form data in api:", formData);
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Candidate/reschedule-request?candidateId=`+id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
        return { data: null, msg: errorMsg };
      }
  
   
      return { data:response, msg: null };
    } catch (error) {
      console.error(" error:", error);
      throw error;
    }
  }


 

  export async function deleteRescheduleRequest(id) {
    try {
       
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Candidate/reschedule-request/`+id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
        return { data: null, msg: errorMsg };
      }
  
   
      return { data:response, msg: null };
    } catch (error) {
      console.error("error:", error);
      throw error;
    }
  }


  
export async function getCandidateRescheduleRequests(id) {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Candidate/reschedule-request/`+id, {
        method: "GET",
        headers: {
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
      console.error("error:", error);
      throw error;
    }
  }


  export async function getAllCandidates() {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Recruiter/getAllCandidate`, {
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
      console.error("error:", error);
      throw error;
    }
  }

  export async function processInvitationResponse(formData) {
    try {
  
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Candidate/invitationResponse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        } ,
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
        return { data: null, msg: errorMsg ||'failed to process invitation response' };
      }
  
     
      return { data:response, msg: null };
    } catch (error) {
      console.error("error:", error);
      throw error;
    }
  }

  

