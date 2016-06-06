import {Component} from '@angular/core';
import {ControlGroup, Control} from '@angular/common';
import {Router, RouterLink} from '@angular/router-deprecated';
import {Http, Headers} from '@angular/http';
import {Handle} from "../../services/handle.service";

@Component({
    selector: 'signup',
    directives: [RouterLink],
    providers: [Handle],
    styleUrls: ['app/components/signup/signup.component.css'],
    templateUrl: 'app/components/signup/signup.component.html'
})
export class SignupComponent {
    signUpForm:ControlGroup;

    constructor(public router:Router, public http:Http, private handle:Handle) {
        this.signUpForm = new ControlGroup({
            first_name: new Control(""),
            last_name: new Control(""),
            username: new Control(""),
            password: new Control("")
        });
    }

    signup(data) {
        var first_name = data.first_name;
        var last_name = data.last_name;
        var username = data.username;
        var password = data.password;

        var credentials = "first_name=" + first_name + "&last_name=" +
            last_name + "&username=" + username + "&password=" + password;
        var headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

        this.http.post('http://localhost:3010/signup', credentials, {
            headers: headers
        }).map(res => res.json())
            .subscribe(
                data => {
                    this.handle.saveJwt(data.id_token);
                    this.router.parent.navigateByUrl('/profile');
                },
                err => this.handle.error(err),
                () => console.log('Auth OK!')
            );
    }
}