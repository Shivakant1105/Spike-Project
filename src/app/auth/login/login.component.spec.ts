import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/service/auth.service';
import { HttpClientModule } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'login',
      'setDataInLocalStorage',
      'getTokenData',
      'logout',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule],
      declarations: [LoginComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should call AuthService.login and navigate to dashboard on successful ADMIN login', () => {
    const mockToken = 'mock-token';
    authService.login.and.returnValue(of({ data: { token: mockToken } }));
    authService.getTokenData.and.returnValue(of({ role: 'ADMIN' })); // Simulate ADMIN role
    component.loginForm.setValue({
      username: 'testuser',
      password: 'password123',
    });
    authService.getTokenData.and.returnValue({ role: 'ADMIN' });
    component.onSubmit();
    expect(authService.login).toHaveBeenCalledWith(component.loginForm.value);
    expect(authService.setDataInLocalStorage).toHaveBeenCalledWith(
      'tkn',
      JSON.stringify(mockToken)
    );
  });

  it('should navigate to courses on successful non-ADMIN login', () => {
    const mockToken = 'mock-token';
    authService.login.and.returnValue(of({ data: { token: mockToken } }));
    authService.getTokenData.and.returnValue(of({ role: 'USER' })); // Simulate USER role
    component.loginForm.setValue({
      username: 'testuser',
      password: 'password123',
    });
    component.onSubmit();
    expect(authService.login).toHaveBeenCalledWith(component.loginForm.value);
    expect(router.navigate).toHaveBeenCalledWith(['menu/course']);
  });
});
