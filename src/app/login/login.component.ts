import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Form, Validators, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router, NavigationExtras} from '@angular/router';
import { AuthProvider } from '../../provider/auth';
import { UserServiceprovider } from '../../provider/user';
import { LocalStorageService } from 'angular-2-local-storage';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
loginForm: any;
loading = false;
routeURL: string;
showAlert = false;
showfailAlert = false;
  constructor(public storage: LocalStorageService, public userService: UserServiceprovider,
     public authService: AuthProvider,public fb: FormBuilder, public router: Router, 
     public activeRoute: ActivatedRoute, public fireauth: AngularFireAuth) {
    const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.loginForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
});
}

  ngOnInit() {
    this.routeURL = this.activeRoute.snapshot.queryParams['returnURL'] || '/';
  }
  login() {
    this.loading = true;
    this.showfailAlert = false;
    this.authService.login(this.loginForm.value).then((res: any) => {
      if ( res.success) {
        this.showAlert = true;
        this.loading = false;
        this.userService.checkUserType().subscribe((reply: any) => {
             if (reply.user_type === 'client'){
              alert('This login is Not Allowed in Web Version');              
             }if(reply.user_type === 'admin')   {
              this.storage.set('loggedIn', true);
              // this.storage.set('userUID', this.fireauth.authState);
               this.storage.set('userUID', this.fireauth.auth.currentUser.uid);
               this.router.navigate(['/adminHome'], {
                queryParams: {
                  user_type: reply.user_type
                }
               });
              }else if (reply.user_type === 'sales') {
                this.storage.set('loggedIn', true);
               // this.storage.set('userUID', this.fireauth.authState);
                this.storage.set('userUID', this.fireauth.auth.currentUser.uid);
                this.router.navigate(['/chatList'], {
                 queryParams: {
                   user_type: reply.user_type
                 }
                });
              }
        });
      }

    }).catch((error) => {
        if ( error.code === 'auth/network-request-failed') {
          this.loading = false;
            alert('Please Check Network Connection');
        }else {
          this.loading = false;
          this.showfailAlert = true;
        }
    });
  }

  ngOnDestroy() {
    this.showAlert = false;
    this.showfailAlert = false;
  }
}
