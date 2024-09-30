import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonRendererComponent } from './button-renderer.component';
import { HttpClientModule } from '@angular/common/http';
import { ICellRendererParams } from 'ag-grid-community';

describe('ButtonRendererComponent', () => {
  let component: ButtonRendererComponent;
  let fixture: ComponentFixture<ButtonRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonRendererComponent],
      imports: [HttpClientModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize params in agInit', () => {
    const params: ICellRendererParams = { data: { id: 1 }, context: {} } as any;

    component.agInit(params);

    expect(component.params).toBe(params);
  });

  it('should refresh params and return true', () => {
    const params: ICellRendererParams = { data: { id: 2 }, context: {} } as any;

    const result = component.refresh(params);

    expect(component.params).toBe(params);
    expect(result).toBeTrue();
  });

  it('should call deleteEmployee with the correct id in deleteData', () => {
    const mockDeleteEmployee = jasmine.createSpy('deleteEmployee');
    const mockData = { id: 3 };
    const mockContext = { component: { deleteEmployee: mockDeleteEmployee } };
    const params: ICellRendererParams = {
      data: mockData,
      context: mockContext,
    } as any;

    component.agInit(params);
    component.deleteData();
    expect(mockDeleteEmployee).toHaveBeenCalledWith(3);
    component.deleteData();
  });

  it('should call editEmployee with the correct id in edit', () => {
    const mockEditEmployee = jasmine.createSpy('editEmployee');
    const mockData = { id: 3 };
    const mockContext = { component: { editEmployee: mockEditEmployee } };
    const params: ICellRendererParams = {
      data: mockData,
      context: mockContext,
    } as any;

    component.agInit(params);
    component.editData();
    expect(mockEditEmployee).toHaveBeenCalledWith(3);
    component.editData();
  });
});
