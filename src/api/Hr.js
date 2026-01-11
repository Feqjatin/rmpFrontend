import Cookies from "js-cookie";

 
export async function getSelectedCandidates(username) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Hr/job-candidate-selected`, {
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
 
export async function updateSelectedCandidate(username, jobCandidateSelectedId, updateData) {
  try {
    const token = Cookies.get("token");
   
    const response = await fetch(`https://localhost:7084/api/Hr/job-candidate-selected?id=${jobCandidateSelectedId}&username=${username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
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

 
export async function getCandidateDocuments(applicationId, candidateId) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Hr/candidate-documents?candidateId=${candidateId}&applicationId=${applicationId}`, {
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


export async function updateDocument(username, documentId, updateData) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/Hr/candidate-document?id=${documentId}&username=${username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
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

 
export async function generateOfferLetter(jobCandidateSelectedId) {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`https://localhost:7084/api/HR/{jobCandidateSelectedId}`, {
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
    const data = await response.json();
    return { data, msg: null };
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
}