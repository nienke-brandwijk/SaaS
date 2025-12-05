'use client';

import { getFlatPages } from '../../../src/data/data';
import { usePathname } from 'next/navigation';
import { Merriweather } from "next/font/google";

const merriweather = Merriweather({
  subsets: ["latin"],
});

export default function Page() {
    const pathname = usePathname();
    const flatPages = getFlatPages();
    const currentPage = flatPages.find(page => page.path === pathname);

    return(
        <div className="flex flex-col justify-center gap-6 mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold text-txtBold">
                {currentPage ? currentPage.title : 'Untitled'}
            </h1>
            
            <div className={`text-lg text-txtDefault flex flex-col gap-4 ${merriweather.className}`}>
                <p>
                    The purl stitch is the second basic stitch in knitting and is essentially the reverse of the knit stitch. It’s used together with knit stitches to create a variety of textures and patterns. To start, hold the needle with your stitches in your left hand, and this time, bring the working yarn—the yarn coming from the ball—to the front of your work. 
                </p>

                <p>
                    Insert the right-hand needle from back to front through the front of the first stitch on the left needle. Then, wrap the working yarn around the tip of the right needle, keeping it in front of the stitches. Pull the right needle with the yarn back through the stitch, forming a new loop on the right needle. Let the original stitch slide off the left needle. Repeat this process across the row, and when finished, transfer the needle with the new stitches to your left hand to start the next row. 
                </p>

                <p>
                    A properly executed purl stitch creates a small horizontal bump on the front of your work. Together with knit stitches, purl stitches allow you to create patterns such as ribbing, seed stitch, and more. As with the knit stitch, aim for even tension: stitches should move smoothly on the needle but remain secure. Practicing purl stitches alongside knit stitches will quickly give you the foundation to follow almost any beginner knitting pattern.
                </p>
            </div>
        </div>
    )
}