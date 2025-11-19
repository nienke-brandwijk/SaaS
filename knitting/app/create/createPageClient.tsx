'use client'

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CreatePageClient({ user }: { user: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    console.log("User in CreatePageClient:", user); // Debug log
    if (!user) {
      setShowPopup(true);
    }
  }, [user]);

  return (
    <>
      {/* Normale content */}
        <div className={'flex flex-col items-center space-y-16'}>
          {/* WORK IN PROGRESS */}
          <div className="card w-4/5 h-4/5 relative">
            {/* "WIPS" & add button */}
            <div className="flex items-center gap-4 py-2">
              <h1 className="card-title font-bold text-txtBold text-2xl">WIPS: Work In Progress</h1>
              <button className="px-2 pb-1 flex items-center justify-center border border-borderAddBtn rounded-lg bg-transparent hover:bg-colorAddBtn hover:text-txtColorAddBtn transition">
                +
              </button>
            </div>
            {/* carousel: showing 1 WIPS */}
            <div className="card-body border border-borderCard bg-white rounded-lg flex flex-col">
              {/* title wips1 */}
              <h2 className="text-xl text-txtDefault px-4 py-2">Title</h2>

              <div className="static flex-1 flex items-center p-2">
                <div className="carousel w-full flex justify-center items-center ">
                  {/* wips1 */}
                  <div id="wips1" className="carousel-item w-full justify-between flex gap-4 p-2">
                    {/* switch buttons */}
                    <div>
                      <a href="#wips3" className="btn rounded-lg border border-borderCard p-2 h-80 flex items-center hover:bg-colorAddBtn hover:text-txtColorAddBtn transition"> 
                        ❮ 
                      </a>
                    </div>
                  
                    {/* WIP image */}
                    <img src="/create/redcardigan.png" alt="Red Cardigan" className="h-80" />

                    {/* wips: Project details  */}
                    <div className="card border border-borderCard bg-[url('/background.svg')] rounded-lg h-80 flex flex-col">
                      <h3 className="card-title p-2 italic">Project details</h3>
                      <div className="card-body flex-1">
                        <ul className="list-disc px-6">
                        </ul>
                      </div>
                    </div>

                    {/* switch buttons */}
                    <div>
                      <a href="#wips2" className="btn rounded-lg border border-borderCard p-2 h-80 flex items-center hover:bg-colorAddBtn hover:text-txtColorAddBtn transition"> 
                        ❯ 
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VISIONBOARDS */}
          <div className="card w-4/5 h-2/5">
            {/* "visionboards" & add button */}
            <div className="flex items-center gap-4 py-2">
              <h1 className="card-title font-bold text-txtBold text-2xl">Visionboards</h1>
              <button 
                onClick={() => router.push('/visionboards')}
                className="px-2 pb-1 flex items-center justify-center border border-borderAddBtn rounded-lg bg-transparent hover:bg-colorAddBtn hover:text-txtColorAddBtn transition"
              >
                +
              </button>
            </div>
            {/* carousel: showing multiple visionboards */}
            <div className="card-body border border-borderCard bg-white rounded-lg h-64 py-2 flex flex-col">
              <div className="relative flex-1 flex items-center overflow-hidden px-4">
                <div className="carousel carousel-center flex gap-4 items-center overflow-x-auto scroll-smooth">
                  {/* board1 */}
                  <div id="board1" className="carousel-item ">
                    <img src="/create/board1.png" alt="Board 1" className="h-48 w-auto object-contain" />
                  </div>

                  {/* board2 */}
                  <div id="board2" className="carousel-item ">
                    <img src="/create/board2.png" alt="Board 2" className="h-48 w-auto object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      

      {/* Popup overlay - alleen tonen als niet ingelogd */}
      {showPopup && !user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-stone-50 rounded-lg p-8 max-w-md mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="text-stone-600 mb-6">
              You need to be logged in to use the Create page.
            </p>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => router.push(`/login?redirect=${encodeURIComponent(pathname)}`)}
                className="w-full px-4 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800 transition"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/')}
                className="text-sm text-stone-600 underline hover:text-stone-800 transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}