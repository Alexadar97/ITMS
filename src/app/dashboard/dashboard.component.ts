import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import 'rxjs/add/operator/filter';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private _router: Subscription;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];

    @ViewChild(NavbarComponent) navbar: NavbarComponent;

  constructor( public location: Location, private router: Router ) { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.runOnRouteChange();
}
isMaps(path){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    titlee = titlee.slice( 1 );
    if(path == titlee){
        return false;
    }
    else {
        return true;
    }
}
runOnRouteChange(): void {
  if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
    const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
  }
}
isMac(): boolean {
    let bool = false;
    if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
        bool = true;
    }
    return bool;
}

}
