'use client'

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { WIPS } from '../../src/domain/wips';
import { WIPDetails } from '../../src/domain/wipDetails';
import { PatternQueue } from '../../src/domain/patternQueue';
import Queue from '../ui/create/queue';
import { VisionBoard } from '../../src/domain/visionboard';

export default function CreatePageClient({ user, wipsData, wipDetailsData, patternQueueData, visionBoardsData }: { user: any , wipsData: WIPS[], wipDetailsData: WIPDetails[], patternQueueData: PatternQueue[], visionBoardsData: VisionBoard[];}) {
  const router = useRouter();
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);
  const [currentWipIndex, setCurrentWipIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const [wips, setWips] = useState<WIPS[]>(wipsData);
  const handleWIPAdded = (newWIP: WIPS) => {
    setWips([newWIP, ...wips]); 
    setCurrentWipIndex(0);
  };


  const handlePatternRemoved = (patternQueueID: number) => {
    setPatternQueue(patternQueue.filter(p => p.patternQueueID !== patternQueueID));
  };

  const [patternQueue, setPatternQueue] = useState<PatternQueue[]>(patternQueueData);
  const handlePatternAdded = (newPattern: PatternQueue) => {
    setPatternQueue([...patternQueue, newPattern]);
  };
  

  useEffect(() => {
    console.log("User in CreatePageClient:", user); 
    if (!user) {
      setShowPopup(true);
    }
  }, [user]);

  return (
    <>
    
    <div className="flex h-screen md:overflow-hidden relative">
      <div className="flex-1 grow p-6 md:overflow-y-auto md:p-12">
          {/* Normale content */}
          <div className={'flex flex-col items-center space-y-16'}>
            {/* WORK IN PROGRESS */}
            <div className="card w-4/5 h-4/5 relative">
              {/* "WIPS" & add button */}
              <div className="flex items-center gap-4 py-2">
                <h1 className="card-title font-bold text-txtBold text-2xl">WIPS: Work In Progress ({wips.length})</h1>
                <button onClick={() => router.push('/wips')}
                className="px-2 pb-1 flex items-center justify-center border border-borderAddBtn rounded-lg bg-transparent hover:bg-colorAddBtn hover:text-txtColorAddBtn transition">
                  +
                </button>
              </div>

              {/* carousel */}
              {wips.length > 0 ? (
                
                  <div className="card-body border border-borderCard bg-white rounded-lg flex flex-col">

                    {/* className="static flex-1 flex items-center p-2" */}
                    <div className="relative flex-1 flex items-center p-2" style={{minHeight: '400px'}}>
                      {/* className="carousel w-full flex snap-x snap-mandatory overflow-x-hidden" */}
                      <div className="w-full relative">

                        {wips.map((wip, index) => {
                          const currentWipDetails = wipDetailsData.find(detail => detail.wipID === wip.wipID);

                          console.log(`WIP ${index}:`, wip.wipID); 
                          console.log(`Found details:`, currentWipDetails); 

                          return (
                            <div key={wip.wipID || index} id={`wips${index}`} className={`w-full flex flex-col gap-4 p-2 ${index === currentWipIndex ? 'block' : 'hidden'}`}>
                            
                            {/* title */}
                            <h2 onClick={() => router.push(`/wips/${wip.wipID}`)} className="text-xl text-txtDefault px-4 py-2 hover:underline hover:font-bold cursor-pointer">{wip.wipName}</h2>

                            <div className="flex justify-between gap-4">
                              {/* switch buttons */}
                              <div>
                                <button onClick={() => setCurrentWipIndex(Math.max(0, currentWipIndex - 1))} disabled={currentWipIndex === 0} className="btn rounded-lg border border-borderCard p-2 h-80 flex items-center hover:bg-colorAddBtn hover:text-txtColorAddBtn transition"> 
                                  ❮ 
                                </button>
                              </div>
                            
                          
                              {/* WIP image */}
                              <img src={wip.wipPictureURL || "/create/Empty-Image.svg"} alt={wip.wipName} className="h-80" />

                              {/* wips: Project details  */}
                              <div className="card border border-borderCard bg-[url('/background.svg')] rounded-lg h-80 flex flex-col">
                              <h3 className="card-title p-2 italic">Project details</h3>
                              <div className="card-body flex-1 overflow-y-auto">
                                <div className="px-6 space-y-1">
                                  {/* Current Position */}
                                  <div>
                                    <p className="font-semibold text-sm">Current Position:</p>
                                    <ul className="list-disc pl-6 text-sm">
                                      <li>{wip.wipCurrentPosition}</li>
                                    </ul>
                                  </div>

                                  {/* Needles */}
                                  {currentWipDetails?.needles && currentWipDetails.needles.length > 0 && (
                                    <div>
                                      <p className="font-semibold text-sm">Needles:</p>
                                      <ul className="list-disc pl-6 text-sm">
                                        {currentWipDetails.needles.map((needle) => (
                                          <li key={needle.needleID}>
                                            {needle.needleSize} mm needle: {needle.needlePart}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Gauge */}
                                  {currentWipDetails?.gaugeSwatches && currentWipDetails.gaugeSwatches.length > 0 && (
                                    <div>
                                      <p className="font-semibold text-sm">Gauge:</p>
                                      <ul className="list-disc pl-6 text-sm">
                                        {currentWipDetails.gaugeSwatches.map((gauge) => (
                                          <li key={gauge.gaugeID}>
                                            {gauge.gaugeStitches} sts x {gauge.gaugeRows} rows
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Yarns */}
                                  {currentWipDetails?.yarns && currentWipDetails.yarns.length > 0 && (
                                    <div>
                                      <p className="font-semibold text-sm">Yarn:</p>
                                      <ul className="list-disc pl-6 text-sm">
                                        {currentWipDetails.yarns.map((yarn) => (
                                          <li key={yarn.yarnID}>
                                            {yarn.yarnName} by {yarn.yarnProducer}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Extra Materials */}
                                  {currentWipDetails?.extraMaterials && currentWipDetails.extraMaterials.length > 0 && (
                                    <div>
                                      <p className="font-semibold text-sm">Extra Materials:</p>
                                      <ul className="list-disc pl-6 text-sm">
                                        {currentWipDetails.extraMaterials.map((material) => (
                                          <li key={material.extraMaterialsID}>
                                            {material.extraMaterialsDescription}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Size info */}
                                  {(wip.wipSize || wip.wipChestCircumference || wip.wipEase) && (
                                    <div>
                                      <p className="font-semibold text-sm">Measurements:</p>
                                      <ul className="list-disc pl-6 text-sm">
                                        {wip.wipSize && <li>Size: {wip.wipSize}</li>}
                                        {wip.wipChestCircumference && <li>Chest Circumference: {wip.wipChestCircumference} cm</li>}
                                        {wip.wipEase && <li>Ease: {wip.wipEase} cm</li>}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                              {/* switch buttons */}
                              <div>
                                <button onClick={() => setCurrentWipIndex(Math.min(wips.length - 1, currentWipIndex + 1))} disabled={currentWipIndex === wips.length - 1} className="btn rounded-lg border border-borderCard p-2 h-80 flex items-center hover:bg-colorAddBtn hover:text-txtColorAddBtn transition"> 
                                  ❯ 
                                </button>
                              </div>
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
              ):(
                <div className="card-body border border-borderCard bg-white rounded-lg flex flex-col">
                    <div className="flex-1 flex items-center justify-center p-8" style={{minHeight: '400px'}}>
                      <button 
                        onClick={() => {
                          // TODO: Voeg hier later je route toe
                          console.log('Navigate to create new WIP');
                        }}
                        className="text-xl text-txtDefault hover:underline transition"
                      >
                        Start your first project!
                      </button>
                    </div>
                  </div>
              )}

              
            </div>

            {/* VISIONBOARDS */}
            <div className="card w-4/5 h-2/5">
              {/* "visionboards" & add button */}
              <div className="flex items-center gap-4 py-2">
                <h1 className="card-title font-bold text-txtBold text-2xl">Visionboards</h1>
                <button onClick={() => router.push('/visionboards')}
                className="px-2 pb-1 flex items-center justify-center border border-borderAddBtn rounded-lg bg-transparent hover:bg-colorAddBtn hover:text-txtColorAddBtn transition">
                  +
                </button>
              </div>
              {/* carousel: showing multiple visionboards */}
              {visionBoardsData.length > 0 ? (
                <div className="card-body border border-borderCard bg-white rounded-lg h-64 py-2 flex flex-col">
                  <div className="relative flex-1 flex items-center overflow-hidden px-4">
                    <div className="carousel carousel-center flex gap-4 items-center overflow-x-auto scroll-smooth">
                      {visionBoardsData.map((board) => (
                        <div 
                          key={board.boardID} 
                          className="carousel-item flex-shrink-0 cursor-pointer hover:opacity-80 transition"
                          onClick={() => router.push(`/visionboards/${board.boardID}`)}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <img 
                              src={board.boardURL} 
                              alt={board.boardName} 
                              className="h-48 w-auto object-contain rounded-lg" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card-body border border-borderCard bg-white rounded-lg h-64 flex items-center justify-center">
                  <button 
                    onClick={() => router.push('/visionboards')}
                    className="text-xl text-txtDefault hover:underline transition"
                  >
                    Create your first visionboard!
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`btn absolute top-2 px-2 ${isOpen ? 'right-60' : 'right-2'}`}
        >
            {isOpen ? '❯❯❯' : '❮❮❮'}
        </button>

        {isOpen && (
            <div className="w-1/5 h-full bg-bgSidebar bg-[url('/background.svg')] p-6 px-1">
                <Queue patternQueueData={patternQueueData} onPatternAdded={handlePatternAdded} onWIPAdded={handleWIPAdded} onPatternRemoved={handlePatternRemoved} />
            </div>
        )}



      </div>
      

      {/* Popup overlay - alleen tonen als niet ingelogd */}
      {showPopup && !user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-bgDefault rounded-lg p-8 max-w-md mx-4 shadow-sm">
            <h2 className="text-2xl font-bold text-txtBold mb-2">Login Required</h2>
            <p className="text-txtDefault mb-6">
              You need to be logged in to use the Create page.
            </p>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => router.push(`/login?redirect=${encodeURIComponent(pathname)}`)}
                className="w-full px-4 py-2 border border-borderBtn bg-colorBtn text-txtColorBtn rounded-lg hover:bg-transparent hover:text-txtTransBtn"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/')}
                className="text-sm text-txtSoft underline hover:text-txtTransBtn"
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