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
        const isActive = pathname === href;
        const isCompleted = progress >= step;
        return (
            <a 
                href={href}
                className={`w-full px-4 text-left rounded ${
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
                <li className="ml-3 mt-5">
                    <MenuItem href="/learn/introduction" step={1}>1. Introduction</MenuItem>
                    <MenuItem href="/learn/materials" step={2}>2 What do we use to knit?</MenuItem>
                    <MenuItem href="/learn/cast-on" step={3}>3 Cast on</MenuItem>
                    <MenuItem href="/learn/knit-stitch" step={4}>4 knit stitch</MenuItem>
                    <MenuItem href="/learn/purl-stitch" step={5}>5 Purl stitch</MenuItem>
                    <MenuItem href="/learn/bind-off" step={6}>6 Bind off</MenuItem>
                    <MenuItem href="/learn/size" step={7}>7 The right size</MenuItem>
                </li>
            </ul>
    )
}