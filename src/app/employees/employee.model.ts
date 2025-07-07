export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: Date;
  isActive: boolean;
  address: EmployeeAddress;
  skills: string[];
  hourlyRate?: number;
}

export interface EmployeeAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: Date;
  address: EmployeeAddress;
  skills: string[];
  hourlyRate?: number;
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  isActive?: boolean;
}