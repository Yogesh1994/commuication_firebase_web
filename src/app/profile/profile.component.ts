import { Component, OnInit, NgZone } from '@angular/core';
import {Router} from '@angular/router';
import * as firebase from 'firebase';
import { LocalStorageService } from 'angular-2-local-storage';
import { FormBuilder, Form, Validators, ReactiveFormsModule} from '@angular/forms';
import {UserServiceprovider} from '../../provider/user';
import {ImagehandlerService} from '../../provider/imagehandler.service';
import {AngularFireAuth} from 'angularfire2/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  showButton: any =  false;
  nameForm: any;
  displayName: any;
  photoURL: any;
  email: any;
  showLoader: any = false;
  showImageloader: any = true;
  constructor(public userservice: UserServiceprovider, public zone: NgZone , public form: FormBuilder,
              public storage: LocalStorageService, public router: Router, public imghandler: ImagehandlerService,
              public fireauth: AngularFireAuth ) { }

  ngOnInit() {
    this.showImageloader = true;
    console.log( this.showImageloader);
    this.zone.run(() => {
      this.displayName = firebase.auth().currentUser.displayName;
      this.photoURL = this.fireauth.auth.currentUser.photoURL;
     this.email = firebase.auth().currentUser.email;
     this.showImageloader = false;
    });
    this.initialize();
  }

  initialize() {
    this.nameForm = this.form.group({
      name : ['']
    });
  }

  goto() {
    this.router.navigate(['/chatList'], {
      queryParams: {
        user_type: 'sales'
      }

     });
  }
  showbuttonfun() {
    this.showButton = true;
  }
  editname() {
    this.showLoader = true;
        this.userservice.updatedisplayname(this.nameForm.value.name).then((res: any) => {
          if (res.success) {
            this.displayName = this.nameForm.value.name;
            alert('Updated');
            this.initialize();
            this.showButton = false;
            this.showLoader = false;
            // this.zone.run(() => {
            //   console.log(this.nameForm.value.name);
            //   this.displayName = this.nameForm.value.name;
            // });
          } else {
            alert('Failed');
          }

        });
  }

  editimage(event: any) {

    const file = event.target.files[0];
    console.log('File', file);
    const fileName = file.name;
    const splitted = fileName.split('.');
    const array = ['jpg', 'jpeg', 'png'];

    if ( array.indexOf(splitted[1]) === -1) {
          alert('Format Not supported');
     }else {
      this.showLoader = true;
        this.imghandler.uploadimage(file).then((url: any) => {
          this.userservice.updateimage(url).then((res: any) => {
            if (res.success) {
              alert('Updated');
              this.zone.run(() => {
                this.showLoader = false;
                this.photoURL = url;
              });
            }
          }).catch((err) => {
            alert('Failed');
          });
        });
     }
  }

  logout() {

            firebase.auth().signOut().then(() => {
              this.storage.remove();
              this.router.navigate(['']);
            });

  }

}
