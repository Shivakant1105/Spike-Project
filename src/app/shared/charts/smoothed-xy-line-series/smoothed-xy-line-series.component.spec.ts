import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmoothedXYLineSeriesComponent } from './smoothed-xy-line-series.component';

describe('SmoothedXYLineSeriesComponent', () => {
  let component: SmoothedXYLineSeriesComponent;
  let fixture: ComponentFixture<SmoothedXYLineSeriesComponent>;
  let mockRoot: any;
  beforeEach(async () => {
    mockRoot = jasmine.createSpyObj('Root', [
      '_logo',
      'setThemes',
      'numberFormatter',
    ]);
    mockRoot._logo = { dispose: jasmine.createSpy('dispose') };
    mockRoot.setThemes.and.returnValue(undefined);
    mockRoot.numberFormatter = {
      set: jasmine.createSpy('set'),
      format: jasmine.createSpy('format').and.returnValue('formattedValue'),
    };
    await TestBed.configureTestingModule({
      declarations: [SmoothedXYLineSeriesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmoothedXYLineSeriesComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
