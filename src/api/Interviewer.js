import Cookies from "js-cookie";

 
export async function getAllInterview(username) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Interviewer/schedule/by-user/${username}`, {
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
    console.log(data);
    return { data, msg: null };
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
}

 
export async function getRescheduleRequests(username) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Interviewer/reschedule-request/${username}`, {
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

 
export async function updateRescheduleRequest(requestData) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Interviewer/reschedule-request`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
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

 
export async function updateInterviewSchedule(interviewId, scheduleData) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Interviewer/schedule/`+interviewId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(scheduleData),
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

 
export async function addInterviewerToInterview(interviewId, userId) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Interviewer/add-interviewer?interviewId=${interviewId}&userId=${userId}`, {
      method: "POST",
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

 
export async function removeInterviewerFromInterview(interviewId, userId) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Interviewer/remove-interviewer?interviewId=${interviewId}&userId=${userId}`, {
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


export async function updateRoundScore(interviewId, scoreData) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Interviewer/schedule/`+interviewId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(scoreData),
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      return { data: null, msg: errorMsg };
    }
     var v=await response.json();
     console.log("response:", v);
    return { data:response, msg: null };
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
}

export async function getApplicationRounds(applicationId) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Interviewer/getRounds/`+applicationId, {
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


export async function deleteInterview(interviewId) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Interviewer/schedule/${interviewId}`, {
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


export async function createInterview(interviewData) {
  try {
    const token = Cookies.get("token");
    console.log("interviewData:", interviewData);
    const response = await fetch(`https://localhost:7084/api/Interviewer/schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(interviewData),
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