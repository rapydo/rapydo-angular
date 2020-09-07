export interface User {
  uuid: string;
  email: string;
  name: string;
  surname: string;
  isAdmin: boolean;
  isLocalAdmin: boolean;
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

export interface Paging {
  page: number;
  itemsPerPage: number;
  numPages: number;
  dataLength: number;
}

export interface Confirmation {
  title: string;
  message: string;
}

// key is optional only for back-compatibility
// remove the ? once dropped all swagger compatibility rules
export interface Schema {
  type: string;
  key: string;
  label?: string;
  description?: string;
  default?: any;
  format?: string;
  required?: string;
  options?: any[];

  min?: number | Date;
  max?: number | Date;
  enum?: Record<string, string>;
}
