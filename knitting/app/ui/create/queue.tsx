

export default function Queue() {
    return (
        <div className="bg-cover flex h-full flex-col">
            <div className="flex items-center gap-4">
                <h1 className="font-bold text-txtBold text-2xl">Pattern Queue</h1>
                <button className="px-2 pb-1 flex items-center justify-center border border-borderAddBtn rounded-lg bg-transparent hover:bg-colorAddBtn hover:text-txtColorAddBtn transition">
                    +
                </button>
            </div>
            <div className="text-txtDefault">
                {/* code to get items in pattern queue from database */}
            </div>
            
        </div>
    )
}