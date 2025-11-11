'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { getFlatPages } from '../../../src/data/data';

export default function Buttons() {
    const pathname = usePathname();
    const pages = getFlatPages();

    // Find current page index
    const currentIndex = pages.findIndex(page => page.path === pathname);
    
    // Get previous and next pages
    const previousPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
    const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

    return (
        <div className="absolute bottom-[55px] left-1/2 -translate-x-1/2 flex items-center justify-center gap-4">
            {previousPage && (
                <Link 
                    href={previousPage.path}
                    className="border border-orange-700 text-orange-700 px-4 py-2 rounded-lg bg-transparent hover:bg-orange-700 hover:text-orange-100 uppercase transition"
                >
                    &lt; Back
                </Link>
            )}
            
            {nextPage && (
                <Link 
                    href={nextPage.path}
                    className="border border-orange-700 text-orange-100 px-4 py-2 rounded-lg bg-orange-700 hover:bg-transparent hover:text-orange-700 uppercase transition"
                >
                    Next &gt;
                </Link>
            )}
        </div>
    )
}
