export class Component{
    componentID: number
    componentURL: string
    positionX: number
    positionY: number
    componentType: string
    componentContent: string
    componentWidth: number
    componentHeight: number
    componentZ: number
    componentFontSize: number
    componentFontWeight: number
    componentColor: string
    componentRotation: number

    constructor(
            componentID: number,
            componentURL: string,
            positionX: number,
            positionY: number,
            componentType: string,
            componentContent: string,
            componentWidth: number,
            componentHeight: number,
            componentZ: number,
            componentFontSize: number,
            componentFontWeight: number,
            componentColor: string,
            componentRotation: number,
    ){
        this.componentID = componentID;
        this.componentURL = componentURL;
        this.positionX = positionX;
        this.positionY = positionY;
        this.componentType = componentType;
        this.componentContent = componentContent;
        this.componentWidth = componentWidth;
        this.componentHeight = componentHeight;
        this.componentZ = componentZ;
        this.componentFontSize = componentFontSize;
        this.componentFontWeight = componentFontWeight;
        this.componentColor = componentColor;
        this.componentRotation = componentRotation;
    }
}