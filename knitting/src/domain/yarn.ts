export class Yarn {
    readonly yarnID: number | undefined;  
    readonly yarnName: string;
    readonly yarnProducer: string;
    readonly yarnURL: string;
    readonly yarnAmountNeeded: number;
    readonly yarnAmountUsed: number;
    readonly wipID: number;     
    constructor( data: { yarnID?: number | undefined, yarnName: string, yarnProducer: string, yarnURL: string, yarnAmountNeeded: number, yarnAmountUsed: number, wipID: number}) {      
        this.yarnID = data.yarnID;
        this.yarnName = data.yarnName;
        this.yarnProducer = data.yarnProducer;
        this.yarnURL = data.yarnURL;
        this.yarnAmountNeeded = data.yarnAmountNeeded;
        this.yarnAmountUsed = data.yarnAmountUsed;  
        this.wipID = data.wipID;     
    }       
}