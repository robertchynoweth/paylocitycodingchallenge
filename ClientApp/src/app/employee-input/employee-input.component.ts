import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn,
  FormArray,
  FormArrayName
} from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from '../shared/models/client';
import { ClientService } from '../services/client.service';
import { Employee } from '../shared/models/employee';
import { Dependent } from '../shared/models/dependent';

@Component({
  selector: 'app-employee-input',
  templateUrl: './employee-input.component.html',
  styleUrls: ['./employee-input.component.css']
})
export class EmployeeInputComponent implements OnInit {

  clientName: string;
  client: Client;
  clientFormGroup: FormGroup;

  constructor(
    private clientService: ClientService,
    private _router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.clientName = localStorage.getItem("clientName").trim();
    if (this.clientName == null || this.clientName === '') {
      //user not logged in, do redirect to home
      this._router.navigateByUrl('/');
    }

    let clientId = localStorage.getItem("clientId").trim();
    this.clientService.getById(clientId)
      .subscribe(
        result => {
          this.client = result;
          this.buildFormGroup();
        },
        error => {
          console.log(error);
          this._router.navigateByUrl('/');
        });
  }

  get employees(): FormArray {
    return this.clientFormGroup.get("employees") as FormArray;
  }

  employeeDependents(employeeIndex: number): FormArray {
    return this.employees.at(employeeIndex).get("dependents") as FormArray
  }

  buildFormGroup() {
    this.clientFormGroup = this.formBuilder.group({
      employees: this.formBuilder.array(this.addEmployeesToForm(this.client))
    });
  }

  addEmployee() {
    (this.clientFormGroup.get("employees") as FormArray).push(this.addEmployeeToForm(new Employee()));
  }

  deleteEmployee(employeeIndex: number) {
    let employeesFormArray = (this.clientFormGroup.get("employees") as FormArray);
    employeesFormArray.removeAt(employeeIndex);
  }

  addEmployeesToForm(client: Client): any[] {
    let employees = [];

    if (client.employees && client.employees.length > 0) {
      for (let i = 0; i < client.employees?.length; i++) {
        employees.push(this.addEmployeeToForm(client.employees[i]));
      }
    }
    else {
      employees.push(this.addEmployeeToForm(new Employee()));
    }

    return employees;
  }

  addEmployeeToForm(employee: Employee): FormGroup {
    return this.formBuilder.group({
      id: [employee.id],
      firstName: [employee.firstName, [Validators.required, Validators.minLength(100)]],
      lastName: [employee.lastName, [Validators.required, Validators.maxLength(100)]],
      dateHired: [employee.dateHired, [Validators.required]],
      biWeeklyPay: [employee.biWeeklyPay == 0 ? 2000 : employee.biWeeklyPay, [Validators.required]],
      dependents: this.formBuilder.array(this.addDependentsToForm(employee))
    });
  }

  addDependent(employeeIndex: number) {
    let dependentsFormArray = ((this.clientFormGroup.get("employees") as FormArray).at(employeeIndex).get("dependents") as FormArray);
    dependentsFormArray.push(this.addDependentToForm(new Dependent()));
  }

  deleteDependent(employeeIndex: number, dependentIndex: number) {
    let dependentsFormArray = ((this.clientFormGroup.get("employees") as FormArray).at(employeeIndex).get("dependents") as FormArray);
    dependentsFormArray.removeAt(dependentIndex);
  }

  addDependentsToForm(employee: Employee): any[] {
    let dependents = [];

    if (employee.dependents && employee.dependents.length > 0) {
      for (let i = 0; i < employee.dependents?.length; i++) {
        dependents.push(this.addDependentToForm(employee.dependents[i]));
      }
    }
    else {
      dependents.push(this.addDependentToForm(new Dependent()));
    }

    return dependents;
  }

  addDependentToForm(dependent: Dependent): FormGroup {
    return this.formBuilder.group({
      id: [dependent.id],
      firstName: [dependent.firstName, [Validators.required, Validators.minLength(100)]],
      lastName: [dependent.lastName, [Validators.required, Validators.maxLength(100)]],
      isSpouse: dependent.isSpouse
    });
  }
}
