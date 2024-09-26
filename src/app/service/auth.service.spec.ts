import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import jwtDecode from 'jwt-decode';

import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve token from local storage', () => {
    localStorage.setItem('tkn', 'test-token');
    expect(service.getToken()).toEqual('test-token');
  });

  it('should return null if token is not found', () => {
    expect(service.getToken()).toBeNull();
  });

  it('should remove item from local storage', () => {
    localStorage.setItem('testKey', 'testValue');
    service.clearStorageByKey('testKey');
    expect(localStorage.getItem('testKey')).toBeNull();
  });

  it('should store data in local storage', () => {
    service.setDataInLocalStorage('testKey', 'testValue');
    expect(localStorage.getItem('testKey')).toEqual('testValue');
  });

  it('should send a POST request to login', () => {
    const mockResponse = { success: true, token: 'mock-token' };
    const payload = { username: 'testUser', password: 'testPassword' };
    service.login(payload).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.baseUrl}/public/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush(mockResponse);
  });

  it('should handle error response', () => {
    const payload = { username: 'wrongUser', password: 'wrongPassword' };

    service.login(payload).subscribe({
      next: () => fail('should have failed with 401 error'),
      error: (error) => {
        expect(error.status).toBe(401);
      },
    });

    const req = httpMock.expectOne(`${service.baseUrl}/public/login`);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should return null when token is undefined or empty', () => {
    localStorage.setItem('tkn', '');
    expect(service.getTokenData()).toBeNull();
    localStorage.removeItem('tkn');
    expect(service.getTokenData()).toBeNull();
  });

  it('should return decoded data when a valid token is stored', () => {
    const mockToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'; // A valid JWT for testing
    localStorage.setItem('tkn', mockToken);

    const decodedToken = jwtDecode(mockToken);
    const result = service.getTokenData();

    expect(result).toEqual(decodedToken);
  });
  it('should clear token from storage and navigate to login on logout', () => {
    // Spy on the clearStorageByKey method
    spyOn(service, 'clearStorageByKey').and.callThrough();
    const navigateSpy = spyOn(router, 'navigateByUrl');

    // Call the logout method
    service.logout();

    // Assert that clearStorageByKey is called with 'tkn'
    expect(service.clearStorageByKey).toHaveBeenCalledWith('tkn');

    // Assert that navigation to '/auth/login' occurred
    expect(navigateSpy).toHaveBeenCalledWith('/auth/login');
  });
});
