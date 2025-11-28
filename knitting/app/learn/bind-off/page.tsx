'use client';

import { getFlatPages } from '../../../src/data/data';
import { usePathname } from 'next/navigation';

export default function Page() {
    const pathname = usePathname();
    const flatPages = getFlatPages();
    const currentPage = flatPages.find(page => page.path === pathname);

    return(
        <div className="flex flex-col justify-center gap-6 mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold text-txtBold">
                {currentPage ? currentPage.title : 'Untitled'}
            </h1>
            
            <div className="text-lg text-txtDefault flex flex-col gap-4">
                <p>
                    Casting off, also called binding off, is the method used to finish your knitting so that the stitches are secure and will not unravel. It is usually done at the end of a project or a section of knitting once you have reached the desired length. The process involves working two stitches and then lifting the first stitch over the second, leaving one stitch on the needle. This is repeated across the row until only one stitch remains, which is then fastened off. Casting off can be done in different styles, such as loosely for a stretchy edge or more tightly for a firmer finish, depending on the type of garment or piece you are making. A neat cast-off edge helps the finished piece maintain its shape and gives it a clean, professional appearance. In patterns, you will often see instructions like “cast off all stitches” or “bind off loosely,” indicating that it is time to finish the edge of your work. 
                </p>
            </div>
        </div>
    )
}