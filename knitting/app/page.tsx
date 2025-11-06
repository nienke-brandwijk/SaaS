import { User } from '../src/domain/user';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_URL}/api/users`, {
    cache: 'no-store',
  });
  
  const data = await res.json();
  console.log(data);
  const users = data.users;

  return (
    <div className="min-h-screen bg-[url('/background.svg')] bg-cover ">
      
      <div className="flex justify-center items-start gap-4 px-4 py-8">
        <Image
          src="/HomePageImages/image1.png"
          alt="First decorative image"
          width={187}
          height={250}
          className=""
        />
        <Image
          src="/HomePageImages/image2.png"
          alt="Second decorative image"
          width={290}
          height={315}
          className=""
        />
        <Image
          src="/HomePageImages/image3.png"
          alt="Third decorative image"
          width={256}
          height={308}
          className=""
        />
        <Image
          src="/HomePageImages/image4.png"
          alt="Fourth decorative image"
          width={216}
          height={215}
          className=""
        />
        <Image
          src="/HomePageImages/image5.png"
          alt="Fifth decorative image"
          width={206}
          height={224}
          className=""
        />
        <Image
          src="/HomePageImages/image6.png"
          alt="Sixth decorative image"
          width={273}
          height={301}
          className=""
        />
      </div>

      <div className="flex flex-col items-center gap-6 px-4 py-8">
        <div className="card bg-white max-w-6xl w-full p-6 border border-stone-300 rounded-[10px]" style={{ boxShadow: '0px 1px 2px rgba(68, 64, 60, 0.15)' }}>
          <p className="mb-4 text-center text-xl">Want to stop fast fashion and be more sustainable by making your own beautiful clothes? <br/> Join our <span className='text-orange-700'>step-by-step knitting program</span> and turn your creativity into wearable pieces, 
           <span className='text-orange-700'> made by you, for you</span>.
          </p>
          <div className='flex justify-center'>
            <Link href="/learn">
            <button className="btn bg-orange-700 rounded-[10px] text-center text-orange-50 px-3 text-2xl">
              Learn
            </button>
          </Link>
          </div>
        </div>

        <div className="card bg-white max-w-5xl w-full p-6 border border-stone-300 rounded-[10px]" style={{ boxShadow: '0px 1px 2px rgba(68, 64, 60, 0.15)' }}>
          <p className="mb-4 text-center">Already ready to take on a project? We offer a tool that helps you track your patterns ad gather your ideas. 
            <br/> <span className='text-orange-700'>Let's get creative!</span>
          </p>
          <div className='flex justify-center'>
            <Link href="/create">
              <button className="btn bg-orange-700 rounded-[10px] text-center text-orange-50 px-3 text-xl">
                Create
              </button>
            </Link>
          </div>
        </div>
      </div>

      <ul className="mt-10 space-y-2">
        {users?.map((user: User) => (
          <li key={user.id} className="text-[2rem]">
            {user.username} {user.email}
          </li>
        ))}
      </ul>
    </div>
    
  );
}