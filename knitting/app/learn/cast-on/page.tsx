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
                    Before you can start knitting, you need to cast on, which means creating the first row of stitches on your needle. Think of it as building the foundation for your project. 
                </p>

                <p>
                    The first step is making a slip knot. This knot is the very first stitch and also secures the yarn to your needle. To make a slip knot, leave a short tail of yarn, form a loop, and pull a piece of the yarn through the loop. Place this knot on your needle—congratulations, you’ve made your first stitch! 
                </p>

                <p>
                    Once your slip knot is in place, it’s time to cast on the rest of the stitches. Each stitch is added by looping the yarn over your fingers and the needle in a specific way (there are several techniques, but the simplest is the long-tail method). Continue until you have the number of stitches required for your pattern. Take your time and try to keep the stitches even—they should be snug but not too tight. 
                </p>
            </div>
        </div>
    )
}