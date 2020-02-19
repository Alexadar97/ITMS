import { Injectable } from '@angular/core';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
declare var $: any;
@Injectable()
export class DatatransferService {
  appcode: any;
  userid: any;
  logintype: any;
  user_email: any;

  //Local Server
  // appconstant = "http://172.30.1.2:8080/iTMS/";

  //QA-Server
  appconstant = "http://139.59.75.83:8080/iTMS/";

  // appconstant = "https://13.127.167.85:8443/iTMS/";

  // Demo-Server
  // appconstant = "https://sevael.in/iTMS/";

  // getsession = JSON.parse(localStorage.getItem("sevinvoicesession"));
  constructor() {
    
  }

  public session: BehaviorSubject<any> = new BehaviorSubject<boolean>(false);
  getsession(value) {
    this.session.next(value);
  }
  showNotification(from, align, msg, type) {

    $.notify({
      icon: 'notifications',
      message: msg

    }, {
        type: type,
        timer: 4000,
        placement: {
          from: from,
          align: align
        }
      });
  }

  // appcode = 'vignesshgmailcom'
  // userid = 'users1';
  // logintype = 'superuser';
  //  getapi(value) {
  //      this.apidetail.next(value);
  //  }
}
