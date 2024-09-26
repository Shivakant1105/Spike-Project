import { TestBed } from '@angular/core/testing';
import Swal from 'sweetalert2';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
  });

  it('should call Swal.fire with correct parameters for dark theme', () => {
    const errorMessage = 'An unexpected error occurred.';
    const swalSpy = spyOn(Swal, 'fire');
    localStorage.setItem('theme', 'dark-theme');
    service.errorAlert(errorMessage);
    expect(swalSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'error',
        title: 'Opsss...',
        text: errorMessage,
        background: '#111C2D',
      })
    );
  });

  it('should call Swal.fire with correct parameters for light theme', () => {
    const errorMessage = 'Another error occurred.';
    const swalSpy = spyOn(Swal, 'fire');
    localStorage.setItem('theme', 'light-theme');
    service.errorAlert(errorMessage);
    expect(swalSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'error',
        title: 'Opsss...',
        text: errorMessage,
        background: '#FFFFFF',
      })
    );
  });
  it('should call Swal.fire with correct parameters for dark theme', () => {
    const errorMessage = 'An unexpected error occurred.';
    const swalSpy = spyOn(Swal, 'fire');
    localStorage.setItem('theme', 'dark-theme');
    service.alertWithSuccess(errorMessage);
    expect(swalSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'success',
        title: 'Success...',
        text: errorMessage,
        background: '#111C2D',
      })
    );
  });

  it('should call Swal.fire with correct parameters for light theme', () => {
    const message = 'Another error occurred.';
    const swalSpy = spyOn(Swal, 'fire');
    localStorage.setItem('theme', 'light-theme');
    service.alertWithSuccess(message);
    expect(swalSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'success',
        title: 'Success...',
        text: message,
        background: '#FFFFFF',
      })
    );
  });
});
