'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { learnPages } from '../../../src/data/data';
import { ToC } from '../../../src/types/types';

interface ContentsProps {
  progress: number;
}

export default function Contents({ progress }: ContentsProps) {
    const pathname = usePathname();

    const MenuItem = ({ href, children, step }: { href: string; children: React.ReactNode; step: number }) => {
        console.log("LEVEL: " + progress)
        const isActive = pathname === href;
        const isCompleted = progress >= step;
        return (
            <a 
                href={href}
                className={`w-full px-2 py-1 text-left rounded ${
                    isActive
                        ? 'bg-colorBtn text-txtColorBtn'
                        : 'text-txtDefault hover:bg-bgHover'
                }`}
            >
                <span>{children}</span>
                {isCompleted && <span className="text-green-500 font-bold">✔</span>}
            </a>
        );
    };

    return (
            <ul className="menu w-full space-y-1">
                <li className="ml-3">
                    <MenuItem href="/learn/introduction" step={1}>1. Introduction</MenuItem>
                </li>
                <li>
                    <details open>
                    <summary >
                        <MenuItem href="/learn/basics" step={2}>2. Basics</MenuItem>
                    </summary>
                    <ul className="ml-7 mt-1 space-y-1">
                        <li><MenuItem href="/learn/basics/materials" step={3}>2.1 What do we use to knit?</MenuItem></li>
                        <li><MenuItem href="/learn/basics/cast-on" step={4}>2.2 Cast on</MenuItem></li>
                        <li><MenuItem href="/learn/basics/knit-stitch" step={5}>2.3 knit stitch</MenuItem></li>
                        <li><MenuItem href="/learn/basics/purl-stitch" step={6}>2.4 Purl stitch</MenuItem></li>
                        <li><MenuItem href="/learn/basics/bind-off" step={7}>2.5 Bind off</MenuItem></li>
                        <li><MenuItem href="/learn/basics/size" step={8}>2.6 The right size</MenuItem></li>
                    </ul>
                    </details>
                </li>
            </ul>
    )
}