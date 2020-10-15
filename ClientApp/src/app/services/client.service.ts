import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client } from '../shared/models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  baseUrl: string;

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') inputBaseUrl: string) {
    this.baseUrl = inputBaseUrl + 'api/client';
  }

  post(clientName: string) {
    let client = { name: clientName};
    return this.httpClient.post<Client>(this.baseUrl, client);
  }

  generateFakeData(clientId: number) {
    return this.httpClient.get<Client>(this.baseUrl + "/generateFakeData?clientId=" + clientId);
  }

  get(clientName: string) {
    return this.httpClient.get<Client>(this.baseUrl + "?clientName=" + clientName);
  }

  getById(clientId: string) {
    return this.httpClient.get<Client>(this.baseUrl + "/getbyid?clientId=" + clientId);
  }
}
