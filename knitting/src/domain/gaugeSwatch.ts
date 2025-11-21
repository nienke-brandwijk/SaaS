export class GaugeSwatch {
    readonly gaugeID: number | undefined;
    readonly gaugeStitches: number;
    readonly gaugeRows: number;
    readonly gaugeDescription: string;
    readonly wipID: number;
    constructor( data: { gaugeID?: number | undefined, gaugeStitches: number, gaugeRows: number, gaugeDescription: string, wipID: number }) {
        this.gaugeID = data.gaugeID;                 
        this.gaugeStitches = data.gaugeStitches;    
        this.gaugeRows = data.gaugeRows;
        this.gaugeDescription = data.gaugeDescription;
        this.wipID = data.wipID;
    }       
}