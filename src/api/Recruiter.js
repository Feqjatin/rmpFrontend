import Cookies from "js-cookie";

 

export async function getAllJobs() {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/first/job-all`, {
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
    console.error("get all jobs error:", error);
    throw error;
  }
}

export async function getAllJobsbyUser(userName) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Recruiter/job-all/`+userName, {
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
    console.error("get all jobs error:", error);
    throw error;
  }
}

export async function createJob(formData) {
  try {
    console.log("form data in api:", formData);
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Recruiter/job-create`, {
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
    console.error("create job error:", error);
    throw error;
  }
}

export async function updateJob(formData) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Recruiter/job-update`, {
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
    console.error("update job error:", error);
    throw error;
  }
}

export async function deleteJob(formData) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Recruiter/job-delete`, {
      method: "DELETE",
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

    return { data: response, msg: null };
  } catch (error) {
    console.error("delete job error:", error);
    throw error;
  }
}

 

export async function getAllSkills() {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Recruiter/skill-all`, {
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

export async function createSkill(formData) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Recruiter/skill-create`, {
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

    const data = await response.json();
    return { data, msg: null };
  } catch (error) {
    console.error("create skill error:", error);
    throw error;
  }
}

export async function updateSkill(formData) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Recruiter/skill-update`, {
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

    const data = await response.json();
    return { data, msg: null };
  } catch (error) {
    console.error("update skill error:", error);
    throw error;
  }
}

export async function deleteSkill(formData) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Recruiter/skill-delete`, {
      method: "DELETE",
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

    return { data: response, msg: null };
  } catch (error) {
    console.error("delete skill error:", error);
    throw error;
  }
}

export async function deleteCandidate(id) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Recruiter/candidate-delete/`+id, {
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

    return { data: response, msg: null };
  } catch (error) {
    console.error("delete skill error:", error);
    throw error;
  }
}

export async function getAllCandidate() {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Recruiter/candidate-all`, {
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
    return { data , msg: null };
  } catch (error) {
    console.error("delete skill error:", error);
    throw error;
  }
}
export async function getCandidateById(id) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Recruiter/candidate/`+id, {
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
    console.error("delete skill error:", error);
    throw error;
  }
}
export async function updateCandidate(formData) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Recruiter/candidate-update`, {
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

    return { data: response, msg: null };
  } catch (error) {
    console.error("delete skill error:", error);
    throw error;
  }
}

export async function createCandidate(formData) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Recruiter/candidate-create`, {
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

    return { data: response, msg: null };
  } catch (error) {
    console.error("delete skill error:", error);
    throw error;
  }
} 