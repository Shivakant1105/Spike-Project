import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ColDef, GridApi } from 'ag-grid-community';
import {
  address,
  city,
  country,
  departments,
  employee,
  managerList,
  state,
} from 'src/app/modal/user';
import { CommonService } from 'src/app/service/common.service';
import { EmployeeService } from 'src/app/service/employee.service';
import { AuthService } from 'src/app/service/auth.service';
import { LoggerService } from 'src/app/service/logger.service';
import { ButtonRendererComponent } from 'src/app/shared/cell-renderer/button-renderer/button-renderer.component';
import { MultiValRendererComponent } from 'src/app/shared/cell-renderer/multi-val-renderer/multi-val-renderer.component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
  @ViewChild('addEmployeeButton') addEmployeeButton!: ElementRef;
  @ViewChild('myDiv') myDiv!: ElementRef; // Reference to the div

  constructor(
    public fb: FormBuilder,
    private commonService: CommonService,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private loggerService: LoggerService
  ) {}

  formBuilder: any;
  userRole!: any;
  base64String!: string;
  data!: string;
  image: any;
  editMode: boolean = false;

  allDepartments: departments[] = [];
  countryList: country[] = [];
  currentAddressStateList: state[] = [];
  permanentAddressStateList: state[] = [];
  currentAddressCityList: city[] = [];
  permanentAddressCityList: city[] = [];
  departmentToggle: boolean = false;
  managerList: managerList[] = [];
  employeeList: any[] = [];
  gridOptions: any;
  pageSize: number = 10;
  pageNumber: number = 0;
  totalPage: number = 0;
  totalEmployees: number = 0;
  lastPage: number = 0;
  employeeId!: number;
  gridApi!: GridApi;
  searchValue!: string;

  colDefs: ColDef[] = [
    {
      headerName: 'Id',
      field: 'id',
      autoHeight: true,
      cellClass: 'd-flex',
      maxWidth: 100,
    },
    {
      headerName: 'Name',
      cellRenderer: MultiValRendererComponent,
      autoHeight: true,
    },
    {
      headerName: 'Email',
      field: 'email',
      autoHeight: true,
      cellClass: 'd-flex',
      maxWidth: 200,
    },
    {
      headerName: 'Mobile',
      field: 'primaryMobileNumber',
      autoHeight: true,
      cellClass: 'd-flex',
      maxWidth: 150,
    },
    {
      headerName: 'Joining Date',
      field: 'joiningDate',
      autoHeight: true,
      cellClass: 'd-flex',
      maxWidth: 100,
      valueFormatter: (params) => {
        let date = new Date(params.data.joiningDate);
        return date.toLocaleDateString();
      },
    },
    {
      headerName: 'Salary',
      field: 'salary',
      autoHeight: true,
      cellClass: 'd-flex',
      maxWidth: 150,
    },
    {
      headerName: 'Designation',
      field: 'designation',
      autoHeight: true,
      cellClass: 'd-flex wrap',
      maxWidth: 150,
    },
    {
      headerName: 'Action',
      cellRenderer: ButtonRendererComponent,
      cellClass: 'd-flex',
      maxWidth: 100,
    },
  ];

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

    this.employeeService.getAllManagersList().subscribe({
      next: (res: any) => {
        this.managerList = res;
      },
    });

    this.getAllEmployeeFunc(this.pageSize, this.pageNumber);

    this.gridOptions = {
      context: {
        component: this,
        parentComponent: 'employeeComponent',
      },
    };
  }

  employeeForm = this.fb.group({
    name: ['', Validators.required],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern(
          /[a-zA-Z0-9._-]{1,}@[a-zA-Z0-9.-]{2,}[.]{1}[a-zA-Z]{2,5}/
        ),
      ],
    ],
    designation: ['', Validators.required],
    employeeCode: ['', Validators.required],
    managerId: [null],
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
   * @description This is a hostlistner which will close dropdown.
   * @author Himmat
   * @param {MouseEvent} event
   */
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const clickedInside = this.myDiv.nativeElement.contains(event.target);
    if (this.departmentToggle && !clickedInside) {
      this.departmentToggle = false;
    }
  }

  /**
   * @description This is method to get all employee.
   * @author Himmat
   * @param {number} pageSize
   * @param {number} pageNumber
   */
  getAllEmployeeFunc(pageSize: number, pageNumber: number) {
    this.commonService.showLoader();
    this.employeeService.getAllEmployee(pageSize, pageNumber).subscribe({
      next: (res: any) => {
        this.employeeList = res.data;
        this.totalEmployees = res.totalEmployees;
        this.totalPage = Math.ceil(this.totalEmployees / this.pageSize);
        this.lastPage = Math.floor(this.totalEmployees / this.pageSize);
        this.commonService.hideLoader();
      },
    });
  }

  /**
   * @description This is method to search employee.
   * @author Himmat
   * @param {any} params
   */
  onGridReady(params: any) {
    this.gridApi = params;
  }

  /**
   * @description This is method to search employee.
   * @author Himmat
   */
  onSearchData(): void {
    this.gridApi!.setQuickFilter(this.searchValue);
  }

  /**
   * @description This is method to select perEmployee on a page.
   * @author Himmat
   * @param {Event} event
   */
  pageSizeSelected(event: any) {
    this.pageSize = event.target.value;
    this.getAllEmployeeFunc(this.pageSize, this.pageNumber);
  }

  goFirstPage() {
    this.pageNumber = 0;
    this.getAllEmployeeFunc(this.pageSize, this.pageNumber);
  }

  goLastPage() {
    this.pageNumber = this.lastPage;
    this.getAllEmployeeFunc(this.pageSize, this.pageNumber);
  }

  /**
   * @description This is method to go next page in table.
   * @author Himmat
   * @returns {void}
   */
  timeOut: any;
  goNextPage(): void {
    this.pageNumber += 1;

    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      this.commonService.showLoader();
      this.employeeService
        .getAllEmployee(this.pageSize, this.pageNumber)
        .pipe(
          switchMap(() =>
            this.employeeService.getAllEmployee(this.pageSize, this.pageNumber)
          )
        )
        .subscribe({
          next: (res: any) => {
            this.employeeList = res.data;
            this.totalEmployees = res.totalEmployees;
            this.totalPage = Math.ceil(this.totalEmployees / this.pageSize);
            this.commonService.hideLoader();
          },
        });
    }, 300);
  }

  /**
   * @description This is method to go privious page in table.
   * @author Himmat
   * @returns {void}
   */
  goPreviousPage(): void {
    this.pageNumber -= 1;
    this.commonService.showLoader();
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      this.commonService.showLoader();
      this.employeeService
        .getAllEmployee(this.pageSize, this.pageNumber)
        .pipe(
          switchMap(() =>
            this.employeeService.getAllEmployee(this.pageSize, this.pageNumber)
          )
        )
        .subscribe({
          next: (res: any) => {
            this.employeeList = res.data;
            this.totalEmployees = res.totalEmployees;
            this.totalPage = Math.ceil(this.totalEmployees / this.pageSize);
            this.commonService.hideLoader();
          },
        });
    }, 300);
  }

  /**
   * @description This is method to get input type file value and convert that in formData and assign to image property.
   * @author Himmat
   * @param {Event} event
   * @returns {void}
   */
  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      this.convertFileToBase64(file);
      this.image = new FormData();
      this.image.append('file', file, file.name);
    }
  }

  /**
   * @description This is method to convert file into base64.
   * @author Himmat
   * @param {File} file
   * @returns {void}
   */
  convertFileToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      const base64 = base64String.split(',')[1];
      this.base64String = base64;
      this.data = base64String;
    };

    reader.readAsDataURL(file);
  }

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
   * @description This method is responsible for deleting single employee based on id and update table.
   * @author Himmat
   * @param {number} id
   * @returns {void}
   */
  deleteEmployee(id: number) {
    this.commonService.showLoader();
    this.employeeService.deleteEmployee(id).subscribe({
      next: (res: any) => {
        this.loggerService.alertWithSuccess(res.message);
        this.getAllEmployeeFunc(this.pageSize, this.pageNumber);
      },
    });
  }

  /**
   * @description This method is responsible for open form.
   * @author Himmat
   * @returns {void}
   */
  openAddEmployeeModal(): void {
    const button: HTMLButtonElement = this.addEmployeeButton.nativeElement;
    button.click();
  }

  /**
   * @description This method is responsible for edit single employee based on id.
   * @author Himmat
   * @param {number} id
   * @returns {void}
   */
  editEmployee(id: number) {
    this.openAddEmployeeModal();
    this.editMode = true;
    this.employeeId = id;

    this.commonService.getUserById(id).subscribe({
      next: (res: any) => {
        let data = res.data;
        let manager = this.managerList.filter(
          (val) => val.id == data.managerId
        );

        this.employeeForm.patchValue({
          name: data.name,
          email: data.email,
          designation: data.designation,
          employeeCode: data.employeeCode,
          managerId: manager.length > 0 ? manager[0].id : null,
          role: data.role,
          primaryMobileNumber: data.primaryMobileNumber,
          joiningDate: data.joiningDate,
          salary: data.salary,
        });

        data.department.map((val: departments) => {
          this.department.push(new FormControl(val.name));
        });

        data.addresses.map((val: address) => {
          if (val.type == 'CURRENT') {
            if (val.country !== '') {
              this.commonService.getState(val.country).subscribe({
                next: (res: state[]) => {
                  this.currentAddressStateList = res;
                },
              });
            }

            if (val.state !== '') {
              this.commonService.getCity(val.state).subscribe({
                next: (res: city[]) => {
                  this.currentAddressCityList = res;
                },
              });
            }

            this.currentAddress.patchValue({
              line1: val.line1,
              state: val.state,
              zip: val.zip,
              city: val.city,
              country: val.country,
              type: val.type,
            });
          } else {
            if (val.country !== '') {
              this.commonService.getState(val.country).subscribe({
                next: (res: state[]) => {
                  this.permanentAddressStateList = res;
                },
              });
            }

            if (val.state !== '') {
              this.commonService.getCity(val.state).subscribe({
                next: (res: city[]) => {
                  this.permanentAddressCityList = res;
                },
              });
            }

            this.permanentAddress.patchValue({
              line1: val.line1,
              state: val.state,
              zip: val.zip,
              city: val.city,
              country: val.country,
              type: val.type,
            });
          }
        });
      },
    });
  }

  /**
   * @description This method will clear form on opening if value is there.
   * @author Himmat
   * @returns {void}
   */
  formOpen() {
    this.editMode = false;
    this.reset();
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
      managerId: formData.managerId ? formData.managerId : null,
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

    if (!this.editMode) {
      this.commonService.showLoader();
      this.employeeService.createEmployee(data).subscribe({
        next: (res: any) => {
          this.commonService.hideLoader();
          this.loggerService.alertWithSuccess(res.message);

          //checking if image is there
          if (this.data) {
            this.employeeService
              .uploadProfileImage(this.image, res.data.id)
              .subscribe({
                next: () => {
                  this.getAllEmployeeFunc(this.pageSize, this.pageNumber);
                },
              });
          } else {
            this.getAllEmployeeFunc(this.pageSize, this.pageNumber);
          }
        },
      });
    } else {
      this.employeeService.editEmployee(this.employeeId, data).subscribe({
        next: () => {},
      });
    }
    this.editMode = false;
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

  /**
   * @description This is a trackBy Method to track looping.
   * @author Himmat
   * @return {number}
   */

  trackById(value: any) {
    return value.id;
  }
}
