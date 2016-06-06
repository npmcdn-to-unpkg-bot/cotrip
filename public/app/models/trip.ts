export class Trip {
    public id:string;
    public name:string;
    public start_date:string;
    public end_date:string;
    public participants:number = 0;
    public description:string;
    public is_public:boolean = true;

    constructor() {
    }
    
    setID(id:string) {
        this.id = id
    }

    setName(name:string) {
        this.name = name
    }
}