import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/service/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

 beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'setDataInLocalStorage']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
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

  it('should call AuthService.login and navigate on successful login', () => {
    const mockToken = 'mock-token';
    authService.login.and.returnValue(of({ data: { token: mockToken } }));
    localStorage.setItem('tkn', mockToken);
    authService.getTokenData.and.returnValue(of({ role:'ADMIN' }));
    component.loginForm.setValue({ username: 'testuser', password: 'password123' });
    component.onSubmit();
    expect(authService.login).toHaveBeenCalledWith(component.loginForm.value);
    expect(router.navigate).toHaveBeenCalledWith(['home/dashboard']);
  });
});
