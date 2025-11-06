'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Contents() {
    const pathname = usePathname();

    return (
        <div className="text-stone-800 flex h-full flex-col px-3 py-4">
            <ul className="menu">
                <li>
                    <details open>
                    <summary className="py-2 hover:underline hover:font-bold transition">
                        <Link href="/learn/introduction">1. Introduction</Link>
                    </summary>
                    <ul className="pl-4">
                        <li><Link href="/learn/introduction/what-to-expect" className="py-2 hover:underline hover:font-bold transition">1.1 What to expect</Link></li>
                    </ul>
                    </details>
                </li>
                <li>
                    <details open>
                    <summary className="py-2 hover:underline hover:font-bold transition">
                        <Link href="/learn/materials">2. Materials</Link>
                    </summary>
                    <ul className="pl-4">
                        <li>
                            <details open>
                                <summary className="py-2 hover:underline hover:font-bold transition">
                                    <Link href="/learn/materials/yarns">2.1 Yarns</Link>
                                </summary>
                                <ul className="pl-6">
                                    <li><Link href="/learn/materials/yarns/types-of-yarn" className="py-2 hover:underline hover:font-bold transition">2.1.2 Types of yarn</Link></li>
                                    <li><Link href="/learn/materials/yarns/yarn-weights" className="py-2 hover:underline hover:font-bold transition">2.1.2 Yarn weights</Link></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details open>
                                <summary className="py-2 hover:underline hover:font-bold transition">
                                    <Link href="/learn/materials/needles"> 2.2 Needles</Link>
                                </summary>
                                <ul className="pl-6">
                                    <li><Link href="/learn/materials/needles/sizes" className="py-2 hover:underline hover:font-bold transition">2.2.1 Needle sizes</Link></li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                    </details>
                </li>
                <li><Link href="/learn/cast-on" className="py-2 hover:underline hover:font-bold transition">3. Cast on</Link></li>
            </ul>
    
        </div>
    )
}