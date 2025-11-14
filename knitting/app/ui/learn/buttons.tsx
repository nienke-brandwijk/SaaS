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
        <div className="flex items-center justify-center gap-4">
            
                <Link 
                    href={previousPage?.path || '#'}
                    className={`border border-borderBtn rounded-lg bg-transparent px-4 py-2 text-txtTransBtn
                    hover:bg-colorBtn hover:text-txtColorBtn ${!previousPage && 'invisible pointer-events-none'}`}
                >
                    &lt; Back
                </Link>
            
                <Link 
                    href={nextPage?.path || '#'}
                    className={`border border-borderBtn rounded-lg bg-colorBtn px-4 py-2 text-txtColorBtn
                    hover:bg-transparent hover:text-txtTransBtn ${!nextPage && 'invisible pointer-events-none'}`} 
                >
                    Next &gt;
                </Link>
        </div>
    )
}
