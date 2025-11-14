export class WIPS {
    readonly wipID: number | undefined
    readonly created_at: string;
    readonly wipName: string;
    readonly wipPictureURL: string;
    readonly wipBoardID: number;
    readonly wipFinished: boolean;
    readonly wipCurrentPosition: string;
    readonly wipSize: string;
    readonly wipChestCircumference: number;
    readonly wipEase: number;
    readonly userID: string;


    constructor( user: {wipID?: number, created_at: string, wipName: string, wipPictureURL: string, wipBoardID: number, wipFinished: boolean, wipCurrentPosition: string, wipSize: string, wipChestCircumference: number, wipEase: number, userID: string}) {
        this.wipID = user.wipID;
        this.created_at = user.created_at;
        this.wipName = user.wipName;
        this.wipPictureURL = user.wipPictureURL;
        this.wipBoardID = user.wipBoardID;
        this.wipFinished = user.wipFinished;
        this.wipCurrentPosition = user.wipCurrentPosition;
        this.wipSize = user.wipSize;
        this.wipChestCircumference = user.wipChestCircumference;
        this.wipEase = user.wipEase;
        this.userID = user.userID;
    }
}