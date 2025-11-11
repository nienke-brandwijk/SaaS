'use client'

export default function Page() {
    return(
        <div className="flex flex-col space-y-16">
            {/* WORK IN PROGRESS */}
            <div className="card">
                {/* "WIPS" & add button */}
                <div className="flex items-center gap-4 py-2">
                    <h1 className="card-title font-bold">WIPS: Work In Progress</h1>
                    <button className="px-2 pb-1 flex items-center justify-center border border-stone-700 rounded-lg bg-transparent hover:bg-stone-700 hover:text-white transition">
                        +
                    </button>
                </div>
                {/* carousel: showing 1 WIPS */}
                <div className="card-body border border-stone-300 bg-white rounded-lg h-96 py-3 flex flex-col">
                    <h2 className="ps-8 pb-2">Title</h2>

                    <div className="relative w-full flex-1 flex items-center">
                        <div className="carousel flex justify-center items-center w-full h-full">
                            {/* wips1 */}
                            <div id="wips1" className="carousel-item flex items-stretch gap-4 ">
                                <img src="/create/redcardigan.png" alt="Red Cardigan" className="h-80 px-5" />
                                {/* wips: Project details  */}
                                <div className="card border border-stone-300 bg-[url('/background.svg')] rounded-lg px-4 py-4 h-80 flex flex-col">
                                    <h3 className="card-title py-2 italic">Project details</h3>
                                    <div className="card-body px-4 flex-1">
                                        <ul className="list-disc">
                                            <li>Needles 6mm - 100cm</li>
                                            <li>Needles 5mm - 100cm</li>
                                            <li>6 buttons 10mm</li>
                                            <li>G60 - fuchsia (colour B)</li>
                                        </ul>
                                    </div>
                                </div>
                                {/* switch buttons */}
                                <div className="absolute left-4 right-4 top-0 flex items-center bottom-0 justify-between">
                                    <a href="#wips3" className="btn rounded-lg border border-stone-300 px-2 h-80 flex items-center hover:bg-stone-700 hover:text-white transition"> 
                                        ❮ 
                                    </a>
                                    <a href="#wips2" className="btn rounded-lg border border-stone-300 px-2 h-80 flex items-center hover:bg-stone-700 hover:text-white transition"> 
                                        ❯ 
                                    </a>
                                </div>
                            </div>


                        </div>

                    </div>

                </div>
            </div>

            {/* VISIONBOARDS */}
            <div className="card">
                {/* "visionboards" & add button */}
                <div className="flex items-center gap-4 py-2">
                    <h1 className="card-title font-bold">Visionboards</h1>
                    <button className="px-2 pb-1 flex items-center justify-center border border-stone-700 rounded-lg bg-transparent hover:bg-stone-700 hover:text-white transition">
                        +
                    </button>
                </div>
                {/* carousel: showing multiple visionboards */}
                <div className="card-body border border-stone-300 bg-white rounded-lg h-64 py-3 flex flex-col">

                    <div className="relative w-full flex-1 flex items-center overflow-hidden px-4">
                        <div className="carousel carousel-center flex gap-4 items-center w-full h-full overflow-x-auto scroll-smooth">
                            {/* board1 */}
                            <div id="board1" className="carousel-item flex-shrink-0">
                                <img src="/create/board1.png" alt="Board 1" className="h-48 w-auto object-contain" />
                            </div>

                            {/* board2 */}
                            <div id="board2" className="carousel-item flex-shrink-0">
                                <img src="/create/board2.png" alt="Board 2" className="h-48 w-auto object-contain" />
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </div>

        
    );
}