import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  addDoc,
  DocumentReference
} from "firebase/firestore";
import {db} from "../plugins/firebase.ts";
import {Companion, Guest, Event, GuestCreationMaterial} from "../interfaces";
import {RootState} from "./index.ts";

export interface EventState {
  currentEvent: Event | null;
  currentCompanion: Companion | null;
  currentGuests: Guest[] | [];
}

const initialState: EventState = {
  currentCompanion: null,
  currentEvent: null,
  currentGuests: [],
}

export interface EventCompanionIdPayload {
  eventId: string,
  companionId: string
}

export interface StatusPayload {
  status: string
}

export const declineCurrentGuests = createAsyncThunk("event/declineCurrentGuests", async (_, {getState}) => {
  // This one is called when user declines entire invitation from LANDING PAGE for all companion guests.
  const rootState: RootState = getState() as RootState;
  if (rootState.event.currentEvent && rootState.event.currentCompanion && rootState.event.currentGuests) {
    for (const guest of rootState.event.currentGuests) {
      const guestRef = doc(db, "events", rootState.event.currentEvent.id, "companions", rootState.event.currentCompanion.id, "guests", guest.id);
      await updateDoc(guestRef, {
        status: 'declined'
      })
    }
  }
})

export const submitinvitation = createAsyncThunk("event/submitinvitation", async (_, {getState}) => {
  // This one is called when guests asnwer their tickets from GUEST DETAIL one by one and submit their response.
  const rootState: RootState = getState() as RootState;
  const eventState = rootState.event;
  if (eventState.currentEvent && eventState.currentCompanion) {
    const companionRef = doc(db, "events", eventState.currentEvent.id, "companions", eventState.currentCompanion.id);
    await updateDoc(companionRef, {
      submitted: true
    })
  }
})

export const setCurrentEvent = createAsyncThunk("event/setCurrentEvent", async (payload: EventCompanionIdPayload) => {

  const currentEventRef = doc(db, "events", payload.eventId);
  const currentEventSnap = await getDoc(currentEventRef);
  const currentEvent: Event = {id: currentEventSnap.data()?.id, email: currentEventSnap.data()?.email}

  const currentCompanionRef = doc(db, "events", payload.eventId, "companions", payload.companionId);
  const currentCompanionSnap = await getDoc(currentCompanionRef);
  const currentCompanion: Companion = {
    id: currentCompanionSnap.data()?.id,
    submitted: currentCompanionSnap.data()?.submitted,
    url: currentCompanionSnap.data()?.url
  }

  const currentGuestsRef = collection(db, "events", payload.eventId, "companions", payload.companionId, "guests");
  const currentGuestsSnap = await getDocs(currentGuestsRef);
  const currentGuests: Guest[] = [];
  currentGuestsSnap.forEach((doc) => {
    const guest: Guest = {
      id: doc.data().id,
      firstName: doc.data().firstName,
      lastName: doc.data().lastName,
      status: doc.data().status,
      ...(doc.data().comment && {comment: doc.data().comment})
    }
    currentGuests.push(guest);
  });

  return {
    currentEvent: currentEvent,
    currentCompanion: currentCompanion,
    currentGuests: currentGuests
  };
})

export interface GuestUpdatePayload {
  guestId: string;
  comment: string;
  status: string
}

export const updateGuest = createAsyncThunk('event/updateGuest', async (payload: GuestUpdatePayload, {getState}) => {
  const currentState: RootState = getState() as RootState;
  if (currentState && currentState.event.currentEvent && currentState.event.currentCompanion) {
    const guestRef = doc(db, "events", currentState.event.currentEvent.id, "companions", currentState.event.currentCompanion.id, "guests", payload.guestId);
    await updateDoc(guestRef, {
      status: payload.status,
      ...(payload.comment !== '' && {comment: payload.comment})
    });
    return {guestId: payload.guestId, comment: payload.comment, status: payload.status};
  } else {
    console.error("currentState, it's currentEvent or currentCompanion is null")
  }

})
export interface Kir {nameValues: GuestCreationMaterial[], eventId: string|undefined}

export const addGuest = createAsyncThunk('event/addGuest', async (kir: Kir): Promise<void> => {
    const companionRef: DocumentReference = await addDoc(collection(db, "companions"), {
      submitted: false,
      eventId: kir.eventId
    })
    await updateDoc(companionRef, {
      url: `http://localhost:5173/event/${kir.eventId}/${companionRef.id}`,
      id: companionRef.id
    })
    for (const guest of kir.nameValues) {
      const guestRef: DocumentReference = await addDoc(collection(db, "guests"), {
        firstName: guest.firstName,
        lastName: guest.lastName,
        status: 'pending',
        eventId: kir.eventId,
        companionId: companionRef.id
      });
      await updateDoc(guestRef, {
        id: guestRef.id
      })
    }
})

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setCurrentEvent.fulfilled, (state: EventState, action) => {
        return {
          ...state,
          currentEvent: action.payload.currentEvent,
          currentCompanion: action.payload.currentCompanion,
          currentGuests: action.payload.currentGuests
        }
      })
      .addCase(updateGuest.fulfilled, (state: EventState, action) => {
        return {
          ...state,
          currentGuests: state.currentGuests.map((guest: Guest) =>
            guest.id === action.payload?.guestId ? {
              ...guest,
              comment: action.payload.comment,
              status: action.payload.status
            } : guest
          )
        };
      })
      .addCase(declineCurrentGuests.fulfilled, (state: EventState) => {
        return {
          ...state,
          currentGuests: state.currentGuests.map((guest: Guest) => ({...guest, status: 'declined'}))
        }
      })
      .addCase(submitinvitation.fulfilled, (state: EventState) => {
        return {
          ...state,
          currentCompanion: {
            ...state.currentCompanion!,
            submitted: true
          }
        }
      })

  }
})

export const eventActions = eventSlice.actions;
export default eventSlice.reducer;