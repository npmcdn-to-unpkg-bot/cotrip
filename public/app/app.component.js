"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_deprecated_1 = require('@angular/router-deprecated');
var home_component_1 = require("./components/home/home.component");
var login_component_1 = require("./components/login/login.component");
var signup_component_1 = require("./components/signup/signup.component");
var profile_component_1 = require("./components/profile/profile.component");
var LoggedInOutlet_1 = require("./LoggedInOutlet");
var user_service_1 = require("./services/user.service");
var handle_service_1 = require("./services/handle.service");
var AppComponent = (function () {
    function AppComponent(router, userService) {
        this.router = router;
        this.userService = userService;
    }
    AppComponent.prototype.logout = function () {
        this.userService.logout();
        this.router.navigate(['Login']);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app',
            templateUrl: 'app/app.component.html',
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, LoggedInOutlet_1.LoggedInRouterOutlet],
            providers: [router_deprecated_1.ROUTER_PROVIDERS, user_service_1.UserService, handle_service_1.Handle]
        }),
        router_deprecated_1.RouteConfig([
            { path: '/', name: 'Home', component: home_component_1.HomeComponent, useAsDefault: true },
            { path: '/profile', name: 'Profile', component: profile_component_1.ProfileComponent },
            { path: '/login', name: 'Login', component: login_component_1.LoginComponent },
            { path: '/signup', name: 'SignUp', component: signup_component_1.SignupComponent }
        ]), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, user_service_1.UserService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map