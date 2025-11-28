'use client';

import React from "react";
import { usePathname, useRouter } from 'next/navigation';
import { getFlatPages } from '../../../src/data/data';

interface ButtonsProps {
  user: any;
  setProgress: (value: number) => void;
}

export default function Buttons({ user, setProgress }: ButtonsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const pages = getFlatPages();

    const currentIndex = pages.findIndex(page => page.path === pathname);
    const previousPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
    const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

    const handleNextClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (!nextPage || !user) return;
        const nextPageNumber = getPageNumber(pathname) + 1;
        if (nextPageNumber > (user.learn_process || 0)) {
            try {
                const res = await fetch('/api/users/uppro', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id, progress: nextPageNumber }),
                });
                setProgress(nextPageNumber);
                if (!res.ok) console.error('Failed to update progress');
                else console.log('Progress updated:', nextPageNumber);
            } catch (err) {
                console.error('Error updating progress:', err);
            }
        }
        router.push(nextPage.path);
    };

    function getPageNumber(pathname: string): number {
        switch (pathname) {
            case '/learn/introduction': return 1;
            case '/learn/materials': return 2;
            case '/learn/cast-on': return 3;
            case '/learn/knit-stitch': return 4;
            case '/learn/purl-stitch': return 5;
            case '/learn/bind-off': return 6;
            case '/learn/size': return 7;
            default: return 0;
        }
    }

    return (
        <div className="flex items-center justify-center gap-4">
            <a
                href={previousPage?.path || '#'}
                className={`border border-borderBtn rounded-lg bg-transparent px-4 py-2 text-txtTransBtn
                    hover:bg-colorBtn hover:text-txtColorBtn ${!previousPage && 'invisible pointer-events-none'}`}
            >
                &lt; Back
            </a>

            <a
                href={nextPage?.path || '#'}
                onClick={handleNextClick}
                className={`border border-borderBtn rounded-lg bg-colorBtn px-4 py-2 text-txtColorBtn
                    hover:bg-transparent hover:text-txtTransBtn ${!nextPage && 'invisible pointer-events-none'}`}
            >
                Next &gt;
            </a>
        </div>
    );
}
