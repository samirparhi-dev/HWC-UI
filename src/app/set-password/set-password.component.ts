import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../app-modules/core/services";
import { ConfirmationService } from "../app-modules/core/services/confirmation.service";

@Component({
  selector: "app-set-password",
  templateUrl: "./set-password.component.html",
  styleUrls: ["./set-password.component.css"],
})
export class SetPasswordComponent {
  newpwd: any;
  confirmpwd: any;
  uname: any;
  dynamictype: any = "password";

  constructor(
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.uname = localStorage.getItem("userName");
  }

  showPWD() {
    this.dynamictype = "text";
  }

  hidePWD() {
    this.dynamictype = "password";
  }

  updatePassword(new_pwd) {
    const transactionId = this.authService.transactionId;
    if (new_pwd === this.confirmpwd) {
      this.authService
        .setNewPassword(this.uname, new_pwd, transactionId)
        .subscribe(
          (response: any) => {
            if (response !== undefined && response !== null && 
              response.statusCode == 200) {
              this.successCallback(response);
            }
            else {
              this.confirmationService.alert(response.errorMessage, 'error');
              this.router.navigate(['/reset-password']);
            }
          },
          (error: any) => {
            this.errorCallback(error);
          },
          (this.authService.transactionId = null)
        );
    } else {
      this.confirmationService.alert("Password does not match", "error");
    }
  }

  successCallback(response) {
    this.confirmationService.alert("Password changed successfully", "success");
    this.logout();
  }
  logout() {
    this.authService.logout().subscribe((res) => {
      this.router.navigate(["/login"]).then((result) => {
        if (result) {
          localStorage.clear();
          sessionStorage.clear();
        }
      });
    });
  }

  errorCallback(response) {
    console.log(response);
	this.router.navigate(['/reset-password']);
  }
}
