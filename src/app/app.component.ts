import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  message: any;
  constructor( public storage: LocalStorageService) {
    console.log(this.storage.get('loggedIn'));

  }
  ngOnInit() {
  }

}
