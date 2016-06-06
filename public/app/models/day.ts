import {Activity} from "./activity";
import {Moment} from "~moment/moment";
export class Day {
    private id:string;
    public activities:Array<Activity>;
    public description:string;

    constructor(public date:Moment) {
    }

    // to be deleted
    getDate():Moment {
        return this.date
    }
}