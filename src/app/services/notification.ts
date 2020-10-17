import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

interface Message {
  text: string;
  title: string;
}

@Injectable()
export class NotificationService {
  readonly CRITICAL = 1;
  readonly ERROR = 2;
  readonly WARNING = 3;
  readonly INFO = 4;

  constructor(private toastr: ToastrService) {}

  private isDict(dict) {
    return typeof dict === "object" && !Array.isArray(dict);
  }

  private extractMessages(msg, title: string): Message[] {
    let messages: Message[] = [];

    if (msg === null) {
      messages.push(null);
      return messages;
    }

    if (msg.error && msg.error instanceof ProgressEvent) {
      messages.push({ text: msg.message, title: title });
      return messages;
    }

    if (msg.error) {
      messages.push({ text: msg.error, title: title });
      return messages;
    }

    if (this.isDict(msg)) {
      for (let k in msg) {
        messages.push({ text: msg[k], title: title || k });
      }
      return messages;
    }

    if (Array.isArray(msg)) {
      for (let m of msg) {
        messages.push({ text: m, title: title });
      }
      return messages;
    }

    messages.push({ text: msg, title: title });
    return messages;
  }
  public showCritical = function (message: any, title: string = ""): void {
    for (let msg of this.extractMessages(message, title)) {
      if (msg === null) {
        continue;
      }
      this.toastr.error(msg.text, msg.title, {
        timeOut: 0,
      });
    }
  };

  public showError = function (message: any, title: string = ""): void {
    for (let msg of this.extractMessages(message, title)) {
      if (msg === null) {
        continue;
      }
      this.toastr.error(msg.text, msg.title, {
        timeOut: 15000,
      });
    }
  };

  public showWarning = function (message: any, title: string = ""): void {
    for (let msg of this.extractMessages(message, title)) {
      if (msg === null) {
        continue;
      }
      this.toastr.warning(msg.text, msg.title, {
        timeOut: 10000,
      });
    }
  };

  public showSuccess = function (message: any, title: string = ""): void {
    for (let msg of this.extractMessages(message, title)) {
      if (msg === null) {
        continue;
      }
      this.toastr.success(msg.text, msg.title, {
        timeOut: 10000,
      });
    }
  };

  public showInfo = function (message: any, title: string = ""): void {
    for (let msg of this.extractMessages(message, title)) {
      if (msg === null) {
        continue;
      }
      this.toastr.info(msg.text, msg.title, {
        timeOut: 10000,
      });
    }
  };
}
