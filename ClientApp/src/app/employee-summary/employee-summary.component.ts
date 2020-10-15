import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn,
  FormArray,
  FormArrayName
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Router } from '@angular/router';
import { Client } from '../shared/models/client';
import { Employee } from '../shared/models/employee';
import { OrganizedEmployeeData } from './organizedEmployeeData';
import { WeeklySummaryData } from './weeklySummaryData';

import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-employee-summary',
  templateUrl: './employee-summary.component.html',
  styleUrls: ['./employee-summary.component.css']
})
export class EmployeeSummaryComponent implements OnInit, AfterViewInit {

  //Table components
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  dataSource: MatTableDataSource<OrganizedEmployeeData>;

  organizedEmployeeData: OrganizedEmployeeData[];
  weeklySummaryData: WeeklySummaryData[];

  displayedColumns: string[] = [
    'lastName',
    'firstName',
    'dateHired',
    'numberOfDependents',
    'biWeeklyPay',
    'yearlyCost',
    'biWeeklyCost',
    'netPay'
  ];

  //Data retrieval
  clientName: string;
  clientId: string;
  client: Client;

  //Chart data
  firstDate: Date;
  lastDate: Date;

  //Table totals
  yearlyCompanyPay: number;
  yearlyBenefitCosts: number;
  yearlyCompanyPayLessBenefits: number;
  biWeeklyCompanyPay: number;
  biWeeklyBenefitCosts: number;
  biWeeklyCompanyPayLessBenefits: number;

  constructor(private clientService: ClientService,
    private _router: Router) { }

  ngAfterViewInit() {
    this.clientService.getById(this.clientId)
      .subscribe(
        result => {
          this.client = result;
          this.organizeData();
          this.dataSource = new MatTableDataSource<OrganizedEmployeeData>(this.organizedEmployeeData);
          this.dataSource.paginator = this.paginator;
        },
        error => {
          console.log(error);
          this._router.navigateByUrl('/');
        });
  }

  ngOnInit(): void {
    this.clientName = localStorage.getItem("clientName");
    if (this.clientName === null || this.clientName.match(/^ *$/) !== null) {
      this._router.navigateByUrl('/');
    }

    this.clientId = localStorage.getItem("clientId").trim();
  }

  organizeData(): void {
    this.organizedEmployeeData = [];

    this.yearlyCompanyPay = 0;
    this.yearlyBenefitCosts = 0;
    this.yearlyCompanyPayLessBenefits = 0;
    this.biWeeklyCompanyPay = 0;
    this.biWeeklyBenefitCosts = 0;
    this.biWeeklyCompanyPayLessBenefits = 0;

    this.firstDate = this.client.employees[0].dateHired;

    for (let i = 0; i < this.client.employees.length; i++) {
      let employee = this.client.employees[i] as Employee;
      let employeeData = new OrganizedEmployeeData();

      employeeData.firstName = employee.firstName;
      employeeData.lastName = employee.lastName;
      employeeData.dateHired = employee.dateHired;
      employeeData.biWeeklyPay = employee.biWeeklyPay;
      employeeData.numberOfDependents = employee.dependents.length;
      employeeData.yearlyCost = parseFloat((1000 + (employeeData.numberOfDependents * 500)).toFixed(2));
      employeeData.biWeeklyCost = parseFloat((employeeData.yearlyCost / 52).toFixed(2));
      employeeData.netPay = parseFloat((employeeData.biWeeklyPay - employeeData.biWeeklyCost).toFixed(2));

      this.yearlyCompanyPay = parseFloat((this.yearlyCompanyPay + (employeeData.biWeeklyPay * 52)).toFixed(2));
      this.yearlyBenefitCosts = parseFloat((this.yearlyBenefitCosts + employeeData.yearlyCost).toFixed(2));

      this.biWeeklyCompanyPay = parseFloat((this.biWeeklyCompanyPay + employeeData.biWeeklyPay).toFixed(2));
      this.biWeeklyBenefitCosts = parseFloat((this.biWeeklyBenefitCosts + employeeData.biWeeklyCost).toFixed(2));

      this.organizedEmployeeData.push(employeeData);

      //find earliest date of hired employee
      if (this.firstDate > employeeData.dateHired) {
        this.firstDate = employeeData.dateHired;
      }
    }

    this.yearlyCompanyPayLessBenefits = parseFloat((this.yearlyCompanyPay - this.yearlyBenefitCosts).toFixed(2));
    this.biWeeklyCompanyPayLessBenefits = parseFloat((this.biWeeklyCompanyPay - this.biWeeklyBenefitCosts).toFixed(2));
  }
}
