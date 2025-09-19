import Cookies from "js-cookie";


export async function getAllUsers() {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Admin/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },  
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
       return {data:null,msg:errorMsg}
      }
  
      const data = await response.json(); 
      console.log(data);
      return data;
  
    } catch (error) {
      console.error("getAllUsers error:", error);
      throw error;
    }
    
  }
  export async function getAllRoles() {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Admin/role`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },  
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
       return {data:null,msg:errorMsg}
      }
  
      const data = await response.json(); 
      console.log(data);
      return data;
  
    } catch (error) {
      console.error("getAllRoles error:", error);
      throw error;
    }
    
  }

  export async function deleteUser(userId) {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Admin/removeUser`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }, 
        body: JSON.stringify({ userId: userId }),
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
       return {data:null,msg:errorMsg}
      }
  
      
      return response;
  
    } catch (error) {
      console.error("deleteUser error:", error);
      throw error;
    }
    
  }
  export async function deleteRole(roleId) {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Admin/removeRole`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }, 
        body: JSON.stringify({ roleId: roleId }),
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
       return {data:null,msg:errorMsg}
      }
  
      
      return response;
  
    } catch (error) {
      console.error("deleteRole error:", error);
      throw error;
    }
    
  }


  export  async function addRoleFun(formData) {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Admin/addNewRole`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      console.error("add role error:", error);
      throw error;
    }
    
  }


  export  async function assignRole(formData) {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Admin/assign-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData), 
         
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
       return {data:null,msg:errorMsg}
      }
  
       
      return {data:response,msg:null};
  
    } catch (error) {
      console.error("add role error:", error);
      throw error;
    }
    
  }

  export  async function getAllUserBYRole(formData) {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Admin/getUserByRole`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      console.error("get user by role error:", error);
      throw error;
    }
    
  }

  export  async function deleteUserToRole(formData) {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`https://localhost:7084/api/Admin/dischargeUserToRole`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData), 
         
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
       return {data:null,msg:errorMsg}
      }
  
        
      return {data:response,msg:null};
  
    } catch (error) {
      console.error("delete user by role error:", error);
      throw error;
    }
    
  }