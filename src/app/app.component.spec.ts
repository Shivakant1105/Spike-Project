import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockRouter: any;
  let mockRouterEvents: Subject<any>;

  beforeEach(async () => {
    mockRouterEvents = new Subject<any>();

    mockRouter = {
      events: mockRouterEvents.asObservable(),
    };
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,SharedModule],
      declarations: [AppComponent],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    component.themeElem = {
      nativeElement: {
        classList: {
          contains: jasmine.createSpy('contains').and.returnValue(false),
          replace: jasmine.createSpy('replace'),
          add: jasmine.createSpy('add'),
        },
      },
    } as any;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set isLogIn to true when URL is /auth/login', () => {
    mockRouterEvents.next(new NavigationEnd(1, '/auth/login', '/auth/login'));
    expect(component.isLogIn).toBeTrue();
  });

  it('should set isLogIn to false when URL is not /auth/login', () => {
    mockRouterEvents.next(new NavigationEnd(1, '/home', '/home'));
    expect(component.isLogIn).toBeFalse();
  });
  
  it(`should have as title 'spike-project'`, () => {
    expect(component.title).toEqual('spike-project');
  });

  it('should set light theme if no theme in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');

    component.ngAfterViewInit();
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light-theme');
  });

  it('should apply existing theme from localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('dark-theme');
    spyOn(localStorage, 'setItem');
    component.ngAfterViewInit();
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  });

  it('should toggle theme to light-theme when dark-theme is active', () => {
    component.themeElem.nativeElement.classList.contains.and.returnValue(true); // Simulate dark-theme
    component.toggleTheme();
    expect(localStorage.getItem('theme')).toEqual('light-theme');
  });

  it('should toggle theme to dark-theme when light-theme is active', () => {
    component.themeElem.nativeElement.classList.contains.and.returnValue(false); // Simulate light-theme
    component.toggleTheme();
    expect(localStorage.getItem('theme')).toEqual('dark-theme');
  });
});
