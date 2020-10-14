import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dependent } from '../shared/models/dependent';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DependentService {

  baseUrl: string;

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') inputBaseUrl: string) {
    this.baseUrl = inputBaseUrl + 'api/dependent';
  }

  post(dependent: Dependent) {
    return this.httpClient.post<Dependent>(this.baseUrl, dependent);
  }

  put(dependent: Dependent) {
    return this.httpClient.put<Dependent>(this.baseUrl, dependent);
  }

  delete(dependentId: number): Observable<any> {
    let result = this.httpClient.delete(this.baseUrl + "?dependentId=" + dependentId);
    return result;
  }
}
