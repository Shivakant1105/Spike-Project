export interface login {
  username: string;
  password: string;
}

export interface departments {
  id: number;
  name: string;
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

export interface managerList {
  id: number;
  name: string;
}
