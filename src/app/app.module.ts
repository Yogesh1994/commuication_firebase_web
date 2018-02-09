import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { config } from './app.firebaseconfig';
import { AppComponent } from './app.component';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireModule} from 'angularfire2';
import { LoginComponent } from './login/login.component';
import {AppRoutingModule} from './app.routing';
import { AuthProvider } from '../provider/auth';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import { ChatListComponent } from './chat-list/chat-list.component';
import {PageNotFoundComp} from './pageNotFound';
import {UserServiceprovider} from '../provider/user';
import {ChatDetailsComponent} from './chat-details/chat-details.components';
import {ChatServiceprovider} from '../provider/chat';
import {ImagehandlerService} from '../provider/imagehandler.service';
import {HttpModule} from '@angular/http';
import { ProfileComponent } from './profile/profile.component';
import { LocalStorageModule } from 'angular-2-local-storage';
import {AuthGuard} from './auth.guard';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { SelectSalesComponent } from './select-sales/select-sales.component';
import { AssignClientsComponent } from './assign-clients/assign-clients.component';
import { AddUserComponent } from './add-user/add-user.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatListComponent,
    PageNotFoundComp,
    ChatDetailsComponent,
    ProfileComponent,
    AdminHomeComponent,
    SelectSalesComponent,
    AssignClientsComponent,
    AddUserComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(config),
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireDatabaseModule,
    HttpModule,
    LocalStorageModule.withConfig({
      prefix: 'my-app',
      storageType: 'localStorage'
  })
  ],
  providers: [  AuthGuard, AuthProvider, AngularFireAuth, UserServiceprovider, ChatServiceprovider, ImagehandlerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
