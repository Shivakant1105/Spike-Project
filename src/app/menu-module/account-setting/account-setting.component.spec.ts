import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountSettingComponent } from './account-setting.component';
import { of } from 'rxjs';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
import { LoggerService } from 'src/app/service/logger.service';
import { Router } from '@angular/router';

describe('AccountSettingComponent', () => {
  let component: AccountSettingComponent;
  let fixture: ComponentFixture<AccountSettingComponent>;
  let commonService: jasmine.SpyObj<CommonService>;
  let authService: jasmine.SpyObj<AuthService>;
  let loggerService: jasmine.SpyObj<LoggerService>;
  let route: jasmine.SpyObj<Router>;
  beforeEach(async () => {
    commonService = jasmine.createSpyObj('CommonService', [
      'getAllDepartments',
      'getCountry',
      'getState',
      'getCity',
      'getDepartmentById',
      'updateUserDetail',
      'resetPassword',
      'getUserById',
    ]);
    authService = jasmine.createSpyObj('AuthService', ['getTokenData']);
    loggerService = jasmine.createSpyObj('LoggerService', ['alertWithSuccess']);
    route = jasmine.createSpyObj('Router', ['navigate']);
    component = new AccountSettingComponent(
      new FormBuilder(),
      commonService,
      loggerService,
      authService
    );
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      declarations: [AccountSettingComponent],
      providers: [
        { provide: CommonService, useValue: commonService },
        { provide: AuthService, useValue: authService },
        { provide: LoggerService, useValue: loggerService },
        { provide: Router, useValue: route },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSettingComponent);
    component = fixture.componentInstance;

    // Initialize the resetPasswordForm
    component.resetPasswordForm = new FormGroup({
      oldPassword: new FormControl(''),

      newPassword: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    });
    // Initialize the form with controls
    component.userDetailForm = component.fb.group({
      name: ['John Doe'],
      email: ['john@example.com'],
      primaryMobileNumber: ['1234567890'],
      secondaryMobileNumber: ['0987654321'],
      permanent_address: ['123 Main St'],
      permanent_state: ['California'],
      permanent_zip: ['90210'],
      permanent_city: ['Los Angeles'],
      permanent_country: ['USA'],
      temperory_address: ['456 Secondary St'],
      temperory_state: ['Nevada'],
      temperory_zip: ['89101'],
      temperory_city: ['Las Vegas'],
      temperory_country: ['USA'],
    });
    component.userId = 1;
  });

  beforeEach(() => {
    authService.getTokenData.and.returnValue({ id: 1 });
    commonService.getUserById.and.returnValue(
      of({
        data: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          designation: 'Developer',
          role: 'Employee',
          department: 'IT',
          primaryMobileNumber: '1234567890',
          secondaryMobileNumber: '0987654321',
          joining_date: '2023-01-01',
          salary: 50000,
          project: 'Project X',
          permanent_address: '123 Main St',
          permanent_state: 'California',
          permanent_country: 'USA',
          permanent_city: 'Los Angeles',
          permanent_zip: '90001',
          temperory_address: '456 Elm St',
          temperory_state: 'Nevada',
          temperory_country: 'USA',
          temperory_city: 'Las Vegas',
          temperory_zip: '89044',
        },
      })
    );
    commonService.getAllDepartments.and.returnValue(of([]));
    commonService.getCountry.and.returnValue(of([]));
    commonService.getDepartmentById.and.returnValue(of([]));
  });

  it('should fetch all departments on init', () => {
    const mockDepartments = [
      { id: 1, name: 'HR' },
      { id: 2, name: 'IT' },
    ];
    commonService.getAllDepartments.and.returnValue(
      of({ data: mockDepartments })
    );
    component.getAllDepartment();
    expect(component.department).toEqual(mockDepartments);
    expect(commonService.getAllDepartments).toHaveBeenCalled();
  });

  it('should fetch countries on init', () => {
    const mockCountries = [
      { id: 1, name: 'India' },
      { id: 2, name: 'USA' },
    ];
    commonService.getCountry.and.returnValue(of(mockCountries));
    component.getCountry();
    expect(component.country).toEqual(mockCountries);
    expect(commonService.getCountry).toHaveBeenCalled();
  });

  it('should fetch states for permanent address type', () => {
    const mockStates = [
      { id: 1, name: 'California', countryName: 'USA' },
      { id: 2, name: 'Texas', countryName: 'USA' },
    ];
    commonService.getState.and.returnValue(of(mockStates));
    component.getState('USA', 'permanent');
    expect(component.permanentStates).toEqual(mockStates);
    expect(commonService.getState).toHaveBeenCalledWith('USA');
  });

  it('should fetch states for temporary address type', () => {
    const mockStates = [
      { id: 3, name: 'New York', countryName: 'USA' },
      { id: 4, name: 'Florida', countryName: 'USA' },
    ];
    commonService.getState.and.returnValue(of(mockStates));
    component.getState('Canada', 'temporary');
    expect(component.temporaryStates).toEqual(mockStates);
    expect(commonService.getState).toHaveBeenCalledWith('Canada');
  });

  it('should fetch cities for permanent address type', () => {
    const mockCities = [
      { id: 1, name: 'Los Angeles', stateName: 'California' },
      { id: 2, name: 'San Francisco', stateName: 'California' },
    ];
    commonService.getCity.and.returnValue(of(mockCities));
    component.getCity('California', 'permanent');
    expect(component.permanentCity).toEqual(mockCities);
    expect(commonService.getCity).toHaveBeenCalledWith('California');
  });

  it('should fetch cities for temporary address type', () => {
    const mockCities = [
      { id: 3, name: 'Toronto', stateName: 'Ontario' },
      { id: 4, name: 'Vancouver', stateName: 'British Columbia' },
    ];
    commonService.getCity.and.returnValue(of(mockCities));
    component.getCity('Ontario', 'temporary');
    expect(component.temporaryCity).toEqual(mockCities);
    expect(commonService.getCity).toHaveBeenCalledWith('Ontario');
  });

  it('should fetch department by ID for EMPLOYEE role', () => {
    const mockUserData = { id: 1, role: 'EMPLOYEE' };
    const mockDepartmentResponse = {
      data: [
        { id: 1, name: 'HR' },
        { id: 2, name: 'Finance' },
      ],
    };

    authService.getTokenData.and.returnValue(mockUserData);
    commonService.getDepartmentById.and.returnValue(of(mockDepartmentResponse));
    component.getDepartmentById();
    expect(component.department).toEqual(mockDepartmentResponse.data);
    expect(commonService.getDepartmentById).toHaveBeenCalledWith(
      mockUserData.id
    );
  });

  it('should not call getDepartmentById if role is not EMPLOYEE or MANAGER', () => {
    const mockUserData = { id: 2, role: 'ADMIN' };
    authService.getTokenData.and.returnValue(mockUserData);
    component.getDepartmentById();
    expect(commonService.getDepartmentById).not.toHaveBeenCalled();
  });

  it('should update user details and show success message', () => {
    const mockResponse = { message: 'User details updated successfully' };
    commonService.updateUserDetail.and.returnValue(of(mockResponse));
    component.updateUserDetails();
    const expectedUserData = {
      username: 'johndoe',
      name: 'John Doe',
      email: 'john@example.com',
      backupEmail: 'john123@gmail.com',
      primaryMobileNumber: '1234567890',
      secondaryMobileNumber: '0987654321',
      role: 'ADMIN',
      addresses: [
        {
          line1: '123 Main St',
          state: 'California',
          zip: '90210',
          city: 'Los Angeles',
          country: 'USA',
          type: 'PERMANENT',
        },
        {
          line1: '456 Secondary St',
          state: 'Nevada',
          zip: '89101',
          city: 'Las Vegas',
          country: 'USA',
          type: 'CURRENT',
        },
      ],
    };

    expect(commonService.updateUserDetail).toHaveBeenCalledWith(
      component.userId,
      expectedUserData
    );
    expect(loggerService.alertWithSuccess).toHaveBeenCalledWith(
      mockResponse.message
    );
    const storedUserData = localStorage.getItem('userDetailForm');
    expect(storedUserData).toEqual(
      JSON.stringify(component.userDetailForm.value)
    );
  });

  it('should return a different id when a different id is passed', () => {
    const id1 = 2;
    const id2 = 3;
    expect(component.trackById(id1)).toBe(id1);
    expect(component.trackById(id2)).toBe(id2);
    expect(component.trackById(id1)).not.toBe(id2);
  });

  it('should mark all controls as touched when save is called', () => {
    const controls = component.resetPasswordForm.controls;
    spyOn(controls['oldPassword'], 'markAsTouched');
    spyOn(controls['newPassword'], 'markAsTouched');
    component.save();
    expect(controls['oldPassword'].markAsTouched).toHaveBeenCalled();
    expect(controls['newPassword'].markAsTouched).toHaveBeenCalled();
  });

  it('should call resetPassword and navigate on valid form', () => {
    component.resetPasswordForm.setValue({
      oldPassword: 'oldPass123',
      newPassword: 'newPass123',
      confirmPassword: 'newPassword',
    });
    commonService.resetPassword.and.returnValue(
      of({ data: 'Password reset successful' })
    );
    component.save();
    expect(commonService.resetPassword).toHaveBeenCalledWith(
      'oldPass123',
      'newPass123'
    );
    expect(loggerService.alertWithSuccess).toHaveBeenCalledWith(
      'Password reset successful'
    );
    expect(route.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should not call resetPassword if the form is invalid', () => {
    component.resetPasswordForm.setValue({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    component.save();
    expect(commonService.resetPassword).not.toHaveBeenCalled();
    expect(route.navigate).not.toHaveBeenCalled();
  });
  it('should return an error if newPassword and confirmPassword do not match', () => {
    component.resetPasswordForm.patchValue({
      oldPassword: 'password123',
      newPassword: 'newPassword123',
      confirmPassword: 'differentPassword123',
    });

    const result = component.customValidator(component.resetPasswordForm);
    expect(result).toEqual({ passwordsMismatch: true });
  });

  it('should return an error if newPassword is the same as oldPassword', () => {
    component.resetPasswordForm.patchValue({
      oldPassword: 'password123',
      newPassword: 'password123',
      confirmPassword: 'password123',
    });

    const result = component.customValidator(component.resetPasswordForm);
    expect(result).toEqual({ sameAsOldPassword: true });
  });

  it('should return null if passwords are valid', () => {
    component.resetPasswordForm.patchValue({
      oldPassword: 'password123',
      newPassword: 'newPassword123',
      confirmPassword: 'newPassword123',
    });

    const result = component.customValidator(component.resetPasswordForm);
    expect(result).toBeNull();
  });

  it('should return null if all passwords are empty', () => {
    component.resetPasswordForm.patchValue({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    const result = component.customValidator(component.resetPasswordForm);
    expect(result).toBeNull();
  });

  it('should return null if only confirmPassword is empty', () => {
    component.resetPasswordForm.patchValue({
      oldPassword: 'password123',
      newPassword: 'newPassword123',
      confirmPassword: '',
    });

    const result = component.customValidator(component.resetPasswordForm);
    expect(result).toBeNull();
  });

  it('should patch form values correctly for CURRENT address type', () => {
    const mockData = {
      name: 'John Doe',
      email: 'john@example.com',
      designation: 'Developer',
      role: 'Employee',
      department: [{ name: 'IT' }],
      primaryMobileNumber: '1234567890',
      joiningDate: '2023-01-01',
      salary: 60000,
      addresses: [
        {
          type: 'CURRENT',
          line1: '456 Secondary St',
          country: 'USA',
          state: 'California',
          city: 'Los Angeles',
          zip: '90210',
        },
      ],
    };

    component.patchFormValues(mockData);

    expect(component.userDetailForm.value).toEqual({
      name: 'John Doe',
      email: 'john@example.com',
      primaryMobileNumber: '1234567890',
      secondaryMobileNumber: '0987654321',
      permanent_address: '123 Main St',
      permanent_state: 'California',
      permanent_zip: '90210',
      permanent_city: 'Los Angeles',
      permanent_country: 'USA',
      temperory_address: '456 Secondary St',
      temperory_state: 'California',
      temperory_zip: '90210',
      temperory_city: 'Los Angeles',
      temperory_country: 'USA',
    });
  });

  it('should patch form values correctly for PERMANENT address type', () => {
    const mockData = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      designation: 'Manager',
      role: 'Manager',
      department: [{ name: 'HR' }],
      primaryMobileNumber: '0987654321',
      joiningDate: '2023-02-01',
      salary: 80000,
      addresses: [
        {
          type: 'PERMANENT',
          line1: '789 Permanent Rd',
          country: 'USA',
          state: 'Nevada',
          city: 'Las Vegas',
          zip: '89101',
        },
      ],
    };

    component.patchFormValues(mockData);

    expect(component.userDetailForm.value).toEqual({
      name: 'Jane Smith',
      email: 'jane@example.com',
      primaryMobileNumber: '0987654321',
      secondaryMobileNumber: '0987654321',
      permanent_address: '789 Permanent Rd',
      permanent_state: 'Nevada',
      permanent_zip: '89101',
      permanent_city: 'Las Vegas',
      permanent_country: 'USA',
      temperory_address: '456 Secondary St',
      temperory_state: 'Nevada',
      temperory_zip: '89101',
      temperory_city: 'Las Vegas',
      temperory_country: 'USA',
    });
  });
});
