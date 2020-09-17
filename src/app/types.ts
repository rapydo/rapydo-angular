import { CustomUser } from "@app/types";

export type UUID = string;

// It is used in Sessions response
export interface SimpleUser {
  /**
   * @format email
   */
  readonly email: string;
  readonly name: string;
  readonly surname: string;
}

// It is used in Groups response
interface SimpleUserWithId extends SimpleUser {
  readonly uuid: string;
}

export interface SimpleGroup {
  readonly shortname: string;
  readonly fullname: string;
  readonly coordinator?: SimpleUserWithId;
}

export interface Group extends SimpleGroup {
  readonly uuid: string;
}

export interface Groups extends Array<Group> {}

export interface User extends SimpleUserWithId, CustomUser {
  readonly isAdmin: boolean;
  readonly isLocalAdmin: boolean;
  readonly is_active: boolean;
  readonly privacy_accepted: boolean;
  readonly roles: any;
  readonly group?: Group;
}

// It is used in AdminUsers response
export interface AdminUser extends SimpleUserWithId, CustomUser {
  readonly is_active: boolean;
  readonly privacy_accepted: boolean;
  /**
   * @nullable
   */
  readonly last_login: Date;
  /**
   * @nullable
   */
  readonly first_login: Date;
  /**
   * @nullable
   */
  readonly last_password_change: Date;
  readonly roles: any;
  readonly group?: Group[];
  readonly coordinator?: Group[];
}
export interface AdminUsers extends Array<AdminUser> {}

export interface Session {
  readonly id: string;
  readonly token: string;
  readonly IP: string;
  readonly location: string;
  readonly user?: SimpleUser;
  readonly emitted: Date;
  readonly last_access: Date;
  readonly expiration: Date;
}
export interface Sessions extends Array<Session> {}

export interface Paging {
  /**
   * @minimum 1
   */
  page: number;
  /**
   * @minimum 1
   */
  readonly itemsPerPage: number;
  /**
   * @minimum 0
   */
  numPages: number;
  /**
   * @minimum 0
   */
  dataLength: number;
}

export interface Total {
  /**
   * @minimum 0
   */
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

interface CPUStats {
  /**
   * @minimum 1
   */
  readonly count: number;
  /**
   * @minimum 0
   * @maximum 100
   */
  readonly load: number;
  /**
   * @minimum 0
   */
  readonly user: number;
  /**
   * @minimum 0
   * @maximum 100
   */
  readonly idle: number;
  /**
   * @minimum 0
   * @maximum 100
   */
  readonly wait: number;
  /**
   * @minimum 0
   * @maximum 100
   */
  readonly system: number;
  /**
   * @minimum 0
   * @maximum 100
   */
  readonly stolen: number;
}

interface DiskStats {
  /**
   * @minimum 1
   */
  readonly free_disk_space: number;
  /**
   * @minimum 1
   */
  readonly total_disk_space: number;
  /**
   * @minimum 1
   */
  readonly used_disk_space: number;
  /**
   * @minimum 0
   * @maximum 100
   */
  readonly occupacy: number;
}

interface IOStats {
  /**
   * @minimum 0
   */
  readonly blocks_received: number;
  /**
   * @minimum 0
   */
  readonly blocks_sent: number;
}

interface NetworkStats {
  /**
   * @minimum 0
   */
  readonly min: number;
  /**
   * @minimum 0
   */
  readonly max: number;
  /**
   * @minimum 0
   */
  readonly avg: number;
}

interface ProcsStats {
  /**
   * @minimum 0
   */
  readonly waiting_for_run: number;
  /**
   * @minimum 0
   */
  readonly uninterruptible_sleep: number;
}

interface RAMStats {
  /**
   * @minimum 0
   */
  readonly active: number;
  /**
   * @minimum 0
   */
  readonly buffer: number;
  /**
   * @minimum 0
   */
  readonly cache: number;
  /**
   * @minimum 0
   */
  readonly free: number;
  /**
   * @minimum 0
   */
  readonly inactive: number;
  /**
   * @minimum 0
   */
  readonly total: number;
  /**
   * @minimum 0
   */
  readonly used: number;
}

interface SwapStats {
  /**
   * @minimum 0
   */
  readonly free: number;
  /**
   * @minimum 0
   */
  readonly from_disk: number;
  /**
   * @minimum 0
   */
  readonly to_disk: number;
  /**
   * @minimum 0
   */

  readonly total: number;
  /**
   * @minimum 0
   */

  readonly used: number;
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
