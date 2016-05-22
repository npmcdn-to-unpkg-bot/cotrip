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
var common_1 = require('@angular/common');
var angular2_jwt_1 = require('angular2-jwt');
var http_1 = require('@angular/http');
var ProfileComponent = (function () {
    function ProfileComponent(router, http, authHttp) {
        this.router = router;
        this.http = http;
        this.authHttp = authHttp;
        this.jwtHelper = new angular2_jwt_1.JwtHelper();
        // get the JWT from localStorage
        this.jwt = localStorage.getItem('id_token');
        // store the decoded JSON from this JWT
        this.decodedJwt = this.jwt && this.jwtHelper.decodeToken(this.jwt);
    }
    ProfileComponent = __decorate([
        core_1.Component({
            selector: 'profile',
            directives: [common_1.CORE_DIRECTIVES],
            templateUrl: 'app/components/profile/profile.component.html'
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, http_1.Http, angular2_jwt_1.AuthHttp])
    ], ProfileComponent);
    return ProfileComponent;
}());
exports.ProfileComponent = ProfileComponent;
//# sourceMappingURL=profile.component.js.map