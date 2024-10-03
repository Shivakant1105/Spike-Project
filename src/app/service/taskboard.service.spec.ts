import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TaskboardService } from './taskboard.service';
import { CreateTask } from '../modal/user';
import { environment } from 'src/environments/environment';

describe('TaskboardService', () => {
  let service: TaskboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskboardService],
    });

    service = TestBed.inject(TaskboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create a task and return response', () => {
    const taskData: CreateTask = {
      departmentId: 0,
      title: '',
      content: '',
    };
    const mockResponse = {
      success: true,
      message: 'Task created successfully',
    };

    service.createTask(taskData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/taskBoard/create`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse); // Simulate server response
  });

  it('should handle error response', () => {
    const taskData: CreateTask = {
      departmentId: 0,
      title: '',
      content: '',
    };
    const mockErrorResponse = {
      success: false,
      message: 'Error creating task',
    };

    service.createTask(taskData).subscribe(
      () => fail('Expected an error, not tasks'),
      (error) => {
        expect(error.error).toEqual(mockErrorResponse);
      }
    );

    const req = httpMock.expectOne(`${environment.baseUrl}/taskBoard/create`);
    req.flush(mockErrorResponse, { status: 400, statusText: 'Bad Request' }); // Simulate error response
  });
});
