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
@Component({
  selector: 'app-approvalactions',
  templateUrl: './approvalactions.component.html',
  styleUrls: ['./approvalactions.component.css']
})
export class ApprovalactionsComponent implements OnInit {
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
  private getLeaveRequest = this.getdata.appconstant + 'getLeaveRequest';
  private viewEmployees = this.getdata.appconstant + 'viewEmployees';
  private updateLeaveRequest = this.getdata.appconstant + 'updateLeaveRequest';

  /* Parameters */
  leavestatusdata: any;
  leavestatusdatapending: any;
  leavestatusdataapproved: any;
  leavestatusdatarejected: any;
  currentPage: number = 1;
  itemsPerPage: number = 8;
  currentPagetwo: number = 1;
  itemsPerPagetwo: number = 8;
  currentPagethree: number = 1;
  itemsPerPagethree: number = 8;
  getleavelwpstatus: any;
  getlwpstatus: any;
  constructor(private getsession: AuthGuard, private Formbuilder: FormBuilder, private router: Router, private makeapi: WebserviceService, private getdata: DatatransferService, private http: Http) {

    this.appcode = this.getsession.session().appcode;
    this.userid = this.getsession.session().empid;
    this.isadmin = this.getsession.session().admin;
    this.name = this.getsession.session().name;
    this.isrm = this.getsession.session().isrm;

  }

  ngOnInit() {
    /*  functions */
    this.getleavestatus('pending');
    this.getleavestatus('approved');
    this.getleavestatus('rejected');
  }
  /** get leave status */
  getleavestatus(status) {

    var datatype = "rmid=" + this.userid + "&status=" + status + "&appcode=" + this.appcode;
    return this.makeapi.method(this.getLeaveRequest, datatype, 'post')
      .subscribe(
        data => {
          if (status == "pending") {
            this.leavestatusdatapending = data;
            data.forEach(data => {
              if(data.sundaylwp){
                this.getleavelwdid.push(data._id) ;
                // console.log( this.getleavelwdid);
              };
           
            });
          } else if (status == "approved") {
            this.leavestatusdataapproved = data;
          } else if (status == "rejected") {
            this.leavestatusdatarejected = data;
          }
          
        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }
  approveleaveid: any;
  setidforleaveaction(leaveid) {
    this.approveleaveid = leaveid;
  }

  /**approve leave */
  updateLeave() {
    this.getlwpstatus = false;
    this.getleavelwpstatus = false;
    var finaldata = "";
    if (this.getlwdid.length > 0) {
      this.getlwdid.forEach(data => {
        if (this.approveleaveid == data) {
          this.getlwpstatus = true;
        }
       
      })
    }
    
     if (this.getleavelwdid.length > 0) {

      this.getleavelwdid.forEach(data => {
        if (this.approveleaveid == data) {
          this.getleavelwpstatus = true;
        }
       
      })
    }
    var leaveobj;
    if (this.getlwpstatus == true && this.getleavelwpstatus != true) {
      leaveobj = { "status": "approved", "lwp": true, "sundaylwp": false }
      //  '&status=approved' + "&lwp=true"
      finaldata = 'appcode=' + this.appcode + '&id=' + this.approveleaveid + "&leaveupdateobj=" + JSON.stringify(leaveobj);
    } else if (this.getleavelwpstatus == true && this.getlwpstatus != true) {
      leaveobj = { "status": "approved", "sundaylwp": true }
      finaldata = 'appcode=' + this.appcode + '&id=' + this.approveleaveid + "&leaveupdateobj=" + JSON.stringify(leaveobj);
      // finaldata = 'appcode=' + this.appcode + '&id=' + this.approveleaveid + '&status=approved' + "&sundaylwp=true";
    } else if (this.getlwpstatus == true && this.getleavelwpstatus == true) {
      leaveobj = { "status": "approved", "sundaylwp": true, "lwp": true }
      finaldata = 'appcode=' + this.appcode + '&id=' + this.approveleaveid + "&leaveupdateobj=" + JSON.stringify(leaveobj);
      // finaldata = 'appcode=' + this.appcode + '&id=' + this.approveleaveid + '&status=approved' + "&sundaylwp=true" + "&lwp=true";
    } else {
      leaveobj = { "status": "approved", "sundaylwp": false }
      finaldata = 'appcode=' + this.appcode + '&id=' + this.approveleaveid + "&leaveupdateobj=" + JSON.stringify(leaveobj);
      // finaldata = 'appcode=' + this.appcode + '&id=' + this.approveleaveid + '&status=approved';
    }
    // var datatype = "id=" + this.leaveid + "&status=approved" + "&appcode=" + this.appcode;
    return this.makeapi.method(this.updateLeaveRequest, finaldata, 'post')
      .subscribe(
        data => {
          if (data.status == "success") {
            this.getleavestatus('pending');
            this.getleavestatus('approved');
            this.getleavestatus('rejected');
            $("#approveleave").modal("hide")
            this.getdata.showNotification('bottom', 'right', 'Leave Approved Successfully', "success");
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

  getlwdid = [];
  getlwp() {
    var getlwdid = $('.lwpclass:checked').map(function () {
      return $(this).val();
    }).get();
    this.getlwdid = getlwdid;
     console.log(this.getlwdid);
  }
  getleavelwdid = [];
  getleavelwp() {
    var getleavelwdid = $('.leavelwpclass:checked').map(function () {
      return $(this).val();
    }).get();
    this.getleavelwdid = getleavelwdid;
  }
  /**reject leave */
  rejectleave() {
    var leaveobj = { "status": "rejected" }
    var finaldata = 'appcode=' + this.appcode + '&id=' + this.approveleaveid + "&leaveupdateobj=" + JSON.stringify(leaveobj);
    // var finaldata = 'appcode=' + this.appcode + '&id=' + this.approveleaveid + '&status=rejected'

    // var datatype = "id=" + this.leaveid + "&status=approved" + "&appcode=" + this.appcode;
    return this.makeapi.method(this.updateLeaveRequest, finaldata, 'post')
      .subscribe(
        data => {
          if (data.status == "success") {
            this.getleavestatus('pending');
            this.getleavestatus('approved');
            this.getleavestatus('rejected');
            $("#rejectleave").modal("hide")
            this.getdata.showNotification('bottom', 'right', 'Leave Rejected Successfully', "success");
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
  searchtable(inputid, tableid) {
    // Declare variables 
    var input, filter, table, tr, td, i;
    input = document.getElementById(inputid);
    filter = input.value.toUpperCase();
    table = document.getElementById(tableid);
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
}
