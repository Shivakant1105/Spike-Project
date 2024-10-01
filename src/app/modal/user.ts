export interface login {
  username: string;
  password: string;
}

export interface departments {
  id: number;
  name: string;
  createdAt?: string | null;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
}

export interface country {
  id: number;
  name: string;
}

export interface state {
  name: string;
  countryName: string;
}

export interface city {
  name: string;
  stateName: string;
}

export interface address {
  line1: string;
  state: string;
  zip: string;
  city: string;
  country: string;
  type: string;
}

export interface employee {
  name: string;
  email: string;
  designation: string;
  employeeCode: string;
  managerId: number;
  role: string;
  primaryMobileNumber: string;
  joiningDate: string;
  salary: number;
  linkedinUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  department: string[];
  addresses: address[];
}

export interface user {
  username: string;
  name: string;
  backupEmail: string | null;
  email: string;
  role: string;
  primaryMobileNumber: string;
  secondaryMobileNumber: string;
  addresses: address[];
}
export interface managerList {
  id: number;
  name: string;
}

export interface CreateTask {
  departmentId: number;
  title: string;
  content: string;
}

export interface ITask {
  id: string;
  userName: string;
  departmentId: number;
  departmentName: string;
  title: string;
  taskDes: string;
  status: string;
  createdAt: string;
  createdBy: string;
  lastModifiedDate: any;
  lastModifiedBy: any;
}
