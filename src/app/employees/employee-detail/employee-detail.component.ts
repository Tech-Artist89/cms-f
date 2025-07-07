import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '../employee.model';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss'
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | null = null;
  employeeForm: FormGroup;
  isEditMode = false;
  isNewEmployee = false;
  isLoading = false;
  employeeId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = this.createForm();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.employeeId = +params['id'];
        this.loadEmployee();
        this.isEditMode = this.route.snapshot.url.some(segment => segment.path === 'edit');
      } else {
        this.isNewEmployee = true;
        this.isEditMode = true;
        this.initializeNewEmployee();
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      position: ['', [Validators.required]],
      department: ['', [Validators.required]],
      hireDate: ['', [Validators.required]],
      hourlyRate: [null],
      skillsString: [''],
      isActive: [true],
      address: this.fb.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        postalCode: ['', [Validators.required]],
        country: ['Deutschland', [Validators.required]]
      })
    });
  }

  private loadEmployee() {
    if (this.employeeId) {
      this.employeeService.getEmployee(this.employeeId).subscribe({
        next: (employee) => {
          this.employee = employee;
          if (this.isEditMode) {
            this.populateForm(employee);
          }
        },
        error: (error) => {
          console.error('Error loading employee:', error);
          this.router.navigate(['/employees']);
        }
      });
    }
  }

  private initializeNewEmployee() {
    // Für neue Mitarbeiter Standardwerte setzen
    this.employeeForm.patchValue({
      address: {
        country: 'Deutschland'
      },
      hireDate: new Date().toISOString().split('T')[0]
    });
  }

  private populateForm(employee: Employee) {
    this.employeeForm.patchValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : '',
      hourlyRate: employee.hourlyRate,
      skillsString: employee.skills ? employee.skills.join(', ') : '',
      isActive: employee.isActive,
      address: {
        street: employee.address.street,
        city: employee.address.city,
        postalCode: employee.address.postalCode,
        country: employee.address.country
      }
    });
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode && this.employee) {
      this.populateForm(this.employee);
    }
  }

  cancelEdit() {
    if (this.isNewEmployee) {
      this.router.navigate(['/employees']);
    } else {
      this.isEditMode = false;
      this.employeeForm.reset();
      if (this.employee) {
        this.populateForm(this.employee);
      }
    }
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.isLoading = true;
      const formValue = this.employeeForm.value;
      
      // Skills String zu Array konvertieren
      const skills = formValue.skillsString 
        ? formValue.skillsString.split(',').map((skill: string) => skill.trim()).filter((skill: string) => skill)
        : [];

      const employeeData = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone,
        position: formValue.position,
        department: formValue.department,
        hireDate: new Date(formValue.hireDate),
        hourlyRate: formValue.hourlyRate || undefined,
        skills: skills,
        address: formValue.address
      };

      if (this.isNewEmployee) {
        this.createEmployee(employeeData as CreateEmployeeRequest);
      } else {
        this.updateEmployee({
          ...employeeData,
          isActive: formValue.isActive
        } as UpdateEmployeeRequest);
      }
    } else {
      // Form validation errors
      this.markFormGroupTouched(this.employeeForm);
    }
  }

  private createEmployee(employeeData: CreateEmployeeRequest) {
    this.employeeService.createEmployee(employeeData).subscribe({
      next: (employee) => {
        this.isLoading = false;
        this.router.navigate(['/employees', employee.id]);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error creating employee:', error);
        // Here you could show an error message to the user
      }
    });
  }

  private updateEmployee(employeeData: UpdateEmployeeRequest) {
    if (this.employeeId) {
      this.employeeService.updateEmployee(this.employeeId, employeeData).subscribe({
        next: (employee) => {
          this.isLoading = false;
          this.employee = employee;
          this.isEditMode = false;
          // Optionally navigate back to view mode
          this.router.navigate(['/employees', employee.id]);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error updating employee:', error);
          // Here you could show an error message to the user
        }
      });
    }
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

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }
}