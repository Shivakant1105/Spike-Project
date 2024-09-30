import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { city, country, departments, state, user } from 'src/app/modal/user';
import { AuthService } from 'src/app/service/auth.service';
// import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { LoggerService } from 'src/app/service/logger.service';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.scss'],
})
export class AccountSettingComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  userDetailForm!: FormGroup;
  profilePicture!: string;
  userId!: number;
  department: departments[] = [];
  country: country[] = [];
  permanentStates: state[] = [];
  temporaryStates: state[] = [];
  permanentCity: city[] = [];
  temporaryCity: city[] = [];
  username!: string;
  constructor(
    public fb: FormBuilder,
    private commonService: CommonService,
    private loggerService: LoggerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.customValidator }
    );

    this.userDetailForm = this.fb.group({
      username: [null],
      name: [null],
      email: [null],
      designation: [null],
      role: [null],
      department: [null],
      primaryMobileNumber: [null],
      secondaryMobileNumber: [null],
      joining_date: [null],
      salary: [null],
      project: [null],
      permanent_address: [null],
      permanent_state: [null],
      permanent_country: [null],
      permanent_city: [null],
      permanent_zip: [null],
      temperory_address: [null],
      temperory_state: [null],
      temperory_country: [null],
      temperory_city: [null],
      temperory_zip: [null],
    });
    this.userId = this.authService.getTokenData().id;
    this.username = this.authService.getTokenData().sub;
    this.commonService.getUserById(this.userId).subscribe((res: any) => {
      this.patchFormValues(res.data);
    });
    this.getAllDepartment();
    this.getCountry();
    this.userDetailForm.get('temperory_state')?.disable();
    this.userDetailForm.get('permanent_state')?.disable();
    this.userDetailForm
      .get('permanent_country')
      ?.valueChanges.subscribe((countryName) => {
        if (countryName) {
          this.permanentStates = [];
          this.userDetailForm.get('permanent_state')?.enable();

          this.getState(countryName, 'permanent');
        } else {
          this.userDetailForm.get('permanent_state')?.disable();
        }
      });
    this.userDetailForm
      .get('temperory_country')
      ?.valueChanges.subscribe((countryName) => {
        if (countryName) {
          this.temporaryStates = [];
          this.userDetailForm.get('temperory_state')?.enable();
          this.getState(countryName, 'temporary');
        } else {
          this.userDetailForm.get('temperory_state')?.disable();
        }
      });

    this.userDetailForm.get('permanent_city')?.disable();
    this.userDetailForm.get('temperory_city')?.disable();
    this.userDetailForm
      .get('permanent_state')
      ?.valueChanges.subscribe((stateName) => {
        if (stateName) {
          this.permanentCity = [];
          this.userDetailForm.get('permanent_city')?.enable();
          this.getCity(stateName, 'permanent');
        } else {
          this.userDetailForm.get('permanent_city')?.disable();
        }
      });
    this.userDetailForm
      .get('temperory_state')
      ?.valueChanges.subscribe((stateName) => {
        if (stateName) {
          this.permanentCity = [];
          this.userDetailForm.get('temperory_city')?.enable();
          this.getCity(stateName, 'temporary');
        } else {
          this.userDetailForm.get('temperory_city')?.disable();
        }
      });
    this.getDepartmentById();
    const savedForm = localStorage.getItem('userDetailForm');
    if (savedForm) {
      this.userDetailForm.patchValue(JSON.parse(savedForm));
    }
  }

  /**
   * @description Handles password reset by validating the form, checking for mismatching passwords, and making a reset request.
   * @author Abhilasha Singh
   * @returns {void}
   */

  save(): void {
    Object.values(this.resetPasswordForm.controls).forEach((control) => {
      control.markAsTouched();
    });
    if (this.resetPasswordForm.valid) {
      const { oldPassword, newPassword } = this.resetPasswordForm.value;
      this.commonService
        .resetPassword(oldPassword, newPassword)
        .subscribe((res: any) => {
          this.loggerService.alertWithSuccess(res.data);
          this.authService.logout();
        });
    }
  }

  /**
   * @description Custom validator that checks if the new password and confirm password fields match, and ensures the new password is not the same as the old password.
   * This validator returns errors for the following conditions:
   * - `sameAsOldPassword`: The new password cannot be the same as the old password.
   * - `passwordsMismatch`: The new password and confirm password must match.
   *  @author Abhilasha Singh
   * @param {FormGroup} formGroup - The form group containing the password fields.
   * @returns {{ [key: string]: any } | null} - Returns an object with validation errors if the conditions are not met, otherwise returns null.
   */

  customValidator(formGroup: FormGroup): { [key: string]: any } | null {
    const newPassword = formGroup.get('newPassword')!.value;
    const confirmPassword = formGroup.get('confirmPassword')!.value;
    const oldPassword = formGroup.get('oldPassword')!.value;
    const errors: { [key: string]: any } = {};
    if (oldPassword === newPassword && oldPassword) {
      errors['sameAsOldPassword'] = true;
    }

    if (newPassword != confirmPassword && confirmPassword) {
      errors['passwordsMismatch'] = true;
    }
    return Object.keys(errors).length > 0 ? errors : null;
  }
  /**
   * @description This method patches form values with user details. It sets the address fields based on the type of address (CURRENT or PERMANENT)
   * and also patches other fields such as name, email, designation, role, and salary.
   * @author Abhilasha Singh
   * @param {any} data - The data object containing user details including name, addresses, and other personal information.
   * @returns {void} - No return value.
   */
  patchFormValues(data: any): void {
    if (data.addresses && data.addresses.length > 0) {
      data.addresses.forEach((address: any) => {
        if (address.type === 'CURRENT') {
          this.userDetailForm.patchValue({
            temperory_address: address.line1 || '',
            temperory_country: address.country || '',
            temperory_state: address.state || '',
            temperory_city: address.city || '',
            temperory_zip: address.zip || '',
          });
        }
        if (address.type === 'PERMANENT') {
          this.userDetailForm.patchValue({
            permanent_address: address.line1 || '',
            permanent_country: address.country || '',
            permanent_state: address.state || '',
            permanent_city: address.city || '',
            permanent_zip: address.zip || '',
          });
        }
      });
    }
    this.userDetailForm.patchValue({
      name: data.name,
      email: data.email,
      designation: data.designation,
      role: data.role,
      department:
        data.department && data.department.length > 0
          ? data.department[0].name
          : '', // Check if department exists
      primaryMobileNumber: data.primaryMobileNumber,
      joining_date: data.joiningDate
        ? new Date(data.joiningDate).toISOString().substring(0, 10)
        : '',
      salary: data.salary,
    });
  }

  /**
   * @description Fetches all department details from the backend and updates the local department variable with the response data.
   * This method calls the `getAllDepartments` method from `commonService` and subscribes to the observable to handle the API response.
   * @author Abhilasha Singh
   * @returns {void} - No return value.
   */
  getAllDepartment() {
    this.commonService.getAllDepartments().subscribe((res: any) => {
      this.department = res.data;
    });
  }

  /**
   * @description Fetches the list of countries from the backend and updates the local `country` variable with the response data.
   * This method calls the `getCountry` method from `commonService` and subscribes to the observable to handle the API response.
   * @author Abhilasha Singh
   * @returns {void} - No return value.
   */

  getCountry() {
    this.commonService.getCountry().subscribe((res: any) => {
      this.country = res;
    });
  }

  /**
   * @description This method calls the `getState` method from `commonService` and subscribes to the observable to handle the API response.
   * @author Abhilasha Singh
   * @param {string} countryName - The name of the country for which the states need to be fetched.
   * @param {'permanent' | 'temporary'} addressType - Specifies whether the states should be assigned to the 'permanent' or 'temporary' address.
   * @returns {void} - No return value.
   */
  getState(countryName: string, addressType: 'permanent' | 'temporary'): void {
    this.commonService.getState(countryName).subscribe((res: any) => {
      if (addressType === 'permanent') {
        this.permanentStates = res;
      } else if (addressType === 'temporary') {
        this.temporaryStates = res;
      }
    });
  }

  /**
   * @description This method calls the `getCity` method from `commonService` and subscribes to the observable to handle the API response.
   * @author Abhilasha Singh
   * @param {string} stateName - The name of the state for which the cities need to be fetched.
   * @param {'permanent' | 'temporary'} addressType - Specifies whether the cities should be assigned to the 'permanent' or 'temporary' address.
   * @returns {void} - No return value.
   */
  getCity(stateName: string, addressType: 'permanent' | 'temporary'): void {
    this.commonService.getCity(stateName).subscribe((res: any) => {
      if (addressType === 'permanent') {
        this.permanentCity = res;
      } else if (addressType === 'temporary') {
        this.temporaryCity = res;
      }
    });
  }

  /**
   * @description Fetches the department details based on the user ID if the user role is either 'EMPLOYEE' or 'MANAGER'.
   * This method calls the `getDepartmentById` method from `commonService` using the user ID extracted from the token.
   * It subscribes to the observable to handle the API response and updates the `department` variable with the returned data.
   * @author Abhilasha Singh
   * @returns {void} - No return value.
   */
  getDepartmentById() {
    const userData = this.authService.getTokenData();
    if (userData.role === 'EMPLOYEE' || userData.role === 'MANAGER') {
      this.commonService
        .getDepartmentById(userData.id)
        .subscribe((res: any) => {
          this.department = res.data;
        });
    }
  }

  /**
   * @description Updates the user details by submitting the form data to the backend. If the form is valid,
   * it constructs a `user` object with the necessary details, including addresses (permanent and temporary),
   * and calls the `updateUserDetail` method from `commonService`. The response is logged, and a success alert is displayed.
   * The form data is also stored in local storage for future reference.
   * @author Abhilasha Singh
   * @returns {void} - No return value.
   */
  updateUserDetails(): void {
    if (this.userDetailForm.valid) {
      const userData: user = {
        username: this.userDetailForm.value.username,
        name: this.userDetailForm.value.name,
        backupEmail: null,
        email: this.userDetailForm.value.email,
        primaryMobileNumber: this.userDetailForm.value.primaryMobileNumber,
        secondaryMobileNumber: this.userDetailForm.value.secondaryMobileNumber,
        role: this.userDetailForm.value.role,
        addresses: [
          {
            line1: this.userDetailForm.value.permanent_address,
            state: this.userDetailForm.value.permanent_state,
            zip: this.userDetailForm.value.permanent_zip,
            city: this.userDetailForm.value.permanent_city,
            country: this.userDetailForm.value.permanent_country,
            type: 'PERMANENT',
          },
          {
            line1: this.userDetailForm.value.temperory_address,
            state: this.userDetailForm.value.temperory_state,
            zip: this.userDetailForm.value.temperory_zip,
            city: this.userDetailForm.value.temperory_city,
            country: this.userDetailForm.value.temperory_country,
            type: 'CURRENT',
          },
        ],
      };
      localStorage.setItem(
        'userDetailForm',
        JSON.stringify(this.userDetailForm.value)
      );

      this.commonService
        .updateUserDetail(this.userId, userData)
        .subscribe((res: any) => {
          this.loggerService.alertWithSuccess(res.message);
        });
    }
  }

  trackById(id: number): number {
    return id;
  }
}
