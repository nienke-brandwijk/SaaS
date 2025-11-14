"use client";

export default function VisionBoardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 py-12 mb-6">
      {/* Container met maximale breedte en centrering */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 min-h-screen">

        {/* Linkerkolom */}
        <div className="flex flex-col gap-8 md:col-span-2 h-full">

          {/* Grote card */}
          <div className="card h-full">
            <div className="flex items-center gap-4 py-2">
              <h1 className="card-title font-bold">Grote Card</h1>
            </div>

            <div className="card-body border border-stone-300 bg-white rounded-lg py-6 px-8 h-full">
              <p className="text-stone-700">Inhoud van de grote card.</p>
            </div>
          </div>

          {/* Smalle card */}
          <div className="card">
            <div className="flex items-center gap-4 py-2">
              <h1 className="card-title font-bold">Smalle Card</h1>
            </div>

            <div className="card-body border border-stone-300 bg-white rounded-lg py-6 px-8 h-full">
              <p className="text-stone-700">Inhoud van de smalle card.</p>
            </div>
          </div>

        </div>

        {/* Rechterkolom */}
        <div className="md:col-span-1 h-full flex flex-col gap-8">
          <div className="card h-full">
            <div className="flex items-center gap-4 py-2">
              <h1 className="card-title font-bold">Rechter Card (Volledige Hoogte)</h1>
            </div>

            <div className="card-body border border-stone-300 bg-white rounded-lg py-6 px-8 h-full">
              {children}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}