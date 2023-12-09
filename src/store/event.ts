import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {doc, getDoc, setDoc, getDocs, collection, updateDoc} from "firebase/firestore";
import {db} from "../plugins/firebase.ts";
import {Companion, Guest, User, Event} from "../interfaces";
import {RootState} from "./index.ts";

export interface EventState {
  currentEvent: Event | null;
  currentCompanion: Companion | null;
  currentGuests: Array<Guest> | [];
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

export const setCurrentEvent = await createAsyncThunk("event/setCurrentEvent", async (payload: EventCompanionIdPayload) => {

  const currentEventRef = doc(db, "events", payload.eventId);
  const currentEventSnap = await getDoc(currentEventRef);
  const currentEvent: Event = {id: currentEventSnap.data()?.id, email: currentEventSnap.data()?.email}

  const currentCompanionRef = doc(db, "events", payload.eventId, "companions", payload.companionId);
  const currentCompanionSnap = await getDoc(currentCompanionRef);
  const currentCompanion: Companion = {
    id: currentCompanionSnap.data()?.id,
    status: currentCompanionSnap.data()?.status,
    url: currentCompanionSnap.data()?.url
  }

  const currentGuestsRef = collection(db, "events", payload.eventId, "companions", payload.companionId, "guests");
  const currentGuestsSnap = await getDocs(currentGuestsRef);
  const currentGuests: Array<Guest> = [];
  currentGuestsSnap.forEach((doc) => {
    const guest: Guest = {
      id: doc.data().id,
      firstName: doc.data().firstName,
      lastName: doc.data().lastName,
      accepted: doc.data().accepted,
      ...(doc.data().comment && { comment: doc.data().comment})
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
}

export const updateGuest = createAsyncThunk('event/updateGuest', async (payload: GuestUpdatePayload, {getState}) => {
  const currentState: RootState = getState() as RootState;
  if (currentState && currentState.event.currentEvent && currentState.event.currentCompanion) {
    const guestRef = doc(db, "events", currentState.event.currentEvent.id, "companions", currentState.event.currentCompanion.id, "guests", payload.guestId);
    await updateDoc(guestRef, {
      accepted: true,
      ...(payload.comment !== '' && {comment: payload.comment})
    });
    return {guestId: payload.guestId, comment: payload.comment};
  } else {
    console.error("currentState, it's currentEvent or currentCompanion is null")
  }

})

export interface GuestAndUserPayload {
  firstName: string,
  lastName: string,
  showDropDown: boolean;
}

export const addGuest = createAsyncThunk('event/addGuest', async (guests: Array<GuestAndUserPayload>, thunkAPI) => {
  const currentState: RootState = thunkAPI.getState() as RootState;
  const currentUser: User | null = currentState.authentication.currentUser;
  if (currentUser) {
    const currentCompanion: string = guests.map(guest => guest.firstName).join('');
    const url: string = `http://localhost:5173/event/${currentUser.uid}/${currentCompanion}`;
    let currentGuestId: string = ''

    await setDoc(doc(db, "events", currentUser.uid, "companions", currentCompanion), {
      id: currentCompanion,
      status: "NOT_ANSWERED",
      url: url
    })
    for (const guest of guests) {
      currentGuestId = guest.firstName + guest.lastName;
      const guestsRef = doc(db, "events", currentUser.uid, "companions", currentCompanion, "guests", currentGuestId);
      await setDoc(guestsRef, {
        id: currentGuestId,
        firstName: guest.firstName,
        lastName: guest.lastName,
        accepted: false
      });
    }
  }
  return {message: 'Successfully added guests to'};
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
            guest.id === action.payload?.guestId ? {...guest, comment: action.payload.comment,  accepted: true} : guest
          )
        };
      })

  }
})

export const eventActions = eventSlice.actions;
export default eventSlice.reducer;