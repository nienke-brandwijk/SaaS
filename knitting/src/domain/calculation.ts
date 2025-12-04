export class Calculation {
    calculationID: number
    created_at: string 
    calculationInputX: string 
    calculationInputY: string
    calculationOutput: string
    wipID: number | null
    calculationName: string
    userID: string
    constructor(
        calculationID: number,
        created_at: string,
        calculationInputX: string,
        calculationInputY: string,
        calculationOutput: string,
        wipID: number | null,
        calculationName: string,
        userID: string
    ) {
        this.calculationID = calculationID;
        this.created_at = created_at;
        this.calculationInputX = calculationInputX;

        this.calculationInputY = calculationInputY;
        this.calculationOutput = calculationOutput;
        this.wipID = wipID;
        this.calculationName = calculationName;
        this.userID = userID;
    }       
}