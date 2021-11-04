import { TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RoomService } from './room_service';
import { PlaylistService } from './playlist_service';

describe('PlaylistService', () => {
    let service: PlaylistService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            providers: [
            ]
        });
        service = TestBed.inject(PlaylistService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});