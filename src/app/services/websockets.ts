import { Injectable } from "@angular/core";
import { WebSocketSubject, webSocket } from "rxjs/webSocket";

import { AuthService } from "@rapydo/services/auth";

import { environment } from "@rapydo/../environments/environment";

@Injectable()
/* istanbul ignore next */
export class WebSocketsService {
  /* istanbul ignore next */
  constructor(private auth: AuthService) {}

  /* istanbul ignore next */
  public subscribe(channel: string, callback: (message: string) => void) {
    let host = environment.websocketsUrl;
    let token = this.auth.getToken();
    let url =
      "ws://" + host + "/api/socket/" + channel + "?access_token=" + token;

    const socket: WebSocketSubject<any> = webSocket({
      url,
      // avoid the default JSON.parse on incoming messages
      deserializer: (msg) => msg,
    });

    socket.subscribe(
      // Called whenever there is a message from the server.
      (msg) => {
        callback(msg.data);
      },
      // Called if at any point WebSocket API signals some kind of error.
      (err) => {
        console.error("Subscribe error: ");
        console.error(err);
      },
      // Called when connection is closed (for whatever reason).
      () => {
        console.info("complete");
      }
    );
  }
}
