import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getCurrentUserProfile} from "../../api/userProfile";

const initialState = {
  profile: {}, status: null,
}

export const getUserProfileAction = createAsyncThunk('profile/getUserProfile', async () => {
  return await getCurrentUserProfile();
})


export const profileSlice = createSlice({
  name: 'profile', initialState, reducers: {}, extraReducers: {
    [getUserProfileAction.fulfilled]: (state, action) => {
      state.profile = action.payload;
      state.status = 'success';
    }
  }
})

export default profileSlice.reducer;