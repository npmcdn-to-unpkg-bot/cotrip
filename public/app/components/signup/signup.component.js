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
var common_1 = require('@angular/common');
var router_deprecated_1 = require('@angular/router-deprecated');
var http_1 = require('@angular/http');
var handle_service_1 = require("../../services/handle.service");
var SignupComponent = (function () {
    function SignupComponent(router, http, handle) {
        this.router = router;
        this.http = http;
        this.handle = handle;
        this.signUpForm = new common_1.ControlGroup({
            first_name: new common_1.Control(""),
            last_name: new common_1.Control(""),
            username: new common_1.Control(""),
            password: new common_1.Control("")
        });
    }
    SignupComponent.prototype.signup = function (data) {
        var _this = this;
        var first_name = data.first_name;
        var last_name = data.last_name;
        var username = data.username;
        var password = data.password;
        var credentials = "first_name=" + first_name + "&last_name=" +
            last_name + "&username=" + username + "&password=" + password;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        this.http.post('http://localhost:3010/signup', credentials, {
            headers: headers
        }).map(function (res) { return res.json(); })
            .subscribe(function (data) {
            _this.handle.saveJwt(data.id_token);
            _this.router.parent.navigateByUrl('/profile');
        }, function (err) { return _this.handle.error(err); }, function () { return console.log('Auth OK!'); });
    };
    SignupComponent = __decorate([
        core_1.Component({
            selector: 'signup',
            directives: [router_deprecated_1.RouterLink],
            providers: [handle_service_1.Handle],
            styleUrls: ['app/components/signup/signup.component.css'],
            templateUrl: 'app/components/signup/signup.component.html'
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, http_1.Http, handle_service_1.Handle])
    ], SignupComponent);
    return SignupComponent;
}());
exports.SignupComponent = SignupComponent;
//# sourceMappingURL=signup.component.js.map