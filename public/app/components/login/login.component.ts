import {Component} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, RouterLink} from '@angular/router-deprecated';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, Control} from '@angular/common';
import {Http, Headers} from '@angular/http';
import {sweetAlert} from 'sweetAlert2';

// Add the RxJS Observable operators we need in this app.
import './rxjs-operators';
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'login',
    directives: [RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES],
    templateUrl: 'app/components/login/login.component.html'
})

export class LoginComponent {
    loginForm:ControlGroup;

    constructor(public router:Router, public http:Http) {
        this.loginForm = new ControlGroup({
            username: new Control(""),
            password: new Control("")
        });
    }

    authenticate(data) {
        var username = data.username;
        var password = data.password;

        var credentials = "username=" + username + "&password=" + password;

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        this.http.post('http://localhost:3005/sessions/create', credentials, {
            headers: headers
        }).map(res => res.json())
            .subscribe(
                data => {
                    LoginComponent.saveJwt(data.id_token);
                    this.router.parent.navigateByUrl('/profile');
                },
                err => LoginComponent.handleError(err),
                () => console.log('Auth OK!')
            );
    }

    static saveJwt(jwt) {
        if (jwt) {
            localStorage.setItem('id_token', jwt)
        }
    }

    private static handleError(error:any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        sweetAlert(
            'Oops...',
            'Error: ' + errMsg,
            'error'
        );
        return Observable.throw(errMsg);
    }
}

