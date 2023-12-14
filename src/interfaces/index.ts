export interface Guest {
  id: string;
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
  email: string;
}

export interface Companion {
  id: string;
  submitted: boolean;
  url: string
}