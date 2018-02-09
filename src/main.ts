import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {config} from './app/app.firebaseconfig';
import * as firebase from 'firebase';


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

  firebase.initializeApp(config);
  const messaging  = firebase.messaging();

  messaging.requestPermission().then(() => {
    console.log('Persmission Granted');
  }).catch((Error) => {
    console.log('Error', Error);
  });
  
  
messaging.getToken().then(function(token){
  console.log('Token', token);
}).catch(function(error){
  console.log('Unable to get permission to notify.',error);
});

 

