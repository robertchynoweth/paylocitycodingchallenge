import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  isUserLoggedIn(): boolean {
    let clientId = localStorage.getItem("clientId");
    if (clientId === null || clientId.match(/^ *$/) !== null) {
      return false;
    }
    return true;
  }
}
