
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class WebsocketService {

    // Our socket connection

    public socketId: string;
    constructor(private readonly socket: Socket) {
        socket.on('connect', () => {
            //   utils.log(`Socket id :: ${this.socket.ioSocket.id}`);
            this.setSocketId(this.socket.ioSocket.id);
        });
    }

    private socketIdSetter = new Subject<any>();
    socketIdSetterObs = this.socketIdSetter.asObservable();
    setSocketId(id: string) {
        this.socketId = id;
        this.socketIdSetter.next();
    }

    ngOnDestroy() {
        this.socket.removeAllListeners();
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