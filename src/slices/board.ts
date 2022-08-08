import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import checkEnvironment from '@/util/check-environment';
import { BoardSlice } from '@/src/types/boards';
import { collection, getDocs, doc, query, where, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/util/firebase';

const initialState = {
  board: {
    _id: '',
    name: '',
    columns: [],
    createdBy: '',
    dateCreated: '',
    backgroundImage: '',
    users: []
  },
  status: 'idle',
  isLoading: false,
  error: ''
};

export const saveBoard = createAsyncThunk('board/save', async (obj, { getState }) => {
  const { board } = getState() as { board: BoardSlice };

  const data = {
    _id: board.board._id,
    name: board.board.name,
    dateCreated: board.board.dateCreated,
    createdBy: board.board.createdBy,
    backgroundImage: board.board.backgroundImage
  };

  const getId = {
    id: null
  };

  try {
    const q = query(collection(db, 'boards'), where('_id', '==', board.board._id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // console.log(doc.id, ' => ', data);
      if (data._id === board.board._id) {
        getId.id = doc.id;
      }
    });
    if (getId.id !== null) {
      const docRef = await updateDoc(doc(db, 'boards', getId.id), data);
      return docRef;
    }
  } catch (error) {
    console.log(error);
  }
});

export const fetchBoard = createAsyncThunk('board/get', async (slug: string) => {
  const q = query(collection(db, 'boards'), where('_id', '==', slug));
  const querySnapshot = await getDocs(q);
  const data = {
    _id: '',
    name: '',
    dateCreated: '',
    createdBy: '',
    backgroundImage: ''
  };
  try {
    querySnapshot.forEach((doc) => {
      const docs = doc.data();
      const check = { ...docs };
      data._id = check._id;
      data.name = check.name;
      data.dateCreated = check.dateCreated;
      data.createdBy = check.createdBy;
      data.backgroundImage = check.backgroundImage;
    });
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
});

export const deleteBoard = createAsyncThunk('board/delete', async (obj, { getState }) => {
  const { board } = getState() as { board: BoardSlice };

  const _id = board.board._id;

  const getId = {
    id: null
  };

  try {
    const q = query(collection(db, 'boards'), where('_id', '==', board.board._id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // console.log(doc.id, ' => ', data);
      if (data._id === _id) {
        getId.id = doc.id;
      }
    });

    if (getId.id !== null) {
      const docRef = await deleteDoc(doc(db, 'boards', getId.id));
      return docRef;
    }
  } catch (error) {
    console.log(error);
  }
});

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    updateBoardDetail: (state, { payload }) => {
      state.board[payload.type] = payload.value;
    },
    resetBoard: () => initialState
  },
  extraReducers: {
    [fetchBoard.pending.toString()]: (state) => {
      state.status = 'pending';
    },
    [fetchBoard.fulfilled.toString()]: (state, { payload }) => {
      state.board = payload;
      state.status = 'success';
    },
    [fetchBoard.rejected.toString()]: (state) => {
      state.status = 'failed';
    },
    [saveBoard.pending.toString()]: (state) => {
      state.status = 'pending';
      state.isLoading = true;
    },
    [saveBoard.fulfilled.toString()]: (state, { payload }) => {
      state.isLoading = false;
      state.status = 'success';
    },
    [saveBoard.rejected.toString()]: (state) => {
      state.status = 'failed';
      state.isLoading = false;
    },
    [deleteBoard.pending.toString()]: (state) => {
      state.status = 'pending';
      state.isLoading = true;
    },
    [deleteBoard.fulfilled.toString()]: (state) => {
      state.isLoading = false;
      state.status = 'success';
    },
    [deleteBoard.rejected.toString()]: (state) => {
      state.status = 'failed';
      state.isLoading = false;
    }
  }
});

export const { updateBoardDetail, resetBoard } = boardSlice.actions;

export default boardSlice.reducer;
