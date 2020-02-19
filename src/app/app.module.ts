import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, BrowserXhr } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { WebserviceService } from './services/webservice.service';
import { DatatransferService } from './services/datatransfer.service';
import { AuthGuard } from './services/canactivate.service';
import { CanDeactivateGuard } from './services/deactivate.service';
import { CheckInComponent } from './employee/check-in/check-in.component';
import { LeaveapplyComponent } from './employee/leaveapply/leaveapply.component';
import { ApprovalactionsComponent } from './employee/approvalactions/approvalactions.component';
import { WorklogComponent } from './employee/worklog/worklog.component';
import { MyworklogComponent } from './employee/myworklog/myworklog.component';
import { CalenderComponent } from './employee/calender/calender.component';
import { ProfileComponent } from './employee/profile/profile.component';
import { ChartModule } from 'angular-highcharts';
import { EmployeeComponent } from './employee/employee.component';
import { ViewComponent } from './admin/view/view.component';
import { ConfigurationComponent } from './admin/configuration/configuration.component';
import { EmployeeadminComponent } from './admin/employeeadmin/employeeadmin.component';
import { EmployeeprofComponent } from './admin/employeeprof/employeeprof.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CalendarModule } from 'angular-calendar';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
 
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    SignupComponent,
    CheckInComponent,
    LeaveapplyComponent,
    ApprovalactionsComponent,
    WorklogComponent,
    MyworklogComponent,
    CalenderComponent,
    ProfileComponent,
    EmployeeComponent,
    ViewComponent,
    ConfigurationComponent,
    EmployeeadminComponent,
    EmployeeprofComponent
  ],
  imports: [
    NgxPaginationModule,
    NgSelectModule,
    ChartModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
    AppRoutingModule,
    CommonModule,
    ComponentsModule,
    BsDatepickerModule.forRoot(),
    CalendarModule.forRoot()
  ],
  providers: [
    WebserviceService,
    AuthGuard,
    CanDeactivateGuard,
    DatatransferService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
