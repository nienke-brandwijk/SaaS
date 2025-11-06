import Contents from "../ui/learn/contents";
import Buttons from "../ui/learn/buttons";

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex min-h-screen">
            {/* table of contents - 1/4 width */}
            <aside className="w-1/5 flex-none bg-stone-100 p-4">
                <Contents />
            </aside>

            {/* content - 3/4 width */}
            <main className="relative w-4/5 bg-white ">
                <Buttons />
                {children}  
            </main>

        </div>    
    );
}