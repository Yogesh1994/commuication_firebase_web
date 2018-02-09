import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { Route } from '@angular/router/src/config';
import {LoginComponent} from './login/login.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import {PageNotFoundComp} from './pageNotFound';
import {ChatDetailsComponent} from './chat-details/chat-details.components';
import {ProfileComponent} from './profile/profile.component';
import { AdminHomeComponent } from './admin-home/admin-home.component'
import {AuthGuard} from './auth.guard';
import { SelectSalesComponent } from './select-sales/select-sales.component';
import { AssignClientsComponent } from './assign-clients/assign-clients.component';
import { AddUserComponent } from './add-user/add-user.component';

const route: Routes = [
    {path: '', component: LoginComponent},
    {path:'selectSales', component:SelectSalesComponent},
    {path: 'chatList', canActivate: [AuthGuard] , component: ChatListComponent},
    {path: 'chatDetails', canActivate: [AuthGuard], component: ChatDetailsComponent},
    {path: 'profile', canActivate: [AuthGuard], component: ProfileComponent},
    {path: 'adminHome', canActivate: [AuthGuard], component: AdminHomeComponent},
    {path: 'AssignClientsPage', canActivate: [AuthGuard], component: AssignClientsComponent}, 
     
    {path: 'AddUser',canActivate:[AuthGuard], component:AddUserComponent}, 
    {path: '**', canActivate: [AuthGuard], component: PageNotFoundComp}
];

@NgModule({
    imports: [
        RouterModule.forRoot(route)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}
