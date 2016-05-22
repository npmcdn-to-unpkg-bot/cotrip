import {Component} from '@angular/core';
import {ControlGroup, Control} from '@angular/common';
import {Router} from '@angular/router-deprecated';

@Component({
    selector: 'signup',
    templateUrl: 'app/components/signup/signup.component.html'
})
export class SignupComponent {
    signUpForm:ControlGroup;

    constructor(public router:Router) {
        this.signUpForm = new ControlGroup({
            username: new Control(""),
            password: new Control("")
        });
    }
    
    signup(data) {
        var username = data.username;
        var password = data.password;

        var credentials = "username=" + username + "&password=" + password;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
    }
}