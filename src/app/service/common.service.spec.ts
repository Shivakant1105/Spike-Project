import { TestBed } from '@angular/core/testing';

import { CommonService } from './common.service';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';

describe('CommonService', () => {
  let service: CommonService;
  let httpMock: HttpTestingController;
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
    const mockResponse = { success: true, message: 'Password reset successfully' };
 
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
});
