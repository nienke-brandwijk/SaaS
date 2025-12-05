'use client';

import React, { useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { getFlatPages } from '../../../src/data/data';

interface ButtonsProps {
  user: any;
  setProgress: (value: number) => void;
}

export default function Buttons({ user, setProgress }: ButtonsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const pages = getFlatPages();
  const [localProgress, setLocalProgress] = useState(user.learn_process);
  const [showCongrats, setShowCongrats] = useState(false);

  const currentIndex = pages.findIndex(page => page.path === pathname);
  const previousPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;
  const isLastPage = currentIndex === pages.length - 1;

  const handleNextClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const nextPageNumber = getPageNumber(pathname);
    if (nextPageNumber > (localProgress || 0)) {
      try {
        await fetch('/api/users/uppro', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, progress: nextPageNumber }),
        });
        setLocalProgress(nextPageNumber);
        setProgress(nextPageNumber);
      } catch (err) {
        console.error(err);
      }
    }
    if (isLastPage) {
      setShowCongrats(true);
      try {
        await fetch('/api/users/uppro', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, progress: 8 }),
        });
        setLocalProgress(8);
        setProgress(8);
      } catch (err) {
        console.error(err);
      }
      return;
    }
    if (nextPage) router.push(nextPage.path);
  };

  function getPageNumber(pathname: string): number {
    switch (pathname) {
      case '/learn/introduction': return 1;
      case '/learn/materials': return 2;
      case '/learn/cast-on': return 3;
      case '/learn/knit-stitch': return 4;
      case '/learn/purl-stitch': return 5;
      case '/learn/bind-off': return 6;
      case '/learn/size': return 7;
      default: return 0;
    }
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <a
        href={previousPage?.path || '#'}
        className={`border border-borderBtn rounded-lg bg-transparent px-4 py-2 text-txtTransBtn
          hover:bg-colorBtn hover:text-txtColorBtn ${!previousPage && 'invisible pointer-events-none'}`}
      >
        &lt; Back
      </a>

      {(!isLastPage || localProgress !== 8) && (
        <a
          href="#"
          onClick={handleNextClick}
          className="border border-borderBtn rounded-lg bg-colorBtn px-4 py-2 text-txtColorBtn hover:bg-transparent hover:text-txtTransBtn"
        >
          {isLastPage ? 'Complete ✅' : 'Next >'}
        </a>
      )}

      {showCongrats && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">🎉 Congratulations! 🎉</h2>
            <p className="mb-6">You have completed all the learning pages!</p>
            <button
              onClick={() => setShowCongrats(false)}
              className="px-4 py-2 bg-colorBtn text-txtColorBtn rounded-lg hover:bg-white hover:text-txtTransBtn transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
