export class VisionBoard {
    boardID: number
    boardName: string
    boardURL: string
    boardHeight: number
    boardWidth: number
    userID: string

    constructor(
        boardID: number,
        boardName: string,
        boardURL: string,
        boardHeight: number,
        boardWidth: number,
        userID: string
    ) { 
        this.boardID = boardID;
        this.boardName = boardName;
        this.boardURL = boardURL;
        this.boardHeight = boardHeight;
        this.boardWidth = boardWidth;
        this.userID = userID;
    }
}
