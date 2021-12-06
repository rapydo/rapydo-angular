import { CustomUser } from "@app/types";

export type UUID = string;
export type String = string;
export type Boolean = boolean;
export type Number = number;

// as returned by keyvalue pipe
export interface KeyValue {
  readonly key: string;
  readonly value: any;
}

// It is used in Sessions response
export interface SimpleUser {
  /** @format email */
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
}

export interface Group extends SimpleGroup {
  readonly uuid: string;

  readonly members?: SimpleUserWithId[];
  readonly coordinators?: SimpleUserWithId[];
}

export interface Groups extends Array<Group> {}

export interface User extends SimpleUserWithId, CustomUser {
  readonly isAdmin: boolean;
  readonly isStaff: boolean;
  readonly isCoordinator: boolean;
  readonly is_active: boolean;
  /** @nullable */
  readonly expiration: Date;
  readonly privacy_accepted: boolean;
  readonly roles: Record<string, string>;
  /** @nullable */
  readonly first_login: Date;
  /** @nullable */
  readonly last_login: Date;
  /** @nullable */
  readonly last_password_change: Date;
  // "nullable" should be removed in a near future
  /** @nullable */
  readonly group: Group;
  readonly two_factor_enabled: boolean;
}

// It is used in AdminUsers response
export interface AdminUser extends SimpleUserWithId, CustomUser {
  readonly is_active: boolean;
  readonly privacy_accepted: boolean;
  /** @nullable */
  readonly first_login: Date;
  /** @nullable */
  readonly last_login: Date;
  /** @nullable */
  readonly last_password_change: Date;
  readonly roles: any;
  /** @nullable */
  readonly expiration: Date;
  // Added by AdminUsersComponent
  expired?: boolean;
  // "nullable" should be removed in a near future
  /** @nullable */
  readonly group: Group;
}
export interface AdminUsers extends Array<AdminUser> {}

// It is used in GroupUsers response
export interface GroupUser extends SimpleUser, CustomUser {
  readonly roles: any;
}
export interface GroupUsers extends Array<GroupUser> {}

export interface Session {
  readonly id: string;
  readonly token: string;
  readonly IP: string;
  /** @nullable */
  readonly location: string;
  readonly user?: SimpleUser;
  readonly emitted: Date;
  readonly last_access: Date;
  readonly expiration: Date;
}
export interface Sessions extends Array<Session> {}

export interface Login {
  /** @format email */
  readonly username: string;
  readonly date: Date;
  readonly IP: string;
  readonly location: string;
  readonly failed: boolean;
  readonly flushed: boolean;
}
export interface Logins extends Array<Login> {}

export interface Paging {
  /** @minimum 1 */
  page: number;
  /** @minimum 1 */
  readonly itemsPerPage: number;
  /** @minimum 0 */
  numPages: number;
  /** @minimum 0 */
  dataLength: number;
}

export interface Total {
  /** @minimum 0 */
  readonly total: number;
}

export enum SchemaType {
  STRING = "string",
  STRING_ARRAY = "string[]",
  INT = "int",
  NUMBER = "number",
  DATE = "date",
  DATETIME = "datetime",
  EMAIL = "email",
  PASSWORD = "password",
  BOOLEAN = "boolean",
  RADIO = "radio",
  URL = "url",
}

export type SchemaOptions =
  // select
  | Record<string, string>
  // radio with/without description
  | Record<"value" | "label", string>[]
  | Record<"value" | "label" | "description", string>[];

export interface Schema {
  readonly key: string;
  readonly type: SchemaType;
  readonly label?: string;
  readonly description?: string;
  readonly default?: any;
  readonly required?: boolean;

  readonly min?: number | Date;
  readonly max?: number | Date;
  readonly options?: SchemaOptions;
  readonly autocomplete_endpoint?: string;
  readonly autocomplete_id_bind?: string;
  readonly autocomplete_label_bind?: string;
  readonly autocomplete_show_id?: boolean;
}

// I would directly use the type from ngx-formly
// https://github.com/ngx-formly/ngx-formly/blob/min/src/core/src/lib/models/fieldconfig.ts
// but it fails during the compilation with ts-json-schema-generator

// output of json2form in FormlyService
export interface JSON2Form {
  readonly fields: any[];
  readonly model: Record<string, unknown>;
}

interface SystemStats {
  readonly boot_time: Date;
}
interface CPUStats {
  /** @minimum 1 */
  readonly count: number;
  /** @minimum 0 */
  readonly load_percentage: number;
  /**
   * @minimum 0
   * @maximum 100
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
  /** @minimum 1 */
  readonly free_disk_space: number;
  /** @minimum 1 */
  readonly total_disk_space: number;
  /** @minimum 1 */
  readonly used_disk_space: number;
  /**
   * @minimum 0
   * @maximum 100
   */
  readonly occupacy: number;
}

interface IOStats {
  /** @minimum 0 */
  readonly blocks_received: number;
  /** @minimum 0 */
  readonly blocks_sent: number;
}

interface NetworkStats {
  /** @minimum 0 */
  readonly min: number;
  /** @minimum 0 */
  readonly max: number;
  /** @minimum 0 */
  readonly avg: number;
}

interface ProcsStats {
  /** @minimum 0 */
  readonly waiting_for_run: number;
  /** @minimum 0 */
  readonly uninterruptible_sleep: number;
}

interface RAMStats {
  /** @minimum 0 */
  readonly active: number;
  /** @minimum 0 */
  readonly buffer: number;
  /** @minimum 0 */
  readonly cache: number;
  /** @minimum 0 */
  readonly free: number;
  /** @minimum 0 */
  readonly inactive: number;
  /** @minimum 0 */
  readonly total: number;
  /** @minimum 0 */
  readonly used: number;
}

interface SwapStats {
  /** @minimum 0 */
  readonly free: number;
  /** @minimum 0 */
  readonly from_disk: number;
  /** @minimum 0 */
  readonly to_disk: number;
  /** @minimum 0 */

  readonly total: number;
  /** @minimum 0 */

  readonly used: number;
}

export interface AdminStats {
  readonly system: SystemStats;
  readonly cpu: CPUStats;
  readonly disk: DiskStats;
  readonly io: IOStats;
  readonly network_latency: NetworkStats;
  readonly procs: ProcsStats;
  readonly ram: RAMStats;
  readonly swap: SwapStats;
}

export interface ConfirmationModalOptions {
  readonly text: string;
  readonly title?: string;
  readonly disableSubText?: boolean;
  readonly subText?: string;
  readonly confirmButton?: string;
  readonly cancelButton?: string;
}

export interface AdminMenu {
  label: string;
  router_link: string;
  enabled: boolean;
}

export interface Email {
  readonly html_body: string;
  readonly plain_body: string;
  readonly subject: string;
  /** @format email */
  readonly to: string;
  /** @nullable */
  readonly cc: string[];
  /** @nullable */
  readonly bcc: string[];
}
