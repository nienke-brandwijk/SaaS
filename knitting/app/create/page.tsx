import { getCurrentUser } from '../../lib/auth'; 
import CreatePageClient from './createPageClient';

export default function Page() {
    return(
        <div className="flex flex-col items-center space-y-16">

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
                            
                                <img src="/create/redcardigan.png" alt="Red Cardigan" className="h-80" />

                                {/* wips: Project details  */}
                                <div className="card border border-borderCard bg-[url('/background.svg')] rounded-lg h-80 flex flex-col">
                                    <h3 className="card-title p-2 italic">Project details</h3>
                                    <div className="card-body flex-1">
                                        <ul className="list-disc px-6">
                                            <li>Needles 6mm - 100cm</li>
                                            <li>Needles 5mm - 100cm</li>
                                            <li>6 buttons 10mm</li>
                                            <li>G60 - fuchsia (colour B)</li>
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
                    <button className="px-2 pb-1 flex items-center justify-center border border-borderAddBtn rounded-lg bg-transparent hover:bg-colorAddBtn hover:text-txtColorAddBtn transition">
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

        
    );
}