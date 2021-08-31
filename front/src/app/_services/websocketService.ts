
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { io } from 'socket.io-client';

@Injectable()
export class WebsocketService {

    // Our socket connection
    socket;

    constructor() { }

    //https://deepinder.me/creating-a-real-time-app-with-angular-8-and-socket-io-with-nodejs
    setupSocketConnection() {
        this.socket = io('http://localhost:8080', {
            auth: {
                token: 'socketToken'
            }
        });

        this.socket.on('chat message', (data: string) => {
            console.log(data);
        });
    }

    listenToServer(connection: string): Observable<any> {
        return new Observable((subscribe) => {
            this.socket.on(connection, (data) => {
                subscribe.next(data);
            });
        });
    }

    emitToServer(connection: string, data: any): void {
        this.socket.emit(connection, data);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}