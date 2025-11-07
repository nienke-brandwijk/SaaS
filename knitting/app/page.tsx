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

      
      <div className="relative flex justify-center items-start px-4 py-8 mt-12 translate-x-20">
          <Image
            src="/HomePageImages/image1.png"
            alt="First decorative image"
            width={187}
            height={250}
            className="relative z-20"
          />
          <Image
            src="/HomePageImages/image2.png"
            alt="Second decorative image"
            width={290}
            height={315}
            className="relative -mt-8"
          />
          <Image
            src="/HomePageImages/image3.png"
            alt="Third decorative image"
            width={256}
            height={308}
            className="relative -translate-x-12 z-30"
          />
          <Image
            src="/HomePageImages/image4.png"
            alt="Fourth decorative image"
            width={216}
            height={215}
            className="relative -translate-x-[75px] translate-y-10 z-10"
          />
          <Image
            src="/HomePageImages/image5.png"
            alt="Fifth decorative image"
            width={206}
            height={224}
            className="relative -translate-x-[145px] z-0"
          />
          <Image
            src="/HomePageImages/image6.png"
            alt="Sixth decorative image"
            width={273}
            height={301}
            className="relative -translate-x-[160px] z-10 -mt-8"
          />
      </div>

      <div className="flex flex-col items-center gap-6 px-4 py-8">
        <div className="card bg-white max-w-6xl w-full p-6 border border-stone-300 rounded-lg " style={{ boxShadow: '0px 1px 2px rgba(68, 64, 60, 0.15)' }}>
          <div>
            <p className="mb-4 text-center text-2xl">Want to stop fast fashion and be more sustainable by making your own beautiful clothes? <br/> Join our <span className='text-orange-700'>step-by-step knitting program</span> and turn your creativity into wearable pieces, 
              <br/> <span className='text-orange-700'> made by you, for you</span>.
            </p>
            <div className='flex justify-center'>
              <Link href="/learn" className='relative'>
                <button className="relative z-10 border border-orange-700 border-2 bg-orange-700 rounded-lg text-center text-orange-50 px-4 py-2 text-3xl hover:bg-white hover:border-orange-700 hover:text-orange-700">
                  Learn
                </button>
                <Image
                    src={"/HomePageImages/naalden.svg"}
                    alt="naalden"
                    width={63}
                    height={75}
                    className="absolute right-0 -top-7 translate-x-1/2 z-0"
                  />
              </Link>
            </div>
          </div>
          
          <div  className="mt-8">
            <p className="mb-4 text-xl text-center ">Already ready to take on a project? We offer a tool that helps you track your patterns and gather your ideas. 
              <br/> <span className='text-orange-700'>Let's get creative!</span>
            </p>
            <div className='flex justify-center'>
              <Link href="/create" className='relative'>
                <Image
                  src={"/HomePageImages/naalden.svg"}
                  alt="naalden"
                  width={43}
                  height={55}
                  className="absolute right-0 -top-5 translate-x-1/2 z-0"
                />
                <button className="relative z-10 border border-orange-700 border-2 bg-orange-700 rounded-lg text-center text-orange-50 px-2 py-1 text-lg hover:bg-white hover:border-orange-700 hover:text-orange-700">
                  Create
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-white text-lg max-w-6xl w-full p-6 border border-stone-300 rounded-lg" style={{ boxShadow: '0px 1px 2px rgba(68, 64, 60, 0.15)' }}>
          <p className="mb-4 text-center">
            Need a hand with project calculations? Our easy-to-use <Link href={"/calculator"} className='text-orange-700 hover:underline'>calculators</Link> are here to help. 
            <br/> Making your work lighter and your results spot-on!
          </p>

          <p className="mb-4 text-center">
            Curious about a knitting term? Our handy <Link href={"/dictionary"} className='text-orange-700 hover:underline'>dictionary</Link> is here to guide you. <br/> Helping you navigate the world of knitting with ease!
          </p>
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