'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { learnPages } from '../../../src/data/data';
import { ToC } from '../../../src/types/types';

export default function Contents() {
    const pathname = usePathname();

    const MenuItem = ({ href, children }: { href: string; children: React.ReactNode }) => {
        const isActive = pathname === href;
        return (
            <a 
                href={href}
                className={`w-full px-2 py-1 text-left rounded ${
                    isActive
                        ? 'bg-colorBtn text-txtColorBtn'
                        : 'text-txtDefault hover:bg-bgHover'
                }`}
            >
                {children}
            </a>
        );
    };

    return (
            <ul className="menu w-full space-y-1">
                <li className="ml-3">
                    <MenuItem href="/learn/introduction">1. Introduction</MenuItem>
                </li>
                <li>
                    <details open>
                    <summary >
                        <MenuItem href="/learn/basics">2. Basics</MenuItem>
                    </summary>
                    <ul className="ml-7 mt-1 space-y-1">
                        <li><MenuItem href="/learn/basics/materials">2.1 What do we use to knit?</MenuItem></li>
                        <li><MenuItem href="/learn/basics/cast-on">2.2 Cast on</MenuItem></li>
                        <li><MenuItem href="/learn/basics/knit-stitch">2.3 knit stitch</MenuItem></li>
                        <li><MenuItem href="/learn/basics/purl-stitch">2.4 Purl stitch</MenuItem></li>
                        <li><MenuItem href="/learn/basics/bind-off">2.5 Bind off</MenuItem></li>
                        <li><MenuItem href="/learn/basics/size">2.6 The right size</MenuItem></li>
                    </ul>
                    </details>
                </li>
            </ul>
    )
}