import Cookies from "js-cookie";
export async function getJobsToReview(username) {
    try {

      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Reviewer/dashboard/`+username, {
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


  export async function getApplicationsToReview(jobid) {
    try {

      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Reviewer/getApplicationsForReviewer/`+jobid, {
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