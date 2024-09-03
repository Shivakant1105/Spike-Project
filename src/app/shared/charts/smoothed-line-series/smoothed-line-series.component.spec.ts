import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmoothedLineSeriesComponent } from './smoothed-line-series.component';

describe('SmoothedLineSeriesComponent', () => {
  let component: SmoothedLineSeriesComponent;
  let fixture: ComponentFixture<SmoothedLineSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmoothedLineSeriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmoothedLineSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
