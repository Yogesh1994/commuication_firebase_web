import { Component, OnInit, NgZone, ViewChild, ElementRef} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ChatServiceprovider} from '../../provider/chat';
import {FormBuilder, Validators, Form, ReactiveFormsModule } from '@angular/forms';
import {ImagehandlerService} from '../../provider/imagehandler.service';
import {ChatListComponent} from '../chat-list/chat-list.component';
import {Location} from '@angular/common';
import {saveAs as importedSaveAs} from 'file-saver';
@Component({
    selector: 'app-login',
    templateUrl: './chat-details.component.html',
    styleUrls: ['./chat-details.component.css']
})
export class ChatDetailsComponent implements OnInit {
    @ViewChild('content') private content: ElementRef;
    salesDetails: any = [];
    user_type: any;
    displayName: any;
    photoURL: any;
    uid: any;
    message: any;
    allMessages: any = [];
    imageOrNot: any = [];
    userForm: any;
    flag = false;
    constructor(public fb: FormBuilder , public zone: NgZone, public location: Location,
                public chatService: ChatServiceprovider, public route: ActivatedRoute,
                public imageService: ImagehandlerService, public router: Router) {
               this.initializeMessage();
                }
      initializeMessage() {
      this.userForm =    this.fb.group({
        message : ['', Validators.compose([Validators.required])]
    });

     }

    ngOnInit() {

        this.message = '';
        this.onScroll();

        this.route.queryParams.subscribe((params: any) => {
            this.zone.run(() => {
                 // tslint:disable-next-line:one-line

                    this.salesDetails =  JSON.parse(params.filter);
                    this.displayName = this.salesDetails.displayName;
                    this.photoURL = this.salesDetails.photoURL;
                    this.uid = this.salesDetails.uid;
                // tslint:disable-next-line:one-line
          });
            });

            this.chatService.getMessages(null).subscribe( (newMessages: any) => {
                this.allMessages = [];
                this.imageOrNot = [];
                this.zone.run(() => {
                  this.allMessages = newMessages;
                  // tslint:disable-next-line:forin
                  for (const key in this.allMessages ) {
                    if (this.allMessages[key].message.substring(0, 4) === 'http' ||
                         this.allMessages[key].message.substring(0, 4) === 'https' ) {
                      this.imageOrNot.push(this.allMessages[key].messageType);
                    }
                    // tslint:disable-next-line:one-line
                    else {
                      this.imageOrNot.push(this.allMessages[key].messageType);

                    }
                  }

                });
                console.log('Message', this.allMessages);
                this.onScroll();
              });
              this.chatService.updateSeen();
    }


    sendMessage() {
        this.chatService.addMessage(this.userForm.value.message, null, null).then((res: any) => {
          this.onScroll();
        //   this.nativeAudio.play('assets/sound/send_message.mp3', () => console.log('uniqueId1 is done playing'));
        //  this.audoProvider.play('sendSuccess');
        this.initializeMessage();
        });
    }

    updateUrl(ev: any) {
        console.log(ev);
        console.log(ev.target.value);
    }
    onScroll() {
        setTimeout(() => {
          this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
        }, 1000);
      }


      selectFiles(ev: any) {
         const file =  ev.target.files;
          let flag = true;
        //  else{}
          // tslint:disable-next-line:forin
         for ( let element = 0; element < file.length; element++ ) {
             const fileName = file[element].name;
             const splitted = fileName.split('.');
             const array = ['jpg', 'jpeg', 'png', 'xlsx', 'xls', 'xlsm', 'pdf'];

             if ( array.indexOf(splitted[1]) === -1) {
                    flag = false;
                    break;
              }
         }

         if ( flag ) {

          for ( let element = 0; element < file.length; element++ ) {
            const fileName = file[element].name;
            const splitted = fileName.split('.');

            this.imageService.uploadFiles(file[element], splitted[1]).then((response: any) => {
              // this.chatService.addMessage(this.)
              this.onScroll();

             });
          }

         }else {
          alert('All Files May not have required format');
         }

        // this.imageService.uploadFiles(file.item(0));
      }
      backtoPage() {
        console.log('Helllloo');
        this.location.back();
      }
      gotoProfile() {
        this.router.navigate(['/profile']);
      }
}
