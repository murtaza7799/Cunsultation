import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import checkEnvironment from '@/util/check-environment';
import { UserDetail } from '@/src/types/user';
import { collection, addDoc, getDocs, doc, query, where } from 'firebase/firestore';
import { db } from '@/util/firebase';

const initialState: UserDetail = {
  id: '',
  status: 'idle',
  email: '',
  password: '',
  fullName: '',
  confirmPassword: '',
  isValid: false,
  isCreating: false,
  isFetching: false,
  message: '',
  error: ''
};

const host = checkEnvironment();

export const fetchUser = createAsyncThunk('users/fetchUser', async (_obj, { getState }) => {
  const { user } = getState() as { user: UserDetail };
  // console.log('fetchUser id : ' + user.id);
  // const response = await fetch(`/api/users/${user.id}`);
  // const responseInjson = await response.json();
  // // console.log(responseInjson);

  // return responseInjson;
  const q = query(collection(db, 'Users'), where('_id', '==', user.id));
  const data = {
    _id: '',
    email: '',
    fullName: ''
  };
  const querySnapshot = await getDocs(q);
  try {
    querySnapshot.forEach((doc) => {
      const docs = doc.data();
      const check = { ...docs };
      data._id = check._id;
      data.email = check.email;
      data.fullName = check.fullName;
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, ' => ', doc.data());
    });
    console.log('fech user Test data new ');
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
});

export const verifyEmail = createAsyncThunk('verify-email', async (email) => {
  const response = await fetch(`/api/verify-email/?email=${email}`);
  const responseInjson = await response.json();

  return responseInjson;
});

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    updateUserData: (state, { payload }) => {
      console.log('updateUserData');
      console.log(payload);
      console.log(state.id);
      state[payload.type] = payload.value;
    },
    resetUserData: () => initialState
  },
  extraReducers: {
    [fetchUser.pending.toString()]: (state) => {
      console.log('fecshuser pending');
      state.status = 'pending';
    },
    [fetchUser.fulfilled.toString()]: (state, { payload }) => {
      state.status = 'success';
      state.id = payload && payload._id;
      state.email = 'murtaza';
      state.fullName = payload && payload.fullName;
      console.log('state.fullName ' + state.fullName);
    },
    [fetchUser.rejected.toString()]: (state, { payload }) => {
      console.log('fecshuser rejected');
      state.status = 'failed';
      state.error = payload && payload.error;
      state.message = payload && payload.message;
    },
    [verifyEmail.pending.toString()]: (state) => {
      state.status = 'pending';
    },
    [verifyEmail.fulfilled.toString()]: (state, { payload }) => {
      state.status = 'success';
      state.status = payload && payload.status;
      state.message = payload && payload.message;
    },
    [verifyEmail.rejected.toString()]: (state, { payload }) => {
      state.status = 'failed';
      state.message = payload && payload.message;
    }
  }
});

export const { updateUserData, resetUserData } = userSlice.actions;

export default userSlice.reducer;
