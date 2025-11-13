'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { learnPages } from '../../../src/data/data';
import { ToC } from '../../../src/types/types';

export default function Contents() {
    const pathname = usePathname();

    const renderPage = (page: ToC, level: number = 0) => {
        const isActive = pathname === page.path;
        const hasChildren = page.children && page.children.length > 0;

       if (hasChildren) {
            return (
                <li key={page.path}>
                    <details open>
                        <summary className={`cursor-pointer text-left px-4 py-2 rounded ${
                                    isActive
                                        ? 'bg-colorBtn text-txtColorBtn'
                                        : 'text-txtDefault hover:bg-bgHover'
                                }`}>
                            <Link 
                                href={page.path}
                                
                            >
                                {page.title}
                            </Link>
                        </summary>
                        <ul>
                            {page.children!.map(child => renderPage(child, level + 1))}
                        </ul>
                    </details>
                </li>
            );
        }

        return (
            <li className={`w-full px-4 py-2 text-left rounded ${
                        isActive
                            ? 'bg-colorBtn text-txtColorBtn'
                            : 'text-txtDefault hover:bg-bgHover'
                    }`} key={page.path}>
                <Link 
                    href={page.path} 
                >
                    {page.title}
                </Link>
            </li>
        );
    };

    return (
        <div className="text-txtDefault flex h-full flex-col">
            <ul className="menu">
                {learnPages.map(page => renderPage(page))}
            </ul>
        </div>
    )
}