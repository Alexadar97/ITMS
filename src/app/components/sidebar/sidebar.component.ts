import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from '../../services/canactivate.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: 'home', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: 'upload', title: 'Upload File',  icon:'bubble_chart', class: '' },
    { path: 'settlement', title: 'Voucher Settlement',  icon:'content_paste', class: '' },
    { path: 'issuereport', title: 'Advance issued report',  icon:'library_books', class: '' },
    { path: '../login', title: 'Logout',  icon:'unarchive', class: 'active-pro'},
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  logintype: any;
/* session       */
appcode: any;
userid: any;
isadmin: any;
name: any;
isrm: any;
  constructor(public router: Router, private getsession: AuthGuard) { 
    this.appcode = this.getsession.session().appcode;
    this.userid = this.getsession.session().empid;
    this.isadmin = this.getsession.session().admin;
    this.name = this.getsession.session().name;
    this.isrm = this.getsession.session().isrm;
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.logintype = localStorage.getItem('logintype');
    console.log(this)
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  
}
