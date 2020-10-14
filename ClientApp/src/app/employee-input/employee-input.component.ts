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
import { Employee } from '../shared/models/employee';
import { Dependent } from '../shared/models/dependent';

import { ClientService } from '../services/client.service';
import { EmployeeService } from '../services/employee.service';
import { DependentService } from '../services/dependent.service';

@Component({
  selector: 'app-employee-input',
  templateUrl: './employee-input.component.html',
  styleUrls: ['./employee-input.component.css']
})
export class EmployeeInputComponent implements OnInit {

  clientName: string;
  clientId: number;
  client: Client;
  clientFormGroup: FormGroup;

  constructor(
    private clientService: ClientService,
    private employeeService: EmployeeService,
    private dependentService: DependentService,
    private _router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.clientName = localStorage.getItem("clientName");
    if (this.clientName === null || this.clientName.match(/^ *$/) !== null) {
      this._router.navigateByUrl('/');
    }

    let clientId = localStorage.getItem("clientId").trim();
    this.clientId = +clientId;
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

  buildFormGroup(): void {
    this.clientFormGroup = this.formBuilder.group({
      employees: this.formBuilder.array(this.addEmployeesToForm(this.client))
    });
  }

  addEmployee(): void {
    (this.clientFormGroup.get("employees") as FormArray).push(this.addEmployeeToForm(new Employee()));
  }

  addEmployeesToForm(client: Client): any[] {
    let employees = [];

    if (client.employees && client.employees.length > 0) {
      for (let i = 0; i < client.employees?.length; i++) {
        employees.push(this.addEmployeeToForm(client.employees[i]));
      }
    }
    else {
      let employee = new Employee();
      employee.clientId = this.clientId;
      employees.push(this.addEmployeeToForm(employee));
    }

    return employees;
  }

  addEmployeeToForm(employee: Employee): FormGroup {
    return this.formBuilder.group({
      id: [employee.id],
      firstName: [employee.firstName, [Validators.required, Validators.maxLength(100)]],
      lastName: [employee.lastName, [Validators.required, Validators.maxLength(100)]],
      dateHired: [employee.dateHired, [Validators.required]],
      biWeeklyPay: [employee.biWeeklyPay == 0 ? 2000 : employee.biWeeklyPay, [Validators.required]],
      dependents: this.formBuilder.array(this.addDependentsToForm(employee)),
      clientId: employee.clientId
    });
  }

  employeeSaveCheck(employeeIndex: number): void {
    let employee = (this.clientFormGroup.get("employees") as FormArray).at(employeeIndex) as FormGroup;

    if (!employee.invalid && !employee.pristine) {
      let clonedEmployee = { ...employee.value };
      delete clonedEmployee["dependents"];
      // New Employee
      if (Number.isNaN(employee.get("id").value)) {
        delete clonedEmployee["id"];
        this.employeeService.post(clonedEmployee).subscribe(
          result => {
            //update Id
            employee.patchValue({ id: result["id"] });

            //update all dependents
            let dependents = employee.get("dependents") as FormArray;
            for (let i = 0; i < dependents.length; i++) {
              let dependent = dependents.at(i);
              dependent.patchValue({ employeeId: result["id"]});
            }

            employee.markAsPristine({ onlySelf: true });
          },
          error => {
            console.log(error);
          });
      } else {
        // Old employee
        this.employeeService.put(clonedEmployee).subscribe(
          result => {
            employee.markAsPristine({ onlySelf: true });
          },
          error => {
            console.log(error);
          });
      }
    }
  }

  deleteEmployee(employeeIndex: number): void {
    let employeesFormArray = (this.clientFormGroup.get("employees") as FormArray);
    let employee = employeesFormArray.at(employeeIndex);
    if (!Number.isNaN(employee.get("id").value)) {
      this.employeeService.delete(employee.get("id").value).subscribe(
        result => { },
        error => {
          console.log(error);
        });
    }
    employeesFormArray.removeAt(employeeIndex);
  }

  addDependent(employeeIndex: number): void {
    let employee = ((this.clientFormGroup.get("employees") as FormArray).at(employeeIndex));
    let dependentsFormArray = (employee.get("dependents") as FormArray);
    let dependent = new Dependent();
    dependent.employeeId = +employee.get("id").value;
    dependentsFormArray.push(this.addDependentToForm(dependent));
  }

  addDependentsToForm(employee: Employee): any[] {
    let dependents = [];

    if (employee.dependents && employee.dependents.length > 0) {
      for (let i = 0; i < employee.dependents?.length; i++) {
        dependents.push(this.addDependentToForm(employee.dependents[i]));
      }
    }

    return dependents;
  }

  addDependentToForm(dependent: Dependent): FormGroup {
    return this.formBuilder.group({
      id: [dependent.id],
      firstName: [dependent.firstName, [Validators.required, Validators.maxLength(100)]],
      lastName: [dependent.lastName, [Validators.required, Validators.maxLength(100)]],
      isSpouse: dependent.isSpouse,
      employeeId: dependent.employeeId
    });
  }
    
  dependentSpouseCheck(employeeIndex: number, dependentIndex: number) {
    //make sure all other spouses are not checked
    let employee = (this.clientFormGroup.get("employees") as FormArray).at(employeeIndex) as FormGroup;
    let dependents = (employee.get("dependents") as FormArray);
    let dependent = dependents.at(dependentIndex) as FormGroup;
    if (dependent.get("isSpouse").value == true) {
      for (let i = 0; i < dependents.length; i++) {
        if (i != dependentIndex && dependents.at(i).get("isSpouse").value) {
          dependents.at(i).patchValue({ isSpouse: false });
          dependents.at(i).markAsDirty({ onlySelf: true });
          this.dependentSaveCheck(employeeIndex, i);
        }
      }
    }

    this.dependentSaveCheck(employeeIndex, dependentIndex);
  }

  dependentSaveCheck(employeeIndex: number, dependentIndex: number): void {
    let employee = (this.clientFormGroup.get("employees") as FormArray).at(employeeIndex) as FormGroup;
    let dependent = (employee.get("dependents") as FormArray).at(dependentIndex) as FormGroup;
    if (!dependent.invalid && dependent.dirty) {
      let clonedDependent = { ...dependent.value };
      delete clonedDependent["id"];
      // New Employee
      if (Number.isNaN(dependent.get("id").value)) {
        this.dependentService.post(clonedDependent).subscribe(
          result => {
            //update id
            dependent.patchValue({ id: result["id"] });
            dependent.markAsPristine({ onlySelf: true });
          },
          error => {
            console.log(error);
          });
      } else {
        // Old employee
        this.dependentService.put(dependent.value).subscribe(
          result => {
            dependent.markAsPristine({ onlySelf: true });
          },
          error => {
            console.log(error);
          });
      }
    }
  }

  deleteDependent(employeeIndex: number, dependentIndex: number): void {
    let dependentsFormArray = ((this.clientFormGroup.get("employees") as FormArray)
      .at(employeeIndex).get("dependents") as FormArray);
    let dependent = dependentsFormArray.at(dependentIndex);
    if (!Number.isNaN(dependent.get("id").value)) {
      this.dependentService.delete(dependent.get("id").value).subscribe(
        result => { },
        error => {
          console.log(error);
        });
    }
    dependentsFormArray.removeAt(dependentIndex);
  }
}
