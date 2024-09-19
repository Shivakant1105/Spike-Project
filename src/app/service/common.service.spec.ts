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

  it('should reset password successfully', () => {
    const oldPassword = 'oldPass123';
    const newPassword = 'newPass123';
    const mockResponse = { success: true };

    service.resetPassword(oldPassword, newPassword).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
  });
});
