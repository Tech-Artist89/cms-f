import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from './employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly API_URL = 'http://localhost:8000/api/employees';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return of(this.getMockEmployees());
  }

  getEmployee(id: number): Observable<Employee> {
    const employee = this.getMockEmployees().find(emp => emp.id === id);
    if (!employee) {
      throw new Error(`Employee with id ${id} not found`);
    }
    return of(employee);
  }

  createEmployee(employee: CreateEmployeeRequest): Observable<Employee> {
    const newEmployee: Employee = {
      id: Date.now(),
      ...employee,
      isActive: true
    };
    return of(newEmployee);
  }

  updateEmployee(id: number, employee: UpdateEmployeeRequest): Observable<Employee> {
    const existingEmployee = this.getMockEmployees().find(emp => emp.id === id);
    if (!existingEmployee) {
      throw new Error(`Employee with id ${id} not found`);
    }
    
    const updatedEmployee: Employee = {
      ...existingEmployee,
      ...employee
    };
    return of(updatedEmployee);
  }

  deleteEmployee(id: number): Observable<void> {
    return of(void 0);
  }

  private getMockEmployees(): Employee[] {
    return [
      {
        id: 1,
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max.mustermann@cms-mitra.de',
        phone: '+49 123 456789',
        position: 'Heizungstechniker',
        department: 'Heizung',
        hireDate: new Date('2020-03-15'),
        isActive: true,
        address: {
          street: 'Musterstraße 123',
          city: 'Berlin',
          postalCode: '10115',
          country: 'Deutschland'
        },
        skills: ['Heizungsinstallation', 'Wartung', 'Gasanlagen'],
        hourlyRate: 65
      },
      {
        id: 2,
        firstName: 'Anna',
        lastName: 'Schmidt',
        email: 'anna.schmidt@cms-mitra.de',
        phone: '+49 123 456790',
        position: 'Sanitärtechnikerin',
        department: 'Sanitär',
        hireDate: new Date('2019-08-01'),
        isActive: true,
        address: {
          street: 'Beispielweg 456',
          city: 'Hamburg',
          postalCode: '20095',
          country: 'Deutschland'
        },
        skills: ['Rohrleitungsbau', 'Badinstallation', 'Wassertechnik'],
        hourlyRate: 62
      },
      {
        id: 3,
        firstName: 'Tom',
        lastName: 'Weber',
        email: 'tom.weber@cms-mitra.de',
        phone: '+49 123 456791',
        position: 'Klimatechniker',
        department: 'Klima',
        hireDate: new Date('2021-01-10'),
        isActive: true,
        address: {
          street: 'Teststraße 789',
          city: 'München',
          postalCode: '80331',
          country: 'Deutschland'
        },
        skills: ['Klimaanlagen', 'Lüftungstechnik', 'Kältetechnik'],
        hourlyRate: 68
      },
      {
        id: 4,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@cms-mitra.de',
        phone: '+49 123 456792',
        position: 'Projektleiterin',
        department: 'Management',
        hireDate: new Date('2018-05-20'),
        isActive: true,
        address: {
          street: 'Führungsstraße 321',
          city: 'Köln',
          postalCode: '50667',
          country: 'Deutschland'
        },
        skills: ['Projektmanagement', 'Kundenbetreuung', 'Teamführung'],
        hourlyRate: 85
      }
    ];
  }
}