import { TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { WebsocketService } from './websocketService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FriendsService } from './friends_service';

describe('FriendsService', () => {
    let service: FriendsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
            ]
        });
        service = TestBed.inject(FriendsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
