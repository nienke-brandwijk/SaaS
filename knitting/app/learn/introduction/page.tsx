'use client';

import { getFlatPages } from '../../../src/data/data';
import { usePathname } from 'next/navigation';
import { Merriweather } from "next/font/google";

const merriweather = Merriweather({
  subsets: ["latin"],
});

export default function Page() {
    const pathname = usePathname();
    const flatPages = getFlatPages();
    const currentPage = flatPages.find(page => page.path === pathname);

    return(
        <div className="flex flex-col justify-center gap-6 mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold text-txtBold">
                {currentPage ? currentPage.title : 'Untitled'}
            </h1>
            
            <div className={`text-lg text-txtDefault flex flex-col gap-4 ${merriweather.className}`}>
                <p>
                    Knitting is a calming, creative craft that allows you to transform simple strands of yarn into something warm, beautiful, and meaningful — from cozy scarves and hats to unique sweaters or home accessories. It’s a hobby that invites you to slow down, focus on the moment, and enjoy the process of making something with your own hands.
                </p>

                <p>
                    If you're new to knitting, don’t worry — everyone starts somewhere, and the basics are easier than they might seem. All you need to begin are a pair of knitting needles, some yarn you love, and a little bit of patience. You’ll start by learning the fundamental techniques: casting on (putting stitches on your needle), knitting and purling (the two stitches that form every knitted fabric), and binding off (finishing your project so it doesn’t unravel). Once you’re familiar with these steps, you’ll already be able to follow simple patterns and explore textures, colors, and shapes.
                </p>

                <p>
                    Knitting has its own vocabulary, and understanding common terms will help you feel more confident as you follow tutorials or written patterns. That’s why we’ve created a clear and beginner-friendly glossary to support you on your learning journey.
                </p>
                <p>
                    Whether you're picking up knitting needles for the very first time, returning to a long-lost hobby, or simply curious about creating your own handmade pieces, this guide is here to walk you through every step. With practice, you’ll soon discover that knitting is not just a craft—but a comforting and empowering skill you can enjoy for a lifetime.
                </p>
            </div>
        </div>
    )
}