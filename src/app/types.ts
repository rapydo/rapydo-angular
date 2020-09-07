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

export interface AdminStats {
  boot_time: Date;
  cpu: CPUStats;
  disk: DiskStats;
  io: IOStats;
  network_latency: NetworkStats;
  procs: ProcsStats;
  ram: RAMStats;
  swap: SwapStats;
}

interface CPUStats {
  count: number;
  load: number;
  user: number;
  idle: number;
  wait: number;
  system: number;
  stolen: number;
}

interface DiskStats {
  free_disk_space: number;
  total_disk_space: number;
  used_disk_space: number;
  occupacy: number;
}

interface IOStats {
  blocks_received: number;
  blocks_sent: number;
}

interface NetworkStats {
  min: number;
  max: number;
  avg: number;
}

interface ProcsStats {
  waiting_for_run: number;
  uninterruptible_sleep: number;
}

interface RAMStats {
  active: number;
  buffer: number;
  cache: number;
  free: number;
  inactive: number;
  total: number;
  used: number;
}

interface SwapStats {
  free: number;
  from_disk: number;
  to_disk: number;
  total: number;
  used: number;
}
