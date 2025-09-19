import { createSlice  } from '@reduxjs/toolkit'

const initialState = {
  userName: "Unknown",
  roles:{}
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login : (state,action)=>{
        console.log(action.payload.data.userRoles.map(r => r.roleName));
        state.userName=action.payload.data.username;
        state.roles=action.payload.data.userRoles.map(r => r.roleName);
        console.log(state.roles);
    },
    print : (state)=>{
        console.log(state.userName);
        console.log(state.roles);
    }

  },
})

 
export const { login,print } = userSlice.actions

export default userSlice.reducer 