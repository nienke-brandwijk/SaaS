'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Buttons() {
    const pathname = usePathname();

     const pages = [
        { path: '/learn/introduction', title: '1. Introduction' },
        { path: '/learn/introduction/what-to-expect', title: '1.1 What to expect' },
        { path: '/learn/materials', title: '2. Materials' },
        { path: '/learn/materials/yarns', title: '2.1 Yarns' },
        { path: '/learn/materials/yarns/types', title: '2.1.1 Types of yarn' },
        { path: '/learn/materials/yarns/weights', title: '2.1.2 Yarn weights' },
        { path: '/learn/materials/needles', title: '2.2 Needles' },
        { path: '/learn/materials/needles/sizes', title: '2.2.1 Needle sizes' },
        { path: '/learn/cast-on', title: '3. Cast on' },
    ];

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
