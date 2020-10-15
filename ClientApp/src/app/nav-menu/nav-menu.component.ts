import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  constructor(private _router: Router) {}

  routeHome() {
    this._router.navigateByUrl('/');
  }

  isUserLoggedIn(): boolean {
    let clientId = localStorage.getItem("clientId");
    if (clientId === null || clientId.match(/^ *$/) !== null) {
      return false;
    }
    return true;
  }

  logUserOut() {
    localStorage.removeItem("clientId");
    localStorage.removeItem("clientName");
    this._router.navigateByUrl('/');
  }
}
