import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';
import { of } from 'rxjs';
 
describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
 
  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['clearStorageByKey']);
    const commonServiceMock = jasmine.createSpyObj('CommonService', ['sideBarTogglebtn'], {
      sideBarTogglebtn: of(false), // default value for sidebar toggle
    });
    const routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);
 
    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: CommonService, useValue: commonServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();
 
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });
 
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

 
  it('should call logout and navigate to login page', () => {
    component.logout();
    expect(authServiceSpy.clearStorageByKey).toHaveBeenCalledWith('tkn');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/auth/login');
  });

  it('should call identify function and return index', () => {
    const index = component.identify(5);
    expect(index).toBe(5);
  });
 
  it('should unsubscribe from common service on destroy', () => {
    spyOn(component.unSub, 'next');
    spyOn(component.unSub, 'complete');
 
    component.ngOnDestroy();
 
    expect(component.unSub.next).toHaveBeenCalledWith(null);
    expect(component.unSub.complete).toHaveBeenCalled();
  });
});