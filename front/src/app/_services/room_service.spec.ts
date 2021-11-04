import { TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RoomService } from './room_service';

describe('RoomService', () => {
    let service: RoomService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            providers: [
            ]
        });
        service = TestBed.inject(RoomService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});