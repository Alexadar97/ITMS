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
declare var $: any;
declare var moment: any;

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {
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
  addleaveForm: FormGroup;
  addofficehoursForm: FormGroup;
  changepassprofileForm: FormGroup;

  /* session       */
  appcode: any;
  userid: any;
  isadmin: any;
  name: any;
  isrm: any;

  /* Parameters */
  monthlyholidaydata: any;
  leaveid: any;
  overlapingtext: any;
  weekoffdays = [];
  currentPage: number = 1;
  itemsPerPage: number = 8;

  eyetypeold = "glyphicon glyphicon-eye-close";
  oldtype = "password";
  showoldpassword = false;
  oldcolor = "#000";

  eyetypecurrent = "glyphicon glyphicon-eye-close";
  currenttype = "password";
  showcurrentpassword = false;
  currentcolor = "#000";

  eyetypeconfirm = "glyphicon glyphicon-eye-close";
  confirmtype = "password";
  showconfirmpassword = false;
  confirmcolor = "#000";
  /* api */
  private getMonthlyHolidays = this.getdata.appconstant + 'getMonthlyHolidays';
  private deleteHoliday = this.getdata.appconstant + 'deleteHoliday';
  private addHolidays = this.getdata.appconstant + 'addHolidays';
  private addWorkHours = this.getdata.appconstant + 'addWorkHours';
  private getWeekoff = this.getdata.appconstant + 'getWeekoff';
  private changePassword = this.getdata.appconstant + 'changePassword';

  constructor(private getsession: AuthGuard, private Formbuilder: FormBuilder, private router: Router, private makeapi: WebserviceService, private getdata: DatatransferService, private http: Http) {

    this.appcode = this.getsession.session().appcode;
    this.userid = this.getsession.session().empid;
    this.isadmin = this.getsession.session().admin;
    this.name = this.getsession.session().name;
    this.isrm = this.getsession.session().isrm;

    /* forms function  */
    this.addleavereactiveform();
    this.addofficehourseactiveform();
    this.changepassreactiveform()

  }
  /*     Forms        */
  addleavereactiveform() {
    this.addleaveForm = this.Formbuilder.group({
      'holidaytype': [null, Validators.compose([Validators.required])],
      'holidaydate': [null, Validators.compose([Validators.required])],
      'reason': [null, Validators.compose([Validators.required])],
    });
  }

  toggleold() {
    this.showoldpassword = !this.showoldpassword;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.showoldpassword) {
      this.eyetypeold = "glyphicon glyphicon-eye-open";
      this.oldtype = "text";
      this.oldcolor = "green";
    }
    else {
      this.eyetypeold = "glyphicon glyphicon-eye-close";
      this.oldtype = "password";
      this.oldcolor = "#000";
    }
  }
  togglecurrent() {
    this.showcurrentpassword = !this.showcurrentpassword;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.showcurrentpassword) {
      this.eyetypecurrent = "glyphicon glyphicon-eye-open";
      this.currenttype = "text";
      this.currentcolor = "green";
    }
    else {
      this.eyetypecurrent = "glyphicon glyphicon-eye-close";
      this.currenttype = "password";
      this.currentcolor = "#000";
    }
  }
  toggleconfirm() {
    this.showconfirmpassword = !this.showconfirmpassword;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.showconfirmpassword) {
      this.eyetypeconfirm = "glyphicon glyphicon-eye-open";
      this.confirmtype = "text";
      this.confirmcolor = "green";
    }
    else {
      this.eyetypeconfirm = "glyphicon glyphicon-eye-close";
      this.confirmtype = "password";
      this.confirmcolor = "#000";
    }
  }
  addofficehourseactiveform() {
    this.addofficehoursForm = this.Formbuilder.group({
      'hours': [null, Validators.compose([Validators.required])],
      'breakperday': [null, Validators.compose([Validators.required])],
      'weekoff': [null, Validators.compose([Validators.required])],
      'isforceadd': [false, Validators.compose([Validators.required])],
    });
  }

  changepassreactiveform() {
    this.changepassprofileForm = this.Formbuilder.group({
      'oldpassword': ['', Validators.compose([Validators.required,,Validators.pattern(this.passwordvalidation)])],
      'password': ['', Validators.compose([Validators.required,,Validators.pattern(this.passwordvalidation)])],
      'confirmpassword': ['', Validators.compose([Validators.required,,Validators.pattern(this.passwordvalidation)])],
    });
  }
  ngOnInit() {

    /* functions call */
    this.monthlyholiday("onload");
    this.getweekoff();

    /* for datepicker */
    $('#leavesearch').datetimepicker({
      viewMode: 'months',
      format: 'MM/YYYY',
      defaultDate: new Date(),
    });

    $('#addholidaydate').datetimepicker({
      // format: 'DD/MM/YYYY',
      // daysOfWeekDisabled: data.weekoff
    });

    $('#addholidaydate').on('dp.change', (e) => {
      console.log(e.date);
      this.addleaveForm.patchValue({
        holidaydate: moment(e.date).format('DD-MM-YYYY')
      });
    })

    /* for modal */

    $('#overlap').on('show.bs.modal', function () {
      $('#addofficehrs').modal('hide');
    });

  }

  /** Monthly Holidays */
  monthlyholiday(type) {
    if (type == "onload") {
      var month = moment().month() + 1;
      var year = moment().year()

    } else if (type == "search") {
      var getdate = $('#leavesearch').data("DateTimePicker").date()
      month = new Date(getdate).getMonth() + 1;
      year = new Date(getdate).getFullYear();
    }
    var datatype = "month=" + month + "&year=" + year + "&appcode=" + this.appcode;
    return this.makeapi.method(this.getMonthlyHolidays, datatype, 'post')
      .subscribe(
        data => {
          // data.forEach(data => {
          //   this.selectdata .push(data.name);
          //   });  
          //   this.roles = this.selectdata;
          //   console.log(this.roles) ;       
          this.monthlyholidaydata = data;
        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }

  /** delete Holidays */
  deleteholiday() {
    var datatype = "id=" + this.leaveid + "&appcode=" + this.appcode;
    return this.makeapi.method(this.deleteHoliday, datatype, 'post')
      .subscribe(
        data => {
          if (data.status == "success") {
            this.getdata.showNotification('bottom', 'right', 'Leave Deleted Successfully', "success");
            $("#deleteholiday").modal("hide");
            this.monthlyholiday("onload");
          } else {
            this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
          }
        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }
  /** Add employee */
  addholiday() {
    // this.addleaveForm.value.holidaydate = moment(this.addleaveForm.value.holidaydate).format('YYYY-MM-DD')

    var leave = this.addleaveForm.value.holidaydate.split("-");
    this.addleaveForm.value["holidaydate"] = leave[2] + "-" + leave[1] + "-" + leave[0];

    var holidaytype = this.addleaveForm.value.holidaytype;
    var reason = this.addleaveForm.value.reason;
    var holidaydate = this.addleaveForm.value.holidaydate;

    var finaldata = "holidaytype=" + holidaytype + "&holidaydate=" + holidaydate + "&reason=" + reason + "&appcode=" + this.appcode;
    return this.makeapi.method(this.addHolidays, finaldata, 'post')
      .subscribe(
        data => {
          if (data.status == "success") {
            this.getdata.showNotification('bottom', 'right', 'Holiday Added Successfully', "success");
            $("#addholiday").modal("hide");
            this.monthlyholiday("onload");
          } else if (data.status == "failure") {
            this.getdata.showNotification('bottom', 'right', 'The selected date is already a holiday! Please delete and add again', "danger");
          }
          else {
            this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
          }
        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }

  /** Add office hours */
  addofficehours() {

    var hours = this.addofficehoursForm.value.hours;
    var breakperday = this.addofficehoursForm.value.breakperday;
    var weekoff = JSON.stringify(this.addofficehoursForm.value.weekoff);
    var isforceadd = this.addofficehoursForm.value.isforceadd;

    var finaldata = "hours=" + hours + "&breakperday=" + breakperday + "&weekoff=" + weekoff + "&isforceadd=" + isforceadd + "&appcode=" + this.appcode;
    return this.makeapi.method(this.addWorkHours, finaldata, 'post')
      .subscribe(
        data => {
          if (data.status == "success") {
            this.getdata.showNotification('bottom', 'right', 'Office Hours  Added Successfully', "success");
            $("#addofficehrs").modal("hide");
            $('#overlap').modal('hide');
            this.addofficehourseactiveform();
            this.getweekoff();
          } else if (data.status == "failure") {

            this.overlapingtext = "Some holiday(s) are overlapping with week off days. Are you sure you want to change this holiday to week off leave?"
            this.addofficehoursForm.patchValue({
              isforceadd: true
            });
            $('#overlap').modal('show');
          } else {
            this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
          }
        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }
  weekoff = [];
  /** get weekoff */
  getweekoff() {
    var datatype = "appcode=" + this.appcode;
    return this.makeapi.method(this.getWeekoff, datatype, 'post')
      .subscribe(
        data => {
          this.weekoff = [];
          data.weekoff.forEach(data2 => {
            if (data2 == 7) {
              data2 = 0;
            }
            this.weekoff.push(data2);
          })
          $('#addholidaydate').datetimepicker('destroy');

          $('#addholidaydate').datetimepicker({
            daysOfWeekDisabled: this.weekoff,
            format: 'DD/MM/YYYY',
          });
        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }
  setleaveid(leaveid) {
    this.leaveid = leaveid;
  }

  /** change pass */
  changepass() {
    if (this.changepassprofileForm.value.password == this.changepassprofileForm.value.oldpassword) {
      this.getdata.showNotification('bottom', 'right', 'Current and new password should not be same', "danger");
      return false;
    } else if (this.changepassprofileForm.value.password != this.changepassprofileForm.value.confirmpassword) {
      this.getdata.showNotification('bottom', 'right', 'New and confirm password must be same', "danger");
      return false;
    }
    delete this.changepassprofileForm.value.confirmpassword;
    var datatype = "appcode=" + this.appcode + "&userid=" + this.userid + "&oldpassword=" + this.changepassprofileForm.value.oldpassword + "&password=" + this.changepassprofileForm.value.password;
    return this.makeapi.method(this.changePassword, datatype, 'post')
      .subscribe(
        data => {
          if (data.status == "success") {
            $("#changepass").modal("hide")
            this.getdata.showNotification('bottom', 'right', 'Password changed successfully', "success");
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
