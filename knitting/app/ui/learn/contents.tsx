'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { CheckIcon } from '@heroicons/react/24/outline'; // ✅ toegevoegd

interface ContentsProps {
  progress: number;
  user: any;
}

export default function Contents({ progress, user }: ContentsProps) {
  const pathname = usePathname();

  const MenuItem = ({
    href,
    children,
    step,
  }: {
    href: string;
    children: React.ReactNode;
    step: number;
  }) => {
    const isActive = pathname === href;
    const isCompleted = progress > step;

    return (
      <Link
        href={href}
        className={`w-full px-4 text-left rounded ${
          isActive
            ? 'bg-colorBtn text-txtColorBtn'
            : 'text-txtDefault hover:bg-bgHover'
        }`}
      >
        <span>{children}</span>

        {isCompleted && user && (
          <CheckIcon className="inline ml-2 w-4 h-4 text-txtTransBtn align-middle" />
        )}
      </Link>
    );
  };

    return (
            <ul className="menu w-full space-y-1">
                <li className="ml-3 mt-5">
                    <MenuItem href="/learn/introduction" step={0}>1. Introduction</MenuItem>
                    <MenuItem href="/learn/materials" step={1}>2 What do we use to knit?</MenuItem>
                    <MenuItem href="/learn/cast-on" step={2}>3 Cast on</MenuItem>
                    <MenuItem href="/learn/knit-stitch" step={3}>4 knit stitch</MenuItem>
                    <MenuItem href="/learn/purl-stitch" step={4}>5 Purl stitch</MenuItem>
                    <MenuItem href="/learn/bind-off" step={5}>6 Bind off</MenuItem>
                    <MenuItem href="/learn/size" step={6}>7 The right size</MenuItem>
                </li>
            </ul>
    )
}