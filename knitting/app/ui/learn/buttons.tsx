'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Buttons() {
    const pathname = usePathname();

    return (
        <div className="absolute bottom-[55px] left-1/2 -translate-x-1/2 flex items-center justify-center gap-4">
            <button className="border border-orange-700 text-orange-700 px-4 py-2 rounded-lg bg-transparent hover:bg-orange-700 hover:text-orange-100 uppercase transition">
                &lt; Back
            </button>
            <button className="border border-orange-700 text-orange-100 px-4 py-2 rounded-lg bg-orange-700 hover:bg-transparent hover:text-orange-700 uppercase transition">
                Next &gt;
            </button>
        </div>
    )
}
