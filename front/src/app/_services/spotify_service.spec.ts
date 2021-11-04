import { TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { WebsocketService } from './websocketService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from './user_service';
import { SpotifyService } from './spotify_service';
import { Device } from '@ionic-native/device/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

describe('SpotifyService', () => {
    let service: SpotifyService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            providers: [
                Device,
                InAppBrowser,
                WebsocketService,
                // AuthService
            ]
        });
        service = TestBed.inject(SpotifyService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
