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
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit {
  /* validation */
  emailvalidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+")){2,}@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  numbervalidation = /^[0-9,/]+$/;
  alphanumeric = /^[a-zA-Z0-9]+$/;
  alphawithdot = /^[a-zA-Z. ]+$/;
  decimalnumber = /^(0|[1-9]\d*)(\.\d+)?$/;
  alpha = /^[a-zA-Z]+$/;
  passwordvalidation = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
  empidvalidation = /^[0-9a-zA-Z]+$/

  /* session       */
  appcode: any;
  userid: any;
  isadmin: any;
  name: any;
  isrm: any;

  /* api */
  private getCheckIODetails = this.getdata.appconstant + 'getCheckIODetails';
  private getBreakInOutDetails = this.getdata.appconstant + 'getBreakInOutDetails';
  private getRemainingTime = this.getdata.appconstant + 'getRemainingTime';
  private checkin = this.getdata.appconstant + 'checkin';
  private checkout = this.getdata.appconstant + 'checkout';
  private breakout = this.getdata.appconstant + 'breakout';
  private breakin = this.getdata.appconstant + 'breakin';
  private uploadStatusFileapi = this.getdata.appconstant + 'uploadStatusFile';
  private changePassword = this.getdata.appconstant + 'changePassword';

  /* Parameters */
  checkinoutdata: any;
  breakinoutdata: any;
  remainingtime: any
  intervaltimeinterval: any;
  ipaddress: any;

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

  /*   Form  */
  checkoutForm: FormGroup;
  changepassprofileForm: FormGroup;
  constructor(private getsession: AuthGuard, private Formbuilder: FormBuilder, private router: Router, private makeapi: WebserviceService, private getdata: DatatransferService, private http: Http) {

    this.appcode = this.getsession.session().appcode;
    this.userid = this.getsession.session().empid;
    this.isadmin = this.getsession.session().admin;
    this.name = this.getsession.session().name;
    this.isrm = this.getsession.session().isrm;
    /* Forms function */
    this.checkoutreactiveform();
    this.changepassreactiveform();
  }
  /*     Forms        */
  checkoutreactiveform() {
    this.checkoutForm = this.Formbuilder.group({
      'isupload': [false],
      'status': [null, Validators.compose([Validators.required])],
    });

    $.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', (data) => {
      // console.log(JSON.stringify(data, null, 2));
      this.ipaddress = data.geoplugin_request;
      // this.loginForm.patchValue({ip:this.ipaddress})
    });
  }
  changepassreactiveform() {
    this.changepassprofileForm = this.Formbuilder.group({
      'oldpassword': ['', Validators.compose([Validators.required, Validators.pattern(this.passwordvalidation)])],
      'password': ['', Validators.compose([Validators.required, Validators.pattern(this.passwordvalidation)])],
      'confirmpassword': ['', Validators.compose([Validators.required, Validators.pattern(this.passwordvalidation)])],
    });
  }
  ngOnInit() {
    /* function  */
    this.checkinout();
    if (localStorage.getItem("firsttimelogin") == "true") {
      $("#changepass").modal({ backdrop: "static" });
    }
  }
  /** check in details */
  checkinout() {
    var datatype = "userid=" + this.userid + "&appcode=" + this.appcode;
    return this.makeapi.method(this.getCheckIODetails, datatype, 'post')
      .subscribe(
        data => {
          this.checkinoutdata = data;
          if (data.checkin == true && !data.checkout) {
            this.breakinout();
            this.getremaining();
            this.intervaltimeinterval = setInterval(() => { this.getremaining(); }, 60000);
          } else {
            this.getremaining();
          }
        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }

  /** break input details */
  breakinout() {
    var datatype = "userid=" + this.userid + "&appcode=" + this.appcode;
    return this.makeapi.method(this.getBreakInOutDetails, datatype, 'post')
      .subscribe(
        data => {
          this.breakinoutdata = data.breakout;
        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }
  totalweeklymins: any;
  userweeklymins: any;
  percentage: any;
  /** get remaining time */
  getremaining() {
    var datatype = "userid=" + this.userid + "&appcode=" + this.appcode;
    return this.makeapi.method(this.getRemainingTime, datatype, 'post')
      .subscribe(
        data => {
          this.remainingtime = data;

          var hours = data.weeklyworkhours.split(":")[0],
            minutes = data.weeklyworkhours.split(":")[1];
          this.totalweeklymins = (hours * 60) + + minutes;

          var userhours = data.userworkhours.split(":")[0],
            userminutes = data.userworkhours.split(":")[1];
          this.userweeklymins = (userhours * 60) + + userminutes;
          this.percentage = (this.userweeklymins / this.totalweeklymins) * 100
        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }

  /** check in details */
  checkinemp() {
    this.checkinoutdata['checkin'] = "true";
    var datatype = "userid=" + this.userid + "&appcode=" + this.appcode + "&ip=" + this.ipaddress;
    return this.makeapi.method(this.checkin, datatype, 'post')
      .subscribe(
        data => {
          this.ngOnInit();
        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }
  /** check out details */
  checkoutemp() {
    var datatype = "userid=" + this.userid + "&appcode=" + this.appcode + "&status=" + this.checkoutForm.value.status + "&isupload=" + this.checkoutForm.value.isupload + "&ip=" + this.ipaddress;;
    return this.makeapi.method(this.checkout, datatype, 'post')
      .subscribe(
        data => {

          if (data.checkout == "true") {
            if (data.empid) {
              this.uploadfile(data.empid);
            }
            else {
              clearInterval(this.intervaltimeinterval);
              $("#checkout").modal("hide");
              this.getdata.showNotification('bottom', 'right', 'successfully Checked-out', "success");
              this.ngOnInit();
            }
          }
          this.ngOnInit();
        },
        Error => {
          this.checkinoutdata['checkout'] = false;
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }
  /** check out details */
  breakoutemp() {
    this.breakinoutdata = true;
    var datatype = "userid=" + this.userid + "&appcode=" + this.appcode + "&ip=" + this.ipaddress;;
    return this.makeapi.method(this.breakout, datatype, 'post')
      .subscribe(
        data => {
          this.ngOnInit();
        },
        Error => {
          this.breakinoutdata = false;
          this.checkinoutdata['checkout'] = false;
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }

  /** check out details */
  breakinemp() {
    this.breakinoutdata = false;
    var datatype = "userid=" + this.userid + "&appcode=" + this.appcode + "&ip=" + this.ipaddress;;
    return this.makeapi.method(this.breakin, datatype, 'post')
      .subscribe(
        data => {
          this.ngOnInit();
        },
        Error => {
          this.breakinoutdata = true;
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }
  finalprofilepic: any;
  filename: any;
  getfile(event) {

    let fileList: FileList = event.target.files;
    let file: File = fileList[0];
    if (fileList.length > 0) {
      var profiledata = { profilepicture: "true" }
      var result = JSON.stringify(profiledata);
      this.finalprofilepic = file;
      this.filename = file.name;

      this.checkoutForm.patchValue({
        isupload: true,
      })
    }
  }

  uploadfile(id) {

    let finalformdata: FormData = new FormData();

    finalformdata.append("file", this.finalprofilepic);
    finalformdata.append("empid", id);
    finalformdata.append('filename', this.filename);
    finalformdata.append('appcode', this.appcode);
    finalformdata.append('status', this.checkoutForm.value.status);
    return this.makeapi.method(this.uploadStatusFileapi, finalformdata, 'file')
      .subscribe(data => {
        if (data.status == "success") {
          $("#checkout").modal("hide");
          this.getdata.showNotification('bottom', 'right', 'successfully Checked-out', "success");
          this.ngOnInit();
        } else {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        });

  }

  ngOnDestroy() {
    if (this.intervaltimeinterval) {
      clearInterval(this.intervaltimeinterval);
    }
  }

  /** change pass */
  changepass() {
    if (this.changepassprofileForm.value.password == this.changepassprofileForm.value.oldpassword) {
      this.getdata.showNotification('bottom', 'right', 'Old and new password should not be same', "danger");
      return false;
    }
    else if (this.changepassprofileForm.value.password != this.changepassprofileForm.value.confirmpassword) {
      this.getdata.showNotification('bottom', 'right', 'New and confirm password must be same', "danger");
      return false;
    }
    delete this.changepassprofileForm.value.confirmpassword;
    var datatype = "appcode=" + this.appcode + "&userid=" + this.userid + "&oldpassword=" + this.changepassprofileForm.value.oldpassword + "&password=" + this.changepassprofileForm.value.password;
    return this.makeapi.method(this.changePassword, datatype, 'post')
      .subscribe(
        data => {
          if (data.status == "success") {
            //  delete localStorage.iTMSsession['firsttimelogin']
            localStorage.removeItem("firsttimelogin");
            $("#changepass").modal("hide");
            this.getdata.showNotification('bottom', 'right', 'Password Changed Successfully', "success");
          } else if (data.oldpassword == 'false') {
            this.getdata.showNotification('bottom', 'right', 'Check Old Password', "danger");
          } else {
            this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
          }
        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
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
}



