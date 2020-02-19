import { Component, OnInit, Injectable, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';
import { WebserviceService } from '../services/webservice.service';
import { DatatransferService } from '../services/datatransfer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  test: Date = new Date();
  errormsg: any;
  loginForm: FormGroup;
  finalappcode: any;
  
  emailvalidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+")){1,}@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  numbervalidation = /^[0-9,/]+$/;
  alphanumeric = /^[a-zA-Z0-9]+$/;
  alphawithdot = /^[a-zA-Z. ]+$/;
  decimalnumber = /^(0|[1-9]\d*)(\.\d+)?$/;
  passwordvalidation = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;

  /** Api Call */
  private loginapi = this.getdata.appconstant + 'login';

  ipaddress:any;
  
  constructor(private Formbuilder: FormBuilder, private router: Router, private makeapi: WebserviceService, private http: Http, private getdata: DatatransferService) {
   

    
    this.loginForm = Formbuilder.group({
      'email': [null, Validators.compose([Validators.required, Validators.pattern(this.emailvalidation)])],
      'password': [null, Validators.compose([Validators.required])],
    });

   
  }

  ngOnInit() {
    this.session();

    if (this.session() != null && this.session().status == "success" && this.session().admin == "true") {
      this.router.navigateByUrl('/dashboard/employee');
    }
    else if (this.session() != null && this.session().status == "success" && this.session().admin == "false") {
      this.router.navigateByUrl('/dashboard/home');
    }
  }

  /** Get Session Data */
  session() {
    return JSON.parse(localStorage.getItem("iTMSsession"));
  }

  /** Login Form On submit */
  login() {
    let logindata = 'loginUser=' + JSON.stringify(this.loginForm.value);
    return this.makeapi.method(this.loginapi, logindata, "post")
      .subscribe(data => {
        if (data.status == "success" && data.admin == "true") {
          localStorage.setItem("iTMSsession", JSON.stringify(data));
          this.router.navigateByUrl('/dashboard/employee');

        }
        else if (data.status == "success" && data.admin == "false") {
          localStorage.setItem("iTMSsession", JSON.stringify(data));
          localStorage.setItem("firsttimelogin", data.firsttimelogin);
          this.router.navigateByUrl('/dashboard/home');

        }
        else {
          this.errormsg = 'Invalid Username or Password';
        }

      },
        Error => {
          // alert( 'add stock error' );
        });
  }

}
