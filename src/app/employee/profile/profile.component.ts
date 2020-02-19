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
import { Chart } from 'angular-highcharts';
declare var $;
declare var moment;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

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

  /* Forms */
  updateprofileForm: FormGroup;
  changepassprofileForm: FormGroup;

  /* api */
  private getEmployeeDetails = this.getdata.appconstant + 'getEmployeeDetails';
  private updateEmployeeDetails = this.getdata.appconstant + 'updateEmployeeDetails';
  private changePassword = this.getdata.appconstant + 'changePassword';
  private saveProfileImage = this.getdata.appconstant + 'saveProfileImage';

  /* Parameters */
  profiledata: any;
  photo: any

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

  constructor(private getsession: AuthGuard, private Formbuilder: FormBuilder, private router: Router, private makeapi: WebserviceService, private getdata: DatatransferService, private http: Http) {

    this.appcode = this.getsession.session().appcode;
    this.userid = this.getsession.session().empid;
    this.isadmin = this.getsession.session().admin;
    this.name = this.getsession.session().name;
    this.isrm = this.getsession.session().isrm;

    /* Forms  */
    this.updateprofilereactiveform();
    this.changepassreactiveform();

  }
  /* Forms  */
  updateprofilereactiveform() {
    this.updateprofileForm = this.Formbuilder.group({
      'permanentaddress': ['', Validators.compose([Validators.required])],
      'alternateemailid': ['', Validators.compose([Validators.required, Validators.pattern(this.emailvalidation)])],
      'mobile': ['', Validators.compose([Validators.required, Validators.pattern(this.numbervalidation), Validators.minLength(10), Validators.maxLength(15)])],
      'temporaryaddress': ['', Validators.compose([Validators.required])],
      'maritalstatus': ['', Validators.compose([Validators.required])],
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
    /*    function */
    this.getprofile();
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
  /** get profile */
  getprofile() {
    var datatype = "appcode=" + this.appcode + "&userid=" + this.userid;
    return this.makeapi.method(this.getEmployeeDetails, datatype, 'post')
      .subscribe(
        data => {
          this.profiledata = data;
          if (data.profilepicture == "true") {
            var d = new Date();
            var n = d.getTime();
            this.photo = this.getdata.appconstant + 'getProfileImage?filename=' + data.pictureid + "&time=" + n;
          }
          else {
            this.photo = "assets/img/user.jpg";
          }
          this.updateprofileForm.patchValue({
            permanentaddress: data.permanentaddress, alternateemailid: data.alternateemailid, mobile: data.mobile, temporaryaddress: data.temporaryaddress, maritalstatus: data.maritalstatus
          })
        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }

  /** update profile */
  updateprofile() {
    var datatype = "appcode=" + this.appcode + "&userid=" + this.userid + "&value=" + JSON.stringify(this.updateprofileForm.value);
    return this.makeapi.method(this.updateEmployeeDetails, datatype, 'post')
      .subscribe(
        data => {
          if (data.status == "success") {
            $("#editprofile").modal("hide")
            this.getdata.showNotification('bottom', 'right', 'Profile Updated Successfully', "success");
            this.getprofile();
          } else {
            this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
          }

        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
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
            $("#changepass").modal("hide")
            this.getdata.showNotification('bottom', 'right', 'Password Changed Successfully', "success");
          } else {
            this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
          }

        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }
  finalprofilepic: any;
  profpicname: any;

  saveProfileimage(event) {
    let fileList: FileList = event.target.files;
    let file: File = fileList[0];


    if (file.size > 4000000) {
      event.target.files[0].value = "";
      this.getdata.showNotification('bottom', 'right', 'Image size is " + file.size * 1e-6 + "mb.Image size must less than 4mb', "danger");
    }
    else {
      if (fileList.length > 0) {
        var profiledata = { profilepicture: "true" }
        var result = JSON.stringify(profiledata);
        this.finalprofilepic = file;
        this.profpicname = file.name;
        var datatype = 'appcode=' + this.appcode + '&userid=' + this.userid + '&value=' + result;
        return this.makeapi.method(this.updateEmployeeDetails, datatype, 'post')

          .subscribe(data => {

            var picturename = data.pictureid;
            this.imguploadfn(picturename);
          },
            Error => {
              alert('error');
              //this.errorMsg = Error;
            });
      }
    }
  }
  imguploadfn(imagename) {

    let form: FormData = new FormData();
    var extension = this.profpicname.substr((this.profpicname.lastIndexOf('.') + 1));
    var finalimagename = imagename + "." + extension;
    form.append('file', this.finalprofilepic);
    form.append('filename', finalimagename);
    return this.makeapi.method(this.saveProfileImage, form, 'file')
      .subscribe(data => {
        if (data.status == "success") {
          $("#editprofile").modal("hide")
          this.getdata.showNotification('bottom', 'right', 'Profile Picture Changed Successfully', "success"); this.getprofile();
        } else {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      },
        Error => {
          alert('save image error');

        });
  }
}
