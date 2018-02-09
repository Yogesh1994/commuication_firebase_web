import { Component, Injectable } from '@angular/core';
import { UserCredentials } from '../model/interface/usercredentials';
import { AngularFireAuth } from 'angularfire2/auth';


@Injectable()
export class AuthProvider {
    usercredentials = {} as UserCredentials;
    constructor(private fireauth: AngularFireAuth) { }

    login( userCredentials: UserCredentials) {
        const promise = new Promise((resolve, reject) => {
            this.fireauth.auth.signInWithEmailAndPassword(userCredentials.email, userCredentials.password).then((res: any) => {
               console.log('reply', res);
                resolve({success: true, uid: res.uid});
            }).catch((error) => {
                reject(error);
            });
        });
        return promise;
    }
}
