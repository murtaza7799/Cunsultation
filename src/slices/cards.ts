import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import checkEnvironment from '@/util/check-environment';
import { SingleUser } from '@/src/types/user';
import { CardSlice } from '@/src/types/cards';
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
import shortId from 'shortid';
import findIndex from 'lodash.findindex';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '@/util/firebase';

type CardPatch = {
  _id: string;
  title?: string;
  description?: string;
  columnId?: string;
  assignedTo?: string;
  sequence?: number;
};

const initialState = {
  cards: [],
  status: 'idle',
  isRequesting: false,
  isDeleting: false,
  doneFetching: true,
  error: {}
};

const host = checkEnvironment();

export const fetchCards = createAsyncThunk('cards/fetchCards', async (_obj, { getState }) => {
  const { board } = getState() as { board: BoardSlice };

  const q = query(collection(db, 'cards'), where('boardId', '==', board.board._id));
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
    console.log('fetch cards');
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
});

export const deleteCard = createAsyncThunk(
  'card/deleteCard',
  async (cardId: string, { getState }) => {
    const { board } = getState() as { board: BoardSlice };
    const getId = {
      id: null
    };

    try {
      const q = query(
        collection(db, 'cards'),
        where('boardId', '==', board.board._id),
        where('_id', '==', cardId)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // console.log(doc.id, ' => ', data);
        if (data._id === cardId) {
          getId.id = doc.id;
        }
      });

      if (getId.id !== null) {
        const docRef = await deleteDoc(doc(db, 'cards', getId.id));
        return docRef;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const addCard = createAsyncThunk('card/addCard', async (columnId: string, { getState }) => {
  const { board } = getState() as { board: BoardSlice };
  const { user } = getState() as { user: SingleUser };
  const { cards } = getState() as { cards: CardSlice };

  const ImageSkaches = async () => {
    const spaceRef = await ref(storage, '/images');
    const filesRef = await listAll(spaceRef);
    const files = await Promise.all(
      filesRef.items.map(async (file) => {
        const url = await getDownloadURL(file);
        return url;
      })
    );
    return files;
  };
  const images = await ImageSkaches();

  const filteredCards = cards.cards.filter((card) => card.columnId === columnId);

  let sequence = 1;

  if (filteredCards.length > 0) {
    sequence = filteredCards[filteredCards.length - 1].sequence + 1;
  }

  const cardId = shortId.generate();
  try {
    const docRef = await addDoc(collection(db, 'cards'), {
      _id: cardId,
      columnId: columnId,
      boardId: board.board._id,
      title: 'Add title',
      type: '',
      description: '',
      dateCreated: new Date().toLocaleString(),
      userId: user.id,
      assignedTo: '',
      sequence,
      images: images
    });
    // console.log('Document written with ID: ', docRef.id);
    return docRef;
  } catch (e) {
    return e;
  }
});

export const updateCard = createAsyncThunk(
  'card/updateCard',
  async (obj: CardPatch, { getState }) => {
    const { board } = getState() as { board: BoardSlice };
    const getId = {
      id: null
    };

    try {
      const q = query(
        collection(db, 'cards'),
        where('boardId', '==', board.board._id),
        where('_id', '==', obj._id)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // console.log(doc.id, ' => ', data);
        if (data._id === obj._id) {
          getId.id = doc.id;
        }
      });

      if (getId.id !== null) {
        const docRef = await updateDoc(doc(db, 'cards', getId.id), obj);

        return docRef;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateCardSequence = createAsyncThunk(
  'card/updateCardSequence',
  async (obj: CardPatch, { getState }) => {
    const { board } = getState() as { board: BoardSlice };
    // const { _id, title, description, columnId, sequence } = obj;

    // const data = {
    //   title,
    //   description,
    //   columnId,
    //   sequence
    // };
    console.log('update card sequence');
    const getId = {
      id: null
    };

    try {
      const q = query(
        collection(db, 'cards'),
        where('boardId', '==', board.board._id),
        where('_id', '==', obj._id)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // console.log(doc.id, ' => ', data);
        if (data._id === obj._id) {
          getId.id = doc.id;
        }
      });
      if (getId.id !== null) {
        const docRef = await updateDoc(doc(db, 'cards', getId.id), obj);
        return docRef;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const cardsSlice = createSlice({
  name: 'cards',
  initialState: initialState,
  reducers: {
    resetCards: () => initialState,
    updateCardSequenceToLocalState: (state, { payload }) => {
      const cardIndex = findIndex(state.cards, { _id: payload._id });

      state.cards[cardIndex].sequence = payload.sequence;
      state.cards[cardIndex].columnId = payload.columnId;
    }
  },
  extraReducers: {
    [addCard.pending.toString()]: (state) => {
      state.isRequesting = true;
      state.status = 'pending';
    },
    [addCard.fulfilled.toString()]: (state) => {
      state.status = 'success';
      state.isRequesting = false;
    },
    [addCard.rejected.toString()]: (state) => {
      state.status = 'failed';
      state.isRequesting = false;
    },
    [fetchCards.pending.toString()]: (state) => {
      state.status = 'pending';
      state.isRequesting = true;
    },
    [fetchCards.fulfilled.toString()]: (state, { payload }) => {
      state.cards = payload;
      state.status = 'success';
      state.isRequesting = false;
    },
    [fetchCards.rejected.toString()]: (state) => {
      state.status = 'failed';
      state.isRequesting = false;
    },
    [deleteCard.pending.toString()]: (state) => {
      state.status = 'pending';
      state.isDeleting = true;
    },
    [deleteCard.fulfilled.toString()]: (state) => {
      state.status = 'success';
      state.isDeleting = false;
    },
    [deleteCard.rejected.toString()]: (state) => {
      state.status = 'failed';
      state.isDeleting = false;
    },
    [updateCard.pending.toString()]: (state) => {
      state.status = 'pending';
      state.isRequesting = true;
    },
    [updateCard.fulfilled.toString()]: (state) => {
      state.status = 'success';
      state.isRequesting = false;
    },
    [updateCard.rejected.toString()]: (state) => {
      state.status = 'failed';
      state.isRequesting = false;
    },
    [updateCardSequence.pending.toString()]: (state) => {
      state.status = 'pending';
    },
    [updateCardSequence.fulfilled.toString()]: (state) => {
      state.status = 'success';
    },
    [updateCardSequence.rejected.toString()]: (state) => {
      state.status = 'failed';
    }
  }
});

export const { resetCards, updateCardSequenceToLocalState } = cardsSlice.actions;

export default cardsSlice.reducer;
