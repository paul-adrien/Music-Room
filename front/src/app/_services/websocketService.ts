import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
// import { Socket } from 'ngx-socket-io';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth_service';

@Injectable()
export class WebsocketService {
  // Our socket connection

  public socket;
  public token: string;

  constructor(private authenticateService: AuthService) {}

  ngOnDestroy() {
    this.socket.removeAllListeners();
  }

  setupSocketConnection() {
    this.token = this.authenticateService.getToken();
    this.socket = io(environment.SOCK_API, {
      query: { token: this.token },
    });
  }

  listenToServer(connection: string): Observable<any> {
    return new Observable((subscribe) => {
      this.socket?.on(connection, (data) => {
        subscribe.next(data);
      });
    });
  }

  emitToServer(connection: string, data: any): void {
    this.socket?.emit(connection, data);
  }

  disconnect() {
    if (this.socket) {
      this.socket?.disconnect();
    }
  }
}
