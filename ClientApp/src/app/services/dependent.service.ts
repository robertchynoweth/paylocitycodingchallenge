import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dependent } from '../shared/models/dependent';

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

  delete(dependentId: number) {
    return this.httpClient.delete(this.baseUrl + "?dependentId=" + dependentId);
  }
}
