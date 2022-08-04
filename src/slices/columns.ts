import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import checkEnvironment from '@/util/check-environment';
import { SingleUser } from '@/src/types/user';
import { ColumnsSlice } from '@/src/types/columns';
import findIndex from 'lodash.findindex';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  query,
  where,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/util/firebase';

import { BoardSlice } from '@/src/types/boards';

const initialState = {
  columns: [],
  status: 'idle',
  isRequesting: false,
  doneFetching: true,
  error: {}
};

const host = checkEnvironment();

export const fetchColumns = createAsyncThunk('columns/fetchColumns', async (_obj, { getState }) => {
  const { board } = getState() as { board: BoardSlice };
  console.log('fech columns');
  const q = query(collection(db, 'columns'), where('boardId', '==', board.board._id));
  const arr = [];
  const querySnapshot = await getDocs(q);
  try {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      arr.push(data);
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, ' => ', doc.data());
    });
    const data = [...arr.map((item) => item)];
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
});

export const deleteColumn = createAsyncThunk(
  'column/deleteColumn',
  async (columnId: string, { getState }) => {
    const { board } = getState() as { board: BoardSlice };
    const getId = {
      id: null
    };

    try {
      const q = query(
        collection(db, 'columns'),
        where('boardId', '==', board.board._id),
        where('_id', '==', columnId)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(doc.id, ' => ', data);
        if (data._id === columnId) {
          console.log('found COLUMN');
          console.log(doc.id);
          getId.id = doc.id;
          console.log(data);
        }
      });
      console.log('data');
      console.log(getId.id);
      if (getId.id !== null) {
        console.log('deleting card');
        const docRef = await deleteDoc(doc(db, 'columns', getId.id));
        return docRef;
      }
    } catch (error) {
      console.log(error);
    }

    // const url = `/api/boards/${board.board._id}/columns/${columnId}`;

    // const response = await fetch(url, {
    //   method: 'DELETE',
    //   mode: 'cors',
    //   cache: 'no-cache',
    //   credentials: 'same-origin',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   redirect: 'follow',
    //   referrerPolicy: 'no-referrer'
    // });

    // const inJSON = await response.json();

    // return inJSON;
  }
);

export const addColumnToBoard = createAsyncThunk(
  'column/add',
  async (columnId: string, { getState }) => {
    console.log('add column to board');
    const { board } = getState() as { board: BoardSlice };
    const { user } = getState() as { user: SingleUser };
    const { columns } = getState() as { columns: ColumnsSlice };

    const columsArray = columns.columns;
    let sequence = 1;

    if (columns.columns.length > 0) {
      sequence = columsArray[columsArray.length - 1].sequence + 1;
    }

    const data = {
      id: columnId,
      boardId: board.board._id,
      columnName: 'Add title',
      dateCreated: new Date().toLocaleString(),
      userId: user.id,
      sequence
    };
    try {
      const docRef = await addDoc(collection(db, 'columns'), {
        _id: columnId,
        boardId: board.board._id,
        columnName: 'Add title',
        dateCreated: new Date().toLocaleString(),
        userId: user.id,
        sequence
      });
      console.log('Document written with ID: ', docRef.id);
      return docRef;
    } catch (e) {
      return e;
    }
  }
);

export const updateColumn = createAsyncThunk(
  'column/updateColumn',
  async (obj: { columnName: string; columnId: string }, { getState }) => {
    const { board } = getState() as { board: BoardSlice };
    const getId = {
      id: null
    };
    const data = {
      _id: obj.columnId,
      boardName: board.board.name,
      columnName: obj.columnName
    };
    try {
      const q = query(
        collection(db, 'columns'),
        where('boardId', '==', board.board._id),
        where('_id', '==', obj.columnId)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(doc.id, ' => ', data);
        if (data._id === obj.columnId) {
          console.log('found column');
          console.log(doc.id);
          getId.id = doc.id;
          console.log(data);
        }
      });
      console.log('data');
      console.log(getId.id);
      if (getId.id !== null) {
        console.log('updating column');
        const docRef = await updateDoc(doc(db, 'columns', getId.id), data);
        console.log('Document written with ID: ');
        return docRef;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateColumnSequence = createAsyncThunk(
  'card/updateCardSequence',
  async (obj: { _id: string; sequence: number }, { getState }) => {
    const { board } = getState() as { board: BoardSlice };
    const { _id, sequence } = obj;

    const data = {
      _id,
      sequence
    };

    const getId = {
      id: null
    };
    try {
      const q = query(
        collection(db, 'columns'),
        where('boardId', '==', board.board._id),
        where('_id', '==', _id)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(doc.id, ' => ', data);
        if (data._id === _id) {
          getId.id = doc.id;
        }
      });

      if (getId.id !== null) {
        const docRef = await updateDoc(doc(db, 'columns', getId.id), data);
        return docRef;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const columnsSlice = createSlice({
  name: 'columns',
  initialState: initialState,
  reducers: {
    resetColumns: () => initialState,
    updateColumnSequenceToLocalState: (state, { payload }) => {
      const columnIndex = findIndex(state.columns, { _id: payload._id });
      state.columns[columnIndex].sequence = payload.sequence;
    }
  },
  extraReducers: {
    [addColumnToBoard.pending.toString()]: (state) => {
      state.status = 'pending';
      state.isRequesting = true;
    },
    [addColumnToBoard.fulfilled.toString()]: (state) => {
      state.status = 'success';
      state.isRequesting = false;
    },
    [addColumnToBoard.rejected.toString()]: (state) => {
      state.status = 'failed';
      state.isRequesting = false;
    },
    [fetchColumns.pending.toString()]: (state) => {
      state.status = 'pending';
      state.isRequesting = true;
    },
    [fetchColumns.fulfilled.toString()]: (state, { payload }) => {
      const sortedColumns = payload.sort((a, b) => a.sequence - b.sequence);

      state.columns = sortedColumns;
      state.status = 'success';
      state.isRequesting = false;
    },
    [fetchColumns.rejected.toString()]: (state) => {
      state.status = 'failed';
      state.isRequesting = false;
    },
    [deleteColumn.pending.toString()]: (state) => {
      state.status = 'pending';
      state.isRequesting = true;
    },
    [deleteColumn.fulfilled.toString()]: (state) => {
      state.status = 'success';
      state.isRequesting = false;
    },
    [deleteColumn.rejected.toString()]: (state) => {
      state.status = 'failed';
      state.isRequesting = false;
    },
    [updateColumn.pending.toString()]: (state) => {
      state.status = 'pending';
      state.isRequesting = true;
    },
    [updateColumn.fulfilled.toString()]: (state) => {
      state.status = 'success';
      state.isRequesting = false;
    },
    [updateColumn.rejected.toString()]: (state) => {
      state.status = 'failed';
      state.isRequesting = false;
    }
  }
});

export const { resetColumns, updateColumnSequenceToLocalState } = columnsSlice.actions;

export default columnsSlice.reducer;
