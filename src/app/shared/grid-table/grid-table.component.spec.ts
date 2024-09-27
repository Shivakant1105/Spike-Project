import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridTableComponent } from './grid-table.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonService } from 'src/app/service/common.service';

describe('GridTableComponent', () => {
  let component: GridTableComponent;
  let fixture: ComponentFixture<GridTableComponent>;
  let commonService: CommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GridTableComponent],
      imports: [HttpClientModule],
      providers: [{ provide: CommonService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridTableComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();

    commonService = TestBed.inject(CommonService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set themeClass to ag-theme-alpine for light-theme', () => {
    // Emit 'light-theme'
    commonService.toggleTheme.next('light-theme');
    expect(component.themeClass).toBe('ag-theme-alpine');
  });

  it('should set themeClass to ag-theme-alpine-dark for dark-theme', () => {
    // Emit 'dark-theme'
    commonService.toggleTheme.next('dark-theme');
    expect(component.themeClass).toBe('ag-theme-alpine-dark');
  });
});
