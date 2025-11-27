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
}