import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsComponent } from './payments.component';

describe('PaymentsComponent', () => {
  let component: PaymentsComponent;
  let fixture: ComponentFixture<PaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should call dispose on root when ngOnDestroy is called', () => {
    component.root = {
      dispose: jasmine.createSpy('dispose')
    } as any;

    component.ngOnDestroy();
    expect(component.root.dispose).toHaveBeenCalled();
  });


  
});
