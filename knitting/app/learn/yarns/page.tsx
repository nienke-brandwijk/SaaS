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
                    Here you'll learn everything about yarns!
                </p>
            </div>
        </div>
    )
}