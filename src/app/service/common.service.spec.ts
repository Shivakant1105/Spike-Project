import { TestBed } from '@angular/core/testing';

import { CommonService } from './common.service';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('CommonService', () => {
  let service: CommonService;
  let httpMock: HttpTestingController;
  let baseUrl = environment.baseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommonService],
    });

    service = TestBed.inject(CommonService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should have initial sidebar toggle value as false', () => {
    expect(service.sideBarTogglebtn.value).toBeFalse();
  });

  it('should update sidebar toggle value to true', () => {
    service.setSideBarToggleBtn(true);
    expect(service.sideBarTogglebtn.value).toBeTrue();
  });

  it('should update sidebar toggle value to false', () => {
    service.setSideBarToggleBtn(false);
    expect(service.sideBarTogglebtn.value).toBeFalse();
  });

  it('should emit the new value when sidebar toggle is updated', (done: DoneFn) => {
    service.setSideBarToggleBtn(true);
    service.sideBarTogglebtn.asObservable().subscribe((value) => {
      expect(value).toBeTrue();
      done();
    });
  });
  it('should reset password', () => {
    const oldPassword = 'oldPassword123';
    const newPassword = 'newPassword123';
    const mockResponse = {
      success: true,
      message: 'Password reset successfully',
    };

    service.resetPassword(oldPassword, newPassword).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.baseUrl}/user/reset-password`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ oldPassword, newPassword });
    req.flush(mockResponse);
  });
  it('should fetch all contacts', () => {
    const mockContacts = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ];

    service.getAllContacts().subscribe((contacts) => {
      expect(contacts).toEqual(mockContacts);
    });

    const req = httpMock.expectOne(`${service.baseUrl}/user/contacts`);
    expect(req.request.method).toBe('GET');
    req.flush(mockContacts);
  });

  it('should get all department list', () => {
    const mockDepartments = [
      { id: 1, name: 'HR' },
      { id: 2, name: 'Engineering' },
    ];
    service.getAllDepartments().subscribe((departments) => {
      expect(departments).toEqual(mockDepartments);
    });

    const req = httpMock.expectOne(`${baseUrl}/department/dropdown`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockDepartments);
  });

  it('should get all country list', () => {
    const mockCountries = [
      { id: 1, name: 'India' },
      { id: 2, name: 'Oman' },
    ];
    service.getCountry().subscribe((countries) => {
      expect(countries).toEqual(mockCountries);
    });

    const req = httpMock.expectOne(`${baseUrl}/user/countries`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockCountries);
  });

  it('should get all state list based on country', () => {
    const mockState = [
      { name: 'Delhi', countryName: 'India' },
      { name: 'Mumbai', countryName: 'India' },
    ];
    service.getState('India').subscribe((state) => {
      expect(state).toEqual(mockState);
    });

    const req = httpMock.expectOne(
      (req) =>
        req.url === `${baseUrl}/user/states` &&
        req.params.get('countryName') === 'India'
    );
    expect(req.request.method).toEqual('GET');
    req.flush(mockState);
  });

  it('should get all city list based on state', () => {
    const mockCities = [{ name: 'Noida', stateName: 'Uttar pradesh' }];
    service.getCity('Delhi').subscribe((cities) => {
      expect(cities).toEqual(mockCities);
    });

    const req = httpMock.expectOne(
      (req) =>
        req.url === `${baseUrl}/user/cities` &&
        req.params.get('stateName') === 'Delhi'
    );
    expect(req.request.method).toEqual('GET');
    req.flush(mockCities);
  });
  it('should get user by ID', () => {
    const userId = 1;
    const mockUser = { id: userId, name: 'John Doe' };
    service.getUserById(userId).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });
    const req = httpMock.expectOne(`${service.baseUrl}/user/self/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
