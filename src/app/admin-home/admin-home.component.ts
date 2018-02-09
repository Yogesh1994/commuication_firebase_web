import { Component } from '@angular/core';
import { UserServiceprovider } from '../../provider/user';
import * as firebase from 'firebase';
import { LocalStorageService } from 'angular-2-local-storage';
import { FormBuilder, Form, Validators, ReactiveFormsModule} from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { ActivatedRoute , Router , NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent  {


  photoURL:any;
  constructor( public fireauth: AngularFireAuth,public user:UserServiceprovider,public router: Router,public storage: LocalStorageService,) {
    this.user.getallUser().then((users:any)=>{
     
          for(let key in users){
            if(users[key].uid === this.fireauth.auth.currentUser.uid){
                this.photoURL = users[key].photoURL;
            }
          }
    })
  }

  ionViewDidLoad() {
    console.log('AdminHomePage');
  }

  gotoNext(){
   // console.log('hiii');
    this.router.navigate(['/selectSales']);
   // this.navCtrl.push('SelectSalesPage');
  }
  addUser(){
    this.router.navigate(['/AddUser']);
  }
  logout() {
 //   this.router.navigate(['']);


 this.fireauth.auth.signOut().then(() => {
  this.storage.remove();
  this.router.navigate(['']);
});


    // let alert = this.alertCtrl.create({
    //   title: 'Confirm Logout',
    //   message: 'Do you want to exit?',
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       handler: () => {
    //         console.log('Cancel clicked');
    //       }
    //     },
    //     {
    //       text: 'Logout',
    //       handler: () => {
    //         firebase.auth().signOut().then(() => {
    //          // this.navCtrl.setRoot('LoginPage');
    //         })
    //       }
    //     }
    //   ]
    // });
    // alert.present();
   
  }
  

}
