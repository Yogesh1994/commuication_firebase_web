import {Injectable} from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import * as firebase from 'firebase';
import { Http } from '@angular/http';

@Injectable()
export class ChatServiceprovider {

user: any;
messages: any = [];
today = new Date();

usersChat = firebase.database().ref('/UsersChatDetails');
clientTokendb = firebase.database().ref('/chatUser');
    messageObj = new ReplaySubject();
    constructor(public fireAuth: AngularFireAuth, public http: Http) { }
    // tslint:disable-next-line:one-line
    initializeUser(user){
        this.user = user;
    }

    getMessages(otheruid) {
        let toUID = '';
        if (otheruid === null) {
            toUID = this.user.uid;
        }else {
            toUID = otheruid;
        }
        this.usersChat.child(this.fireAuth.auth.currentUser.uid).child(toUID).on('value', (snapshot) => {
          this.messages = [];
          const temp = snapshot.val();
         
              // tslint:disable-next-line:forin
              for (const key in temp) {
                  this.messages.push(temp[key]);
              }
              this.messageObj.next( this.messages);
        });
        return this.messageObj;
      }

      getunreadCounter(otheruid) {
        let counter = 0;
        const promise = new Promise((resolve, reject) => {
            this.usersChat.child(this.fireAuth.auth.currentUser.uid).child(otheruid).on('value', (snapshot) => {
                const temp = snapshot.val();
                // tslint:disable-next-line:forin
                for (const key in temp) {
                    if ( temp[key].read === false) {
                        counter++;
                    }
                }
                resolve(counter);
            });
        });
        return promise;
      }

      addMessage(msg, msgType, fileName) {
        const timenDate = this.today.toLocaleTimeString() + ' on ' + this.today.toLocaleDateString();
          const promise  = new Promise ((resolve, reject) => {
            console.log('current User',  firebase.auth().currentUser);
            this.usersChat.child(this.fireAuth.auth.currentUser.uid).child(this.user.uid).push({
              sentBy : this.fireAuth.auth.currentUser.uid,
              sentByName : firebase.auth().currentUser.email,
              message: msg,
              timestamp: firebase.database.ServerValue.TIMESTAMP,
              messageType: msgType,
              fileName: fileName,
              time: timenDate,
              messageDate: this.today.toLocaleDateString(),
              read: false
            }).then(() => {
                this.usersChat.child(this.user.uid).child(firebase.auth().currentUser.uid).push({
                 sentBy :  this.fireAuth.auth.currentUser.uid,
                 sentByName : firebase.auth().currentUser.email,
                 message: msg,
                 timestamp: firebase.database.ServerValue.TIMESTAMP,
                 messageType: msgType,
                 fileName: fileName,
                 time: timenDate,
                 messageDate: this.today.toLocaleDateString(),
                 read: false
                });
            }).then(() => {
               
                this.clientTokendb.child(this.user.uid).once('value',(snapshot)=>{

                    const tokenArray = snapshot.val();
                    const link = 'https://www.binnysworld.com/communication_app/store_message.php';
                    const  data = JSON.stringify({'sentBy': this.fireAuth.auth.currentUser.uid,
                                                   'sentByName': firebase.auth().currentUser.email,
                                                  'sentTo': this.user.uid,
                                                  'message': msg, 'messageType': msgType,
                                                  'fileName': fileName, 
                                                  'messageDate': this.today.toLocaleDateString(),
                                                 'sentToToken': tokenArray['token'] });
                    this.http.post(link, data).map(res => res.json()).subscribe((data) => {
                            console.log(data);
                    });
                });
              

              resolve(true);
            });

         });
         return promise;


        }

      updateSeen() {
          this.usersChat.child(this.fireAuth.auth.currentUser.uid).child(this.user.uid).once('value', (snapshot) => {
              const tempArray = snapshot.val();
              // tslint:disable-next-line:forin
              for (const key in tempArray) {
               //  tempArray[key]
                 console.log(key);
                 this.usersChat.child(this.fireAuth.auth.currentUser.uid).child(this.user.uid).child(key).update({
                            read: true
                    }).then(() => {});
              }
          });

        // this.usersChat.child(this.fireAuth.auth.currentUser.uid).child(this.user.uid).update({
        //         read: true
        // }).then(() => {
        //     this.usersChat.child(this.user.uid).child(this.fireAuth.auth.currentUser.uid).update({
        //         read: true
        //     });
        // });
      }
}
