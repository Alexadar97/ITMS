import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './services/canactivate.service';
import { CanDeactivateGuard } from './services/deactivate.service';
import { CheckInComponent } from './employee/check-in/check-in.component';
import { LeaveapplyComponent } from './employee/leaveapply/leaveapply.component';
import { ApprovalactionsComponent } from './employee/approvalactions/approvalactions.component';
import { ProfileComponent } from './employee/profile/profile.component';
import { CalenderComponent } from './employee/calender/calender.component';
import { MyworklogComponent } from './employee/myworklog/myworklog.component';
import { WorklogComponent } from './employee/worklog/worklog.component';
import { ViewComponent } from './admin/view/view.component';
import { ConfigurationComponent } from './admin/configuration/configuration.component';
import { EmployeeadminComponent } from './admin/employeeadmin/employeeadmin.component';
import { EmployeeprofComponent } from './admin/employeeprof/employeeprof.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    {
        path: 'dashboard', component: DashboardComponent, canDeactivate: [CanDeactivateGuard],
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: CheckInComponent, canActivate: [AuthGuard]  },
            { path: 'leave', component: LeaveapplyComponent , canActivate: [AuthGuard]},
            { path: 'approve', component: ApprovalactionsComponent, canActivate: [AuthGuard] },
            { path: 'work', component: WorklogComponent , canActivate: [AuthGuard]},
            { path: 'mywork', component: MyworklogComponent , canActivate: [AuthGuard]},
            { path: 'calender', component: CalenderComponent , canActivate: [AuthGuard]},
            { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
            { path: 'config', component: ConfigurationComponent, canActivate: [AuthGuard] },
            { path: 'view', component: ViewComponent , canActivate: [AuthGuard]},
            { path: 'employee', component: EmployeeadminComponent, canActivate: [AuthGuard] },
            { path: 'employeeprof', component: EmployeeprofComponent , canActivate: [AuthGuard]},
        ]
    },
];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes, { useHash: true })
    ],
    exports: [
        RouterModule,
    ],
})
export class AppRoutingModule { }