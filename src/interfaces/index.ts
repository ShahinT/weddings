export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  accepted: boolean;
  comment?: string;
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
  email: string;
}

export interface Companion {
  id: string;
  status: string;
  url: string
}