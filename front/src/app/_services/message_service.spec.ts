import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from './message_service';

describe('MessageService', () => {
    let service: MessageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
            ]
        });
        service = TestBed.inject(MessageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});