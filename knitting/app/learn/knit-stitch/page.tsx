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
                    The knit stitch is one of the two fundamental stitches in knitting and forms the foundation for countless projects, from scarves to blankets. To start, hold the needle with your cast-on stitches in your left hand and keep the working yarn—the yarn coming from the ball—behind your work. 
                </p>

                <p>
                    Insert the right-hand needle from front to back through the front of the first stitch on the left needle. Then, wrap the working yarn around the tip of the right needle, keeping the yarn behind the needles. Pull the right needle with the wrapped yarn back through the stitch, creating a new loop on the right needle. Finally, let the original stitch slide off the left needle—your new stitch is now secured. Repeat these steps across the row. When you reach the end, transfer the needle with the new stitches to your left hand to begin the next row. 
                </p>

                <p>
                    A properly made knit stitch shows a clear “V” shape on the front of your work. Keeping the yarn behind the stitches helps prevent gaps and makes it easier to switch between knit and purl stitches later on. For beginners, it’s important to maintain even tension: stitches should slide easily on the needle but shouldn’t be so loose that they fall off. Take your time, and remember that your first rows may feel slow, but with practice, knitting the knit stitch will quickly become natural. 
                </p>
            </div>
        </div>
    )
}