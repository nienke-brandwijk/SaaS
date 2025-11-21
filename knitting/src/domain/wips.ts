export class WIPS {
    readonly wipID: number | undefined
    readonly created_at: string;
    readonly wipName: string;
    readonly wipPictureURL: string | null;
    readonly wipBoardID: number | null;
    readonly wipFinished: boolean | null;
    readonly wipCurrentPosition: string | null;
    readonly wipSize: string | null;
    readonly wipChestCircumference: number | null;
    readonly wipEase: number | null;
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