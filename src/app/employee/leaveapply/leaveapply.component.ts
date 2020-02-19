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
  selector: 'app-leaveapply',
  templateUrl: './leaveapply.component.html',
  styleUrls: ['./leaveapply.component.css']
})
export class LeaveapplyComponent implements OnInit {
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
  applyleaveForm: FormGroup;

  /* session       */
  appcode: any;
  userid: any;
  isadmin: any;
  name: any;
  isrm: any;

  /* api */
  private applyLeave = this.getdata.appconstant + 'applyLeave';
  private getUserLeaveStatus = this.getdata.appconstant + 'getUserLeaveStatus';
  private cancelLeaveRequest = this.getdata.appconstant + 'cancelLeaveRequest';
  private getUserHolidayDetails = this.getdata.appconstant + 'getUserHolidayDetails';

  /* Parameters */
  leavedata: any;
  leavedates: any = [];
  currentPage: number = 1;
  itemsPerPage: number = 8;

  constructor(private getsession: AuthGuard, private Formbuilder: FormBuilder, private router: Router, private makeapi: WebserviceService, private getdata: DatatransferService, private http: Http) {

    this.appcode = this.getsession.session().appcode;
    this.userid = this.getsession.session().empid;
    this.isadmin = this.getsession.session().admin;
    this.name = this.getsession.session().name;
    this.isrm = this.getsession.session().isrm;

    /* forms **/
    this.leaveapplyreactiveform();

  }
  ngOnInit() {
    $('#fromdate').datetimepicker({
      format: 'DD/MM/YYYY',

    });
    $('#todate').datetimepicker({
      // useCurrent: false, //Important! See issue #1075
      format: 'DD/MM/YYYY',

    });

    $('#fromdate').on('dp.change', (e) => {
      this.applyleaveForm.patchValue({
        from: moment(e.date).format('DD-MM-YYYY')
      });
    })
    $('#todate').on('dp.change', (e) => {
      this.applyleaveForm.patchValue({
        to: moment(e.date).format('DD-MM-YYYY')
      });
    })

    /* functions */
    this.getleavestatus('approved');
    this.holidays();
  }
  /*     leave apply Forms        */
  leaveapplyreactiveform() {
    this.applyleaveForm = this.Formbuilder.group({
      'from': [null, Validators.compose([Validators.required, Validators.maxLength(10)])],
      'to': [null, Validators.compose([Validators.required])],
      'reason': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(40)])],
    });
  }
  /** apply leave */
  leaveapply() {
    if (this.applyleaveForm.value.from == this.applyleaveForm.value.to) {
      delete this.applyleaveForm.value.to;
      var from = this.applyleaveForm.value.from.split("-");
      this.applyleaveForm.value["from"] = from[2] + "-" + from[1] + "-" + from[0];

      //  this.applyleaveForm.value.from = moment(this.applyleaveForm.value.from).format('YYYY-MM-DD')
    } else {
      var from = this.applyleaveForm.value.from.split("-");
      this.applyleaveForm.value["from"] = from[2] + "-" + from[1] + "-" + from[0];

      var to = this.applyleaveForm.value.to.split("-");
      this.applyleaveForm.value["to"] = to[2] + "-" + to[1] + "-" + to[0];
    }

    var datatype = "leavedate=" + JSON.stringify(this.applyleaveForm.value) + "&userid=" + this.userid + "&appcode=" + this.appcode;
    return this.makeapi.method(this.applyLeave, datatype, 'post')
      .subscribe(
        data => {
          if (data.status == "success") {
            this.getdata.showNotification('bottom', 'right', 'Leave Applied Successfully', "success");
            $("#Applyleavemodal").modal("hide");
            this.getleavestatus('approved');
          }
        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }

  /** get leave status */
  getleavestatus(status) {
    var datatype = "userid=" + this.userid + "&appcode=" + this.appcode + "&status=" + status;
    return this.makeapi.method(this.getUserLeaveStatus, datatype, 'post')
      .subscribe(
        data => {
          this.leavedata = data;

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
  approveleaveid: any;
  setidforleaveaction(leaveid) {
    this.approveleaveid = leaveid;
  }

  /**cancel leave */
  cancelleave() {
    var finaldata = 'appcode=' + this.appcode + '&leaveid=' + this.approveleaveid;
    return this.makeapi.method(this.cancelLeaveRequest, finaldata, 'post')
      .subscribe(
        data => {
          if (data.status == "success") {
            this.getleavestatus('pending');
            $("#cancelleave").modal("hide")
            this.getdata.showNotification('bottom', 'right', 'Leave Cancelled Successfully', "success");
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
  weekoff = [];
  /**holidays */
  holidays() {
    var finaldata = 'appcode=' + this.appcode + '&userid=' + this.userid;
    return this.makeapi.method(this.getUserHolidayDetails, finaldata, 'post')
      .subscribe(
        data => {
          this.weekoff = [];
          this.leavedates = [];
          data.forEach(data => {
            if (data.leavedate) {
              this.leavedates.push(data.leavedate)
            } else if (data.weekoff) {
              data.weekoff.forEach(data => {
                if (data == 7) {
                  data = 0;
                }
                this.weekoff.push(data);
              })
            }
          });
          // $('#fromdate').datetimepicker('refresh');
          console.log(this.leavedates);
          $('#fromdate').datetimepicker('destroy');
          $('#todate').datetimepicker('destroy');

          $('#fromdate').datetimepicker({
            disabledDates: this.leavedates,
            daysOfWeekDisabled: this.weekoff,
            format: 'DD/MM/YYYY',
          });
          $('#todate').datetimepicker({
            disabledDates: this.leavedates,
            daysOfWeekDisabled: this.weekoff,
            format: 'DD/MM/YYYY',
          });

          $("#fromdate").on("dp.change", function (e) {
            $('#todate').data("DateTimePicker").minDate(e.date);
            $('#todate').data("DateTimePicker").date(e.date);
          });

        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }
}
