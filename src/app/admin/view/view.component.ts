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
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
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
  private getEmpHistoryByDateRangeAdmin = this.getdata.appconstant + 'getEmpHistoryByDateRangeAdmin';
  private getHistoryByMonth = this.getdata.appconstant + 'getHistoryByMonth';

  /* Parameters */
  dailydata: any;
  monthlydata: any;
  currentPage: number = 1;
  itemsPerPage: number = 8;
  currentPagetwo: number = 1;
  itemsPerPagetwo: number = 8;
  currentPagethree: number = 1;
  itemsPerPagethree: number = 8;
  constructor(private getsession: AuthGuard, private Formbuilder: FormBuilder, private router: Router, private makeapi: WebserviceService, private getdata: DatatransferService, private http: Http) {

    this.appcode = this.getsession.session().appcode;
    this.userid = this.getsession.session().empid;
    this.isadmin = this.getsession.session().admin;
    this.name = this.getsession.session().name;
    this.isrm = this.getsession.session().isrm;
  }

  ngOnInit() {
    let date = new Date();
    $('#fromdate').datetimepicker({
      format: 'DD/MM/YYYY',
      // defaultDate: moment().subtract(1, 'days'),
      defaultDate: moment().format("YYYY-MM-01"),
      useCurrent: true
    });
    $('#todate').datetimepicker({
      useCurrent: true, //Important! See issue #1075
      format: 'DD/MM/YYYY',
      minDate:moment().format("YYYY-MM-") + moment().daysInMonth(),
      // defaultDate: moment().subtract(1, 'days'),
      defaultDate: moment().format("YYYY-MM-") + moment().daysInMonth(),

    });
    $("#fromdate").on("dp.change", function (e) {
      $('#todate').data("DateTimePicker").minDate(e.date);
      $('#todate').data("DateTimePicker").date(e.date);
    });

    $('#monthlysearch').datetimepicker({
      viewMode: "months",
      format: 'MM/YYYY',
      defaultDate: new Date(),
    });

    /* functions call */
    this.getdailydata("onload");
    this.getmonthlydata("onload");
    this.getsearchdata('onload')
  }

  /** get daily */
  totalweeklymins: any;
  userweeklymins: any;
  percentage: any;
  getdailydata(type) {
    if (type == "onload") {
      // var startdate = moment().subtract(1, 'days').toISOString().substring(0, 10);
      // var enddate = moment().subtract(1, 'days').toISOString().substring(0, 10);
      var startdate = moment().toISOString().substring(0, 10);
      var enddate = moment().toISOString().substring(0, 10);
    } else if (type == "search") {
      var startdate = moment($('#fromdate').data("DateTimePicker").date()).format('YYYY-MM-DD');
      var enddate = moment($('#todate').data("DateTimePicker").date()).format('YYYY-MM-DD');
    }
    var datatype = "startdate=" + startdate + "&enddate=" + enddate + "&appcode=" + this.appcode;
    return this.makeapi.method(this.getEmpHistoryByDateRangeAdmin, datatype, 'post')
      .subscribe(
        data => {
          this.dailydata = data;
          if (data.length > 0) {
            data.forEach(data2 => {
              if (data2.worktime) {
                var hours = data2.totalworktime.split(":")[0],
                  minutes = data2.totalworktime.split(":")[1];
                this.totalweeklymins = (hours * 60) + +minutes;

                var userhours = data2.worktime.split(":")[0],
                  userminutes = data2.worktime.split(":")[1];
                this.userweeklymins = (userhours * 60) + +userminutes;

                this.percentage = (this.userweeklymins / this.totalweeklymins) * 100
                data2['percentage'] = this.percentage;

                var finallink = this.getdata.appconstant + 'getFile/' + data2.statusfilename + '?date=' + data2.date + '&employeeid=' + data2.empid;
                data2['filelink'] = finallink;
              }

            });
            // console.log(this.dailydata)
          }

        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }
  /** get monthly */
  getmonthlydata(type) {
    if (type == "onload") {
      var month = moment().month() + 1;
      var year = moment().year()

    } else if (type == "search") {
      var getdate = $('#monthlysearch').data("DateTimePicker").date()
      month = new Date(getdate).getMonth() + 1;
      year = new Date(getdate).getFullYear();
    }
    var datatype = "month=" + month + "&year=" + year + "&appcode=" + this.appcode;
    return this.makeapi.method(this.getHistoryByMonth, datatype, 'post')
      .subscribe(
        data => {
          // data.forEach(data => {
          //   this.selectdata .push(data.name);
          //   });  
          //   this.roles = this.selectdata;
          //   console.log(this.roles) ;       
          this.monthlydata = data;
        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }
  dailydaterange: any;
  getsearchdata(type) {

    if (type == "onload") {

      // var startdate = moment().toISOString().substring(0, 10);
      // var enddate = moment().toISOString().substring(0, 10);
      var startdate = moment().format("YYYY-MM-01");
      var enddate = moment().format("YYYY-MM-") + moment().daysInMonth();
    } else if (type == "search") {
      var startdate = moment($('#fromdate').data("DateTimePicker").date()).format('YYYY-MM-DD');
      var enddate = moment($('#todate').data("DateTimePicker").date()).format('YYYY-MM-DD');
    }
    var datatype = "startdate=" + startdate + "&enddate=" + enddate + "&appcode=" + this.appcode;
    return this.makeapi.method(this.getEmpHistoryByDateRangeAdmin, datatype, 'post')
      .subscribe(
        data => {
          this.dailydaterange = data;
          if (data.length > 0) {
            data.forEach(data2 => {
              if (data2.worktime) {
                var hours = data2.totalworktime.split(":")[0],
                  minutes = data2.totalworktime.split(":")[1];
                this.totalweeklymins = (hours * 60) + +minutes;

                var userhours = data2.worktime.split(":")[0],
                  userminutes = data2.worktime.split(":")[1];
                this.userweeklymins = (userhours * 60) + +userminutes;

                this.percentage = (this.userweeklymins / this.totalweeklymins) * 100
                data2['percentage'] = this.percentage;
                var finallink = this.getdata.appconstant + 'getFile/' + data2.statusfilename + '?date=' + data2.date + '&employeeid=' + data2.empid;
                data2['filelink'] = finallink;
              }

            });
            // console.log(this.dailydata)
          }

        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }
}
