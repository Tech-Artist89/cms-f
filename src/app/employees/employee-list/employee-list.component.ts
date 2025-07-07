import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Employee } from '../employee.model';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm: string = '';
  selectedDepartment: string = '';
  selectedStatus: string = '';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
      this.applyFilters();
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  private applyFilters() {
    this.filteredEmployees = this.employees.filter(employee => {
      const matchesSearch = !this.searchTerm || 
        employee.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesDepartment = !this.selectedDepartment || 
        employee.department === this.selectedDepartment;

      const matchesStatus = !this.selectedStatus || 
        (this.selectedStatus === 'active' && employee.isActive) ||
        (this.selectedStatus === 'inactive' && !employee.isActive);

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  getDepartmentBadgeClass(department: string): string {
    const classes = {
      'Heizung': 'bg-danger',
      'Sanitär': 'bg-primary',
      'Klima': 'bg-info',
      'Management': 'bg-success'
    };
    return classes[department as keyof typeof classes] || 'bg-secondary';
  }

  deleteEmployee(employee: Employee) {
    if (confirm(`Möchten Sie den Mitarbeiter ${employee.firstName} ${employee.lastName} wirklich löschen?`)) {
      this.employeeService.deleteEmployee(employee.id).subscribe(() => {
        this.loadEmployees();
      });
    }
  }
}