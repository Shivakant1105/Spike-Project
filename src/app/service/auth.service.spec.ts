import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
 
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
 
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
 
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
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
      service.login(payload).subscribe(response => {
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
        }
      });
 
      const req = httpMock.expectOne(`${service.baseUrl}/public/login`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });