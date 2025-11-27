export class PatternQueue {
    readonly patternQueueID: number | undefined;
    readonly patternName: string;
    readonly patternLink: string;
    readonly patternPosition: number;          
    readonly userID: string ;  
    
    constructor( data: { patternQueueID?: number | undefined, patternName: string, patternLink: string, patternPosition: number, userID: string }) {
        this.patternQueueID = data.patternQueueID;                 
        this.patternName = data.patternName;
        this.patternLink = data.patternLink;
        this.patternPosition = data.patternPosition;
        this.userID = data.userID;
    }
      
}