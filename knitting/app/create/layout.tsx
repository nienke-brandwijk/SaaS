import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import ClientLayout from './clientLayout';

const JWT_SECRET = process.env.JWT_SECRET!;

export const dynamic = 'force-dynamic';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get('token')?.value;

  if (!token) redirect('/login');
export default function Layout({children}: {children: React.ReactNode}) {
    const [isOpen, setIsOpen] = useState(true);
    
    return (
        <div className="flex relative">
            <div className="relative w-4/5 bg-bgDefault flex-1 grow px-8 py-2">
                {/* PAGE CONTENT */}
                {children}
            </div>

            {/* Toggle button - altijd zichtbaar */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`btn absolute top-2 px-2 ${isOpen ? 'right-60' : 'right-2'}`}
            >
                {isOpen ? '❯❯❯' : '❮❮❮'}
            </button>

            {isOpen && (
                <div className="w-1/5 flex-none bg-bgSidebar p-8 bg-[url('/background.svg')]">
                    <Queue />
                </div>
            )}
        </div>
    );

  try {
    jwt.verify(token, JWT_SECRET);
  } catch {
    redirect('/login');
  }

  return <ClientLayout>{children}</ClientLayout>;
}