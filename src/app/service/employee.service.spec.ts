import { TestBed } from '@angular/core/testing';

import { EmployeeService } from './employee.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { employee } from '../modal/user';
import { environment } from 'src/environments/environment';
import { RouterTestingModule } from '@angular/router/testing';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;
  let baseUrl: string = environment.baseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [EmployeeService],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(EmployeeService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create an employee', () => {
    const mockEmployee: employee = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      designation: 'Software Engineer',
      employeeCode: 'EMP123',
      managerId: 0,
      role: 'Developer',
      primaryMobileNumber: '1234567890',
      joiningDate: '2023-01-01',
      salary: 60000,
      linkedinUrl: 'https://linkedin.com/in/johndoe',
      facebookUrl: 'https://facebook.com/johndoe',
      instagramUrl: 'https://instagram.com/johndoe',
      department: ['Engineering'],
      addresses: [
        {
          line1: '123 Main St',
          state: 'CA',
          zip: '12345',
          city: 'Los Angeles',
          country: 'USA',
          type: 'CURRENT',
        },
      ],
    };

    service.createEmployee(mockEmployee).subscribe((response) => {
      expect(response).toEqual(mockEmployee);
    });

    const req = httpMock.expectOne(`${baseUrl}/user/create`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(mockEmployee);
    req.flush(mockEmployee);
  });

  describe('getAllManagersList', () => {
    it('should return the list of managers', () => {
      const mockManagers = [
        { id: 1, name: 'Manager A' },
        { id: 2, name: 'Manager B' },
      ];

      service.getAllManagersList().subscribe((managers) => {
        expect(managers).toEqual(mockManagers);
      });

      const req = httpMock.expectOne(`${baseUrl}/user/managers`);
      expect(req.request.method).toBe('GET');
      req.flush(mockManagers);
    });
  });

  describe('uploadProfileImage', () => {
    it('should upload profile image and return response', () => {
      const mockFormData = new FormData();
      mockFormData.append(
        'file',
        new Blob(['file content'], { type: 'image/png' }),
        'profile.png'
      );
      const mockId = 1;
      const mockResponse = { success: true };

      service.uploadProfileImage(mockFormData, mockId).subscribe(() => {});

      const req = httpMock.expectOne(`${baseUrl}/user/add/picture/${mockId}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.has('file')).toBeTrue();
      req.flush(mockResponse);
    });
  });

  describe('getAllEmployee', () => {
    it('should return a list of employees', () => {
      const mockEmployees = [
        { id: 1, name: 'Employee A' },
        { id: 2, name: 'Employee B' },
      ];

      const pageNumber = 1;
      const pageSize = 10;

      // Call getAllEmployee with the correct parameters
      service.getAllEmployee(pageSize, pageNumber).subscribe((employees) => {
        expect(employees).toEqual(mockEmployees);
      });

      const req = httpMock.expectOne(
        `${baseUrl}/user/employees?page=${pageNumber}&size=${pageSize}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockEmployees);
    });
  });
});
