export class extraMaterials {
    readonly extraMaterialsID: number | undefined;
    readonly extraMaterialsDescription: string;
    readonly wipID: number;
    constructor( data: { extraMaterialsID?: number | undefined, extraMaterialsDescription: string,  wipID: number }) {
        this.extraMaterialsID = data.extraMaterialsID;
        this.extraMaterialsDescription = data.extraMaterialsDescription;
        this.wipID = data.wipID;
    }
}