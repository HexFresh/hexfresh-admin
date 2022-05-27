import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {signInService, signOutService} from "./auth-services";

const initialState = {
  user: {}, status: null,
};

export const signIn = createAsyncThunk('auth/signIn', async (payload) => {
  const {credentials, navigate} = payload;
  const user = await signInService(credentials);
  navigate('/');
  return user;
});

export const signOut = createAsyncThunk('auth/signOut', async (payload) => {
  const {navigate} = payload;
  await signOutService(navigate);
});

export const authSlice = createSlice({
  name: 'auth', initialState, reducers: {}, extraReducers: {
    [signIn.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.status = 'success';
    }, [signOut.fulfilled]: (state) => {
      state.status = 'success';
    }
  }
});

export default authSlice.reducer;