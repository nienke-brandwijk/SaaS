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
        const indent = level > 0 ? `pl-${level * 2 + 4}` : '';

        if (hasChildren) {
            return (
                <li key={page.path}>
                    <details open>
                        <summary className="py-2 hover:underline hover:font-bold transition">
                            <Link 
                                href={page.path}
                                className={isActive ? 'text-orange-700 underline font-bold' : ''}
                            >
                                {page.title}
                            </Link>
                        </summary>
                        <ul className={indent}>
                            {page.children!.map(child => renderPage(child, level + 1))}
                        </ul>
                    </details>
                </li>
            );
        }

        return (
            <li key={page.path}>
                <Link 
                    href={page.path} 
                    className={`py-2 hover:underline hover:font-bold transition ${
                        isActive ? 'text-orange-700 font-bold' : ''
                    }`}
                >
                    {page.title}
                </Link>
            </li>
        );
    };

    return (
        <div className="text-stone-800 flex h-full flex-col px-3 py-4">
            <ul className="menu">
                {learnPages.map(page => renderPage(page))}
            </ul>
        </div>
    )
}