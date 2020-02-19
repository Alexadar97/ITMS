
import { Injectable } from '@angular/core';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class WebserviceService {
  constructor(private http: Http) {
  }

  method(url, data, method): Observable<any> {
   
    if (method === 'post') {
      this.getmodalvalue(true);
      const headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(url, data, { headers: headers })
        .map((response: Response) => response.json())
        .catch((error: any) => {
          if (error.status === 500) {
            return Observable.throw(new Error(error.status));
          }
          else if (error.status === 400) {
            return Observable.throw(new Error(error.status));
          }
          else if (error.status === 409) {
            return Observable.throw(new Error(error.status));
          }
          else if (error.status === 406) {
            return Observable.throw(new Error(error.status));
          }
        })
        .finally(() => {
          this.getmodalvalue(false);
        });
    }
    if (method === 'get') {
      this.getmodalvalue(true);
      const headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.get(url)
        .map((response: Response) => response.json())
        .catch((error: any) => {
          if (error.status === 500) {
            return Observable.throw(new Error(error));
          }
          else if (error.status === 400) {
            return Observable.throw(new Error(error));
          }
          else if (error.status === 409) {
            return Observable.throw(new Error(error));
          }
          else if (error.status === 406) {
            return Observable.throw(new Error(error));
          }
        })
        .finally(() => {
          this.getmodalvalue(false);
        });
    }
    if (method === 'file') {
      this.getmodalvalue(true);
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      let options = new RequestOptions({ headers: headers });
      return this.http.post(url, data, { headers: headers })
        .map((response: Response) => response.json())
        .catch((error: any) => {
          if (error.status === 500) {
            return Observable.throw(new Error(error.status));
          }
          else if (error.status === 400) {
            return Observable.throw(new Error(error.status));
          }
          else if (error.status === 409) {
            return Observable.throw(new Error(error.status));
          }
          else if (error.status === 406) {
            return Observable.throw(new Error(error.status));
          }
        })
        .finally(() => {
          this.getmodalvalue(false);
        });
    }
  }
  public displayloading: BehaviorSubject<any> = new BehaviorSubject<boolean>(false);

  getmodalvalue(value) {
    this.displayloading.next(value);
}
}
