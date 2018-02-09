import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserServiceprovider} from '../../provider/user';
import {ChatServiceprovider} from '../../provider/chat';


@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit, OnDestroy {

  user_type: any;
  clientList: any = [];
  newclientList: any = [];
  service: any;
  loading: any = false;
  unreadArray: any = [];
  constructor(public chatService: ChatServiceprovider, public router: Router, public  zone: NgZone,
              public userService: UserServiceprovider , public route: ActivatedRoute) {
                 setInterval(() => {
                  this.zone.run(() => {
                    this.ngOnInit();
                  });
                 }, 6000);
               }

  ngOnInit() {

    this.unreadArray = [];
    this.loading = true;
    this.clientList = [];
    this.newclientList = [];
    // this.route.params.subscribe((param: any) => {
    //     this.user_type = param.user_type;
    // });
    this.zone.run(() => {
      this.userService.getmyClients().then((res: any) => {

        this.clientList = [];
        this.loading = false;
        this.clientList = res;
        // tslint:disable-next-line:forin
        for ( const key in this.clientList) {
          this.chatService.getunreadCounter(this.clientList[key].uid).then(data => {
            this.unreadArray.push(data);
          });
        }

      });
    });

console.log(this.unreadArray);

  }

  goto()  {
      this.router.navigate(['/profile']);
  }
  gotoChatDetails(user) {
    this.chatService.initializeUser(user);
    this.router.navigate(['/chatDetails'], {
      queryParams: {
        user_type: user.user_type,
        filter: JSON.stringify(user)
      }
    });
  }

  ngOnDestroy() {
    // this.userService.getmyClients().unsubscribe();
  }

 

}
