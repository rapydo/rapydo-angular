export interface User {
  uuid: string;
  email: string;
  name: string;
  surname: string;
  isAdmin: boolean;
  isLocalAdmin: boolean;
  // isGroupAdmin: boolean,
  is_active: boolean;
  privacy_accepted: boolean;
  roles: any;
  group?: Group;
}

export interface Sessions extends Array<Session> {}

export interface Session {
  token: string;
  IP: string;
  location: string;
  user?: User;
}

export interface Group {
  uuid: string;
  shortname: string;
  fullname: string;
  coordinator?: User;
}
