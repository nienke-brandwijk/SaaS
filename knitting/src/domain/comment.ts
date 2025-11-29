export class Comment {
    commentID: number;
    created_at: Date;
    commentContent: string;
    wipID: number;

    constructor(
        commentID: number,
        created_at: Date,
        commentContent: string,
        wipID: number
    ) {
        this.commentID = commentID;
        this.created_at = created_at;   
        this.commentContent = commentContent;
        this.wipID = wipID;
    }
}
