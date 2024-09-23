import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JwtInterceptor } from './jwt.interceptor';
import { AuthService } from '../service/auth.service';
import { LoggerService } from '../service/logger.service';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, } from '@angular/common/http';
import { throwError } from 'rxjs';
 
describe('JwtInterceptor', () => {
  let interceptor: JwtInterceptor;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let loggerServiceSpy: jasmine.SpyObj<LoggerService>;
  let routerSpy: jasmine.SpyObj<Router>;
 
  beforeEach(() => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['getToken', 'clearStorageByKey']);
    const loggerServiceMock = jasmine.createSpyObj('LoggerService', ['errorAlert']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
 
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        JwtInterceptor,
        { provide: AuthService, useValue: authServiceMock },
        { provide: LoggerService, useValue: loggerServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
 
    interceptor = TestBed.inject(JwtInterceptor);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    loggerServiceSpy = TestBed.inject(LoggerService) as jasmine.SpyObj<LoggerService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

 
  it('should handle 401 error and navigate to login', () => {
    authServiceSpy.getToken.and.returnValue(JSON.stringify('fake-token'));
    const httpRequest = new HttpRequest('GET', '/test');
    const httpHandler = {
      handle: () => throwError({ status: 401, error: { data: 'Unauthorized' } }),
    };
 
    interceptor.intercept(httpRequest, httpHandler as HttpHandler).subscribe({
      error: (err) => {
        expect(err.message).toContain('Unauthorized');
        expect(authServiceSpy.clearStorageByKey).toHaveBeenCalledWith('tkn');
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
      },
    });
  });
 
  it('should handle 403 error and navigate to login', () => {
    authServiceSpy.getToken.and.returnValue(JSON.stringify('fake-token'));
    const httpRequest = new HttpRequest('GET', '/test');
    const httpHandler = {
      handle: () => throwError({ status: 403, error: { data: 'Forbidden' } }),
    };
 
    interceptor.intercept(httpRequest, httpHandler as HttpHandler).subscribe({
      error: (err) => {
        expect(err.message).toContain('Forbidden');
        expect(authServiceSpy.clearStorageByKey).toHaveBeenCalledWith('tkn');
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
      },
    });
  });
 
  it('should handle 500 error', () => {
    authServiceSpy.getToken.and.returnValue(JSON.stringify('fake-token'));
    const httpRequest = new HttpRequest('GET', '/test');
    const httpHandler = {
      handle: () => throwError({ status: 500, message: 'Internal Server Error' }),
    };
 
    interceptor.intercept(httpRequest, httpHandler as HttpHandler).subscribe({
      error: (err) => {
        expect(err.message).toContain('Internal Server Error');
        expect(loggerServiceSpy.errorAlert).toHaveBeenCalledWith('Internal Server Error. Please try again later.');
      },
    });
  });
 
  it('should handle other errors and log them', () => {
    authServiceSpy.getToken.and.returnValue(JSON.stringify('fake-token'));
    const httpRequest = new HttpRequest('GET', '/test');
    const httpHandler = {
      handle: () => throwError({ status: 400, message: 'Bad Request' }),
    };
 
    interceptor.intercept(httpRequest, httpHandler as HttpHandler).subscribe({
      error: (err) => {
        expect(err.message).toContain('Bad Request');
        expect(loggerServiceSpy.errorAlert).toHaveBeenCalledWith('Error Code: 400\nMessage: Bad Request');
      },
    });
  });
});