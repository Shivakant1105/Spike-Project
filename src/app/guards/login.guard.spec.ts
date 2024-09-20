import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginGuard } from './login.guard';
import { RouterTestingModule } from '@angular/router/testing';
describe('LoginGuard', () => {
  let guard: LoginGuard;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({imports:[HttpClientTestingModule,RouterTestingModule]});
    guard = TestBed.inject(LoginGuard);
    httpMock = TestBed.inject(HttpTestingController);

  });
 
  afterEach(() => {
    httpMock.verify(); 
  });
  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
