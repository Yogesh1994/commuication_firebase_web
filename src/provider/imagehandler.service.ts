import { Injectable } from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as  firebase from 'firebase';
import {ChatServiceprovider} from '../provider/chat';
import {saveAs as importedSaveAs, RequestOptions, ResponseContentType } from 'file-saver';
import { Observable } from 'rxjs/Observable';
import {Http} from '@angular/http';

@Injectable()
export class ImagehandlerService {

  private basePath: any = '/uploads';
  private uploadtask: firebase.storage.UploadTask;
  $key: string;
  file: File;
  name: string;
  details: any = [];
  progress: number;
  createDate: Date = new Date();
  currentTime: any;
  constructor(public http: Http, public chatService: ChatServiceprovider, public fireauth: AngularFireAuth) {
   this.currentTime = this.createDate.getUTCMilliseconds() ;
  }

   uploadFiles(files, extension) {

     const promise = new Promise((resolve, reject) => {
        const storageRef = firebase.storage().ref('/SentFiles/' + firebase.auth().currentUser.uid);
        const tmpFile = files.name;
        const splitted = tmpFile.split('.');
        const newFileName =  splitted[0] + this.currentTime + '.' + splitted[1];
        this.uploadtask = storageRef.child(newFileName).put(files);
        this.uploadtask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot: any) => {
             if (snapshot.downloadURL !== null) {
               
             alert(files.name + ' Sent ' + (snapshot.bytesTransferred / snapshot.totalBytes) * 100 + ' %');
              this.chatService.addMessage(snapshot.downloadURL, extension, newFileName).then((res: any) => {
                resolve(true);
              });
             }else{
             
             }
        }, (error) => {
          reject( error );
        }, () => {
          // if( extension!=='jpg' || extension!=='png' || extension!=='jpeg' ){
          //   this.details = this.uploadtask.snapshot;
          //   const URL = this.uploadtask.snapshot.downloadURL;
          //    this.chatService.addMessage(URL, extension, files.name).then((res: any) => {
          //     resolve(true);
          //   });
          // }
 
        });
     });
     return promise;
    }


  uploadimage(file) {
    const user = firebase.auth().currentUser.uid;
  //  console.log(user);
    const imageStore = firebase.storage().ref(user).child('/profilepic');

    // var imageStore = this.firestore.ref(user).child('/profilepic');alert(imageStore);
    const promise = new Promise((resolve, reject) => {
      const tmpFile = file.name;
      const splitted = tmpFile.split('.');
      const newFileName =  firebase.auth().currentUser.uid + '.' + splitted[1];
      this.uploadtask = imageStore.child(newFileName).put(file);
      this.uploadtask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot: any) => {
        if ( snapshot.downloadURL !== null ) {
          resolve(snapshot.downloadURL);
        }
      }, (error) => {
        reject(error);
      });
    });
     return promise;
  }

 }
