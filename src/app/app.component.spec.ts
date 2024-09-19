import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    // Mock the native element and classList
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

  it(`should have as title 'spike-project'`, () => {
    expect(component.title).toEqual('spike-project');
  });

  it('should render title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('spike-project app is running!');
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
