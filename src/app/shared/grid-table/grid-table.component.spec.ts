import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridTableComponent } from './grid-table.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonService } from 'src/app/service/common.service';

fdescribe('GridTableComponent', () => {
  let component: GridTableComponent;
  let fixture: ComponentFixture<GridTableComponent>;
  let commonService: CommonService;
  let mockApi: any;
  let mockEmitter: jasmine.SpyObj<any>;

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

    commonService = TestBed.inject(CommonService);
    mockEmitter = jasmine.createSpyObj('EventEmitter', ['emit']);
    component.GridReady = mockEmitter; // Replace the emitter in your component

    mockApi = { api: {} };
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

  it('should set gridApi and emit GridReady event', () => {
    component.onGridReady(mockApi);

    expect(component.gridApi).toBe(mockApi.api); // Check if gridApi is set correctly
    expect(mockEmitter.emit).toHaveBeenCalledWith(mockApi.api); // Check if emit was called with the correct value
  });
});
