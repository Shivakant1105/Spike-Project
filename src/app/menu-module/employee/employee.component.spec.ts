import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { EmployeeComponent } from './employee.component';
import { CommonService } from 'src/app/service/common.service';
import { EmployeeService } from 'src/app/service/employee.service';
import { of } from 'rxjs';
import { city, country, state } from 'src/app/modal/user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from 'src/app/service/auth.service';
import { HttpResponse } from '@angular/common/http';

describe('EmployeeComponent', () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;
  let commonServiceMock: jasmine.SpyObj<CommonService>;
  let employeeService: jasmine.SpyObj<EmployeeService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    commonServiceMock = jasmine.createSpyObj('CommonService', [
      'getCountry',
      'getAllDepartments',
      'getState',
      'getCity',
      'getUserById',
    ]);

    authServiceSpy = jasmine.createSpyObj('AuthService', ['getTokenData']);
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', [
      'createEmployee',
      'getAllManagersList',
      'getAllEmployee',
      'uploadProfileImage',
      'deleteEmployee',
    ]);

    await TestBed.configureTestingModule({
      declarations: [EmployeeComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: CommonService, useValue: commonServiceMock },
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    employeeService = TestBed.inject(
      EmployeeService
    ) as jasmine.SpyObj<EmployeeService>;
  });

  beforeEach(() => {});

  it('should load countries and departments on init', () => {
    const mockCountries: country[] = [
      { id: 1, name: 'Country1' },
      { id: 2, name: 'Country2' },
    ];
    const mockDepartments = {
      data: [
        { id: 1, name: 'Dept1' },
        { id: 2, name: 'Dept2' },
      ],
    };
    const mockUser = { data: { role: 'admin' } };
    const mockUserId = 1;

    const mockManagerList = [
      { id: 1, name: 'Dept1' },
      { id: 2, name: 'Dept2' },
    ];

    const mockEmployeeList = {
      data: [
        {
          id: 47,
          name: 'kfdifkdidf',
          email: 'vivek@gmail.com',
          designation: 'dev.pdfg',
          primaryMobile: '2353254453',
          salary: 2353,
          profilePicture: 'fgsdfg',
        },
        {
          id: 47,
          name: 'ajay',
          email: 'vivek@gmail.com',
          designation: 'devdf.pdfg',
          primaryMobile: '2353204453',
          salary: 23535,
          profilePicture: 'fdgs',
        },
      ],
    };

    authServiceSpy.getTokenData.and.returnValue({ id: mockUserId });
    commonServiceMock.getUserById.and.returnValue(of(mockUser));
    commonServiceMock.getCountry.and.returnValue(of(mockCountries));
    commonServiceMock.getAllDepartments.and.returnValue(of(mockDepartments));
    employeeService.getAllManagersList.and.returnValue(of(mockManagerList));
    employeeService.getAllEmployee.and.returnValue(of(mockEmployeeList));

    component.ngOnInit();

    expect(component.countryList).toEqual(mockCountries);
    expect(component.allDepartments).toEqual(mockDepartments.data);
    expect(component.userRole).toBe('admin');
    expect(component.managerList).toEqual(mockManagerList);
    expect(component.employeeList).toEqual(mockEmployeeList.data);
  });

  it('should validate mobile number', () => {
    const validControl = new FormControl('1234567890');
    const invalidControl = new FormControl('123');

    expect(component.mobileValidator(validControl)).toBeNull();
    expect(component.mobileValidator(invalidControl)).toEqual({
      invalidMobile: true,
    });
  });

  it('should add and remove departments', () => {
    const mockDepartment = { id: 1, name: 'Dept1' };

    component.addDepartment(mockDepartment);
    expect(component.department.length).toBe(1);
    expect(component.department.at(0).value).toBe('Dept1');

    component.addDepartment(mockDepartment);
    expect(component.department.length).toBe(0);
  });

  it('should load states when a country is selected', () => {
    const mockStates: state[] = [
      { name: 'State1', countryName: 'India' },
      { name: 'State2', countryName: 'India' },
    ];
    commonServiceMock.getState.and.returnValue(of(mockStates));

    component.currentAddress.patchValue({ country: 'Country1' });
    component.countrySelect('CURRENT');
    expect(component.currentAddressStateList).toEqual(mockStates);
  });

  it('should return true if the field has the specified error and has been touched', () => {
    component.employeeForm.get('name')?.setValue('');
    component.employeeForm.get('name')?.markAsTouched();
    component.employeeForm.get('name')?.updateValueAndValidity();

    const hasError = component.checkError('name', 'required');
    expect(hasError).toBeTrue();
  });

  it('should return false if the field has not been touched', () => {
    component.employeeForm.get('name')?.setValue('');
    component.employeeForm.get('name')?.updateValueAndValidity();

    const hasError = component.checkError('name', 'required');

    expect(hasError).toBeFalse();
  });

  it('should return false if the field does not have the specified error', () => {
    component.employeeForm.get('email')?.setValue('invalidEmail');
    component.employeeForm.get('email')?.markAsTouched();
    component.employeeForm.get('email')?.updateValueAndValidity();

    const hasError = component.checkError('email', 'email');

    expect(hasError).toBeTrue();
  });

  it('should return true if the current address field has the specified error and has been touched', () => {
    component.currentAddress.get('line1')?.setValue('');
    component.currentAddress.get('line1')?.markAsTouched();
    component.currentAddress.get('line1')?.updateValueAndValidity();

    const hasError = component.addressErrorCheck(
      'CURRENT',
      'line1',
      'required'
    );

    expect(hasError).toBeTrue();
  });

  it('should return false if the current address field has not been touched', () => {
    component.currentAddress.get('line1')?.setValue('');
    component.currentAddress.get('line1')?.updateValueAndValidity();

    const hasError = component.addressErrorCheck(
      'CURRENT',
      'line1',
      'required'
    );

    expect(hasError).toBeFalse();
  });

  it('should return true if the permanent address field has the specified error and has been touched', () => {
    component.permanentAddress.get('zip')?.setValue('');
    component.permanentAddress.get('zip')?.markAsTouched();
    component.permanentAddress.get('zip')?.updateValueAndValidity();

    const hasError = component.addressErrorCheck(
      'PERMANENT',
      'zip',
      'required'
    );

    expect(hasError).toBeTrue();
  });

  it('should return false if the permanent address field does not have the specified error', () => {
    component.permanentAddress.get('state')?.setValue('validState');
    component.permanentAddress.get('state')?.markAsTouched();
    component.permanentAddress.get('state')?.updateValueAndValidity();

    const hasError = component.addressErrorCheck(
      'PERMANENT',
      'state',
      'required'
    );

    expect(hasError).toBeFalse();
  });

  it('should toggle departmentToggle value', () => {
    component.departmentToggle = false;
    component.openDepartmentDropDown();

    expect(component.departmentToggle).toBeTrue();
    component.openDepartmentDropDown();
    expect(component.departmentToggle).toBeFalse();
  });

  it('should reset and load states for the permanent address when a country is selected', () => {
    const mockStates: state[] = [
      { name: 'State1', countryName: 'India' },
      { name: 'State2', countryName: 'India' },
    ];
    commonServiceMock.getState.and.returnValue(of(mockStates));
    component.permanentAddress.patchValue({ country: 'Country1' });

    component.countrySelect('PERMANENT');

    expect(component.permanentAddress.get('state')?.value).toBe('');
    expect(component.permanentAddress.get('city')?.value).toBe('');
    expect(component.permanentAddressStateList).toEqual(mockStates);
  });

  it('should reset and load states for the current address when a country is selected', () => {
    const mockStates: state[] = [
      { name: 'State1', countryName: 'India' },
      { name: 'State2', countryName: 'India' },
    ];
    commonServiceMock.getState.and.returnValue(of(mockStates));
    component.currentAddress.patchValue({ country: 'Country1' });

    component.countrySelect('CURRENT');

    expect(component.currentAddress.get('state')?.value).toBe('');
    expect(component.currentAddress.get('city')?.value).toBe('');
    expect(component.currentAddressStateList).toEqual(mockStates);
  });

  it('should not load states if the country is empty', () => {
    component.permanentAddress.patchValue({ country: '' });

    component.countrySelect('PERMANENT');

    expect(component.permanentAddressStateList).toEqual([]);
  });

  it('should reset and load cities for the permanent address when a state is selected', () => {
    const mockCities: city[] = [
      { name: 'City1', stateName: 'Delhi' },
      { name: 'City2', stateName: 'Delhi' },
    ];
    commonServiceMock.getCity.and.returnValue(of(mockCities));
    component.permanentAddress.patchValue({ state: 'State1' });

    component.stateSelected('PERMANENT');

    expect(component.permanentAddress.get('city')?.value).toBe('');
    expect(component.permanentAddressCityList).toEqual(mockCities);
  });

  it('should reset and load cities for the current address when a state is selected', () => {
    const mockCities = [{ name: 'City1' }, { name: 'City2' }];
    commonServiceMock.getCity.and.returnValue(of(mockCities));
    component.currentAddress.patchValue({ state: 'State1' });

    component.stateSelected('CURRENT');
    expect(component.currentAddress.get('city')?.value).toBe('');
  });

  it('should not load cities if the state is empty for permanent address', () => {
    component.permanentAddress.patchValue({ state: '' });

    component.stateSelected('PERMANENT');
    expect(component.permanentAddressCityList).toEqual([]);
  });

  it('should not load cities if the state is empty for current address', () => {
    component.currentAddress.patchValue({ state: '' });

    component.stateSelected('CURRENT');
    expect(component.currentAddressCityList).toEqual([]);
  });

  it('should fill the permanent address with values from the current address', () => {
    component.currentAddress.patchValue({
      line1: '123 Main St',
      state: 'State1',
      zip: '12345',
      city: 'City1',
      country: 'Country1',
    });
    component.currentAddressCityList = [
      { name: 'City1', stateName: 'Delhi' },
      { name: 'City2', stateName: 'Delhi' },
    ];
    component.currentAddressStateList = [
      { name: 'State1', countryName: 'India' },
      { name: 'State2', countryName: 'India' },
    ];

    component.fillPermanentAddress();

    expect(component.permanentAddress.get('line1')?.value).toBe('123 Main St');
    expect(component.permanentAddress.get('state')?.value).toBe('State1');
    expect(component.permanentAddress.get('zip')?.value).toBe('12345');
    expect(component.permanentAddress.get('city')?.value).toBe('City1');
    expect(component.permanentAddress.get('country')?.value).toBe('Country1');

    expect(component.permanentAddressCityList).toEqual(
      component.currentAddressCityList
    );
    expect(component.permanentAddressStateList).toEqual(
      component.currentAddressStateList
    );
  });

  it('should submit employee form and call createEmployee service', () => {
    component.employeeForm = component.fb.group({
      name: [''],
      email: [''],
      designation: [''],
      employeeCode: [''],
      managerId: [''],
      role: [''],
      primaryMobileNumber: [''],
      joiningDate: [''],
      salary: [''],
      linkedinUrl: [''],
      facebookUrl: [''],
      instagramUrl: [''],
      department: component.fb.array([]),
      currentAddress: component.fb.group({
        line1: [''],
        state: [''],
        zip: [''],
        city: [''],
        country: [''],
        type: ['CURRENT'],
      }),
      permanentAddress: component.fb.group({
        line1: [''],
        state: [''],
        zip: [''],
        city: [''],
        country: [''],
        type: ['PERMANENT'],
      }),
    });

    component.employeeForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      designation: 'Developer',
      employeeCode: 'EMP123',
      managerId: 'MGR001',
      role: 'Admin',
      primaryMobileNumber: '1234567890',
      joiningDate: '2024-01-01',
      salary: 50000,
      linkedinUrl: 'https://linkedin.com/in/johndoe',
      facebookUrl: 'https://facebook.com/johndoe',
      instagramUrl: 'https://instagram.com/johndoe',
      department: [],
      currentAddress: {
        line1: '123 Main St',
        state: 'CA',
        zip: '90001',
        city: 'Los Angeles',
        country: 'USA',
        type: 'CURRENT',
      },
      permanentAddress: {
        line1: '456 Elm St',
        state: 'CA',
        zip: '90001',
        city: 'Los Angeles',
        country: 'USA',
        type: 'CURRENT',
      },
    });

    component.department.push(component.fb.control('Engineering'));
    spyOn(component, 'reset');

    const mockUploadResponse = new HttpResponse({
      status: 200,
      body: { data: { id: 1 } },
    });

    employeeService.createEmployee.and.returnValue(of({ data: { id: 1 } }));
    employeeService.uploadProfileImage.and.returnValue(of(mockUploadResponse));
    component.employeeFormSubmit();
    expect(employeeService.createEmployee).toHaveBeenCalled();
    expect(employeeService.uploadProfileImage).toHaveBeenCalled();
  });

  it('should reset the form', () => {
    component.employeeForm.patchValue({ role: 'EMPLOYEE' });
    component.reset();

    expect(component.employeeForm.value.role).toBe('');
    expect(component.department.length).toBe(0);
  });

  it('should convert file to base64 and append to FormData if file is present', () => {
    const mockFile = new Blob(['file content'], { type: 'image/png' });
    const event = {
      target: {
        files: [new File([mockFile], 'test.png')],
      },
    } as unknown as Event;

    spyOn(component, 'convertFileToBase64').and.callThrough();

    component.onFileChange(event);
    expect(component.image.has('file')).toBeTrue();
    expect(component.image.get('file').name).toBe('test.png');
    expect(component.convertFileToBase64).toHaveBeenCalledWith(
      jasmine.any(File)
    );
  });

  it('should not do anything if no file is selected', () => {
    const event = {
      target: {
        files: null,
      },
    } as unknown as Event;

    spyOn(component, 'convertFileToBase64');

    component.onFileChange(event);

    expect(component.convertFileToBase64).not.toHaveBeenCalled();
    expect(component.image).toBeUndefined();
  });

  it('should go to the next page and fetch employee data', () => {
    const mockResponse = { data: ['Employee1', 'Employee2'] };
    employeeService.getAllEmployee.and.returnValue(of(mockResponse));

    component.goNextPage();

    expect(employeeService.getAllEmployee).toHaveBeenCalledWith(
      component.pageSize,
      component.pageNumber
    );
    expect(component.employeeList).toEqual(mockResponse.data);
  });

  it('should go to the previous page and fetch employee data', () => {
    component.pageNumber = 2; // Start on page 2
    const mockResponse = { data: ['Employee3', 'Employee4'] };
    employeeService.getAllEmployee.and.returnValue(of(mockResponse));

    component.goPreviousPage();

    expect(component.pageNumber).toBe(1);
    expect(employeeService.getAllEmployee).toHaveBeenCalledWith(
      component.pageSize,
      component.pageNumber
    );
    expect(component.employeeList).toEqual(mockResponse.data);
  });

  it('should update pageSize and fetch employees on pageSizeSelected', () => {
    const mockEvent = { target: { value: 20 } };
    const mockResponse = { data: [{ id: 1, name: 'John Doe' }] };

    employeeService.getAllEmployee.and.returnValue(of(mockResponse));

    component.pageSizeSelected(mockEvent);

    expect(component.pageSize).toBe(20);
    expect(employeeService.getAllEmployee).toHaveBeenCalledWith(
      20,
      component.pageNumber
    );
    expect(component.employeeList).toEqual(mockResponse.data);
  });

  it('should delete employee and fetch updated employee list', () => {
    const mockId = 1;
    const mockDeleteResponse = { message: 'Employee deleted successfully' };
    const mockEmployeeListResponse = { data: [{ id: 2, name: 'Jane Doe' }] };

    employeeService.deleteEmployee.and.returnValue(of(mockDeleteResponse));
    employeeService.getAllEmployee.and.returnValue(
      of(mockEmployeeListResponse)
    );

    component.deleteEmployee(mockId);

    expect(employeeService.deleteEmployee).toHaveBeenCalledWith(mockId);
    // expect(loggerService.alertWithSuccess).toHaveBeenCalledWith(
    //   mockDeleteResponse.message
    // );
    expect(employeeService.getAllEmployee).toHaveBeenCalledWith(
      component.pageSize,
      component.pageNumber
    );
    expect(component.employeeList).toEqual(mockEmployeeListResponse.data);
  });

  it('should return the correct contact id', () => {
    const mockData: any = { id: 1, name: 'John Doe' };
    const result = component.trackById(mockData);

    expect(result).toBe(1);
  });
});
