export class Component{
    componentID: number
    componentURL: string | undefined
    positionX: number
    positionY: number
    componentType: string
    componentContent: string | undefined
    componentWidth: number 
    componentHeight: number 
    componentZ: number | undefined
    componentFontSize: number | undefined
    componentFontWeight: number | undefined
    componentColor: string | undefined
    componentRotation: number | undefined

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

export interface ComponentData {
    componentURL?: string | undefined;
    positionX: number;
    positionY: number;
    componentType: 'image' | 'text';
    componentContent?: string | undefined;
    componentWidth?: number | undefined;
    componentHeight?: number | undefined;
    componentZ?: number | undefined;
    componentFontSize?: number | undefined;
    componentFontWeight?: number | undefined;
    componentColor?: string | undefined;
    componentRotation?: number | undefined;
}