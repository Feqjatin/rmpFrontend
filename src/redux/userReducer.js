import { createSlice  } from '@reduxjs/toolkit'

const initialState = {
  userName: "Unknown",
  roles:{},
  Id:-1
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login : (state,action)=>{
        console.log(action.payload.data.userRoles.map(r => r.roleName));
        state.userName=action.payload.data.username;
        if(action.payload.data.candidateId!=null){
          state.Id=action.payload.data.candidateId;
        }
        console.log(action.payload.data.candidateId);
        state.roles=action.payload.data.userRoles.map(r => r.roleName);
        console.log(state.roles);
    },
    logout : (state)=>{
        state.userName="Unknown";
        state.roles={};
    },
    print : (state)=>{
        console.log(state.userName);
        console.log(state.roles);
    }

  },
})

 
export const { login,print,logout } = userSlice.actions

export default userSlice.reducer 