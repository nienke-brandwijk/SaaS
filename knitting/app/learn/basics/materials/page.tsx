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
                    When it comes to knitting, the most important tools are yarn and needles. Everything else is optional.
                </p>

                <p>
                    Yarn comes in many colors, textures, and thicknesses. For beginners, a smooth, medium-weight yarn is easiest to work with—it’s easier to see your stitches and control your work. Wool is soft and forgiving, acrylic is easy to care for, and cotton is sturdy but less stretchy. 
                </p>

                <p>
                    Knitting needles come in different sizes and materials, such as wood, metal, or plastic. Medium-sized needles (around 4–6 mm) are ideal for beginners. Wooden needles hold the yarn better, while metal needles are smooth and allow stitches to glide. Straight needles are perfect for flat pieces like scarves, and circular needles are useful for larger or round projects. 
                </p>

                <p>
                    A few extra tools make finishing your work easier. A pair of scissors is needed to cut yarn neatly, and a tapestry or yarn needle is helpful for weaving in ends or sewing pieces together. 
                </p>
            </div>
        </div>
    )
}