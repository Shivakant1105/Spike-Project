import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../service/auth.service';

class MockAuthService {
  getToken() {
    return 'mockToken';
  }

  getTokenData() {
    return { role: 'admin' };
  }
}

class MockRouter {
  navigateByUrl(url: string) {
    return url;
  }
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });
  it('should allow access if the user has the required role and token', () => {
    const route = new ActivatedRouteSnapshot();
    route.data = { roles: ['admin'] }; // Setting required roles
    spyOn(authService, 'getToken').and.returnValue('mockToken');
    spyOn(authService, 'getTokenData').and.returnValue({ role: 'admin' });
    const result = guard.canActivate(route, {} as RouterStateSnapshot);
    expect(result).toBe(true);
  });
  it('should deny access and redirect if the user does not have the required role', () => {
    const route = new ActivatedRouteSnapshot();
    route.data = { roles: ['admin'] };
    spyOn(authService, 'getToken').and.returnValue('mockToken');
    spyOn(authService, 'getTokenData').and.returnValue({ role: 'user' });
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const result = guard.canActivate(route, {} as RouterStateSnapshot);
    expect(result).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith('/auth/login');
  });

  it('should deny access and redirect to /auth/login if no token is present', () => {
    const route = new ActivatedRouteSnapshot();
    route.data = { roles: ['admin'] };
    spyOn(authService, 'getToken').and.returnValue(null);
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const result = guard.canActivate(route, {} as RouterStateSnapshot);
    expect(result).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith('/auth/login');
  });
});
