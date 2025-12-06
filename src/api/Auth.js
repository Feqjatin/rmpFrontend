import Cookies from "js-cookie";
import { useSelector, useDispatch } from 'react-redux'
export  async function loginUser(formData) {
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
      console.log(data.userRoles);
      Cookies.set("token", data.token, { expires: 7 }); 
      return {data:data,msg:null};
  
    } catch (error) {
      console.error("login error:", error);
      throw error;
    }
    
  }
  export  async function loginCandidate(formData) {
    try {
      const response = await fetch(`https://localhost:7084/api/first/loginCandidate`, {
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
      
      Cookies.set("token", data.token, { expires: 7 }); 
      return {data:data,msg:null};
  
    } catch (error) {
      console.error("login error:", error);
      throw error;
    }
    
  }
  
  export  async function makeNewUser(formData) {
    try {
      const response = await fetch(`https://localhost:7084/api/first/signUp`, {
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
      console.log(data) 
      return {data:data,msg:null};
  
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
    
  }
  

  export  async function makeNewCandidate(formData) {
    try {
      const response = await fetch(`https://localhost:7084/api/first/signUpCandidate`, {
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
      console.log(data) 
      return {data:data,msg:null};
  
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
    
  }