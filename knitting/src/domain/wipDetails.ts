import { WIPS } from './wips';
import { Needle } from './needle';
import { GaugeSwatch } from './gaugeSwatch';
import { Yarn } from './yarn';
import { extraMaterials } from './extraMaterials';

export class WIPDetails {
    [x: string]: any;
    readonly wip: WIPS;
    readonly needles: Needle[];
    readonly gaugeSwatches: GaugeSwatch[];
    readonly yarns: Yarn[];
    readonly extraMaterials: extraMaterials[];

    constructor(data: {
        wip: WIPS;
        needles: Needle[];
        gaugeSwatches: GaugeSwatch[];
        yarns: Yarn[];
        extraMaterials: extraMaterials[];
    }) {
        this.wip = data.wip;
        this.needles = data.needles;
        this.gaugeSwatches = data.gaugeSwatches;
        this.yarns = data.yarns;
        this.extraMaterials = data.extraMaterials;
    }

    // Handige helper methods voor directe toegang tot WIP properties
    get wipID(): number | undefined {
        return this.wip.wipID;
    }

    get wipName(): string {
        return this.wip.wipName;
    }

    get wipPictureURL(): string {
        return this.wip.wipPictureURL;
    }

    get wipFinished(): boolean {
        return this.wip.wipFinished;
    }

    get wipCurrentPosition(): string {
        return this.wip.wipCurrentPosition;
    }

    get wipSize(): string {
        return this.wip.wipSize;
    }

    get wipChestCircumference(): number {
        return this.wip.wipChestCircumference;
    }

    get wipEase(): number {
        return this.wip.wipEase;
    }
}