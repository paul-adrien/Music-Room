import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { WebsocketService } from './websocketService';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = {
    url: 'http://localhost:8080', options: {}
};

describe('SocketService', () => {
    let service: WebsocketService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                SocketIoModule.forRoot(config),
                RouterTestingModule,
            ],
            providers: [
                WebsocketService
            ]
        });
        service = TestBed.inject(WebsocketService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
