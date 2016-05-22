import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

@Component({
    selector: 'home',
    templateUrl: 'app/components/home/home.component.html',
    styleUrls: ['app/components/home/home.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class HomeComponent {

    constructor() {
    }
}