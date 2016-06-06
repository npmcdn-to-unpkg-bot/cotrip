import {Component, Input} from "@angular/core";

@Component({
    selector: 'day',
    directives: [],
    providers: [],
    templateUrl: 'app/components/profile/day/day.component.html'
})

export class DayComponent {
    @Input() id:string;
    @Input() createdAt:string;

    constructor() {
        console.log('now')
    }

    getId() {
        console.log(this.id)
    }



}