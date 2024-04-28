import { Injectable } from "@angular/core";
import { format, addMinutes } from "date-fns";

@Injectable()
export class DateService {
  constructor() {}

  public toUTCDate(date: Date | string | number): Date {
    date = new Date(date);
    return addMinutes(date, date.getTimezoneOffset());
  }

  public toUTCString(date: Date | string | number, fmt: string): string {
    const d = this.toUTCDate(date);
    return format(d, fmt);
  }
}
