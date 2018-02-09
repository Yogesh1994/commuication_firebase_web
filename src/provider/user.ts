import {Injectable} from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import { LocalStorageService } from 'angular-2-local-storage';
import * as firebase from 'firebase';

@Injectable()
export class UserServiceprovider {

    public obj = new ReplaySubject();
    public namearray: any= [];
    public databaseObj = firebase.database().ref('/SalesNClients');
    public databaseObj2 = firebase.database().ref('/chatUser');
    firedata = firebase.database().ref('/SalesNClients');
    getUser = firebase.database().ref('/chatUser');
    nameArray: any = [];
    messages:any=[];
    constructor(public storage: LocalStorageService, public firedb: AngularFireDatabase, public fireauth: AngularFireAuth) {
    }

    checkUserType() {
              this.databaseObj2.child(this.fireauth.auth.currentUser.uid).once('value', (snapshot) => {
                   const user_type = snapshot.val().user_type;
                   if (user_type === 'sales') {
                       this.obj.next({user_type: user_type, salesDetails: ''});
                   }else if (user_type === 'client') {
                       this.getallUser().then((res) => {
                            for (const i in res) {
                                if ( res[i].uid === snapshot.val().uid) {
                                      this.obj.next({user_type: user_type, salesDetails: res[i]});
                                }
                            }
                       });
                   }else if (user_type === 'admin' ) {
                        this.obj.next({user_type: user_type, salesDetails: ''});
                   }
              });
       return this.obj;

    }

    updatedisplayname(newname) {
        const promise = new Promise((resolve, reject) => {
          this.fireauth.auth.currentUser.updateProfile({
            displayName: newname,
            photoURL: this.fireauth.auth.currentUser.photoURL
          }).then(() => {
            this.databaseObj2.child(firebase.auth().currentUser.uid).update({
              displayName: newname,
              photoURL: this.fireauth.auth.currentUser.photoURL,
              uid: this.fireauth.auth.currentUser.uid
            }).then(() => {
              resolve({
                success: true
              });
            }).catch((err) => {
              reject(err);
            });
          }).catch((err) => {
            reject(err);
          });
        });
        return promise;
      }


    getmyClients() {
  
        this.namearray = [];
       const promise = new Promise((resolve, reject) => {
        this.databaseObj.child(this.storage.get('userUID')).on('value', (snapshot) => {
            const snaparray = snapshot.val();
            const temparray = [];

            // tslint:disable-next-line:forin
            for (const key in snaparray) {
                temparray.push(snaparray[key]);
            }
            this.getallUser().then((res: any) => {
                // tslint:disable-next-line:forin
                // tslint:disable-next-line:one-line
                // tslint:disable-next-line:forin
                for (const j in temparray) {
                    for (const i in res) {
                        if (res[i].uid === temparray[j].clientId) {
                            this.namearray.push(res[i]);
                        }
                    }
                }
                resolve(this.namearray);

            });
        });
       });
       return promise;
    }

    checkAlreadyadded(){  

      var promise = new Promise((resolve,reject)=>{
  
        this.firedata.orderByChild('uid').on('value',(snapshot)=>{
          this.messages = [];       
          let  temp = snapshot.val();
              for(let key in temp){     
               this.firedata.child(key).on('value',(snapshot)=>{
  
                  let clientarr = snapshot.val();
                  
                    for(let j in clientarr){
                     this.messages.push(clientarr[j]);
  
                    }
  
                })
                  
              }
              resolve(this.messages);     
        }) 
      });
      return promise;   
    }

    addClient(client, sales) {

      var promise = new Promise((resolve, reject) => {
        this.firedata.child(sales.uid).push({
          clientId: client.uid
        }).then(() => {
          this.getUser.child(client.uid).update({
            associate_sales:sales.uid
          })
          resolve({
            success: true
          })
        })
  
      });
  
      return promise;
    }
    getallUser() {
            const promise  = new Promise((resolve, reject) => {
                this.databaseObj2.orderByChild('uid').once('value', (snapshot) => {
                    const snaparray = snapshot.val();
                    const temparray = [];
                   // tslint:disable-next-line:forin
                   for (const key in snaparray) {
                           temparray.push(snaparray[key]);
                   }
                    resolve(temparray);
                }).catch((error) => {
                    reject(error);
                });
            });
        return promise;
    }

    updateimage(imageurl) {
        const promise = new Promise((resolve, reject) => {
          this.fireauth.auth.currentUser.updateProfile({
            displayName: this.fireauth.auth.currentUser.displayName,
            photoURL: imageurl
          }).then(() => {
            firebase.database().ref('/chatUser/' + firebase.auth().currentUser.uid).update({
              displayName: this.fireauth.auth.currentUser.displayName,
              photoURL: imageurl,
              uid: firebase.auth().currentUser.uid
            }).then(() => {
              resolve({
                success: true
              });
            }).catch((err) => {
              reject(err);
            });
          }).catch((err) => {
            reject(err);
          });
        });
        return promise;
      }
  
      adduser(newuser) {
        var promise = new Promise((resolve, reject) => {
          this.fireauth.auth.createUserWithEmailAndPassword(newuser.email, newuser.password).then((res:any) => {
          
            this.fireauth.auth.currentUser.updateProfile({
              displayName: newuser.displayName,
              photoURL: 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e'
            }).then(() => {
             
              this.getUser.child(res.uid).set({
                uid: res.uid,
                displayName: newuser.displayName,
                photoURL: 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e',
                email:newuser.email,
                user_type :newuser.userType,
    
              }).then(() => {
                resolve({ success: true });
                }).catch((err) => {
                  reject(err);
              })
              }).catch((err) => {
                reject(err);
            })
          }).catch((err) => {
            reject(err);
          })
        })
        return promise;
      }
}
