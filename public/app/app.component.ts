import {Component} from '@angular/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {SignupComponent} from "./components/signup/signup.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {LoggedInRouterOutlet} from "./LoggedInOutlet";

@Component({
    selector: 'app',
    templateUrl: 'app/app.component.html',
    directives: [ROUTER_DIRECTIVES, LoggedInRouterOutlet],
    providers: [
        ROUTER_PROVIDERS,
    ]
})

@RouteConfig([
    {path: '/', name: 'Home', component: HomeComponent, useAsDefault: true},
    {path: '/profile', name: 'Profile', component: ProfileComponent},
    {path: '/login', name: 'Login', component: LoginComponent},
    {path: '/signup', name: 'SignUp', component: SignupComponent}
])

export class AppComponent {
    constructor(public router:Router) {
    }

    logout() {
        // logging out means just deleting the JWT from localStorage
        // and redirecting the user to the Login page
        localStorage.removeItem('id_token');
        this.router.navigate(['Login']);
    }
}