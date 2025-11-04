import { User } from '../src/domain/user';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_URL}/api/users`, {
    cache: 'no-store',
  });
  
  const data = await res.json();
  const users = data.users; //extract array

  return (
    <div>
      {/* <p className="text-[10rem] underline text-center">Hello World!</p> */}
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


      <p className="text-[2rem] mt-10">Want to stop fast fashion and be more sustainable by making your own beautiful clothes? Join our step-by-step knitting program and turn your creativity into wearable pieces, 
        made by you, for you.
      </p>
      <Link href="/learn" >
        <button className='btn btn-primary'>
          Learn
        </button>
      </Link>

      <p className="text-[2rem] mt-10">Already ready to take on a project? We offer a tool that helps you track your patterns ad gather your ideas. 
        Let's get creative!
      </p>
      <Link href="/create" >
        <button className='btn btn-secondary'>
          Create
        </button>
      </Link>


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