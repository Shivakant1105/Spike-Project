import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsChartComponent } from './products-chart.component';

describe('ProductsChartComponent', () => {
  let component: ProductsChartComponent;
  let fixture: ComponentFixture<ProductsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
