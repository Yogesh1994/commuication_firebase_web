import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators,FormArray,Form ,ReactiveFormsModule} from '@angular/forms';
import {Router,ActivatedRoute,NavigationExtras} from '@angular/router';
import { UserServiceprovider } from '../../provider/user';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  user : Array<string>;
  loading = false;
  userAdded = false;
//loader=false;
  public myForm : FormGroup;

  constructor(private http: HttpClient, public router:Router,
    
    public userservice:UserServiceprovider,private _fb: FormBuilder) 
 {
    this.user = [];
  }

  ngOnInit() {
    this.myForm = this._fb.group({
        Particulars: this._fb.array([
            this.initUser(),
        ])
    });
}

initUser(){
  let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
  return this._fb.group({
    name: [' ', [Validators.required,Validators.minLength(1)]],
    email: [' ', [Validators.required,Validators.pattern(EMAIL_REGEXP)]],
     contactNo: [' ', [Validators.required]],
     pw:['',[Validators.required,Validators.minLength(6)]],
     cpw:['',[Validators.required,Validators.minLength(6)]],
     userType:['',[Validators.required]],
      
  })
}

addUser(){
  console.log(this.myForm.controls['Particulars']);
  const control = <FormArray>this.myForm.controls['Particulars'];
  control.push(this.initUser());
}

removeUser(i : number){

  const control = <FormArray>this.myForm.controls['Particulars'];
  control.removeAt(i);
  this.user.splice(i,1);
}
save(){
  let i:any ;
  let arrayLength:any;
  let datamore=this.myForm.value;
  let flag = true;
  arrayLength = (datamore.Particulars).length;

  for(i=0; i<arrayLength; i++){
    
    if( datamore.Particulars[i].pw !== datamore.Particulars[i].cpw){
        flag = false;
        break;
    }
  }

  if(flag){
    for(i=0; i<arrayLength; i++){

          let newuser={
            email: datamore.Particulars[i].email,
            password: datamore.Particulars[i].pw,
            displayName: datamore.Particulars[i].name,
            contactNo:datamore.Particulars[i].contactNo,
            userType:datamore.Particulars[i].userType,
          }
      
          const email =  datamore.Particulars[i].email;
          const password = datamore.Particulars[i].pw;
      
      //  this.loader = this.loadingCtrl.create({
      //     content: 'Please wait',
      //     spinner: 'crescent'
      //   });
       // this.loader.present();
  this.loading = true;
        
        this.userservice.adduser(newuser).then((res: any) => {
        this.loading = false;          
      //    this.loader.dismiss();
          if (res.success){
          
            const link = "http://binnysjewellery.com/Comminication_app/sendemail.php";
            const data = JSON.stringify({'email':email,'password':password});
                
            this.http.post(link,data).subscribe((response) => {
            },(error)=>{
              console.log(error);
            });
            this.presentToast("Users Registered SuccesFully!",true);       
          }
        }).catch((error)=>{
            this.presentToast(error,false);
        })
      

      }    
  }else{
  //  this.loader.dismiss();
  this.loading = false;            
    // let toast = this.toastCtrl.create({
    //   message: 'Pasword Mismatch for Email '+datamore.Particulars[i].email ,
    //   duration: 2000,
    //   position: 'bottom'
    // });

   // toast.present();
  } 
}

presentToast(message,flag){
  this.loading = false;  
  this.userAdded = true;
  alert("user added successfully");

  // setInterval(function(){this.userAdded=false;
     
  //    },1500);
     if(flag)
      this.router.navigate(['/adminHome']);
    
  // this.loader.dismiss();
  // let toast = this.toastCtrl.create({
  //   message: message ,
  //   duration: 2000,
  //   position: 'bottom'
  // });
  // toast.onDidDismiss(() => {
      
  // });
  // toast.present();
}



}
