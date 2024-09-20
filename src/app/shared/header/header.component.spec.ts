import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let commonService: jasmine.SpyObj<CommonService>;
  // let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const commonServiceSpy = jasmine.createSpyObj('CommonService', [
      'setSideBarToggleBtn',
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'clearStorageByKey',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    commonService = TestBed.inject(
      CommonService
    ) as jasmine.SpyObj<CommonService>;
    // authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should toggle the value and call setSideBarToggleBtn', () => {
    component.toggle = false;
    component.toggleFn();
    expect(component.toggle).toBeTrue();
    expect(commonService.setSideBarToggleBtn).toHaveBeenCalledWith(true);

    component.toggleFn();

    expect(component.toggle).toBeFalse();
  });

  it('should clear storage and navigate to login on logout', () => {
    component.logout();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/auth/login');
  });
});
