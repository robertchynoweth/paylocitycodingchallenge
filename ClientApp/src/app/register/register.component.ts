import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ClientService } from '../services/client.service';
import { ErrorDialogComponent } from '../shared/dialogs/error-dialog.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  clientName: string;

  constructor(
    private clientService: ClientService,
    private _router: Router,
    public dialog: MatDialog) { }

  register() {
    this.clientService.post(this.clientName)
      .subscribe(
        result => {
          localStorage.setItem("clientId", result.id.toString());
          localStorage.setItem("clientName", result.name);
          this._router.navigateByUrl('/employeeinput');
        },
        error => {
          this.dialog.open(ErrorDialogComponent, {
            data: { name: this.clientName, title: " is already taken." }
          });
        });
  }
}
