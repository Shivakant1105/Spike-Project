import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginGuard } from './login.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../service/auth.service';
 
class MockAuthService {
  getToken() {
    return null; 
  }
}
 
class MockRouter {
  navigateByUrl(url: string) {
    return url;
  }
}
 
describe('LoginGuard', () => {
  let guard: LoginGuard;
  let authService: AuthService;
  let router: Router;
 
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoginGuard,
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter }
      ]
    });
 
    guard = TestBed.inject(LoginGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });
 
  it('should allow access if no token is present', () => {
    spyOn(authService, 'getToken').and.returnValue(null); 
    const result = guard.canActivate(new ActivatedRouteSnapshot(), {} as RouterStateSnapshot);
    expect(result).toBe(true);
  });
 
  it('should redirect to /menu if token is present', () => {
    spyOn(authService, 'getToken').and.returnValue('mockToken'); 
    const navigateSpy = spyOn(router, 'navigateByUrl');
    guard.canActivate(new ActivatedRouteSnapshot(), {} as RouterStateSnapshot);
    expect(navigateSpy).toHaveBeenCalledWith('/menu');
  });
});