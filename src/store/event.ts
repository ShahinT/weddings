import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {doc, getDoc, setDoc, getDocs, collection, updateDoc, DocumentReference, DocumentSnapshot  } from "firebase/firestore";
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

export interface StatusPayload {
  status: string
}

export const declineInvatation = createAsyncThunk("event/declineInvatation", async (_, {getState}) => {
  const rootState: RootState = getState() as RootState;
  if (rootState.event.currentEvent && rootState.event.currentCompanion){
    const companionRef = doc(db, "events", rootState.event.currentEvent.id, "companions", rootState.event.currentCompanion.id)
    await updateDoc(companionRef, {
      status: "declined"
    })
  }
})

  export const changeCompanionStatus = createAsyncThunk("event/changeCompanionStatus", async (payload: StatusPayload, {getState}) => {
  const rootState: RootState = getState() as RootState;
  const eventState = rootState.event;
  if(eventState.currentEvent && eventState.currentCompanion){
    console.log(eventState.currentEvent.id, eventState.currentCompanion.id)
    const companionRef = doc(db, "events", eventState.currentEvent.id, "companions", eventState.currentCompanion.id);
    await updateDoc(companionRef, {
      status: payload.status
    })
    return {status: payload.status}
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
      status: doc.data().status,
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

export interface GuestAndUserPayload {
  firstName: string,
  lastName: string,
  showDropDown: boolean;
}

export const addGuest = createAsyncThunk('event/addGuest', async (guests: Array<GuestAndUserPayload>, thunkAPI) => {
  const currentState: RootState = thunkAPI.getState() as RootState;
  const currentUser: User | null = currentState.authentication.currentUser;
  if (currentUser) {
    const currentCompanionId: string = guests.map(guest => guest.firstName).join('');
    const url: string = `http://localhost:5173/event/${currentUser.uid}/${currentCompanionId}`;
    let currentGuestId: string = '';

    const counterRef: DocumentReference = doc(db, "counters", "counters");
    const countersSnap: DocumentSnapshot = await getDoc(counterRef);
    const counters = countersSnap.data();

    await setDoc(doc(db, "events", currentUser.uid, "companions", (currentCompanionId + counters?.companionCounter)), {
      id: (currentCompanionId + counters?.companionCounter),
      status: "pending",
      url: url + counters?.companionCounter
    })
    for (const [index, guest] of guests.entries()) {
      currentGuestId = guest.firstName + guest.lastName;
      console.log('currentGuestId + (counters?.guestCounter+index)')
      console.log(currentGuestId + (counters?.guestCounter+index))
      const guestsRef: DocumentReference = doc(db, "events", currentUser.uid, "companions", (currentCompanionId + counters?.companionCounter), "guests", currentGuestId+(counters?.guestCounter+index));
      await setDoc(guestsRef, {
        id: currentGuestId + (counters?.guestCounter+index),
        firstName: guest.firstName,
        lastName: guest.lastName,
        status: 'pending'
      });
    }
    await updateDoc(counterRef, {
      companionCounter: counters?.companionCounter + 1,
      guestCounter: counters?.guestCounter + guests.length
    })
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
            guest.id === action.payload?.guestId ? {...guest, comment: action.payload.comment, status: action.payload.status} : guest
          )
        };
      })
      .addCase(declineInvatation.fulfilled, (state: EventState) => {
        return {
          ...state,
          currentCompanion: {
            ...state.currentCompanion!,
            status: 'declined'
          },
          currentGuests: state.currentGuests.map((guest: Guest) => ({...guest, accepted: true}))

        }
      })
      .addCase(changeCompanionStatus.fulfilled, (state: EventState, action) => {
        return {
          ...state,
          currentCompanion: {
            ...state.currentCompanion!,
            status: action.payload!.status
          },
        }
      })

  }
})

export const eventActions = eventSlice.actions;
export default eventSlice.reducer;