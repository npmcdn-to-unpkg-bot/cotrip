import {Component} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, RouterLink} from '@angular/router-deprecated';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, Control} from '@angular/common';
import {Http, Headers} from '@angular/http';

// Add the RxJS Observable operators we need in this app.
import './rxjs-operators';
import {Observable} from "rxjs/Observable";
import {UserService} from "../../services/user.service";

@Component({
    selector: 'login',
    directives: [RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES],
    styleUrls: ['app/components/login/login.component.css'],
    templateUrl: 'app/components/login/login.component.html'
})

export class LoginComponent {
    loginForm:ControlGroup;

    constructor(public router:Router, public http:Http) {
        this.loginForm = new ControlGroup({
            username: new Control(""),
            password: new Control("")
        });

        if (UserService.isLoggedIn()) this.router.parent.navigateByUrl('/profile')
    }

    authenticate(data) {
        var username = data.username;
        var password = data.password;

        var credentials = "username=" + username + "&password=" + password;

        var headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

        this.http.post('http://localhost:3010/login', credentials, {
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
        if (jwt) localStorage.setItem('id_token', jwt)
    }

    private static handleError(error:any) {
        console.log(error);
        alert('[' + error.status + '] ' + error._body);
        return Observable.throw(error);
    }
}

