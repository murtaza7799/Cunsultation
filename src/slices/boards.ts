import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import checkEnvironment from '@/util/check-environment';
import { SingleUser } from '@/src/types/user';
import { BoardSlice } from '@/src/types/boards';
import { collection, addDoc, getDocs, doc, query, where } from 'firebase/firestore';
import { db } from '@/util/firebase';
import { useState } from 'react';

const initialState = {
  boards: [],
  status: 'idle',
  doneFetching: true,
  isRequesting: false,
  error: {}
};

export const fetchBoards = createAsyncThunk('boards/fetchBoards', async (_obj, { getState }) => {
  const { user } = getState() as { user: SingleUser };
  const arr = [];
  const id = user.id;
  const q = query(collection(db, 'boards'), where('createdBy', '==', id));

  const querySnapshot = await getDocs(q);
  try {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      arr.push(data);
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, ' => ', doc.data());
    });
    const data = [...arr.map((item) => item)];
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
});

export const createBoard = createAsyncThunk('board/create', async (_obj, { getState }) => {
  const { board } = getState() as { board: BoardSlice };
  const { user } = getState() as { user: SingleUser };
  try {
    const docRef = await addDoc(collection(db, 'boards'), {
      _id: board.board._id,
      name: board.board.name,
      dateCreated: board.board.dateCreated,
      createdBy: user.id,
      backgroundImage: '/boards/board-background.jpg'
    });
    return docRef;
  } catch (e) {
    return e;
  }
});

export const boardSlice = createSlice({
  name: 'boards',
  initialState: initialState,
  reducers: {
    resetBoards: () => initialState
  },
  extraReducers: {
    [fetchBoards.pending.toString()]: (state) => {
      state.status = 'pending';
    },
    [fetchBoards.fulfilled.toString()]: (state, { payload }) => {
      state.boards = payload;
      state.status = 'success';
    },
    [fetchBoards.rejected.toString()]: (state) => {
      state.status = 'failed';
    },
    [createBoard.pending.toString()]: (state) => {
      state.isRequesting = true;
      state.status = 'pending';
    },
    [createBoard.fulfilled.toString()]: (state) => {
      state.isRequesting = false;
      state.status = 'success';
    },
    [createBoard.rejected.toString()]: (state) => {
      state.isRequesting = false;
      state.status = 'failed';
    }
  }
});

export const { resetBoards } = boardSlice.actions;

export default boardSlice.reducer;
