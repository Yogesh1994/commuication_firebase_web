import { Component,NgZone } from '@angular/core';
import { UserServiceprovider } from '../../provider/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router,ActivatedRoute,NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-select-sales',
  templateUrl: './select-sales.component.html',
  styleUrls: ['./select-sales.component.css']
})
export class SelectSalesComponent {

  salesPersons:any = [];
  tempUsers:any = [];
  
  constructor(public zone:NgZone,public user:UserServiceprovider,public router:Router) {
    this.getsalesPersons();
  }

 
  getsalesPersons(){
    this.user.getallUser().then((users:any)=>{
         for(let key in users){
            
            if(users[key].user_type=='sales'){
              this.zone.run(()=>{
                this.salesPersons.push(users[key]);  
                this.tempUsers.push(users[key]);                              
              });
            }

         }     
    });
   
  }

  getItems(ev: any) {
   
    this.salesPersons = this.tempUsers;
    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.salesPersons = this.salesPersons.filter((item) => {
        return (item.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

    gotoClient(salesP){
      console.log("sales",salesP);
      let val = salesP;
      this.router.navigate(['AssignClientsPage'],{
        queryParams:{
          uid : val.uid,
          displayName : val.displayName
        }
    });
    }
}
