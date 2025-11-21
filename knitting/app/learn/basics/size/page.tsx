'use client';

import { getFlatPages } from '../../../../src/data/data';
import { usePathname } from 'next/navigation';

export default function Page() {
    const pathname = usePathname();
    const flatPages = getFlatPages();
    const currentPage = flatPages.find(page => page.path === pathname);

    return(
        <div className="flex flex-col justify-center gap-6">
            <h1 className="text-4xl font-bold text-txtBold">
                {currentPage ? currentPage.title : 'Untitled'}
            </h1>
            
            <div className="text-lg text-txtDefault flex flex-col gap-4">
                <p>
                    When knitting, selecting the right size is essential to ensure your finished piece fits as intended. Most patterns provide a size (such as S, M, L, or numeric sizes) along with the recommended gauge, which is the number of stitches and rows per 10 cm (4 inches) in a specific stitch pattern. Gauge is crucial because even a small difference can change the dimensions of your garment significantly. Before starting, it is recommended to knit a swatch—a small square of fabric in the stitch pattern—so you can measure your gauge. Compare your swatch to the pattern’s recommended gauge and adjust your needle size if necessary to match it. Patterns may also provide exact measurements for different parts of the garment, like chest, waist, or sleeve length, which help you confirm the best size. By carefully checking both gauge and measurements, you can ensure your knitted piece will fit comfortably and look as intended. 
                </p>
            </div>
        </div>
    )
}