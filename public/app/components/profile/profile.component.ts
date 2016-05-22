import {Component} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {CORE_DIRECTIVES} from '@angular/common';
import {AuthHttp, JwtHelper} from 'angular2-jwt';
import {Http, Headers} from '@angular/http';

@Component({
    selector: 'profile',
    directives: [CORE_DIRECTIVES],
    templateUrl: 'app/components/profile/profile.component.html'
})
export class ProfileComponent {

    // component's instance variables
    jwt:string;
    decodedJwt:string;
    response:string;
    api:string;
    jwtHelper:JwtHelper = new JwtHelper();

    constructor(public router:Router, public http:Http, public authHttp:AuthHttp) {
        // get the JWT from localStorage
        this.jwt = localStorage.getItem('id_token');

        // store the decoded JSON from this JWT
        this.decodedJwt = this.jwt && this.jwtHelper.decodeToken(this.jwt);
    }
}