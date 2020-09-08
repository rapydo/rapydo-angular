// It is used in Sessions response
interface SimpleUser {
  readonly email: string;
  readonly name: string;
  readonly surname: string;
}

// It is used in Groups response
interface SimpleUserWithId extends SimpleUser {
  readonly uuid: string;
}

// It is used in Users response
export interface Users extends Array<User> {}
export interface User extends SimpleUserWithId {
  readonly isAdmin: boolean;
  readonly isLocalAdmin: boolean;
  readonly is_active: boolean;
  readonly privacy_accepted: boolean;
  readonly roles: any;
  readonly group?: Group;
}

export interface Sessions extends Array<Session> {}
export interface Session {
  readonly token: string;
  readonly IP: string;
  readonly location: string;
  readonly user?: SimpleUser;
}

export interface Groups extends Array<Group> {}
export interface Group {
  readonly uuid: string;
  readonly shortname: string;
  readonly fullname: string;
  readonly coordinator?: SimpleUserWithId;
}

export interface Paging {
  page: number;
  readonly itemsPerPage: number;
  numPages: number;
  dataLength: number;
}

export interface Total {
  readonly total: number;
}
export interface Confirmation {
  readonly title: string;
  readonly message: string;
}

// key is optional only for back-compatibility
// remove the ? once dropped all swagger compatibility rules
export interface Schema {
  readonly type: string;
  readonly key: string;
  readonly label?: string;
  readonly description?: string;
  readonly default?: any;
  readonly format?: string;
  readonly required?: string;
  // this is initialized in formly service in case of type select
  options?: any[];

  readonly min?: number | Date;
  readonly max?: number | Date;
  readonly enum?: Record<string, string>;
}

export interface AdminStats {
  readonly boot_time: Date;
  readonly cpu: CPUStats;
  readonly disk: DiskStats;
  readonly io: IOStats;
  readonly network_latency: NetworkStats;
  readonly procs: ProcsStats;
  readonly ram: RAMStats;
  readonly swap: SwapStats;
}

interface CPUStats {
  /*
   * @min 10
   */
  readonly count: number;
  readonly load: number;
  readonly user: number;
  readonly idle: number;
  readonly wait: number;
  readonly system: number;
  readonly stolen: number;
}

interface DiskStats {
  readonly free_disk_space: number;
  readonly total_disk_space: number;
  readonly used_disk_space: number;
  readonly occupacy: number;
}

interface IOStats {
  readonly blocks_received: number;
  readonly blocks_sent: number;
}

interface NetworkStats {
  readonly min: number;
  readonly max: number;
  readonly avg: number;
}

interface ProcsStats {
  readonly waiting_for_run: number;
  readonly uninterruptible_sleep: number;
}

interface RAMStats {
  readonly active: number;
  readonly buffer: number;
  readonly cache: number;
  readonly free: number;
  readonly inactive: number;
  readonly total: number;
  readonly used: number;
}

interface SwapStats {
  readonly free: number;
  readonly from_disk: number;
  readonly to_disk: number;
  readonly total: number;
  readonly used: number;
}
