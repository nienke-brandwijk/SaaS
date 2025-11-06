import Queue from "../ui/create/queue";

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex h-screen md:flex-row md:overflow-hidden">
            
            <div className="flex-1 grow p-6 md:overflow-y-auto md:p-12">
                {children}
            </div>
            <div className="top-0 right-0 w-full flex-none md:w-64">
                <Queue />
            </div>
        </div>
    );
}