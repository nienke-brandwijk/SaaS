export class Image {
    imageID: number
    imageURL: string
    imageHeight: number
    imageWidth: number

    constructor(
        imageID: number,
        imageURL: string,
        imageHeight: number,
        imageWidth: number){
            this.imageID = imageID;
            this.imageURL = imageURL;
            this.imageHeight = imageHeight;
            this.imageWidth = imageWidth;
        }
}