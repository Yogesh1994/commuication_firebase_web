import { Component,NgZone } from '@angular/core';
import { UserServiceprovider } from '../../provider/user';
import { SelectSalesComponent } from '../select-sales/select-sales.component';
import { ActivatedRoute,Router,NavigationExtras } from '@angular/router'
import { trigger } from '@angular/core/src/animation/dsl';



@Component({
  selector: 'app-assign-clients',
  templateUrl: './assign-clients.component.html',
  styleUrls: ['./assign-clients.component.css']
})
export class AssignClientsComponent {

  salespDetails: any;
  salesName: any;
  clientList: any = [];
  tempUsers: any = [];
  addedClientsArray: any = [];
  loading = false;
  constructor( public zone: NgZone, public user: UserServiceprovider,public route:ActivatedRoute,
               public router:Router) {

    this.user.checkAlreadyadded().then((clients) => {
     
      let tempArray1 = [];
      

      let tempClients = clients;

      this.user.getallUser().then((res: any) => {
       
        this.zone.run(()=>{
          for (let i in tempClients) {
            tempArray1.push(tempClients[i].clientId);
          }
          for (let j in res) {
            if (tempArray1.indexOf(res[j].uid) === -1 && res[j].user_type == 'client') {
              this.addedClientsArray.push(res[j]);
              this.tempUsers.push(res[j]);
            };
          }
        })

      });
    });

  }
 
  ngOnInit(){
    this.route.queryParams.subscribe((params:any)=>{
      
      this.zone.run(() => {
        this.salespDetails = params;
      //
    //  this.salespDetails = JSON.parse(params.filter);
      console.log("salespdetail",this.salespDetails);

    });
    });
  }

  
  getItems(ev: any) {

    this.clientList = this.tempUsers;
    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.clientList = this.clientList.filter((item) => {
        return (item.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  addClient(person) {
            this.loading = true;
            this.user.addClient(person, this.salespDetails).then((res) => {
              if (res) {
                this.loading = false;
                // let toast = this.toastCtrl.create({
                //   message: 'Client has been added successfully',
                //   duration: 1000,
                //   position: 'bottom'
                // });

                // toast.onDidDismiss(() => {
                //  this.ionViewWillEnter();
                  let addedClientId = this.addedClientsArray.indexOf(person);
                  this.addedClientsArray.splice(addedClientId, 1);
                  alert (person.displayName+" Added to "+this.salespDetails.displayName);
                // });

                // toast.present();
              }
            })
          }
        }
      // ]
    // });
    // addalert.present(); 

  // }


// }
