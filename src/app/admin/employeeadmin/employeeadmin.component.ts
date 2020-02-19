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
declare var moment;
declare var dateTo;
@Component({
  selector: 'app-employeeadmin',
  templateUrl: './employeeadmin.component.html',
  styleUrls: ['./employeeadmin.component.css'],

})
export class EmployeeadminComponent implements OnInit {
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
  addemployeeForm: FormGroup;

  /* session       */
  appcode: any;
  userid: any;
  isadmin: any;
  name: any;
  isrm: any;

  /* api */
  private addUsers = this.getdata.appconstant + 'addUsers';
  private viewEmployees = this.getdata.appconstant + 'viewEmployees';
  private searchEmployee = this.getdata.appconstant + 'searchEmployee';

  /* Parameters */
  viewEmployeesdata: any;
  selectdata = [];
  employeeprofileid: any;
  currentPage: number = 1;
  itemsPerPage: number = 8;
  searchString: any;

  constructor(private getsession: AuthGuard, private Formbuilder: FormBuilder, private router: Router, private makeapi: WebserviceService, private getdata: DatatransferService, private http: Http) {

    this.appcode = this.getsession.session().appcode;
    this.userid = this.getsession.session().empid;
    this.isadmin = this.getsession.session().admin;
    this.name = this.getsession.session().name;
    this.isrm = this.getsession.session().isrm;


  }

  /*     Forms        */
  addemployeereactiveform() {
    this.addemployeeForm = this.Formbuilder.group({
      'name': [null, Validators.compose([Validators.required, Validators.pattern(this.alphawithdot), Validators.maxLength(40)])],
      'dateofbirth': [null, Validators.compose([Validators.required])],
      'mobile': [null, Validators.compose([Validators.required, Validators.pattern(this.numbervalidation), Validators.minLength(10), Validators.maxLength(15)])],
      'joindate': [null, Validators.compose([Validators.required])],
      'designation': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      'gender': [null, Validators.compose([Validators.required])],
      'email': [null, Validators.compose([Validators.required, Validators.pattern(this.emailvalidation)])],
      'employeeid': [null, Validators.compose([Validators.required, Validators.pattern(this.empidvalidation)])],
      'rmdetails': [null],
      'rmemail': [null],
      'rmid': [null],
    });
  }


  ngOnInit() {
    /* functions call */
    this.viewemployee();
    /* forms function  */
    this.addemployeereactiveform();
    console.log(moment().subtract(18, 'years').format('YYYY-MM-DD'));

    $('#dateofbirth').datetimepicker({
      format: 'DD-MM-YYYY',
      maxDate: moment().subtract(18, 'years'),
    });

    $('#dateofjoining').datetimepicker({
      // useCurrent: false, //Important! See issue #1075
      format: 'DD-MM-YYYY',
      minDate: moment(),
    });

    $('#dateofbirth').on('dp.change', (e) => {
      this.addemployeeForm.patchValue({
        dateofbirth: moment(e.date).format('DD-MM-YYYY')
      });
      $('#dateofjoining').data("DateTimePicker").minDate(moment(e.date).add(18, 'years').format('DD-MM-YYYY'));
    })
    $('#dateofjoining').on('dp.change', (e) => {
      this.addemployeeForm.patchValue({
        joindate: moment(e.date).format('DD-MM-YYYY')
      });
    })

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

  /** Add employee */
  addemployee() {

    if (this.addemployeeForm.value.rmdetails == (null || "" || undefined)) {
      delete this.addemployeeForm.value.rmdetails;
      delete this.addemployeeForm.value.rmid;
      delete this.addemployeeForm.value.rmemail;
    }
    else {
      this.addemployeeForm.patchValue({
        rmemail: this.addemployeeForm.value.rmdetails.split("|")[0],
        rmid: this.addemployeeForm.value.rmdetails.split("|")[1]
      });
      delete this.addemployeeForm.value.rmdetails;
    }

    var joindate = this.addemployeeForm.value.joindate.split("-");
    this.addemployeeForm.value["joindate"] = joindate[2] + "-" + joindate[1] + "-" + joindate[0];

    var dateofbirth = this.addemployeeForm.value.dateofbirth.split("-");
    this.addemployeeForm.value["dateofbirth"] = joindate[2] + "-" + joindate[1] + "-" + joindate[0];

    var finaldata = "empobj=" + JSON.stringify(this.addemployeeForm.value) + "&appcode=" + this.appcode;

    return this.makeapi.method(this.addUsers, finaldata, 'post')
      .subscribe(
        data => {
          if (data.status == "success") {
            $("#addemployee").modal("hide");
            this.getdata.showNotification('bottom', 'right', 'Employee Added Successfully', "success");
            // this.viewemployee();
            this.ngOnInit();
          } else if (data.isExists == "employeeid") {
            this.getdata.showNotification('bottom', 'right', 'Employee Already Exists', "danger");
          } else if (data.exists == "email") {
            this.getdata.showNotification('bottom', 'right', 'Email Already Exists', "danger");
          }
        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );

  }

  setempprofileid(userid) {
    this.employeeprofileid = userid;
    localStorage.setItem("employeeid", userid);
    this.router.navigateByUrl('/dashboard/employeeprof');
  }

  // searchtable(inputid, tableid) {
  //   // Declare variables 
  //   var input, filter, table, tr, td, i;
  //   input = document.getElementById(inputid);
  //   filter = input.value.toUpperCase();
  //   table = document.getElementById(tableid);
  //   tr = table.getElementsByTagName("tr");

  //   // Loop through all table rows, and hide those who don't match the search query
  //   for (i = 0; i < tr.length; i++) {
  //     td = tr[i].getElementsByTagName("td")[0];
  //     if (td) {
  //       if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
  //         tr[i].style.display = "";
  //       } else {
  //         tr[i].style.display = "none";
  //       }
  //     }
  //   }
  // }
  searchtable(text) {
    this.currentPage = 1;
    var datatype = "searchstr=" + text + "&appcode=" + this.appcode;
    return this.makeapi.method(this.searchEmployee, datatype, 'post')
      .subscribe(
        data => {
          this.viewEmployeesdata = data;
 },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
    }
}
