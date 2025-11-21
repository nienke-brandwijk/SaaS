export class Needle {
    readonly needleID: number | undefined;
    readonly needleSize: string;
    readonly needlePart: string;
    readonly wipID: number;            
    constructor( data: { needleID?: number | undefined, needleSize: string, needlePart: string, wipID: number }) {
        this.needleID = data.needleID;                 
        this.needleSize = data.needleSize;
        this.needlePart = data.needlePart;
        this.wipID = data.wipID;
    }   
}