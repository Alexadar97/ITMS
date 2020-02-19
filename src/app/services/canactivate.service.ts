import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private router: Router) {
    }
    canActivate() {
        if (this.session() == null) {
            this.router.navigateByUrl('/login');
            return true;
        }
        else {
            return true;
        }
    }

    canActivateChild() {
        console.log('Checking child route access');
        return true;
    }

    session() {
        return JSON.parse(localStorage.getItem("iTMSsession"));
    }

}