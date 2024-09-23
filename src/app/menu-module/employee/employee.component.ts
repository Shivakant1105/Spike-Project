import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  city,
  country,
  departments,
  employee,
  state,
} from 'src/app/modal/user';
import { CommonService } from 'src/app/service/common.service';
import { EmployeeService } from 'src/app/service/employee.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    private commonService: CommonService,
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {}

  formBuilder: any;
  userRole!: any;

  allDepartments: departments[] = [];
  countryList: country[] = [];
  currentAddressStateList: state[] = [];
  permanentAddressStateList: state[] = [];
  currentAddressCityList: city[] = [];
  permanentAddressCityList: city[] = [];
  departmentToggle: boolean = false;

  ngOnInit(): void {
    this.commonService.getCountry().subscribe({
      next: (res: country[]) => {
        this.countryList = res;
      },
    });

    this.commonService.getAllDepartments().subscribe({
      next: (res: any) => {
        this.allDepartments = res.data;
      },
    });
    const id = this.authService.getTokenData().id;
    this.commonService.getUserById(id).subscribe({
      next: (user: any) => {
        this.userRole = user.data.role;
      },
    });
  }

  employeeForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    designation: ['', Validators.required],
    employeeCode: ['', Validators.required],
    managerId: ['', Validators.required],
    role: ['', Validators.required],
    primaryMobileNumber: ['', [Validators.required, this.mobileValidator]],
    joiningDate: ['', Validators.required],
    salary: [''],
    linkedinUrl: [''],
    facebookUrl: [''],
    instagramUrl: [''],
    department: this.fb.array([]),
    currentAddress: this.fb.group({
      line1: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      type: ['CURRENT'],
    }),
    permanentAddress: this.fb.group({
      line1: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      type: ['PERMANENT'],
    }),
  });

  /**
   * @description This is custom validator for mobile number.
   * @author Himmat
   * @param {FormControl} control - The employee object.
   * @returns {{ [key: string]: boolean } | null}
   */
  mobileValidator(control: FormControl): { [key: string]: boolean } | null {
    const regex = /^\d{10}$/; // Regex for 10-digit mobile number
    return regex.test(control.value) ? null : { invalidMobile: true };
  }

  /**
   * @description This is method to check error in formcontrolls.
   * @author Himmat
   * @param {string} fieldName
   * @param {string} errorName
   * @returns {boolean | undefined}
   */
  checkError(fieldName: string, errorName: string): boolean | undefined {
    return (
      this.employeeForm.get(fieldName)!.hasError(errorName) &&
      this.employeeForm.get(fieldName)!.touched
    );
  }

  /**
   * @description This is method to check error in formcontrolls in address.
   * @author Himmat
   * @param {string} type
   * @param {string} fieldName
   * @param {string} errorName
   * @returns {boolean | undefined}
   */
  addressErrorCheck(
    type: string,
    fieldName: string,
    errorName: string
  ): boolean | undefined {
    if (type == 'CURRENT') {
      return (
        this.currentAddress.get(fieldName)!.hasError(errorName) &&
        this.currentAddress.get(fieldName)!.touched
      );
    } else {
      return (
        this.permanentAddress.get(fieldName)!.hasError(errorName) &&
        this.permanentAddress.get(fieldName)!.touched
      );
    }
  }

  /**
   * @description This is getter method for current address.
   * @author Himmat
   * @returns {FormGroup}
   */
  get currentAddress(): FormGroup {
    return this.employeeForm.get('currentAddress') as FormGroup;
  }

  /**
   * @description This is getter method for permanent address.
   * @author Himmat
   * @returns {FormGroup}
   */
  get permanentAddress(): FormGroup {
    return this.employeeForm.get('permanentAddress') as FormGroup;
  }

  /**
   * @description This is getter method for department.
   * @author Himmat
   * @returns {FormArray}
   */
  get department(): FormArray {
    return this.employeeForm.get('department') as FormArray;
  }

  /**
   * @description This is method to add formcontroll with value in department formarray.
   * @author Himmat
   * @param {departments} value
   * @returns {void}
   */
  addDepartment(value: departments): void {
    let index = this.department.value.indexOf(value.name);
    if (index < 0) {
      this.department.push(this.fb.control(value.name));
    } else {
      this.department.removeAt(index);
    }
  }

  /**
   * @description This is method to open and close department dropdown.
   * @author Himmat
   * @returns {void}
   */
  openDepartmentDropDown(): void {
    this.departmentToggle = !this.departmentToggle;
  }

  /**
   * @description This method is responsible for state dropdown and its api call.
   * @author Himmat
   * @param {string} addressType
   * @returns {void}
   */
  countrySelect(addressType: string) {
    let currentAddressCountry = this.currentAddress.value.country;
    let permanentAddressCountry = this.permanentAddress.value.country;

    if (addressType == 'PERMANENT') {
      this.permanentAddress.patchValue({
        state: '',
        city: '',
      });
      this.permanentAddressStateList = [];
      this.permanentAddressCityList = [];

      if (permanentAddressCountry !== '') {
        this.commonService.getState(permanentAddressCountry).subscribe({
          next: (res: state[]) => {
            this.permanentAddressStateList = res;
          },
        });
      }
    } else if (addressType == 'CURRENT') {
      this.currentAddress.patchValue({
        state: '',
        city: '',
      });
      this.currentAddressCityList = [];
      this.currentAddressStateList = [];

      if (currentAddressCountry !== '') {
        this.commonService.getState(currentAddressCountry).subscribe({
          next: (res: state[]) => {
            this.currentAddressStateList = res;
          },
        });
      }
    }
  }

  /**
   * @description This method is responsible for city dropdown and its api call.
   * @author Himmat
   * @param {string} addressType
   * @returns {void}
   */
  stateSelected(addressType: string) {
    let currentAddressState = this.currentAddress.value.state;
    let permanentAddressState = this.permanentAddress.value.state;

    if (addressType == 'PERMANENT') {
      this.permanentAddressCityList = [];
      this.permanentAddress.patchValue({
        city: '',
      });

      if (permanentAddressState !== '') {
        this.commonService.getCity(permanentAddressState).subscribe({
          next: (res: city[]) => {
            this.permanentAddressCityList = res;
          },
        });
      }
    } else if (addressType == 'CURRENT') {
      this.currentAddressCityList = [];
      this.currentAddress.patchValue({
        city: '',
      });

      if (currentAddressState !== '') {
        this.commonService.getCity(currentAddressState).subscribe({
          next: (res: city[]) => {
            this.currentAddressCityList = res;
          },
        });
      }
    }
  }

  /**
   * @description This method is responsible for filling the current address field in permanent address.
   * @author Himmat
   * @returns {void}
   */
  fillPermanentAddress() {
    let currAddresVal = this.currentAddress.value;

    this.permanentAddressCityList = this.currentAddressCityList;
    this.permanentAddressStateList = this.currentAddressStateList;

    this.permanentAddress.patchValue({
      line1: currAddresVal.line1,
      state: currAddresVal.state,
      zip: currAddresVal.zip,
      city: currAddresVal.city,
      country: currAddresVal.country,
    });
  }

  /**
   * @description This method is responsible for submiting employeeForm and creating user on backend.
   * @author Himmat
   * @returns {void}
   */
  employeeFormSubmit() {
    let formData = this.employeeForm.value;
    let data = {
      name: formData.name,
      email: formData.email,
      designation: formData.designation,
      employeeCode: formData.employeeCode,
      managerId: formData.managerId,
      role: formData.role,
      primaryMobileNumber: formData.primaryMobileNumber.toString(),
      joiningDate: formData.joiningDate,
      salary: formData.salary,
      linkedinUrl: formData.linkedinUrl,
      facebookUrl: formData.facebookUrl,
      instagramUrl: formData.instagramUrl,
      department: formData.department,
      addresses: [
        { ...formData.currentAddress },
        { ...formData.permanentAddress },
      ],
    } as employee;

    this.employeeService.createEmployee(data).subscribe({
      next: (_res: any) => {},
    });

    this.reset();
  }
  /**
   * @description This method is responsible for reseting the form field value.
   * @author Himmat
   * @returns {void}
   */
  reset() {
    this.employeeForm.reset();
    this.employeeForm.patchValue({
      role: '',
    });
    this.department.clear();
    this.currentAddress.patchValue({
      line1: '',
      state: '',
      zip: '',
      city: '',
      country: '',
      type: 'CURRENT',
    });
    this.permanentAddress.patchValue({
      line1: '',
      state: '',
      zip: '',
      city: '',
      country: '',
      type: 'PERMANENT',
    });
    this.currentAddressCityList = [];
    this.currentAddressStateList = [];
    this.permanentAddressCityList = [];
    this.permanentAddressStateList = [];
  }
}
