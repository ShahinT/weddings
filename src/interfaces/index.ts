export interface Guest {
  id: string;
  eventId: string;
  companionId: string;
  firstName: string;
  lastName: string;
  status: string;
  comment?: string;
}
export interface GuestCreationMaterial {
  firstName: string,
  lastName: string,
  showDropDown: boolean,
}

export interface GuestPayload {
  firstName: string;
  lastName: string;
}

export interface User {
  uid: string;
  email: string;
}

export interface Event {
  id: string;
  name: string;
  userId: string;
  bride: string;
  groom: string;
  startTime: string;
  address: string;
}

export interface Companion {
  id: string;
  eventId: string;
  submitted: boolean;
  url: string
}