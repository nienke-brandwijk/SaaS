'use client';

import { getFlatPages } from '../../../src/data/data';
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
                    Knitting is a relaxing and creative craft that lets you turn simple yarn 
                    into something beautiful and useful, from cozy scarves to handmade sweaters. 
                    If you're new to knitting, don't worry! All you need to start are a pair of 
                    knitting needles, some yarn, and a bit of patience.
                </p>

                <p>
                    Begin by learning the basics: how to cast on (start your stitches), knit 
                    and purl (the two main stitches), and bind off (finish your work). Once 
                    you're comfortable with these, you'll be able to follow simple patterns 
                    and experiment with different textures and designs.
                </p>

                <p>
                    Understanding common knitting terms will make it much easier to follow 
                    patterns and tutorials, so we've put together a glossary to help you 
                    along the way. Whether you're just picking up your needles for the first 
                    time or brushing up on forgotten skills, you'll find everything you need 
                    here to begin your knitting journey with confidence.
                </p>
            </div>
        </div>
    )
}