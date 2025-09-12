export default async function loginUser(formData) {
    try {
      const response = await fetch(`https://localhost:7084/api/first/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),  
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
       return {data:null,msg:errorMsg}
      }
  
      const data = await response.json(); 
      console.log(data);
      return {data:document,msg:null};
  
    } catch (error) {
      console.error("login error:", error);
      throw error;
    }
    
  }
  