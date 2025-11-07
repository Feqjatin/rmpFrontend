import Cookies from "js-cookie";
export async function getAllInterview(username) {
    try {

      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Interviewer/schedule/by-user/`+username, {
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
      console.error(" error:", error);
      throw error;
    }
  }