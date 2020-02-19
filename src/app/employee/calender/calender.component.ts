import { Component, OnInit, Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response , Headers} from '@angular/http';
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
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent {
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
 private getUserHolidayDetails = this.getdata.appconstant + 'getUserHolidayDetails';
 private viewEmployees = this.getdata.appconstant + 'viewEmployees';

 /* Parameters */
 leavestatusdata: any;
 leavestatusdatapending: any;
 leavestatusdataapproved: any;
 leavestatusdatarejected: any;
 
//   constructor(private getsession: AuthGuard, private Formbuilder: FormBuilder, private router: Router, private makeapi: WebserviceService, private getdata: DatatransferService, private http: Http) {

    

//   }

// ngOnInit() {
   
//   }
  errornandle: any;
  constructor(private getsession: AuthGuard, private http: Http, private router: Router , private getdata: DatatransferService,) {
    this.appcode = this.getsession.session().appcode;
    this.userid = this.getsession.session().empid;
    this.isadmin = this.getsession.session().admin;
    this.name = this.getsession.session().name;
    this.isrm = this.getsession.session().isrm;
  }
  ngAfterViewInit() {
      
      const headers = new Headers();
      headers.append( 'Content-Type', 'application/x-www-form-urlencoded' );
      return this.http.post( this.getUserHolidayDetails, 'appcode=' + this.appcode + '&userid=' + this.userid, { headers: headers } )
          .map(( response: Response ) => response.json() )
          .catch( this.errornandle )
          .subscribe( data => {
            this.hh( data )
          },
          Error => {
              alert( 'error' );
              //this.errorMsg = Error;
          } );
  }
  hh( data ) {
      var arr = [];
      var reason = [];
      var resdayarr = [];
      var dad = [];
      var lotsOfMixedEvents = [];
      $( '[data-toggle="tooltip"]' ).tooltip();

      for ( var i = 0; i < data.length; i++ ) {
          if ( data[i].leavedate ) {
              arr.push( data[i].leavedate );
              if ( data[i].holidaytype ) {
                  reason.push( data[i].reason + "-" + data[i].holidaytype );
              }
              else {
                  reason.push( data[i].reason );
              }
              // arr.sort();
          }
          if ( data[i].weekoff ) {
              for ( var j = 0; j < data[i].weekoff.length; j++ ) {
                  resdayarr.push( data[i].weekoff[j].day );
              }
          }
      }
      for ( var i = 0; i < arr.length; i++ ) {
          /*dad.push({
              date: arr[i]
          });*/
          lotsOfMixedEvents.push( {
              date: arr[i],
              title: reason[i]
          } );
      }
      

      $.getScript( "assets/js/calender.js", ( data, textStatus, jqxhr )=> {
        $( '#calendar' ).clndr( {
            //events: dad,
            events: lotsOfMixedEvents,
            multiDayEvents: {
                endDate: 'end',
                singleDay: 'date',
                startDate: 'start'
            },
            classes: {
                event: "my-event"
            },
  
            ready: function() {
                var self = this;
  
                /*   $(document).ready(function(e){  
                       
                  var target = self.buildTargetObject( e.currentTarget, true );
                  var numItems = $('.my-event').length;
                   var hh=  target.events[0].title.split("-");
                   for(i=0;i< $('.my-event').length;i++){
                       alert(numItems);
                       if((hh.splice(-1))=="Government Holiday"){
                           (<any>document.getElementsByClassName(e.currentTarget)).style.background="red";
                        }
                        else if((hh.splice(-1))=="Office Holiday"){
                            (<any>document.getElementsByClassName(e.currentTarget)).style.background="#000000";
                        }
                    }
                   });*/
                $( this.element ).on( 'mouseover', '.day', function( e ) {
                    var target = self.buildTargetObject( e.currentTarget, true );
                    //alert(target.events.length)
                    //console.log(target);
                    if ( target.events.length > 0 ) {
                        $( e.currentTarget ).attr( "data-toggle", "tooltip" );
                        $( e.currentTarget ).attr( "title", target.events[0].title );
                    }
  
                } );
            },
            clickEvents: {
                click: function( target ) {
                    //console.log(target);
                },
                onMonthChange: function( month ) {
                    //console.log('you just went to ' + month.format('MMMM, YYYY'));
                }
            },
            doneRendering: function() {
                //console.log('this would be a fine place to attach custom event handlers.');
            }
        } );
      });
      $(".enablecal").addClass("cal1")
  }
 
}