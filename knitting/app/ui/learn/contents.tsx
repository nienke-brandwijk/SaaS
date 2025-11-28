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
                    <li><MenuItem href="/learn/basics/materials" step={3}>2 What do we use to knit?</MenuItem></li>
                    <li><MenuItem href="/learn/basics/cast-on" step={4}>3 Cast on</MenuItem></li>
                    <li><MenuItem href="/learn/basics/knit-stitch" step={5}>4 knit stitch</MenuItem></li>
                    <li><MenuItem href="/learn/basics/purl-stitch" step={6}>5 Purl stitch</MenuItem></li>
                    <li><MenuItem href="/learn/basics/bind-off" step={7}>6 Bind off</MenuItem></li>
                    <li><MenuItem href="/learn/basics/size" step={8}>7 The right size</MenuItem></li>
                </li>
            </ul>
    )
}