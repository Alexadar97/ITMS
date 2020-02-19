import { Component, OnInit, Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { WebserviceService } from '../../services/webservice.service';
import { DatatransferService } from '../../services/datatransfer.service';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthGuard } from '../../services/canactivate.service';
declare var $;

@Component({
  selector: 'app-employeeprof',
  templateUrl: './employeeprof.component.html',
  styleUrls: ['./employeeprof.component.css']
})
export class EmployeeprofComponent implements OnInit {
  /* validation */
  emailvalidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+")){2,}@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  numbervalidation = /^[0-9,/]+$/;
  alphanumeric = /^[a-zA-Z0-9]+$/;
  alphawithdot = /^[a-zA-Z. ]+$/;
  decimalnumber = /^(0|[1-9]\d*)(\.\d+)?$/;
  alpha = /^[a-zA-Z]+$/;
  passwordvalidation = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
  empidvalidation = /^[0-9a-zA-Z]+$/

  /* Forms */
  updateemployeeForm: FormGroup;

  /* session       */
  appcode: any;
  userid: any;
  isadmin: any;
  name: any;
  isrm: any;

  /* api */
  private getEmployeeDetails = this.getdata.appconstant + 'getEmployeeDetails';
  private viewEmployees = this.getdata.appconstant + 'viewEmployees';
  private resetPassword = this.getdata.appconstant + 'resetPassword';
  private deleteUsers = this.getdata.appconstant + 'deleteUsers';
  private updateEmployeeDetails = this.getdata.appconstant + 'updateEmployeeDetails';

  /* Parameters */
  viewEmployeesdata: any;
  profiledata: any;
  photo:any;
  
  constructor(private getsession: AuthGuard, private Formbuilder: FormBuilder, private router: Router, private makeapi: WebserviceService, private getdata: DatatransferService, private http: Http) {

    this.appcode = this.getsession.session().appcode;
    this.userid = this.getsession.session().empid;
    this.isadmin = this.getsession.session().admin;
    this.name = this.getsession.session().name;
    this.isrm = this.getsession.session().isrm;

    /*   form functions */
    this.updateemployeereactiveform()
  }

  ngOnInit() {
    /* functions call */
    this.viewemployee();
    this.getempdetails();
  }
  /*     Forms        */
  updateemployeereactiveform() {
    this.updateemployeeForm = this.Formbuilder.group({
      'designation': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      'rmdetails': [null],
      'rmemail': [null],
      'rmid': [null],
    });
  }
  /** view Employees */
  viewemployee() {
    var datatype = "userid=" + JSON.stringify({ "userid": this.userid }) + "&appcode=" + this.appcode;
    return this.makeapi.method(this.viewEmployees, datatype, 'post')
      .subscribe(
        data => {
          // data.forEach(data => {
          //   this.selectdata .push(data.name);
          //   });  
          //   this.roles = this.selectdata;
          //   console.log(this.roles) ;       
          this.viewEmployeesdata = data;
        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }
  /** get emp details Employees */
  getempdetails() {
    var datatype = "userid=" + localStorage.getItem('employeeid') + "&appcode=" + this.appcode;
    return this.makeapi.method(this.getEmployeeDetails, datatype, 'post')
      .subscribe(
        data => {
          // data.forEach(data => {
          //   this.selectdata .push(data.name);
          //   });  
          //   this.roles = this.selectdata;
          //   console.log(this.roles) ;       
          this.profiledata = data;
          if (data.profilepicture == "true") {
            var d = new Date();
            var n = d.getTime();
            this.photo = this.getdata.appconstant + 'getProfileImage?filename=' + data.pictureid + "&time=" + n;
          }
          else {
            this.photo = "assets/img/user.jpg";
          }
          if (data.rmemail != undefined) {
            this.updateemployeeForm.patchValue({
              designation: data.designation,
              rmdetails: data.rmemail + "|" + data.rmid,
              rmemail: data.rmemail,
              rmid: data.rmid
            })
          } else {
            this.updateemployeeForm.patchValue({
              designation: data.designation,
            })
          }
        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }
  /** Reset password */
  resetpassword() {
    var datatype = "userid=" + localStorage.getItem('employeeid') + "&appcode=" + this.appcode;
    return this.makeapi.method(this.resetPassword, datatype, 'post')
      .subscribe(
        data => {
          if (data.status == "success") {
            this.getdata.showNotification('bottom', 'right', 'Password Reset Successfully', "success");
            $("#changepass").modal("hide");
          } else {
            this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
          }
        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }

  /** Delete user */
  deleteuser() {
    var datatype = "userid=" + localStorage.getItem('employeeid') + "&appcode=" + this.appcode;
    return this.makeapi.method(this.deleteUsers, datatype, 'post')
      .subscribe(
        data => {
          if (data.status == "success") {
            this.getdata.showNotification('bottom', 'right', 'User Deleted Successfully', "success");
            $("#deleteemp").modal("hide");
            this.router.navigateByUrl('/dashboard/employee');
          } else {
            this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
          }
        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }

  /** update emp user */
  updateemp() {
    if (this.updateemployeeForm.value.rmdetails == (null || "" || undefined)) {
      delete this.updateemployeeForm.value.rmdetails;
      delete this.updateemployeeForm.value.rmid;
      delete this.updateemployeeForm.value.rmemail;
    }
    else {
      this.updateemployeeForm.patchValue({
        rmemail: this.updateemployeeForm.value.rmdetails.split("|")[0],
        rmid: this.updateemployeeForm.value.rmdetails.split("|")[1]
      });
      delete this.updateemployeeForm.value.rmdetails;
    }
    var datatype = "userid=" + localStorage.getItem('employeeid') + "&appcode=" + this.appcode + "&value=" + JSON.stringify( this.updateemployeeForm.value);
    return this.makeapi.method(this.updateEmployeeDetails, datatype, 'post')
      .subscribe(
        data => {
          if (data.status == "success") {
            this.getdata.showNotification('bottom', 'right', 'Profile Updated Successfully', "success");
            $("#editprofile").modal("hide");
            this.getempdetails();
          } else {
            this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
          }
        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }
}
