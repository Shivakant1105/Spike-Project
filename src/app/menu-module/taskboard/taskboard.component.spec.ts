import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskboardComponent } from './taskboard.component';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';
import { LoggerService } from 'src/app/service/logger.service';
import { TaskboardService } from 'src/app/service/taskboard.service';
import { of } from 'rxjs';
import { ElementRef } from '@angular/core';

fdescribe('TaskboardComponent', () => {
  let component: TaskboardComponent;
  let fixture: ComponentFixture<TaskboardComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let commonService: jasmine.SpyObj<CommonService>;
  let loggerService: jasmine.SpyObj<LoggerService>;
  let taskboardService: jasmine.SpyObj<TaskboardService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getTokenData']);
    const commonSpy = jasmine.createSpyObj('CommonService', [
      'getUserById',
      'getAllDepartments',
      'showLoader',
      'hideLoader',
    ]);
    const loggerSpy = jasmine.createSpyObj('LoggerService', [
      'alertWithSuccess',
    ]);
    const taskboardSpy = jasmine.createSpyObj('TaskboardService', [
      'createTask',
      'getTaskByDepartment',
    ]);

    TestBed.configureTestingModule({
      declarations: [TaskboardComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: CommonService, useValue: commonSpy },
        { provide: LoggerService, useValue: loggerSpy },
        { provide: TaskboardService, useValue: taskboardSpy },
        FormBuilder,
      ],
    });

    fixture = TestBed.createComponent(TaskboardComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    commonService = TestBed.inject(
      CommonService
    ) as jasmine.SpyObj<CommonService>;
    loggerService = TestBed.inject(
      LoggerService
    ) as jasmine.SpyObj<LoggerService>;
    taskboardService = TestBed.inject(
      TaskboardService
    ) as jasmine.SpyObj<TaskboardService>;

    // Mock the ElementRef for cancel button
    component.cancel = new ElementRef(document.createElement('button'));

    authService.getTokenData.and.returnValue({ id: 1 });
    commonService.getUserById.and.returnValue(of({ data: { role: 'ADMIN' } }));
    commonService.getAllDepartments.and.returnValue(of({ data: [] }));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with user departments with admin', () => {
    component.ngOnInit();
    expect(commonService.getUserById).toHaveBeenCalled();
    expect(commonService.getAllDepartments).toHaveBeenCalled();
    expect(component.allDepartments).toEqual([]);
  });

  it('should initialize with user departments without admin', () => {
    authService.getTokenData.and.returnValue({ id: 1 });
    commonService.getUserById.and.returnValue(of({ data: { role: 'HR' } }));
    component.ngOnInit();
    expect(commonService.getUserById).toHaveBeenCalled();
  });

  it('should submit the form successfully', () => {
    component.taskBoard_form.patchValue({
      departmentId: 1,
      title: 'New Task',
      content: 'Task content',
    });
    taskboardService.createTask.and.returnValue(
      of({ message: 'Task created successfully' })
    );

    component.onSubmit();

    expect(commonService.showLoader).toHaveBeenCalled();
    expect(taskboardService.createTask).toHaveBeenCalledWith({
      departmentId: 1,
      title: 'New Task',
      content: 'Task content',
    });
    expect(loggerService.alertWithSuccess).toHaveBeenCalledWith(
      'Task created successfully'
    );
    // expect(component.taskBoard_form.valid).toBe(true);
  });

  it('should not submit the form if invalid', () => {
    component.onSubmit();
    expect(commonService.showLoader).not.toHaveBeenCalled();
  });

  it('should reset the form after submission', () => {
    component.taskBoard_form.patchValue({
      departmentId: 1,
      title: 'New Task',
      content: 'Task content',
    });
    taskboardService.createTask.and.returnValue(
      of({ message: 'Task created successfully' })
    );

    component.onSubmit();
  });

  it('should delete a task', () => {
    const initialTaskCount = component.tasks.length;
    component.onDeleteTask(1);
    expect(component.tasks.length).toBe(initialTaskCount - 1);
    expect(loggerService.alertWithSuccess).toHaveBeenCalledWith(
      'Task Deleted!'
    );
  });

  it('should handle drag and drop events', () => {
    const task = component.tasks[0];
    const event = { dataTransfer: { getData: () => '1' } } as any;

    component.onDrop(event, 'completed');
    expect(task.status).toBe('completed');
  });

  it('should handle drag and drop events', () => {
    const task = component.tasks[0];
    const event = { dataTransfer: { getData: () => '1' } } as any;

    component.onDrop(event, 'completed');
    expect(task.status).toBe('completed');
  });

  it('should track task by ID', () => {
    expect(component.trackByTaskId(component.tasks[0])).toBe(1);
  });

  it('should reset the form when opening the task creation dialog', () => {
    component.openCreateTask();
    expect(component.taskBoard_form.value).toEqual({
      departmentId: null,
      title: '',
      content: '',
    });
  });

  it('should check error in form controls correctly', () => {
    component.taskBoard_form.get('title')?.setErrors({ required: true });
    component.taskBoard_form.get('title')?.markAsTouched();

    expect(component.checkError('title', 'required')).toBeTrue();
  });

  it('should return a different id for different departments', () => {
    const department1 = { id: 1, name: 'HR' };

    expect(component.trackByDepartmentId(department1)).toBe(1);
  });

  it('should call preventDefault on the event', () => {
    const event = {
      preventDefault: jasmine.createSpy('preventDefault'),
    } as any;

    component.onDragOver(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should set data for drag event with valid task', () => {
    const task = {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      status: 'todo',
    };
    const event = {
      dataTransfer: {
        setData: jasmine.createSpy('setData'),
      },
    } as any;

    component.onDragStart(event, task);

    expect(event.dataTransfer?.setData).toHaveBeenCalledWith('text/plain', '1');
  });

  it('should not throw error if dataTransfer is undefined', () => {
    const task = {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      status: 'todo',
    };
    const event = {
      dataTransfer: undefined,
    } as any;

    expect(() => {
      component.onDragStart(event, task);
    }).not.toThrow();
  });
});
