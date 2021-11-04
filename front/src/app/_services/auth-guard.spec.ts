import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from './message_service';
import { AuthGuard } from './auth-guard';
import { AuthService } from './auth_service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
    let service: AuthGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ],
            providers: [
                AuthService
            ]
        });
        service = TestBed.inject(AuthGuard);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});