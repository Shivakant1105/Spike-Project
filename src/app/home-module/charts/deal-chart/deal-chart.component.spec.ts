import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealChartComponent } from './deal-chart.component';

describe('DealChartComponent', () => {
  let component: DealChartComponent;
  let fixture: ComponentFixture<DealChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
