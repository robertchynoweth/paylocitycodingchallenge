import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../shared/models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  baseUrl: string;

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') inputBaseUrl: string) {
    this.baseUrl = inputBaseUrl + 'api/employee';
  }

  post(employee: Employee) {
    return this.httpClient.post<Employee>(this.baseUrl, employee);
  }

  put(employee: Employee) {
    return this.httpClient.put<Employee>(this.baseUrl, employee);
  }

  delete(employeeId: number) {
    return this.httpClient.delete(this.baseUrl + "?employeeId=" + employeeId);
  }
}
