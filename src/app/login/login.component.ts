import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../app-modules/core/services';
import { ConfirmationService } from '../app-modules/core/services/confirmation.service';

import { MdDialog, MdDialogRef } from '@angular/material';

import { DataSyncLoginComponent } from '../app-modules/data-sync/data-sync-login/data-sync-login.component';
import { MasterDownloadComponent } from '../app-modules/data-sync/master-download/master-download.component';

@Component({
  selector: 'app-login-cmp',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userName: any;
  password: any;
  dynamictype = 'password';
  @ViewChild('focus') private elementRef: ElementRef;  

  constructor(
    private router: Router,
    private dialog: MdDialog,
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    if (sessionStorage.getItem('isAuthenticated')) {
      this.authService.validateSessionKey()
        .subscribe(res => {
          if (res && res.statusCode == 200 && res.data)
            this.router.navigate(['/service']);
        })
    } else {
      sessionStorage.clear();
    }
  }

  public ngAfterViewInit(): void {
    this.elementRef.nativeElement.focus();
  }

  login() {
    this.authService.login(this.userName, this.password, false)
      .subscribe(res => {
        if (res.statusCode === 200) {
          if (res.data.previlegeObj && res.data.previlegeObj[0]) {
            localStorage.setItem('loginDataResponse', JSON.stringify(res.data));
            
            this.getServicesAuthdetails(res.data);
          } else {
            this.confirmationService.alert('Seems you are logged in from somewhere else, Logout from there & try back in.', 'error');
          }
        } else if (res.statusCode === 5002){
          if(res.errorMessage === 'You are already logged in,please confirm to logout from other device and login again') {
          this.confirmationService.confirm('info', res.errorMessage).subscribe((confirmResponse) => {
            if (confirmResponse){
              this.authService.userLogoutPreviousSession(this.userName).subscribe((logOutFromPreviousSession) => {
                if (logOutFromPreviousSession.statusCode === 200){
              this.authService.login(this.userName, this.password, true).subscribe((userLoggedIn) => {
                if (userLoggedIn.statusCode === 200) {
                if (userLoggedIn.data.previlegeObj && userLoggedIn.data.previlegeObj[0] && userLoggedIn.data.previlegeObj != null && userLoggedIn.data.previlegeObj != undefined) {
                  localStorage.setItem('loginDataResponse', JSON.stringify(userLoggedIn.data));
                  this.getServicesAuthdetails(userLoggedIn.data);
                } else {
                  this.confirmationService.alert('Seems you are logged in from somewhere else, Logout from there & try back in.', 'error');
                }
              }
              else {
                this.confirmationService.alert(userLoggedIn.errorMessage, 'error');
              }  
              })
            }
              else {
                this.confirmationService.alert(logOutFromPreviousSession.errorMessage, 'error');
              }
            })
            }
          });
        }
        else {
          sessionStorage.clear();
          this.router.navigate(["/login"]);
          this.confirmationService.alert(res.errorMessage, 'error');
          }
        }
        else {
          this.confirmationService.alert(res.errorMessage, 'error');
        }
      }, err => {
        this.confirmationService.alert(err, 'error');
      });
  }

  getServicesAuthdetails(loginDataResponse) {
    sessionStorage.setItem('key', loginDataResponse.key);
    sessionStorage.setItem('isAuthenticated', loginDataResponse.isAuthenticated);
    localStorage.setItem('userID', loginDataResponse.userID);
    localStorage.setItem('userName', loginDataResponse.userName);
    localStorage.setItem('username', this.userName);
    localStorage.setItem('fullName', loginDataResponse.fullName);
  
    const services = [];
    loginDataResponse.previlegeObj.map(item => {
      if (item.roles[0].serviceRoleScreenMappings[0].providerServiceMapping.serviceID == '4') {
        let service = {
          'providerServiceID': item.serviceID,
          'serviceName': item.serviceName,
          'apimanClientKey': item.apimanClientKey,
          'serviceID': item.roles[0].serviceRoleScreenMappings[0].providerServiceMapping.serviceID
        }
        services.push(service)
      }
    })
    if (services.length > 0) {
      localStorage.setItem('services', JSON.stringify(services));
      if (loginDataResponse.Status.toLowerCase() == 'new') {
        this.router.navigate(['/set-security-questions'])
      }
      else {
        this.router.navigate(['/service']);
      }
    } else {
      this.confirmationService.alert('User doesn\'t have previlege to access the application');
    }
  }

  showPWD() {
    this.dynamictype = 'text';
  }

  hidePWD() {
    this.dynamictype = 'password';
  }

  loginDialogRef: MdDialogRef<DataSyncLoginComponent>;
  openDialog() {
    this.loginDialogRef = this.dialog.open(DataSyncLoginComponent, {
      hasBackdrop: true,
      disableClose: true,
      panelClass: 'fit-screen',
      backdropClass: 'backdrop',
      position: { top: "20px" },
      data: {
        masterDowloadFirstTime: true
      }
    });

    this.loginDialogRef.afterClosed()
      .subscribe(flag => {
        if (flag) {
          this.dialog.open(MasterDownloadComponent, {
            hasBackdrop: true,
            disableClose: true,
            panelClass: 'fit-screen',
            backdropClass: 'backdrop',
            position: { top: "20px" },
          }).afterClosed().subscribe(() => {
            sessionStorage.clear();
            localStorage.clear();
          });
        }
      })
  }

}
