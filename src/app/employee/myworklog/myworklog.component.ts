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
  selector: 'app-myworklog',
  templateUrl: './myworklog.component.html',
  styleUrls: ['./myworklog.component.css']
})
export class MyworklogComponent implements OnInit {

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
  private getEmpHistoryByDateRange = this.getdata.appconstant + 'getEmpHistoryByDateRange';
  private getHistoryByMonth = this.getdata.appconstant + 'getHistoryByMonth';
  private getEmpHistoryByMonth = this.getdata.appconstant + 'getEmpHistoryByMonth';

  /* Parameters */
  dailydata: any;
  monthlydata: any;
  currentPage: number = 1;
  itemsPerPage: number = 8;
  currentPagetwo: number = 1;
  itemsPerPagetwo: number = 8;

  constructor(private getsession: AuthGuard, private Formbuilder: FormBuilder, private router: Router, private makeapi: WebserviceService, private getdata: DatatransferService, private http: Http) {

    this.appcode = this.getsession.session().appcode;
    this.userid = this.getsession.session().empid;
    this.isadmin = this.getsession.session().admin;
    this.name = this.getsession.session().name;
    this.isrm = this.getsession.session().isrm;


  }

  chart: any;

  ngOnInit() {

    /* functions */
    this.getdailydata('onload');
    this.getmonthlydata('onload');
    this.getmonthlychart('onload');

    $('#fromdate').datetimepicker({
      format: 'DD/MM/YYYY',
      defaultDate: new Date(),
      useCurrent: true
    });
    $('#todate').datetimepicker({
      useCurrent: true, //Important! See issue #1075
      format: 'DD/MM/YYYY',
      defaultDate: new Date(),
    });
    $("#fromdate").on("dp.change", function (e) {
      $('#todate').data("DateTimePicker").minDate(e.date);
      $('#todate').data("DateTimePicker").date(e.date);
    });


    $('#monthlysearch').datetimepicker({
      viewMode: 'months',
      format: 'MM/YYYY',
      defaultDate: moment(),
    });


  }

  /** get daily */
  totalweeklymins: any;
  userweeklymins: any;
  percentage: any;
  getdailydata(type) {
    if (type == "onload") {
      var startdate = moment().toISOString().substring(0, 10);
      var enddate = moment().toISOString().substring(0, 10);
    } else if (type == "search") {
      var startdate = moment($('#fromdate').data("DateTimePicker").date()).format('YYYY-MM-DD');
      var enddate = moment($('#todate').data("DateTimePicker").date()).format('YYYY-MM-DD');
    }
    var datatype = "startdate=" + startdate + "&enddate=" + enddate + "&appcode=" + this.appcode + "&userid=" + this.userid;
    return this.makeapi.method(this.getEmpHistoryByDateRange, datatype, 'post')
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


          }

        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }

  /** get daily */
  getmonthlydata(type) {
    if (type == "onload") {
      var startdate = moment().format("YYYY-MM-01");
      var enddate = moment().format("YYYY-MM-") + moment().daysInMonth();
    } else if (type == "search") {
      var startdate = moment($('#monthlysearch').data("DateTimePicker").date()).format("YYYY-MM-01");
      var enddate = moment($('#monthlysearch').data("DateTimePicker").date()).format("YYYY-MM-") + moment($('#monthlysearch').data("DateTimePicker").date()).daysInMonth();

      // var startdate = $('#fromdate').data("DateTimePicker").date().toISOString().substring(0, 10);
      // var enddate = $('#todate').data("DateTimePicker").date().toISOString().substring(0, 10);
    }
    var datatype = "startdate=" + startdate + "&enddate=" + enddate + "&appcode=" + this.appcode + "&userid=" + this.userid;
    return this.makeapi.method(this.getEmpHistoryByDateRange, datatype, 'post')
      .subscribe(
        data => {
          this.monthlydata = data;

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

          }
        },

        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }

  /** get monthly chart  */
  getmonthlychart(type) {
    if (type == "onload") {
      var month = moment().format("MM");
      var year = moment().format("YYYY");
    } else if (type == "search") {
      var month = $('#monthlysearch').data("DateTimePicker").date().format("MM");
      var year = $('#monthlysearch').data("DateTimePicker").date().format("YYYY")
    }
    var datatype = "year=" + year + "&month=" + month + "&appcode=" + this.appcode + "&userid=" + this.userid;
    return this.makeapi.method(this.getEmpHistoryByMonth, datatype, 'post')
      .subscribe(
        data => {

          this.chart = new Chart({
            chart: {
              type: 'pie'
            },
            title: {
              text: ''
            },
            credits: {
              enabled: false
            },
            series: [{
              name: 'Hrs',
              data: [{
                name: 'Pending',
                y: (data.totalworkinghours - data.userworkhours),
                sliced: true,
                selected: true
              }, {
                name: 'Worked',
                y: data.userworkhours
              }]
            }]
          });
        },
        Error => {
          this.getdata.showNotification('bottom', 'right', 'Something went wrong. Try again later', "danger");
        }
      );
  }
}
