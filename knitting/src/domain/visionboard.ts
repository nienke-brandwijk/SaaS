export class VisionBoard {
    boardID: number
    boardName: string
    boardURL: string
    boardHeight: number | null
    boardWidth: number | null
    createdAt: Date | null
    updatedAt: Date | null
    userID: string

    constructor(
        boardID: number,
        boardName: string,
        boardURL: string,
        boardHeight: number,
        boardWidth: number,
        createdAt: Date | null,
        updatedtAt: Date | null,
        userID: string
    ) { 
        this.boardID = boardID;
        this.boardName = boardName;
        this.boardURL = boardURL;
        this.boardHeight = boardHeight;
        this.boardWidth = boardWidth;
        this.createdAt = createdAt;
        this.updatedAt = updatedtAt;
        this.userID = userID;
    }
}
