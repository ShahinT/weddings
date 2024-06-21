import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  addDoc,
  DocumentReference, query, where
} from "firebase/firestore";
import {db} from "../plugins/firebase.ts";
import {Companion, Guest, Event, GuestCreationMaterial, AddEventPayload, User} from "../interfaces";
import {RootState} from "./index.ts";

export interface EventState {
  currentEvent: Event | null;
  currentCompanion: Companion | null;
  currentGuests: Guest[] | [];
  adminEvents: Event[] | [],
  currentAdminEvent: { companions: Array<{guests: Guest[]}> } | null,
  currentAdminGuests: Guest[] | [],
  currentAdminCompanions: Companion[] | [],
}

const initialState: EventState = {
  currentCompanion: null,
  currentEvent: null,
  currentGuests: [],
  adminEvents: [],
  currentAdminEvent: null,
  currentAdminGuests: [],
  currentAdminCompanions: []
}

export interface EventCompanionIdPayload {
  eventId: string,
  companionId: string
}
collection
export const setCurrentAdminEvent = createAsyncThunk("event/setCurrentAdminEvent", async (payload: { eventId: string | undefined }) => {
  const companionsQuery = query(collection(db, "companions"), where("eventId", "==", payload.eventId));
  const companionsSnap = await getDocs(companionsQuery)
  const companions: Companion[] = companionsSnap.docs.map(companion => (
    {
      id: companion.data().id,
      eventId: companion.data().eventId,
      submitted: companion.data().submitted,
      url: companion.data().url
    }));

  const guestsQuery = query(collection(db, "guests"), where("eventId", "==", payload.eventId));
  const guestsSnap = await getDocs(guestsQuery)
  const guests: Guest[] = guestsSnap.docs.map(guest => (
    {
      id: guest.data().id,
      eventId: guest.data().eventId,
      companionId: guest.data().companionId,
      firstName: guest.data().firstName,
      lastName: guest.data().lastName,
      status: guest.data().status,
      comment: guest.data().comment
    }));

  const event =  {
    companions: companions.map(companion => ({
      ...companion,
      guests: guests.filter(guest => guest.companionId === companion.id)
    }))
  };
  return {event, guests, companions}
})

export const addEvent = createAsyncThunk("event/addEvent", async (payload: AddEventPayload) => {
  console.log(payload)
  const userIdQuery = query(collection(db, "users"), where("email","==",payload.email));
  const userId = await getDocs(userIdQuery)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {email, ...newPayload} = payload;

  newPayload.userId = userId.docs[0].data().id;
  const eventRef =  await addDoc(collection(db, "events"), {...newPayload, });
  await updateDoc(eventRef, {id: eventRef.id});
})

export const setAdminEvents = createAsyncThunk("event/setAdminEvents", async (_, {getState}) => {
  const rootState: RootState = getState() as RootState;
  const currentUser: User | null = rootState.authentication.currentUser;
  const eventsQuery = query(collection(db, "events"), where("userId", "==", currentUser?.uid));
  const eventsSnapshot = await getDocs(eventsQuery);
  return eventsSnapshot.docs.map((event) => (
    {
      id: event.data().id,
      userId: event.data().userId,
      name: event.data().name,
      groom: event.data().groom,
      bride: event.data().bride,
      startTime: event.data().startTime,
      address: event.data().address
    }
  ))
})

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
    const companionRef = doc(db, "companions", eventState.currentCompanion.id);
    await updateDoc(companionRef, {
      submitted: true
    })
  }
})

export const setCurrentEvent = createAsyncThunk("event/setCurrentEvent", async (payload: EventCompanionIdPayload) => {

  const currentEventRef = doc(db, "events", payload.eventId);
  const currentEventSnap = await getDoc(currentEventRef);
  const currentEvent: Event = {
    id: currentEventSnap.data()?.id,
    name: currentEventSnap.data()?.name,
    userId: currentEventSnap.data()?.userId,
    bride: currentEventSnap.data()?.bride,
    groom: currentEventSnap.data()?.groom,
    startTime: currentEventSnap.data()?.startTime,
    address: currentEventSnap.data()?.address
  }

  const currentCompanionSnap = await getDoc(doc(db, "companions", payload.companionId))
  const currentCompanion: Companion = {
    id: currentCompanionSnap.data()?.id,
    eventId: currentCompanionSnap.data()?.eventId,
    submitted: currentCompanionSnap.data()?.submitted,
    url: currentCompanionSnap.data()?.url
  }
  const guestsQuery = query(collection(db, "guests"), where("companionId","==", payload.companionId))
  const guestsSnap = await getDocs(guestsQuery);
  const currentGuests: Guest[] = guestsSnap.docs.map(doc => ({
    id: doc.data().id,
    firstName: doc.data().firstName,
    lastName: doc.data().lastName,
    status: doc.data().status,
    companionId: doc.data().companionId,
    eventId: doc.data().eventId,
    ...(doc.data().comment && {comment: doc.data().comment})
  }))

  return {currentEvent,currentCompanion,currentGuests
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
    const guestRef = doc(db, "guests", payload.guestId);
    await updateDoc(guestRef, {
      status: payload.status,
      ...(payload.comment !== '' && {comment: payload.comment})
    });
    return {guestId: payload.guestId, comment: payload.comment, status: payload.status};
  } else {
    console.error("currentState, it's currentEvent or currentCompanion is null")
  }

})

export interface addGuestPayload {
  nameValues: GuestCreationMaterial[],
  eventId: string | undefined
}

export const addGuest = createAsyncThunk('event/addGuest', async (payload: addGuestPayload): Promise<void> => {
  const companionRef: DocumentReference = await addDoc(collection(db, "companions"), {
    submitted: false,
    eventId: payload.eventId
  })
  await updateDoc(companionRef, {
    url: `https://eventmanager-shahin.web.app/event/${payload.eventId}/${companionRef.id}`,
    id: companionRef.id
  })
  for (const guest of payload.nameValues) {
    const guestRef: DocumentReference = await addDoc(collection(db, "guests"), {
      firstName: guest.firstName,
      lastName: guest.lastName,
      status: 'pending',
      eventId: payload.eventId,
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
      .addCase(setAdminEvents.fulfilled, (state: EventState, action) => {
        return {
          ...state,
          adminEvents: action.payload
        }
      })
      .addCase(setCurrentAdminEvent.fulfilled, (state: EventState, action) => {
        return {
          ...state,
          currentAdminEvent: action.payload.event,
          currentAdminCompanions: action.payload.companions,
          currentAdminGuests: action.payload.guests
        }
      })

  }
})

export const eventActions = eventSlice.actions;
export default eventSlice.reducer;